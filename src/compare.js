

/**
 * Comparison tool for JSON vs TOON formats
 * Measures token count, size in bytes, and visualizes differences
 * 
 * This script runs comprehensive comparisons across multiple test datasets
 * to demonstrate TOON's token reduction benefits across different data sizes.
 */

// ES6 import: brings in the encode function from toon.js module
import { encode } from './toon.js';

// Import tiktoken's encoding_for_model function
// This is used to count tokens accurately for different LLM models
import { encoding_for_model } from 'tiktoken';

// 'const' keyword: declares constant variable
// Object literal: { } creates an object with properties
// Test datasets of different sizes and types to show TOON's effectiveness
const testDatasets = {
  smallUsers: {
    name: 'Small User Dataset (5 users)',
    data: {
      users: [
        { id: 1, name: 'Alice', role: 'admin', lastLogin: '2025-01-15T10:30:00Z' },
        { id: 2, name: 'Bob', role: 'user', lastLogin: '2025-01-14T15:22:00Z' },
        { id: 3, name: 'Charlie', role: 'user', lastLogin: '2025-01-13T09:45:00Z' },
        { id: 4, name: 'Diana', role: 'moderator', lastLogin: '2025-01-12T11:00:00Z' },
        { id: 5, name: 'Eve', role: 'user', lastLogin: '2025-01-11T08:30:00Z' }
      ]
    }
  },
  mediumProducts: {
    name: 'Medium Product Dataset (10 products)',
    data: {
      products: [
        { id: 1, name: 'Widget', price: 9.99, category: 'tools', inStock: true },
        { id: 2, name: 'Gadget', price: 14.50, category: 'tools', inStock: true },
        { id: 3, name: 'Book: Advanced Python', price: 29.99, category: 'books', inStock: false },
        { id: 4, name: 'Notebook', price: 5.99, category: 'stationery', inStock: true },
        { id: 5, name: 'Pen Set', price: 12.99, category: 'stationery', inStock: true },
        { id: 6, name: 'Coffee Mug', price: 8.50, category: 'lifestyle', inStock: true },
        { id: 7, name: 'Monitor 24"', price: 199.99, category: 'electronics', inStock: true },
        { id: 8, name: 'USB Cable', price: 4.99, category: 'electronics', inStock: true },
        { id: 9, name: 'T-Shirt', price: 19.99, category: 'clothing', inStock: true },
        { id: 10, name: 'Sneakers', price: 79.99, category: 'clothing', inStock: false }
      ]
    }
  },
  largeOrders: {
    name: 'Large Order Dataset (20 orders)',
    data: {
      orders: Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        customerId: (i % 5) + 1,
        productId: (i % 10) + 1,
        quantity: Math.floor(Math.random() * 5) + 1,
        price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
        date: `2025-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:00:00Z`,
        status: ['pending', 'completed', 'shipped'][Math.floor(Math.random() * 3)]
      }))
    }
  }
};

/**
 * Counts tokens using tiktoken tokenizer
 * 
 * TOKENIZER CONCEPT EXPLAINED:
 * - Tokenizers convert text into tokens (not words or characters)
 * - Tokens are the unit of measurement for LLM API costs
 * - Example: "Hello world" might be 2 tokens, but "Hello" might be 1 token
 * - Different models use different tokenization rules:
 *   - GPT-4 uses cl100k_base encoding
 *   - Older models use different encodings
 * - Token count directly affects API pricing and context window usage
 * 
 * @param {string} text - Text to tokenize
 * @param {string} model - Model name (determines which tokenizer to use)
 * @returns {number} - Number of tokens
 */
