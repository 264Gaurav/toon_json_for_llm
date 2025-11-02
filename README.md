# JSON vs TOON Comparison

A demonstration comparing JSON and TOON (Token-Oriented Object Notation) formats for LLM inputs.

## What is TOON?

**TOON** is a token-efficient data format that reduces token count by 30-60% compared to JSON, saving money on LLM API calls.

### Benefits
- 💰 **Cost Savings**: Fewer tokens = lower costs
- 📏 **Self-Documenting**: Explicit lengths and field headers
- 🎯 **LLM-Friendly**: Better tokenization patterns

## Quick Start

### Prerequisites
- Node.js 18+
- Ollama installed (optional, for testing)

### Setup
```bash
npm install
```

### Run Examples
```bash
npm start          # Quick comparison
npm run compare    # Detailed analysis
npm run test       # Test with LLM (requires Ollama)
```

## Example

**JSON (45 tokens):**
```json
{
  "users": [
    { "id": 1, "name": "Alice", "role": "admin" },
    { "id": 2, "name": "Bob", "role": "user" },
    { "id": 3, "name": "Charlie", "role": "moderator" }
  ]
}
```

**TOON (25 tokens, 44% reduction):**
```
users[3]{id,name,role}:
  1,Alice,admin
  2,Bob,user
  3,Charlie,moderator
```

## How TOON Works

1. **Declares keys once** in header: `{id,name,role}`
2. **Shows length upfront**: `[3]` means 3 items
3. **Minimal syntax**: No quotes or braces
4. **Row-based data**: Values in same order

## Token Savings

| Dataset | JSON Tokens | TOON Tokens | Savings |
|---------|-------------|-------------|---------|
| Small (5 items) | ~45 | ~25 | 44% |
| Medium (10 items) | ~120 | ~65 | 46% |
| Large (20 items) | ~280 | ~140 | 50% |

## Usage

### Basic Encoding
```javascript
import { encode } from './src/toon.js';

const data = {
  users: [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' }
  ]
};

const toon = encode(data);
console.log(toon);

// Options
encode(data, { delimiter: '\t' });  // Tab delimiter
encode(data, { indent: 4 });        // Custom indentation
```

### Nested Data

TOON automatically handles nesting:
```javascript
// JSON
{ "user": { "id": 1, "address": { "city": "NYC" } } }

// TOON
user:
  id: 1
  address:
    city: NYC
```

**Tip:** Flatten nested data for best token savings:
```javascript
// Instead of nested objects, flatten:
const flattened = {
  users: [
    { id: 1, city: "NYC" },
    { id: 2, city: "LA" }
  ]
};
```

## When to Use TOON

✅ **Good for:**
- Uniform arrays of objects
- Large datasets sent to LLMs
- Reducing token costs
- Flat or shallow structures

❌ **Not ideal for:**
- Non-uniform structures
- Very deeply nested objects (>3 levels)
- General data storage

## Technical Details

- Uses [tiktoken](https://github.com/openai/tiktoken) for token counting
- Supports delimiters: comma, tab, pipe
- Works with Ollama local models

## License

Apache License 2.0