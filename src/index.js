/**
 * Main entry point for JSON vs TOON comparison demo
 * Shows side-by-side comparison of JSON and TOON encoding approaches
 * 
 * This script demonstrates how TOON (Token-Oriented Object Notation) reduces
 * token count compared to JSON when sending data to Large Language Models (LLMs).
 */

// ES6 import statement: imports named exports from other modules
// 'encode' is a function exported from toon.js that converts JavaScript objects to TOON format
import { encode } from './toon.js';

// Import tiktoken library's encoding_for_model function
// TIKTOKEN is a tokenizer library that splits text into tokens the same way OpenAI models do
// A TOKENIZER converts text into tokens - the smallest units that LLMs process
// Different models use different tokenizers (e.g., GPT-4 uses cl100k_base encoding)
import { encoding_for_model } from 'tiktoken';

/**
 * Counts tokens in text using tiktoken tokenizer
 * 
 * TOKENIZER CONCEPT:
 * - Tokenizers break text into tokens (not characters or words)
 * - Example: "Hello world!" might be tokenized as ["Hello", " world", "!"]
 * - Token count determines API costs and context window usage
 * - Different models use different tokenization rules
 * 
 * @param {string} text - The text to tokenize
 * @param {string} model - The model name (e.g., 'gpt-4o', 'gpt-4', 'cl100k_base')
 *                         This determines which tokenizer to use
 * @returns {number} - The number of tokens in the text
 */
function countTokens(text, model = 'gpt-4o') {
  try {
    // encoding_for_model() returns a tokenizer encoder for the specified model
    // This encoder knows how to split text into tokens for that specific model
    const encoding = encoding_for_model(model);
    
    // encode() converts the text string into an array of token IDs
    // Each token ID represents a piece of text (word, subword, or punctuation)
    const tokens = encoding.encode(text);
    
    // Return the length of the token array (total number of tokens)
    return tokens.length;
  } catch {
    // Fallback: if tokenizer fails, estimate tokens as 1 token per 4 characters
    // This is a rough approximation (actual tokenization varies by model)
    return Math.ceil(text.length / 4);
  }
}

console.log('🎒 JSON vs TOON Encoding Comparison Demo\n');
console.log('Token-Oriented Object Notation (TOON) vs JSON for LLM Inputs\n');
console.log('='.repeat(80));

// 'const' keyword: declares a constant variable that cannot be reassigned
// Sample data with uniform object arrays (all objects have the same keys)
// This is ideal for TOON format which declares keys once in the header
const sampleData = {
  users: [
    { id: 1, name: 'Alice', role: 'admin', active: true },
    { id: 2, name: 'Bob', role: 'user', active: true },
    { id: 3, name: 'Charlie', role: 'moderator', active: false }
  ],
  metadata: {
    total: 3,
    lastUpdated: '2025-01-15T10:00:00Z'
  }
};

console.log('\n📄 Original Data Structure:');
console.log(JSON.stringify(sampleData, null, 2));

// Generate different formats for comparison
// JSON.stringify() - converts JavaScript object to JSON string
// Second parameter (null) is a replacer function (not used here)
// Third parameter (2) is the number of spaces for indentation (null = compact, 2 = pretty)
const jsonCompact = JSON.stringify(sampleData);
const jsonPretty = JSON.stringify(sampleData, null, 2);

// encode() - TOON encoder function (from toon.js)
// Options object with delimiter property: specifies character to separate values
// Comma is default, tab and pipe are alternatives that may tokenize better
const toonComma = encode(sampleData);
const toonTab = encode(sampleData, { delimiter: '\t' }); // Tab delimiter: \t is escape sequence for tab character
const toonPipe = encode(sampleData, { delimiter: '|' }); // Pipe delimiter: | character

// Calculate metrics for each format
// Array of objects: each object represents a format with its name and content
const formats = [
  { name: 'JSON (Compact)', content: jsonCompact },
  { name: 'JSON (Pretty)', content: jsonPretty },
  { name: 'TOON (Comma)', content: toonComma },
  { name: 'TOON (Tab)', content: toonTab },
  { name: 'TOON (Pipe)', content: toonPipe }
];

console.log('\n' + '='.repeat(80));
console.log('📊 COMPARISON METRICS');
console.log('='.repeat(80));
console.log('\nFormat'.padEnd(20) + 'Chars'.padStart(12) + 'Bytes'.padStart(12) + 'Lines'.padStart(12) + 'Tokens'.padStart(12));
console.log('-'.repeat(80));