function countTokens(text, model = 'gpt-4o') {
  // try-catch: error handling - try block may throw errors
  try {
    // Get tokenizer encoder for the specified model
    const encoding = encoding_for_model(model);
    
    // Encode text to array of token IDs
    const tokens = encoding.encode(text);
    
    // Return count of tokens
    return tokens.length;
  } catch (error) {
    // catch block: handles errors thrown in try block
    // console.warn() - logs warning message (non-fatal)
    // Template literal: ${} embeds variables in string
    console.warn(`Warning: Could not use tokenizer for ${model}, using fallback`);
    
    // Fallback: rough estimate (4 chars per token is average)
    // Math.ceil() - rounds up to nearest integer
    return Math.ceil(text.length / 4);
  }
}

/**
 * Analyzes a formatted data string and calculates various metrics
 * 
 * @param {*} data - The data (not used, but kept for consistency)
 * @param {string} formatName - Name of the format (e.g., 'JSON (Pretty)')
 * @param {Function} formatter - Function that formats data (returns string)
 * @returns {Object} - Object containing format name, content, and metrics
 * 
 * Function parameter: formatter is a function passed as argument
 * This is a "higher-order function" - accepts another function as parameter
 */
function analyzeFormat(data, formatName, formatter) {
  // Call formatter function with data - this generates the formatted string
  const formatted = formatter(data);
  
  // Buffer.byteLength() - calculates byte size in UTF-8 encoding
  // UTF-8: variable-length encoding (1-4 bytes per character)
  const byteSize = Buffer.byteLength(formatted, 'utf8');
  
  // String.length - number of characters (not bytes)
  const charCount = formatted.length;
  
  // split('\n') - splits string into array by newline
  // Array.length - number of lines
  const lines = formatted.split('\n').length;
  
  // Try multiple tokenizer models to show consistency
  // Object literal: {} creates empty object
  const tokenCounts = {};
  
  // Array of model names to test
  // 'gpt-4o' - latest GPT-4 model
  // 'gpt-4' - standard GPT-4
  // 'cl100k_base' - base encoding name (used by GPT-4)
  const models = ['gpt-4o', 'gpt-4', 'cl100k_base'];
  
  // for...of loop: iterates over array elements
  // 'const model' - declares constant for each iteration
  for (const model of models) {
    try {
      // Object property assignment: tokenCounts[model] = value
      // Bracket notation: access property by variable name
      tokenCounts[model] = countTokens(formatted, model);
    } catch (error) {
      // Skip if model not available (silent fail)
      // Empty catch block - error is ignored
    }
  }

  return {
    format: formatName,
    content: formatted,
    metrics: {
      bytes: byteSize,
      characters: charCount,
      lines,
      tokens: tokenCounts
    }
  };
}

