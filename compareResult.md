```bash
npm run compare

> toon-json-comparison@1.0.0 compare
> node src/compare.js
```

🚀 JSON vs TOON Comparison Tool
Using tokenizer from tiktoken library

---

## Dataset: Small User Dataset (5 users)

### 📊 Comparison Metrics

| Format        | Bytes | Chars | Lines | GPT-4o Tokens |
|---------------|-------|-------|-------|---------------|
| JSON (Compact)| 380   | 380   | 1     | 153           |
| JSON (Pretty) | 598   | 598   | 34    | 237           |
| TOON (Comma)  | 220   | 220   | 7     | 121           |
| TOON (Tab)    | 220   | 220   | 7     | 119           |
| TOON (Pipe)   | 220   | 220   | 7     | 128           |

✅ Best TOON format: TOON (Tab)
💡 Token reduction: 49.8% (237 → 119 tokens)

### 📄 Sample Outputs

**JSON (Pretty):**

```json
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
      "name": "Diana",
      "role": "moderator",
      "lastLogin": "2025-01-12T11:00:00Z"
    },
    {
      "id": 5,
      "name": "Eve",
      "role": "user",
      "lastLogin": "2025-01-11T08:30:00Z"
    }
  ]
}
```

**TOON (Tab):**

```toon
users:
[5	]{id	name	role	lastLogin}:
  1	Alice	admin	2025-01-15T10:30:00Z
  2	Bob	user	2025-01-14T15:22:00Z
  3	Charlie	user	2025-01-13T09:45:00Z
  4	Diana	moderator	2025-01-12T11:00:00Z
  5	Eve	user	2025-01-11T08:30:00Z
```

---

## Dataset: Medium Product Dataset (10 products)

### 📊 Comparison Metrics

| Format        | Bytes | Chars | Lines | GPT-4o Tokens |
|---------------|-------|-------|-------|---------------|
| JSON (Compact)| 808   | 808   | 1     | 252           |
| JSON (Pretty) | 1316  | 1316  | 74    | 436           |
| TOON (Comma)  | 402   | 402   | 12    | 160           |
| TOON (Tab)    | 402   | 402   | 12    | 166           |
| TOON (Pipe)   | 402   | 402   | 12    | 174           |

✅ Best TOON format: TOON (Comma)
💡 Token reduction: 63.3% (436 → 160 tokens)

### 📄 Sample Outputs

**JSON (Pretty):**

```json
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
    },
    {
      "id": 4,
      "name": "Notebook",
      "price": 5.99,
      "category": "stationery",
      "inStock": true
    },
    {
      "id": 5,
      "name": "Pen Set",
      "price": 12.99,
      "category": "stationery",
      "inStock": true
    },
    {
      "id": 6,
      "name": "Coffee Mug",
      "price": 8.5,
      "category": "lifestyle",
      "inStock": true
    },
    {
      "id": 7,
      "name": "Monitor 24\"",
      "price": 199.99,
      "category": "electronics",
      "inStock": true
    },
    {
      "id": 8,
      "name": "USB Cable",
      "price": 4.99,
      "category": "electronics",
      "inStock": true
    },
    {
      "id": 9,
      "name": "T-Shirt",
      "price": 19.99,
      "category": "clothing",
      "inStock": true
    },
    {
      "id": 10,
      "name": "Sneakers",
      "price": 79.99,
      "category": "clothing",
      "inStock": false
    }
  ]
}
```

**TOON (Comma):**

```toon
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
  10,Sneakers,79.99,clothing,false
```

---

## Dataset: Large Order Dataset (20 orders)

### 📊 Comparison Metrics

| Format        | Bytes | Chars | Lines | GPT-4o Tokens |
|---------------|-------|-------|-------|---------------|
| JSON (Compact)| 2316  | 2316  | 1     | 890           |
| JSON (Pretty) | 3644  | 3644  | 184   | 1394          |
| TOON (Comma)  | 990   | 990   | 22    | 625           |
| TOON (Tab)    | 990   | 990   | 22    | 617           |
| TOON (Pipe)   | 990   | 990   | 22    | 627           |

✅ Best TOON format: TOON (Tab)
💡 Token reduction: 55.7% (1394 → 617 tokens)

### 📄 Sample Outputs

**JSON (Pretty):**

