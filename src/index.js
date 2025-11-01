/**
 * Main entry point for JSON vs TOON comparison demo
 * Shows side-by-side comparison of JSON and TOON encoding approaches
 */

import { encode } from './toon.js';
import { encoding_for_model } from 'tiktoken';

// Count tokens using tiktoken
function countTokens(text, model = 'gpt-4o') {
  try {
    const encoding = encoding_for_model(model);
    const tokens = encoding.encode(text);
    return tokens.length;
  } catch {
    return Math.ceil(text.length / 4); // fallback estimate
  }
}

console.log('🎒 JSON vs TOON Encoding Comparison Demo\n');
console.log('Token-Oriented Object Notation (TOON) vs JSON for LLM Inputs\n');
console.log('='.repeat(80));

// Sample data with uniform object arrays
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

// Generate different formats
const jsonCompact = JSON.stringify(sampleData);
const jsonPretty = JSON.stringify(sampleData, null, 2);
const toonComma = encode(sampleData);
const toonTab = encode(sampleData, { delimiter: '\t' });
const toonPipe = encode(sampleData, { delimiter: '|' });

// Calculate metrics for each format
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

formats.forEach(format => {
  const chars = format.content.length;
  const bytes = Buffer.byteLength(format.content, 'utf8');
  const lines = format.content.split('\n').length;
  const tokens = countTokens(format.content, 'gpt-4o');
  
  console.log(
    format.name.padEnd(20) +
    chars.toString().padStart(12) +
    bytes.toString().padStart(12) +
    lines.toString().padStart(12) +
    tokens.toString().padStart(12)
  );
});

// Find best TOON format
const jsonBaseline = formats.find(f => f.name === 'JSON (Pretty)');
const toonFormats = formats.filter(f => f.name.startsWith('TOON'));
const toonBest = toonFormats.reduce((best, current) => {
  const bestTokens = countTokens(best.content, 'gpt-4o');
  const currentTokens = countTokens(current.content, 'gpt-4o');
  return currentTokens < bestTokens ? current : best;
});

if (jsonBaseline && toonBest) {
  const jsonTokens = countTokens(jsonBaseline.content, 'gpt-4o');
  const toonTokens = countTokens(toonBest.content, 'gpt-4o');
  const reduction = ((jsonTokens - toonTokens) / jsonTokens * 100).toFixed(1);
  
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
