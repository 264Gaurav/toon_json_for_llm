# TOON vs JSON (for LLM Inputs)

TOON (Token‑Oriented Object Notation) is a compact, LLM‑friendly format that typically reduces token count by 30–60% vs JSON. Fewer tokens = lower costs and more room in the context window.

## Why TOON is Better for LLMs
- **Fewer tokens → lower cost**: Keys aren’t repeated for every row.
- **More context per request**: Save tokens for what matters (instructions + data).
- **LLM‑friendly structure**: Simple, row‑oriented text with predictable patterns.

## How TOON Achieves Savings
1. **Declare keys once** per uniform array: `{id,name,role}` instead of repeating keys.
2. **State length upfront**: `[3]` clearly signals row count.
3. **Minimal syntax**: Avoids braces/quotes unless needed (quotes only when required).
4. **Delimited rows**: Values appear in a fixed key order (CSV/TSV‑like), which tokenizes well.

Example
```json
// JSON
{
  "users": [
    { "id": 1, "name": "Alice", "role": "admin" },
    { "id": 2, "name": "Bob", "role": "user" }
  ]
}
```
```
// TOON
users[2]{id,name,role}:
  1,Alice,admin
  2,Bob,user
```

## When TOON Fits
Use TOON when your data is:
- **Uniform arrays of objects** (same keys per row)
- **Flat or shallow** (1–2 nesting levels)
- **Large** and sent directly to an LLM

## Limitations (When NOT to use TOON)
- **Non‑uniform arrays** (varying keys across rows)
- **Deeply nested objects** (>3 levels) where readability drops
- **General storage/transport** for arbitrary data (JSON/MsgPack are better)
- **Schemas with many optional fields** (header becomes sparse/misleading)

## Quick Start
Prereqs: Node.js 18+. Ollama optional for local model tests.

Install
```bash
npm install
```

Run
```bash
npm start          # Quick comparison (JSON vs TOON)
npm run compare    # Detailed metrics (bytes, lines, tokens)
npm run test       # Test with an Ollama model (if installed)
```

Use in Code
```javascript
import { encode } from './src/toon.js';

const data = { users: [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' }
]};

console.log(encode(data));                 // default comma delimiter
console.log(encode(data, { delimiter: '\t' })); // often tokenizes better
```

Notes
- Token counting uses `tiktoken`. Actual savings depend on model/tokenizer.
- Delimiters supported: comma, tab, pipe. Tab often yields best tokenization.
- TOON is designed for LLM prompts, not as a general‑purpose data store.

## License
Apache License 2.0