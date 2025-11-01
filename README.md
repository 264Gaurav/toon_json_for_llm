# JSON vs TOON Comparison Demo

A comprehensive demonstration comparing JSON and TOON (Token-Oriented Object Notation) formats for LLM inputs using local Ollama models.

## Why TOON : 
Reducing the Token size without loosing the context and data (TOON conveys the same information with fewer tokens).Thus, larger context windows allow for larger data inputs as well. LLM tokens still cost money, thus less token , less cost money. 


## 🎯 Overview

This project compares the efficiency of JSON and TOON formats when used as input for Large Language Models. TOON is a data serialization format specifically designed to reduce token count while maintaining readability for LLMs.

**Key Features:**
💸 Token-efficient: typically 30–60% fewer tokens than JSON
🤿 LLM-friendly guardrails: explicit lengths and fields enable validation
🍱 Minimal syntax: removes redundant punctuation (braces, brackets, most quotes)
📐 Indentation-based structure: like YAML, uses whitespace instead of braces
🧺 Tabular arrays: declare keys once, stream data as rows

## 📦 Setup

### Prerequisites

- Node.js 18+ installed
- Ollama installed and running ([download here](https://ollama.ai))

### Installation

```bash
# Install dependencies
npm install

# Pull an Ollama model (recommended)
ollama pull llama3.1
```

### Starting Ollama

```bash
# Start Ollama server
ollama serve
```

Keep this running in a separate terminal.

## 🚀 Usage

### Quick Demo

Run a simple side-by-side comparison:

```bash
npm start
```

### Detailed Comparison

Run comprehensive token counting and size analysis across multiple datasets:

```bash
npm run compare
```

This will test:
- Small user dataset (5 users)
- Medium product dataset (10 products)
- Large order dataset (20 orders)

### LLM Testing

Test both formats with a live Ollama model:

```bash
npm run test
```

This sends the same data in both JSON and TOON formats to your Ollama model and compares:
- Response times
- Token usage
- Output quality

## 📊 Expected Results

### Token Reduction

TOON typically achieves **40-60% token reduction** for uniform object arrays:

```
Format          | Tokens (GPT-4o) | Reduction
----------------|-----------------|----------
JSON (Pretty)   | 150 tokens      | -
TOON (Comma)    | 95 tokens       | 37%
TOON (Tab)      | 85 tokens       | 43%
```

### Why TOON Works Better

1. **Eliminates Repeated Keys**: Array headers list keys once
2. **Compact Syntax**: No quotes for simple values, fewer delimiters
3. **Better Tokenization**: Tab delimiters often tokenize more efficiently
4. **Self-Documenting**: Structure is clear from headers

### Example

**JSON:**
```json
{
  "users": [
    { "id": 1, "name": "Alice", "role": "admin" },
    { "id": 2, "name": "Bob", "role": "user" },
    { "id": 3, "name": "Charlie", "role": "moderator" }
  ]
}
```
- 127 characters
- ~45 tokens

**TOON:**
```
users[3]{id,name,role}:
  1,Alice,admin
  2,Bob,user
  3,Charlie,moderator
```
- 60 characters
- ~25 tokens
- **44% reduction**

## 🔧 Customization

### Test Your Own Data

Edit `src/compare.js` to add your datasets:

```javascript
const myData = {
  name: 'My Dataset',
  data: {
    items: [/* your data */]
  }
};
```

### Try Different Delimiters

```javascript
import { encode } from './src/toon.js';

const data = { items: [...] };

// Tab delimiter (often best for tokenization)
const tabFormat = encode(data, { delimiter: '\t' });

// Pipe delimiter
const pipeFormat = encode(data, { delimiter: '|' });

// Custom indent
const customIndent = encode(data, { indent: 4 });
```

## 📈 Benchmarks

The demo includes benchmark data for different dataset sizes:

| Dataset Size | JSON Tokens | TOON Tokens | Savings |
|--------------|-------------|-------------|---------|
| Small (5 items) | ~45 | ~25 | 44% |
| Medium (10 items) | ~120 | ~65 | 46% |
| Large (20 items) | ~280 | ~140 | 50% |

*Actual results may vary based on data complexity and tokenizer used*

## 🔬 Technical Details

### Token Counting

The project uses [tiktoken](https://github.com/openai/tiktoken) for accurate token counting with multiple models:
- GPT-4o
- GPT-4
- cl100k_base (fallback)

### TOON Implementation

This demo implements a simplified version of TOON v1.3 specification:
- Uniform object array encoding
- Primitive array encoding
- Nested objects
- Multiple delimiter support
- Indentation control

### Full TOON Spec

For production use, see the official implementation:
- [GitHub: johannschopplich/toon](https://github.com/johannschopplich/toon)
- [Full Specification](https://github.com/johannschopplich/toon/blob/main/SPEC.md)

## 🤝 Contributing

Feel free to:
- Add more test datasets
- Implement additional TOON features
- Test with other LLM models
- Share your benchmarks

## 📚 References

- [TOON Repository](https://github.com/johannschopplich/toon)
- [TOON Specification](https://github.com/johannschopplich/toon/blob/main/SPEC.md)
- [Ollama Documentation](https://ollama.ai)
- [TikToken](https://github.com/openai/tiktoken)

## 📄 License

MIT License - Feel free to use and modify as needed.

## 💡 Key Takeaway

**TOON is most effective for:**
- ✅ Uniform arrays of objects
- ✅ Tabular data with identical fields
- ✅ Large datasets where token savings matter
- ✅ LLM input/prompt engineering

**Stick with JSON for:**
- ❌ Non-uniform data structures
- ❌ Deeply nested objects
- ❌ API responses
- ❌ Data storage

Choose the format based on your use case!