```json
{
  "orders": [
    {
      "id": 1,
      "customerId": 1,
      "productId": 1,
      "quantity": 4,
      "price": 81.84,
      "date": "2025-01-11T11:00:00Z",
      "status": "pending"
    },
    {
      "id": 2,
      "customerId": 2,
      "productId": 2,
      "quantity": 3,
      "price": 73.57,
      "date": "2025-01-18T07:00:00Z",
      "status": "shipped"
    },
    {
      "id": 3,
      "customerId": 3,
      "productId": 3,
      "quantity": 1,
      "price": 51.95,
      "date": "2025-01-17T14:00:00Z",
      "status": "completed"
    },
    {
      "id": 4,
      "customerId": 4,
      "productId": 4,
      "quantity": 2,
      "price": 52.38,
      "date": "2025-01-11T10:00:00Z",
      "status": "pending"
    },
    {
      "id": 5,
      "customerId": 5,
      "productId": 5,
      "quantity": 2,
      "price": 65.13,
      "date": "2025-01-07T16:00:00Z",
      "status": "completed"
    },
    {
      "id": 6,
      "customerId": 1,
      "productId": 6,
      "quantity": 2,
      "price": 19.47,
      "date": "2025-01-28T18:00:00Z",
      "status": "shipped"
    },
    {
      "id": 7,
      "customerId": 2,
      "productId": 7,
      "quantity": 2,
      "price": 92.11,
      "date": "2025-01-16T07:00:00Z",
      "status": "shipped"
    },
    {
      "id": 8,
      "customerId": 3,
      "productId": 8,
      "quantity": 2,
      "price": 99.64,
      "date": "2025-01-01T22:00:00Z",
      "status": "pending"
    },
    {
      "id": 9,
      "customerId": 4,
      "productId": 9,
      "quantity": 5,
      "price": 98.65,
      "date": "2025-01-02T03:00:00Z",
      "status": "pending"
    },
    {
      "id": 10,
      "customerId": 5,
      "productId": 10,
      "quantity": 1,
      "price": 103.86,
      "date": "2025-01-07T22:00:00Z",
      "status": "pending"
    },
    {
      "id": 11,
      "customerId": 1,
      "productId": 1,
      "quantity": 4,
      "price": 56.32,
      "date": "2025-01-14T05:00:00Z",
      "status": "completed"
    },
    {
      "id": 12,
      "customerId": 2,
      "productId": 2,
      "quantity": 1,
      "price": 70.73,
      "date": "2025-01-23T23:00:00Z",
      "status": "completed"
    },
    {
      "id": 13,
      "customerId": 3,
      "productId": 3,
      "quantity": 5,
      "price": 60.23,
      "date": "2025-01-10T04:00:00Z",
      "status": "pending"
    },
    {
      "id": 14,
      "customerId": 4,
      "productId": 4,
      "quantity": 5,
      "price": 16.4,
      "date": "2025-01-12T17:00:00Z",
      "status": "pending"
    },
    {
      "id": 15,
      "customerId": 5,
      "productId": 5,
      "quantity": 2,
      "price": 19.67,
      "date": "2025-01-11T10:00:00Z",
      "status": "shipped"
    },
    {
      "id": 16,
      "customerId": 1,
      "productId": 6,
      "quantity": 3,
      "price": 60.1,
      "date": "2025-01-20T05:00:00Z",
      "status": "pending"
    },
    {
      "id": 17,
      "customerId": 2,
      "productId": 7,
      "quantity": 1,
      "price": 90.41,
      "date": "2025-01-15T20:00:00Z",
      "status": "completed"
    },
    {
      "id": 18,
      "customerId": 3,
      "productId": 8,
      "quantity": 5,
      "price": 29.19,
      "date": "2025-01-15T10:00:00Z",
      "status": "completed"
    },
    {
      "id": 19,
      "customerId": 4,
      "productId": 9,
      "quantity": 2,
      "price": 84.54,
      "date": "2025-01-02T01:00:00Z",
      "status": "shipped"
    },
    {
      "id": 20,
      "customerId": 5,
      "productId": 10,
      "quantity": 4,
      "price": 20.48,
      "date": "2025-01-14T19:00:00Z",
      "status": "pending"
    }
  ]
}
```

**TOON (Tab):**

```toon
orders:
[20	]{id	customerId	productId	quantity	price	date	status}:
  1	1	1	4	81.84	2025-01-11T11:00:00Z	pending
  2	2	2	3	73.57	2025-01-18T07:00:00Z	shipped
  3	3	3	1	51.95	2025-01-17T14:00:00Z	completed
  4	4	4	2	52.38	2025-01-11T10:00:00Z	pending
  5	5	5	2	65.13	2025-01-07T16:00:00Z	completed
  6	1	6	2	19.47	2025-01-28T18:00:00Z	shipped
  7	2	7	2	92.11	2025-01-16T07:00:00Z	shipped
  8	3	8	2	99.64	2025-01-01T22:00:00Z	pending
  9	4	9	5	98.65	2025-01-02T03:00:00Z	pending
  10	5	10	1	103.86	2025-01-07T22:00:00Z	pending
  11	1	1	4	56.32	2025-01-14T05:00:00Z	completed
  12	2	2	1	70.73	2025-01-23T23:00:00Z	completed
  13	3	3	5	60.23	2025-01-10T04:00:00Z	pending
  14	4	4	5	16.4	2025-01-12T17:00:00Z	pending
  15	5	5	2	19.67	2025-01-11T10:00:00Z	shipped
  16	1	6	3	60.1	2025-01-20T05:00:00Z	pending
  17	2	7	1	90.41	2025-01-15T20:00:00Z	completed
  18	3	8	5	29.19	2025-01-15T10:00:00Z	completed
  19	4	9	2	84.54	2025-01-02T01:00:00Z	shipped
  20	5	10	4	20.48	2025-01-14T19:00:00Z	pending
```

---

## 📋 SUMMARY

- **Small User Dataset (5 users)**
  - Best format: TOON (Tab)

- **Medium Product Dataset (10 products)**
  - Best format: TOON (Comma)

- **Large Order Dataset (20 orders)**
  - Best format: TOON (Tab)

✅ Comparison complete!

### 💡 Key Findings:

- TOON reduces tokens by eliminating repeated keys in arrays
- Tab delimiters often tokenize better than commas
- TOON is most effective for uniform object arrays
- Real savings: ~40-60% token reduction for tabular data

