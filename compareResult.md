(base) PS C:\Users\gaura\OneDrive\Desktop\AI projects\toon_json_for_llm> npm run compare

> toon-json-comparison@1.0.0 compare
> node src/compare.js

🚀 JSON vs TOON Comparison Tool
Using tokenizer from tiktoken library

================================================================================
Dataset: Small User Dataset (5 users)
================================================================================
Warning: Could not use tokenizer for cl100k_base, using fallback
Warning: Could not use tokenizer for cl100k_base, using fallback
Warning: Could not use tokenizer for cl100k_base, using fallback
Warning: Could not use tokenizer for cl100k_base, using fallback
Warning: Could not use tokenizer for cl100k_base, using fallback

📊 Comparison Metrics:
                           Bytes       Chars       Lines      GPT-4o
--------------------------------------------------------------------------------
JSON (Compact)               380         380           1         153
JSON (Pretty)                598         598          34         237
TOON (Comma)                 220         220           7         121
TOON (Tab)                   220         220           7         119
TOON (Pipe)                  220         220           7         128

✅ Best TOON format: TOON (Tab)
💡 Token reduction: 49.8% (237 → 119 tokens)

📄 Sample Outputs:

--- JSON (Pretty) ---
{
  "users": [
    {
      "id": 1,
      "name": "Alice",
      "role": "admin",
      "lastLogin": "2025-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "name": "Bob",
      "role": "user",
      "lastLogin": "2025-01-14T15:22:00Z"
    },
    {
      "id": 3,
      "name": "Charlie",
      "role": "user",
      "lastLogin": "2025-01-13T09:45:00Z"
    },
    {
      "id": 4,
      "name": "Dia...

--- TOON (Tab) ---
users:
[5      ]{id    name    role    lastLogin}:
  1     Alice   admin   2025-01-15T10:30:00Z
  2     Bob     user    2025-01-14T15:22:00Z
  3     Charlie user    2025-01-13T09:45:00Z
  4     Diana   moderator       2025-01-12T11:00:00Z
  5     Eve     user    2025-01-11T08:30:00Z

================================================================================
Dataset: Medium Product Dataset (10 products)
================================================================================
Warning: Could not use tokenizer for cl100k_base, using fallback
Warning: Could not use tokenizer for cl100k_base, using fallback
Warning: Could not use tokenizer for cl100k_base, using fallback
Warning: Could not use tokenizer for cl100k_base, using fallback
Warning: Could not use tokenizer for cl100k_base, using fallback

📊 Comparison Metrics:
                           Bytes       Chars       Lines      GPT-4o
--------------------------------------------------------------------------------
JSON (Compact)               808         808           1         252
JSON (Pretty)               1316        1316          74         436
TOON (Comma)                 402         402          12         160
TOON (Tab)                   402         402          12         166
TOON (Pipe)                  402         402          12         174

✅ Best TOON format: TOON (Comma)
💡 Token reduction: 63.3% (436 → 160 tokens)

📄 Sample Outputs:

--- JSON (Pretty) ---
{
  "products": [
    {
      "id": 1,
      "name": "Widget",
      "price": 9.99,
      "category": "tools",
      "inStock": true
    },
    {
      "id": 2,
      "name": "Gadget",
      "price": 14.5,
      "category": "tools",
      "inStock": true
    },
    {
      "id": 3,
      "name": "Book: Advanced Python",
      "price": 29.99,
      "category": "books",
      "inStock": false
    },...

--- TOON (Comma) ---
products:
[10,]{id,name,price,category,inStock}:
  1,Widget,9.99,tools,true
  2,Gadget,14.5,tools,true
  3,"Book: Advanced Python",29.99,books,false
  4,Notebook,5.99,stationery,true
  5,"Pen Set",12.99,stationery,true
  6,"Coffee Mug",8.5,lifestyle,true
  7,"Monitor 24\"",199.99,electronics,true
  8,"USB Cable",4.99,electronics,true
  9,T-Shirt,19.99,clothing,true
  10,Sneakers,79.99,clothing,fal...

================================================================================
Dataset: Large Order Dataset (20 orders)
================================================================================
Warning: Could not use tokenizer for cl100k_base, using fallback
Warning: Could not use tokenizer for cl100k_base, using fallback
Warning: Could not use tokenizer for cl100k_base, using fallback
Warning: Could not use tokenizer for cl100k_base, using fallback
Warning: Could not use tokenizer for cl100k_base, using fallback

📊 Comparison Metrics:
                           Bytes       Chars       Lines      GPT-4o
--------------------------------------------------------------------------------
JSON (Compact)              2314        2314           1         893
JSON (Pretty)               3642        3642         184        1397
TOON (Comma)                 988         988          22         628
TOON (Tab)                   988         988          22         617
TOON (Pipe)                  988         988          22         630

✅ Best TOON format: TOON (Tab)
💡 Token reduction: 55.8% (1397 → 617 tokens)

📄 Sample Outputs:

--- JSON (Pretty) ---
{
  "orders": [
    {
      "id": 1,
      "customerId": 1,
      "productId": 1,
      "quantity": 5,
      "price": 18.92,
      "date": "2025-01-08T14:00:00Z",
      "status": "pending"
    },
    {
      "id": 2,
      "customerId": 2,
      "productId": 2,
      "quantity": 3,
      "price": 97.94,
      "date": "2025-01-18T00:00:00Z",
      "status": "pending"
    },
    {
      "id": 3,
   ...

--- TOON (Tab) ---
orders:
[20     ]{id    customerId      productId       quantity        price   date    status}:
  1     1       1       5       18.92   2025-01-08T14:00:00Z    pending
  2     2       2       3       97.94   2025-01-18T00:00:00Z    pending
  3     3       3       3       80.49   2025-01-22T19:00:00Z    pending
  4     4       4       2       35.86   2025-01-22T09:00:00Z    shipped
  5     5       5       3       22.75   2025-01-26T22:00:00Z    pending
  6     1       6       4       23.11   2025-01-14T11:00:00Z    shipped
  7     2       7       5       42.92   2025-01-01T18:00:00Z    shipped
  8     3       8       5       18.05   20...


================================================================================
📋 SUMMARY
================================================================================

Small User Dataset (5 users)
  Best format: TOON (Tab)

Medium Product Dataset (10 products)
  Best format: TOON (Comma)

Large Order Dataset (20 orders)
  Best format: TOON (Tab)

✅ Comparison complete!

💡 Key Findings:
  - TOON reduces tokens by eliminating repeated keys in arrays
  - Tab delimiters often tokenize better than commas
  - TOON is most effective for uniform object arrays
  - Real savings: ~40-60% token reduction for tabular data
(base) PS C:\Users\gaura\OneDrive\Desktop\AI projects\toon_json_for_llm>