// forEach() - array method that executes a function for each array element
// Arrow function syntax: (format => { ... }) is equivalent to function(format) { ... }
formats.forEach(format => {
  // String.length - property that returns the number of characters in a string
  const chars = format.content.length;
  
  // Buffer.byteLength() - calculates the byte size of a string in a specific encoding
  // UTF-8 is the encoding (1-4 bytes per character depending on the character)
  const bytes = Buffer.byteLength(format.content, 'utf8');
  
  // split('\n') - splits string into array by newline character
  // Array.length - number of lines in the formatted content
  const lines = format.content.split('\n').length;
  
  // countTokens() - uses tiktoken to count tokens for GPT-4o model
  // This is the most important metric for LLM cost comparison
  const tokens = countTokens(format.content, 'gpt-4o');
  
  // padEnd() / padStart() - string methods that pad with spaces for alignment
  // padEnd(20) - adds spaces at the end to make total length 20
  // padStart(12) - adds spaces at the beginning to make total length 12
  console.log(
    format.name.padEnd(20) +
    chars.toString().padStart(12) +
    bytes.toString().padStart(12) +
    lines.toString().padStart(12) +
    tokens.toString().padStart(12)
  );
});

// Find best TOON format by comparing token counts
// find() - array method that returns first element matching the condition
// Arrow function f => f.name === 'JSON (Pretty)' returns format with matching name
const jsonBaseline = formats.find(f => f.name === 'JSON (Pretty)');

// filter() - array method that returns new array with elements matching condition
// startsWith() - string method that checks if string starts with specified substring
// This filters all formats that start with 'TOON'
const toonFormats = formats.filter(f => f.name.startsWith('TOON'));

// reduce() - array method that reduces array to a single value
// Compares each TOON format's token count and keeps the one with fewest tokens
// Ternary operator: condition ? valueIfTrue : valueIfFalse
const toonBest = toonFormats.reduce((best, current) => {
  const bestTokens = countTokens(best.content, 'gpt-4o');
  const currentTokens = countTokens(current.content, 'gpt-4o');
  return currentTokens < bestTokens ? current : best;
});

// if statement: executes code block only if condition is true
// && operator: logical AND - both conditions must be true
// Checks that both baseline and best TOON format were found
if (jsonBaseline && toonBest) {
  const jsonTokens = countTokens(jsonBaseline.content, 'gpt-4o');
  const toonTokens = countTokens(toonBest.content, 'gpt-4o');
  
  // Template literal: uses backticks (`) to embed expressions with ${}
  // toFixed(1) - rounds number to 1 decimal place
  // Calculate percentage reduction: ((old - new) / old) * 100
  const reduction = ((jsonTokens - toonTokens) / jsonTokens * 100).toFixed(1);
  
  // String concatenation: + operator joins strings
  // repeat(80) - repeats the string 80 times
  console.log('\n' + '='.repeat(80));
  console.log('💡 KEY INSIGHTS');
  console.log('='.repeat(80));
  console.log(`✅ Best TOON format: ${toonBest.name}`);
  console.log(`📉 Token reduction: ${reduction}% (${jsonTokens} → ${toonTokens} tokens)`);
  console.log(`📏 Character reduction: ${((jsonBaseline.content.length - toonBest.content.length) / jsonBaseline.content.length * 100).toFixed(1)}%`);
}

// Side-by-side comparison
console.log('\n' + '='.repeat(80));
console.log('🔍 SIDE-BY-SIDE FORMAT COMPARISON');
console.log('='.repeat(80));

console.log('\n📋 JSON (Pretty) Format:');
console.log('-'.repeat(80));
console.log(jsonPretty);

console.log('\n📋 TOON (Comma) Format:');
console.log('-'.repeat(80));
console.log(toonComma);

console.log('\n📋 TOON (Tab) Format:');
console.log('-'.repeat(80));
console.log(toonTab);

// Show key differences
console.log('\n' + '='.repeat(80));
console.log('🔑 KEY DIFFERENCES BETWEEN JSON AND TOON');
console.log('='.repeat(80));
console.log(`
JSON Approach:
  • Uses braces { } and brackets [ ] for structure
  • Requires quotes around all string keys and values
  • Repeats keys for each object in an array
  • Verbose syntax with commas and colons
  • Example: { "id": 1, "name": "Alice", "role": "admin" }

TOON Approach:
  • Uses indentation for structure (like YAML)
  • Quotes only when needed (values with spaces/special chars)
  • Declares keys once in array header: [3]{id,name,role}:
  • Compact syntax: just values separated by delimiters
  • Example: 1,Alice,admin (keys declared in header)

Benefits of TOON:
  ✓ Fewer tokens = lower LLM costs
  ✓ Faster processing (less to parse)
  ✓ More readable for tabular data
  ✓ Explicit length markers help validation
  ✓ Better for uniform object arrays
`);

console.log('\n' + '='.repeat(80));
console.log('📊 Run detailed comparison: npm run compare');
console.log('🤖 Test with LLM: npm run test');
console.log('='.repeat(80));
console.log('\n✅ Demo complete!');
