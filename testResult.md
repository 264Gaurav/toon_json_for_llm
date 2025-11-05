(base) PS C:\Users\gaura\OneDrive\Desktop\AI projects\toon_json_for_llm> npm run test

> toon-json-comparison@1.0.0 test
> node src/test-llm.js

🚀 LLM Format Comparison Test
Testing JSON vs TOON with Ollama

✅ Ollama is running
Available models: llava:7b, nomic-embed-text:latest, llama3.1:8b, gemma3:4b

🤖 Testing with model: llama3.1:8b
================================================================================

📊 Test 1: JSON Format
────────────────────────────────────────────────────────────────────────────────
json data :  {
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
──────────────────────────────
⏱️  Response time: 12786ms
📝 Response length: 477 chars
🔢 Tokens used: 151

Response:
Here is the list of products that meet the criteria:

1. Wireless Mouse (ID: 1)
2. USB-C Hub (ID: 3) *Note: This product is currently out of stock*
3. Monitor Stand (ID: 4)
4. Desk Lamp (ID: 5)
5. Cable Management (ID: 8)

I removed the USB-C Hub from the list since it's out of stock.

If you'd like...

📊 Test 2: TOON Format
────────────────────────────────────────────────────────────────────────────────
toon data :  products:
[8      ]{id    name    price   category        inStock}:
  1     "Wireless Mouse"        29.99   Electronics     true
  2     "Mechanical Keyboard"   89.99   Electronics     true
  3     "USB-C Hub"     45      Electronics     false
  4     "Monitor Stand" 39.99   Office  true
  5     "Desk Lamp"     24.99   Office  true
  6     "Ergonomic Chair"       249.99  Furniture       true
  7     "Standing Desk" 499.99  Furniture       false
  8     "Cable Management"      12.99   Office  true
──────────────────────────────
⏱️  Response time: 9560ms
📝 Response length: 451 chars
🔢 Tokens used: 116

Response:
Based on the product data, here is the list of products that meet the criteria:

* Wireless Mouse (id: 1)
* USB-C Hub (id: 3) - Note: this product is currently out of stock, so it does not strictly meet all three criteria. However, I will include it in the list as per your request.
* Desk Lamp (id: ...

📊 Comparison
────────────────────────────────────────────────────────────────────────────────
Input size reduction: 53.2% (1351 → 632 chars)
Response time difference: -25.2% (12786ms → 9560ms)
✅ TOON is faster!

✅ Test complete!
(base) PS C:\Users\gaura\OneDrive\Desktop\AI projects\toon_json_for_llm> 