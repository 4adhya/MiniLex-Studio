#include <algorithm>
#include <fstream>
#include <iostream>
#include <regex>
#include <sstream>
#include <string>
#include <vector>

struct Rule { std::string type, name, pattern; bool skip; std::regex compiled; };
struct Token { std::string lexeme, type; int line, column; };

static std::string trim(const std::string& s) {
    const auto a = s.find_first_not_of(" \t\r\n");
    if (a == std::string::npos) return "";
    const auto b = s.find_last_not_of(" \t\r\n");
    return s.substr(a, b - a + 1);
}

static std::vector<Rule> loadRules(const std::string& path) {
    std::ifstream in(path);
    if (!in) throw std::runtime_error("Cannot open specification: " + path);
    std::vector<Rule> rules;
    std::string line;
    int number = 0;
    while (std::getline(in, line)) {
        ++number; line = trim(line);
        if (line.empty() || line[0] == '#') continue;
        std::istringstream row(line);
        std::string kind, name, pattern;
        row >> kind >> name;
        std::getline(row, pattern); pattern = trim(pattern);
        if ((kind != "TOKEN" && kind != "SKIP") || name.empty() || pattern.empty())
            throw std::runtime_error("Invalid rule at line " + std::to_string(number));
        try { rules.push_back({kind, name, pattern, kind == "SKIP", std::regex(pattern)}); }
        catch (const std::regex_error&) { throw std::runtime_error("Invalid regex at line " + std::to_string(number)); }
    }
    return rules;
}

static std::vector<Token> scan(const std::string& source, const std::vector<Rule>& rules,
                               std::vector<Token>& errors) {
    std::vector<Token> tokens;
    std::size_t pos = 0;
    int line = 1, col = 1;
    while (pos < source.size()) {
        std::size_t best = 0;
        const Rule* selected = nullptr;
        const std::string remaining = source.substr(pos);
        for (const auto& rule : rules) {
            std::smatch match;
            if (std::regex_search(remaining, match, rule.compiled,
                                  std::regex_constants::match_continuous)) {
                const auto len = match.length();
                if (len > best) { best = len; selected = &rule; }
            }
        }
        if (selected && best > 0) {
            const std::string lexeme = source.substr(pos, best);
            if (!selected->skip) tokens.push_back({lexeme, selected->name, line, col});
            for (char c : lexeme) { if (c == '\n') { ++line; col = 1; } else ++col; }
            pos += best;
        } else {
            const std::string bad(1, source[pos]);
            errors.push_back({bad, "LEXICAL_ERROR", line, col});
            if (source[pos] == '\n') { ++line; col = 1; } else ++col;
            ++pos;
        }
    }
    return tokens;
}

int main(int argc, char* argv[]) {
    if (argc != 3) {
        std::cerr << "Usage: " << argv[0] << " <spec.lex> <source-file>\n";
        return 1;
    }
    try {
        const auto rules = loadRules(argv[1]);
        std::ifstream input(argv[2]);
        if (!input) throw std::runtime_error("Cannot open source file: " + std::string(argv[2]));
        std::ostringstream buffer; buffer << input.rdbuf();
        std::vector<Token> errors;
        const auto tokens = scan(buffer.str(), rules, errors);
        std::cout << "\n" << "LEXEME\t\tTOKEN TYPE\t\tPOSITION\n";
        std::cout << "------------------------------------------------------\n";
        for (const auto& t : tokens)
            std::cout << t.lexeme << "\t\t" << t.type << "\t\t" << t.line << ":" << t.column << "\n";
        std::cout << "\nToken count: " << tokens.size() << "\n";
        std::cout << "Lexical errors: " << errors.size() << "\n";
        for (const auto& e : errors)
            std::cout << "  '" << e.lexeme << "' at " << e.line << ":" << e.column << "\n";
        return errors.empty() ? 0 : 2;
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << "\n";
        return 1;
    }
}
