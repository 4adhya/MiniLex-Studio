# MiniLex Studio — Project Report

## Abstract
MiniLex Studio demonstrates the lexical analysis phase of a compiler. It scans source text, groups character sequences into lexemes, assigns token categories, and reports unrecognized characters with source positions.

## Objectives
1. Understand the role of a lexical analyzer in a compiler.
2. Implement token recognition using ordered rules and longest-match behavior.
3. Distinguish keywords, identifiers, numeric literals, strings, operators and delimiters.
4. Ignore whitespace and comments while maintaining accurate line and column positions.
5. Present scanner output in a form that is easy to inspect and test.

## Design
The scanner reads the source from left to right. At each position it first consumes whitespace or comments. It then checks for quoted literals, numeric values, identifiers/keywords, operators and symbols. Operators are listed longest-first so that `>=` is recognized as one token rather than `>` followed by `=`. If no rule matches, the current character is recorded as a lexical error and scanning continues.

## Modules
- **Editor:** accepts source code and sample inputs.
- **Scanner:** applies lexical patterns and tracks source positions.
- **Token classifier:** assigns a category to each lexeme.
- **Results view:** displays tokens, category counts and errors.
- **Export:** copies results or downloads a CSV file.
- **C++ companion:** provides a terminal implementation using a `.lex` rule file.

## Testing
Try the built-in arithmetic, C-like and invalid-character examples. Confirm that comments and whitespace do not appear in the token stream, multi-character operators remain a single token, and invalid characters report the correct line and column.

## Conclusion
The project provides a practical demonstration of lexical analysis and the tokenization stage of compiler construction. It can be extended with user-editable rule files, finite automata visualization, and richer language grammars.
