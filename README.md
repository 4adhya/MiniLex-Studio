# MiniLex Studio

A browser-based Mini LEX playground and companion C++17 command-line scanner. The interface is intentionally lightweight and deployable as a static site — no build step, framework, API key, or backend required.

## Features
- Rule-based lexical scanning with longest-match operator recognition.
- Keywords, identifiers, integer/decimal numbers, strings, operators and symbols.
- Whitespace and single-/multi-line comments are skipped.
- Lexical errors include exact line and column positions.
- Token table, category filter, summary cards, CSV export and clipboard copy.
- Sample programs and a reference view of token rules.
- C++17 implementation in `cpp/` for compiler-design coursework.

## Run locally
Open `index.html` in a browser. For a local server, run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy with GitHub Pages
1. Create a new public repository on GitHub.
2. Upload the contents of this project (keep `index.html` at repository root).
3. Open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then Save.
6. Wait for the Pages URL to appear in the Pages section.

You can also deploy the static frontend on Netlify by importing the GitHub repository; use the repository root as the publish directory.

## Compile the C++ version
Requires a C++17 compiler.

```bash
g++ -std=c++17 -O2 -Wall cpp/main.cpp -o minilex
./minilex cpp/specs/default.lex cpp/samples/example.c
```

On Windows, compile to `minilex.exe` and run `.\minilex.exe ...`.

## Project structure
```text
mini-lex-studio/
├── index.html
├── src/
│   ├── app.js
│   └── styles.css
├── cpp/
│   ├── main.cpp
│   ├── specs/default.lex
│   └── samples/example.c
├── REPORT.md
├── VIVA.md
└── README.md
```

## Scope and limitations
This is an educational lexer, not a complete C/C++ front end. The browser scanner recognizes a useful subset of C-like syntax. It does not parse grammar or validate program semantics. The C++ companion uses `std::regex` and a configurable token specification; it is not a Flex replacement and does not generate parser code.

## License
MIT — see `LICENSE`.
