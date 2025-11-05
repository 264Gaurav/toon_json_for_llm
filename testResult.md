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
⏱️  Response time: 23723ms
📝 Response length: 164 chars
🔢 Tokens used: 53

Response:
Here is the list of products that match the specified criteria:

1. Wireless Mouse (id: 1)
2. Monitor Stand (id: 4)
3. Desk Lamp (id: 5)
4. Cable Management (id: 8)

📊 Test 2: TOON Format
────────────────────────────────────────────────────────────────────────────────
⏱️  Response time: 6055ms
📝 Response length: 235 chars
🔢 Tokens used: 66

Response:
Here is the list of products that meet the specified criteria:

1. Wireless Mouse (id: 1)
2. USB-C Hub (id: 3)
3. Cable Management (id: 8)

These products are in the "Electronics" category, currently in stock, and priced less than $50.

📊 Comparison
────────────────────────────────────────────────────────────────────────────────
Input size reduction: 53.2% (1351 → 632 chars)
Response time difference: -74.5% (23723ms → 6055ms)
✅ TOON is faster!

✅ Test complete!
(base) PS C:\Users\gaura\OneDrive\Desktop\AI projects\toon_json_for_llm> 