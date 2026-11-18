# MiniLex Studio — Viva Questions

**1. What is lexical analysis?**  
The first phase of a compiler. It reads source characters and groups them into tokens.

**2. What is a lexeme?**  
The actual character sequence matched by a token rule, such as `count` or `42`.

**3. What is a token?**  
A category assigned to a lexeme, such as IDENTIFIER, NUMBER or KEYWORD.

**4. What is the role of a lexical analyzer?**  
It converts source code into a token stream for the syntax analyzer and reports invalid character sequences.

**5. What is the longest-match rule?**  
At a source position, the scanner chooses the valid match consuming the greatest number of characters.

**6. Why should `>=` be checked before `>`?**  
To ensure the two-character operator is recognized as one token.

**7. Why are keywords checked before identifiers?**  
Both can match the same character pattern. Reserved words must be classified as KEYWORD rather than IDENTIFIER.

**8. What are SKIP rules?**  
Rules that consume whitespace or comments without emitting tokens.

**9. What is a lexical error?**  
An input character or sequence that does not match any supported token rule.

**10. How are line and column numbers maintained?**  
The scanner increments the column for ordinary characters and resets it to 1 while incrementing the line after a newline.

**11. Does this project perform syntax analysis?**  
No. It only tokenizes source text; it does not validate grammar or program meaning.

**12. What is the difference between a compiler and an interpreter?**  
A compiler translates a program before execution, while an interpreter executes instructions through a runtime process.
