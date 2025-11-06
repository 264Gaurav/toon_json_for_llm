(base) PS C:\Users\gaura\OneDrive\Desktop\AI projects\toon_json_for_llm> npm run test

> toon-json-comparison@1.0.0 test
> node src/test-llm.js

🚀 LLM Format Comparison Test
Testing JSON vs TOON with Ollama

✅ Ollama is running
Available models: llava:7b, nomic-embed-text:latest, llama3.1:8b, gemma3:4b

🔍 Checking if model "llama3.1:8b" is ready...
🔥 Warming up model (this may take a moment on first run)...
✅ Model is ready (warmup took 3277ms)

🤖 Testing with model: llama3.1:8b
================================================================================

📊 Test 1: JSON Format
────────────────────────────────────────────────────────────────────────────────
JSON data: {
  "products": [
    {
      "id": 1,
      "name": "Wireless Mouse",
      "price": 29.99,
      "category": "Electronics",
      "inStock": true
    },
    {
      "id": 2,
      "name": "Mechanical Keyboard",
      "price": 89.99,
      "category": "Electronics",
      "inStock": true
    },
    {
      "id": 3,
      "name": "USB-C Hub",
      "price": 45,
      "category": "Electronics",
      "inStock": false
    },
    {
      "id": 4,
      "name": "Monitor Stand",
      "price": 39.99,
      "category": "Office",
      "inStock": true
    },
    {
      "id": 5,
      "name": "Desk Lamp",
      "price": 24.99,
      "category": "Office",
      "inStock": true
    },
    {
      "id": 6,
      "name": "Ergonomic Chair",
      "price": 249.99,
      "category": "Furniture",
      "inStock": true
    },
    {
      "id": 7,
      "name": "Standing Desk",
      "price": 499.99,
      "category": "Furniture",
      "inStock": false
    },
    {
      "id": 8,
      "name": "Cable Management",
      "price": 12.99,
      "category": "Office",
      "inStock": true
    }
  ]
}
📏 JSON data size: 1096 chars, 1096 bytes
──────────────────────────────
⏱️  Response time: 6144ms
📝 Response length: 223 chars
🔢 Tokens used: 59

Response:
Here is the list of products in the "Electronics" category and are less than $50:

1. Wireless Mouse ($29.99)
2. USB-C Hub ($45)

Note that I excluded products with a price greater than or equal to $50, as per your request.  

📊 Test 2: TOON Format
────────────────────────────────────────────────────────────────────────────────
TOON data: products:
[8      ]{id    name    price   category        inStock}:
  1     "Wireless Mouse"        29.99   Electronics     true
  2     "Mechanical Keyboard"   89.99   Electronics     true
  3     "USB-C Hub"     45      Electronics     false
  4     "Monitor Stand" 39.99   Office  true
  5     "Desk Lamp"     24.99   Office  true
  6     "Ergonomic Chair"       249.99  Furniture       true
  7     "Standing Desk" 499.99  Furniture       false
  8     "Cable Management"      12.99   Office  true
📏 TOON data size: 377 chars, 377 bytes
──────────────────────────────
⏱️  Response time: 4546ms
📝 Response length: 185 chars
🔢 Tokens used: 48

Response:
Here is the list of products that are in the "Electronics" category and cost less than $50:    

* Wireless Mouse ($29.99)
* USB-C Hub ($45)

Let me know if you need any further assistance!

📊 Comparison
================================================================================

📦 INPUT SIZE COMPARISON (Data Only):
────────────────────────────────────────────────────────────────────────────────
JSON Format:  1096 chars, 1096 bytes
TOON Format:  377 chars, 377 bytes

💾 Size Reduction:
   Characters: 65.6% (1096 → 377 chars)
   Bytes:      65.6% (1096 → 377 bytes)
   ✅ TOON is smaller!

📝 FULL PROMPT SIZE COMPARISON:

📝 FULL PROMPT SIZE COMPARISON:

📝 FULL PROMPT SIZE COMPARISON:

📝 FULL PROMPT SIZE COMPARISON:
────────────────────────────────────────────────────────────────────────────────
JSON Prompt:  1322 chars
TOON Prompt:  603 chars
Reduction:    54.4% (1322 → 603 chars)

⏱️  RESPONSE TIME COMPARISON:
────────────────────────────────────────────────────────────────────────────────
JSON:  6144ms
TOON:  4546ms
Difference: -26.0% (6144ms → 4546ms)
✅ TOON is faster!

✅ Test complete!