(base) PS C:\Users\gaura\OneDrive\Desktop\AI projects\toon_json_for_llm> npm run compare

> toon-json-comparison@1.0.0 compare
> node src/compare.js

🚀 JSON vs TOON Comparison Tool
Using tokenizer from tiktoken library

================================================================================
Dataset: Small User Dataset (5 users)
================================================================================

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

📊 Comparison Metrics:
                           Bytes       Chars       Lines      GPT-4o
--------------------------------------------------------------------------------
JSON (Compact)              2322        2322           1         892
JSON (Pretty)               3650        3650         184        1396
TOON (Comma)                 996         996          22         627
TOON (Tab)                   996         996          22         617
TOON (Pipe)                  996         996          22         629

✅ Best TOON format: TOON (Tab)
💡 Token reduction: 55.8% (1396 → 617 tokens)

📄 Sample Outputs:

--- JSON (Pretty) ---
{
  "orders": [
    {
      "id": 1,
      "customerId": 1,
      "productId": 1,
      "quantity": 2,
      "price": 38.96,
      "date": "2025-01-26T15:00:00Z",
      "status": "completed"
    },
    {
      "id": 2,
      "customerId": 2,
      "productId": 2,
      "quantity": 4,
      "price": 56.34,
      "date": "2025-01-12T23:00:00Z",
      "status": "pending"
    },
    {
      "id": 3,
 ...

--- TOON (Tab) ---
orders:
[20     ]{id    customerId      productId       quantity        price   date    status}:    
  1     1       1       2       38.96   2025-01-26T15:00:00Z    completed
  2     2       2       4       56.34   2025-01-12T23:00:00Z    pending
  3     3       3       1       38.78   2025-01-01T02:00:00Z    pending
  4     4       4       3       90.39   2025-01-18T01:00:00Z    shipped
  5     5       5       3       84.11   2025-01-21T23:00:00Z    pending
  6     1       6       5       104.56  2025-01-27T02:00:00Z    completed
  7     2       7       4       96.41   2025-01-13T10:00:00Z    shipped
  8     3       8       4       10....


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