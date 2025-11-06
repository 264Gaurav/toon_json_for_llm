/**
 * Test data for LLM format comparison tests
 * Contains sample product data used for testing JSON vs TOON formats
 */

export const testData = {
  products: [
    { id: 1, name: 'Wireless Mouse', price: 29.99, category: 'Electronics', inStock: true },
    { id: 2, name: 'Mechanical Keyboard', price: 89.99, category: 'Electronics', inStock: true },
    { id: 3, name: 'USB-C Hub', price: 45.00, category: 'Electronics', inStock: false },
    { id: 4, name: 'Monitor Stand', price: 39.99, category: 'Office', inStock: true },
    { id: 5, name: 'Desk Lamp', price: 24.99, category: 'Office', inStock: true },
    { id: 6, name: 'Ergonomic Chair', price: 249.99, category: 'Furniture', inStock: true },
    { id: 7, name: 'Standing Desk', price: 499.99, category: 'Furniture', inStock: false },
    { id: 8, name: 'Cable Management', price: 12.99, category: 'Office', inStock: true }
  ]
};

export const testPrompt = `You are a helpful assistant. Analyze the product data below and list all products that are:
In the "Electronics" category and is less than $50. 
Format your response as a simple list.`;

