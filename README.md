# JSON vs TOON Comparison

A simple demonstration comparing JSON and TOON (Token-Oriented Object Notation) formats for LLM inputs.

## What is TOON?

**TOON** is a token-efficient data format designed for LLM inputs. It reduces token count by 30-60% compared to JSON while maintaining the same data.

**Benefits:**
- 💰 **Cost Savings**: Fewer tokens = less money spent on LLM API calls
- 🪟 **Larger Context**: More data fits in the same token budget
- 📏 **Self-Documenting**: Explicit lengths and field headers
- 🎯 **LLM-Friendly**: Better tokenization patterns

## Quick Start

### Prerequisites

- Node.js 18+
- Ollama installed and running

### Setup

```bash
npm install
ollama pull llama3.1
ollama serve  # Keep this running in a separate terminal
```

### Run Examples

```bash
# Quick side-by-side comparison
npm start

# Detailed token analysis
npm run compare

# Test with live LLM
npm run test
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

1. **Declares keys once** in the header: `{id,name,role}`
2. **Shows length upfront**: `[3]` indicates 3 items
3. **Minimal syntax**: No quotes, braces, or redundant punctuation
4. **Row-based data**: Each row contains values in the same order

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

// Default encoding (comma delimiter)
const toon = encode(data);
console.log(toon);

// Tab delimiter (often more efficient)
const toonTab = encode(data, { delimiter: '\t' });

// Custom indentation
const toonIndented = encode(data, { indent: 4 });
```

### Custom Data

Add your datasets in `src/compare.js`:

```javascript
const myData = {
  name: 'My Dataset',
  data: {
    items: [/* your data */]
  }
};
```

## When to Use TOON

**✅ Good for:**
- Uniform arrays of objects
- Tabular data with identical fields
- Large datasets sent to LLMs
- Reducing token costs

**❌ Not ideal for:**
- Non-uniform structures
- Deeply nested objects
- API responses
- General data storage

## Technical Details

- Uses [tiktoken](https://github.com/openai/tiktoken) for accurate token counting
- Implements simplified TOON v1.3 specification
- Supports multiple delimiters (comma, tab, pipe)
- Works with Ollama local models for testing

## License

Apache License 2.0 