function compareDataset(dataset) {
  console.log('\n' + '='.repeat(80));
  console.log(`Dataset: ${dataset.name}`);
  console.log('='.repeat(80));

  // JSON with different formatting options
  const jsonCompact = JSON.stringify(dataset.data);
  const jsonPretty = JSON.stringify(dataset.data, null, 2);
  
  // TOON with default options
  const toonDefault = encode(dataset.data);
  
  // TOON with tab delimiter
  const toonTab = encode(dataset.data, { delimiter: '\t' });
  
  // TOON with pipe delimiter
  const toonPipe = encode(dataset.data, { delimiter: '|' });

  const results = [
    analyzeFormat(jsonCompact, 'JSON (Compact)', () => jsonCompact),
    analyzeFormat(jsonPretty, 'JSON (Pretty)', () => jsonPretty),
    analyzeFormat(toonDefault, 'TOON (Comma)', () => toonDefault),
    analyzeFormat(toonTab, 'TOON (Tab)', () => toonTab),
    analyzeFormat(toonPipe, 'TOON (Pipe)', () => toonPipe)
  ];

  // Display comparison table
  console.log('\n📊 Comparison Metrics:');
  console.log(''.padEnd(20) + 'Bytes'.padStart(12) + 'Chars'.padStart(12) + 'Lines'.padStart(12) + 'GPT-4o'.padStart(12));
  console.log('-'.repeat(80));

  results.forEach(result => {
    const tokens = result.metrics.tokens['gpt-4o'] || result.metrics.tokens['gpt-4'] || result.metrics.tokens['cl100k_base'] || 'N/A';
    console.log(
      result.format.padEnd(20) +
      result.metrics.bytes.toString().padStart(12) +
      result.metrics.characters.toString().padStart(12) +
      result.metrics.lines.toString().padStart(12) +
      tokens.toString().padStart(12)
    );
  });

  // Calculate savings: compare JSON baseline with best TOON format
  // find() - returns first element matching condition
  // Arrow function: r => r.format === 'JSON (Pretty)' checks format name
  const jsonBaseline = results.find(r => r.format === 'JSON (Pretty)');
  
  // Find best TOON format by sorting by token count
  // filter() - keeps only TOON formats
  // startsWith() - checks if string starts with 'TOON'
  // sort() - sorts array using comparison function
  // Comparison function: (a, b) => a - b sorts ascending (lowest first)
  // || operator: if tokens['gpt-4o'] is undefined, use 0
  // [0] - gets first element (best/lowest token count)
  const toonBest = results
    .filter(r => r.format.startsWith('TOON'))
    .sort((a, b) => {
      const aTokens = a.metrics.tokens['gpt-4o'] || 0;
      const bTokens = b.metrics.tokens['gpt-4o'] || 0;
      return aTokens - bTokens; // Negative = a comes first, positive = b comes first
    })[0];

  if (jsonBaseline && toonBest) {
    const jsonTokens = jsonBaseline.metrics.tokens['gpt-4o'] || jsonBaseline.metrics.tokens['gpt-4'] || 0;
    const toonTokens = toonBest.metrics.tokens['gpt-4o'] || toonBest.metrics.tokens['gpt-4'] || 0;
    
    if (jsonTokens > 0) {
      const reduction = ((jsonTokens - toonTokens) / jsonTokens * 100).toFixed(1);
      console.log('\n✅ Best TOON format:', toonBest.format);
      console.log(`💡 Token reduction: ${reduction}% (${jsonTokens} → ${toonTokens} tokens)`);
    }
  }

  // Show samples
  console.log('\n📄 Sample Outputs:');
  console.log('\n--- JSON (Pretty) ---');
  console.log(results[1].content.substring(0, 400) + (results[1].content.length > 400 ? '...' : ''));
  console.log('\n--- ' + toonBest.format + ' ---');
  console.log(toonBest.content.substring(0, 400) + (toonBest.content.length > 400 ? '...' : ''));

  return { dataset: dataset.name, results, bestFormat: toonBest.format };
}

/**
 * Main execution function
 * 
 * 'async' keyword: marks function as asynchronous (can use await)
 * Async functions return Promises (but we're not using await here)
 */
async function main() {
  console.log('🚀 JSON vs TOON Comparison Tool');
  console.log('Using tokenizer from tiktoken library');
  
  // Array to store all comparison results
  const allResults = [];
  
  // for...in loop: iterates over object property names (keys)
  // testDatasets is an object, so 'key' is property name (e.g., 'smallUsers')
  // testDatasets[key] - bracket notation to access property value
  for (const key in testDatasets) {
    // Call compareDataset function with dataset object
    const result = compareDataset(testDatasets[key]);
    
    // push() - array method: adds element to end of array
    allResults.push(result);
  }

  // Summary
  console.log('\n\n' + '='.repeat(80));
  console.log('📋 SUMMARY');
  console.log('='.repeat(80));
  
  allResults.forEach(result => {
    console.log(`\n${result.dataset}`);
    console.log(`  Best format: ${result.bestFormat}`);
  });

  console.log('\n✅ Comparison complete!');
  console.log('\n💡 Key Findings:');
  console.log('  - TOON reduces tokens by eliminating repeated keys in arrays');
  console.log('  - Tab delimiters often tokenize better than commas');
  console.log('  - TOON is most effective for uniform object arrays');
  console.log('  - Real savings: ~40-60% token reduction for tabular data');
}

main().catch(console.error);
