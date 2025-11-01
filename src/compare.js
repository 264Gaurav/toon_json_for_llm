/**
 * compare.js
 * Handles dataset comparison between JSON and TOON formats.
 */

import { encode } from './toon.js';
import { encoding_for_model } from 'tiktoken';

function countTokens(text, model = 'gpt-4o') {
  try {
    const encoding = encoding_for_model(model);
    const tokens = encoding.encode(text);
    return tokens.length;
  } catch {
    console.warn(`⚠️ Tokenizer unavailable for ${model}, using rough estimate`);
    return Math.ceil(text.length / 4); // fallback estimate
  }
}

function analyzeFormat(data, formatName, formatter) {
  const formatted = formatter(data);
  const byteSize = Buffer.byteLength(formatted, 'utf8');
  const charCount = formatted.length;
  const lines = formatted.split('\n').length;

  const tokenCounts = {};
  const models = ['gpt-4o', 'gpt-4', 'cl100k_base'];
  for (const model of models) {
    try {
      tokenCounts[model] = countTokens(formatted, model);
    } catch {}
  }

  return {
    format: formatName,
    content: formatted,
    metrics: {
      bytes: byteSize,
      characters: charCount,
      lines,
      tokens: tokenCounts,
    },
  };
}

export function compareDataset(dataset) {
  console.log('\n' + '='.repeat(80));
  console.log(`Dataset: ${dataset.name}`);
  console.log('='.repeat(80));

  const jsonCompact = JSON.stringify(dataset.data);
  const jsonPretty = JSON.stringify(dataset.data, null, 2);
  const toonDefault = encode(dataset.data);
  const toonTab = encode(dataset.data, { delimiter: '\t' });
  const toonPipe = encode(dataset.data, { delimiter: '|' });

  const results = [
    analyzeFormat(dataset.data, 'JSON (Compact)', () => jsonCompact),
    analyzeFormat(dataset.data, 'JSON (Pretty)', () => jsonPretty),
    analyzeFormat(dataset.data, 'TOON (Comma)', () => toonDefault),
    analyzeFormat(dataset.data, 'TOON (Tab)', () => toonTab),
    analyzeFormat(dataset.data, 'TOON (Pipe)', () => toonPipe),
  ];

  console.log('\n📊 Comparison Metrics:');
  console.log(''.padEnd(20) + 'Bytes'.padStart(12) + 'Chars'.padStart(12) + 'Lines'.padStart(12) + 'GPT-4o'.padStart(12));
  console.log('-'.repeat(80));

  results.forEach(result => {
    const tokens =
      result.metrics.tokens['gpt-4o'] ||
      result.metrics.tokens['gpt-4'] ||
      result.metrics.tokens['cl100k_base'] ||
      'N/A';

    console.log(
      result.format.padEnd(20) +
      result.metrics.bytes.toString().padStart(12) +
      result.metrics.characters.toString().padStart(12) +
      result.metrics.lines.toString().padStart(12) +
      tokens.toString().padStart(12)
    );
  });

  const jsonBaseline = results.find(r => r.format === 'JSON (Pretty)');
  const toonBest = results
    .filter(r => r.format.startsWith('TOON'))
    .sort((a, b) => {
      const aTokens = a.metrics.tokens['gpt-4o'] || 0;
      const bTokens = b.metrics.tokens['gpt-4o'] || 0;
      return aTokens - bTokens;
    })[0];

  if (jsonBaseline && toonBest) {
    const jsonTokens =
      jsonBaseline.metrics.tokens['gpt-4o'] || jsonBaseline.metrics.tokens['gpt-4'] || 0;
    const toonTokens =
      toonBest.metrics.tokens['gpt-4o'] || toonBest.metrics.tokens['gpt-4'] || 0;

    if (jsonTokens > 0) {
      const reduction = ((jsonTokens - toonTokens) / jsonTokens * 100).toFixed(1);
      console.log('\n✅ Best TOON format:', toonBest.format);
      console.log(`💡 Token reduction: ${reduction}% (${jsonTokens} → ${toonTokens} tokens)`);
    }
  }

  console.log('\n📄 Sample Outputs:');
  console.log('\n--- JSON (Pretty) ---');
  console.log(jsonPretty.substring(0, 400) + (jsonPretty.length > 400 ? '...' : ''));
  console.log('\n--- ' + toonBest.format + ' ---');
  console.log(toonBest.content.substring(0, 400) + (toonBest.content.length > 400 ? '...' : ''));

  return { dataset: dataset.name, results, bestFormat: toonBest.format };
}




// /**
//  * Comparison tool for JSON vs TOON formats
//  * Measures token count, size in bytes, and visualizes differences
//  */

// import { encode } from './toon.js';
// import { encoding_for_model } from 'tiktoken';

// // Test datasets of different sizes and types
// const testDatasets = {
//   smallUsers: {
//     name: 'Small User Dataset (5 users)',
//     data: {
//       users: [
//         { id: 1, name: 'Alice', role: 'admin', lastLogin: '2025-01-15T10:30:00Z' },
//         { id: 2, name: 'Bob', role: 'user', lastLogin: '2025-01-14T15:22:00Z' },
//         { id: 3, name: 'Charlie', role: 'user', lastLogin: '2025-01-13T09:45:00Z' },
//         { id: 4, name: 'Diana', role: 'moderator', lastLogin: '2025-01-12T11:00:00Z' },
//         { id: 5, name: 'Eve', role: 'user', lastLogin: '2025-01-11T08:30:00Z' }
//       ]
//     }
//   },
//   mediumProducts: {
//     name: 'Medium Product Dataset (10 products)',
//     data: {
//       products: [
//         { id: 1, name: 'Widget', price: 9.99, category: 'tools', inStock: true },
//         { id: 2, name: 'Gadget', price: 14.50, category: 'tools', inStock: true },
//         { id: 3, name: 'Book: Advanced Python', price: 29.99, category: 'books', inStock: false },
//         { id: 4, name: 'Notebook', price: 5.99, category: 'stationery', inStock: true },
//         { id: 5, name: 'Pen Set', price: 12.99, category: 'stationery', inStock: true },
//         { id: 6, name: 'Coffee Mug', price: 8.50, category: 'lifestyle', inStock: true },
//         { id: 7, name: 'Monitor 24"', price: 199.99, category: 'electronics', inStock: true },
//         { id: 8, name: 'USB Cable', price: 4.99, category: 'electronics', inStock: true },
//         { id: 9, name: 'T-Shirt', price: 19.99, category: 'clothing', inStock: true },
//         { id: 10, name: 'Sneakers', price: 79.99, category: 'clothing', inStock: false }
//       ]
//     }
//   },
//   largeOrders: {
//     name: 'Large Order Dataset (20 orders)',
//     data: {
//       orders: Array.from({ length: 20 }, (_, i) => ({
//         id: i + 1,
//         customerId: (i % 5) + 1,
//         productId: (i % 10) + 1,
//         quantity: Math.floor(Math.random() * 5) + 1,
//         price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
//         date: `2025-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:00:00Z`,
//         status: ['pending', 'completed', 'shipped'][Math.floor(Math.random() * 3)]
//       }))
//     }
//   }
// };

// function countTokens(text, model = 'gpt-4o') {
//   try {
//     const encoding = encoding_for_model(model);
//     const tokens = encoding.encode(text);
//     return tokens.length;
//   } catch (error) {
//     console.warn(`Warning: Could not use tokenizer for ${model}, using fallback`);
//     // Fallback: rough estimate (4 chars per token)
//     return Math.ceil(text.length / 4);
//   }
// }

// function analyzeFormat(data, formatName, formatter) {
//   const formatted = formatter(data);
//   const byteSize = Buffer.byteLength(formatted, 'utf8');
//   const charCount = formatted.length;
//   const lines = formatted.split('\n').length;
  
//   // Try multiple tokenizer models
//   const tokenCounts = {};
//   const models = ['gpt-4o', 'gpt-4', 'cl100k_base'];
  
//   for (const model of models) {
//     try {
//       tokenCounts[model] = countTokens(formatted, model);
//     } catch (error) {
//       // Skip if model not available
//     }
//   }

//   return {
//     format: formatName,
//     content: formatted,
//     metrics: {
//       bytes: byteSize,
//       characters: charCount,
//       lines,
//       tokens: tokenCounts
//     }
//   };
// }

// function compareDataset(dataset) {
//   console.log('\n' + '='.repeat(80));
//   console.log(`Dataset: ${dataset.name}`);
//   console.log('='.repeat(80));

//   // JSON with different formatting options
//   const jsonCompact = JSON.stringify(dataset.data);
//   const jsonPretty = JSON.stringify(dataset.data, null, 2);
  
//   // TOON with default options
//   const toonDefault = encode(dataset.data);
  
//   // TOON with tab delimiter
//   const toonTab = encode(dataset.data, { delimiter: '\t' });
  
//   // TOON with pipe delimiter
//   const toonPipe = encode(dataset.data, { delimiter: '|' });

//   const results = [
//     analyzeFormat(jsonCompact, 'JSON (Compact)', () => jsonCompact),
//     analyzeFormat(jsonPretty, 'JSON (Pretty)', () => jsonPretty),
//     analyzeFormat(toonDefault, 'TOON (Comma)', () => toonDefault),
//     analyzeFormat(toonTab, 'TOON (Tab)', () => toonTab),
//     analyzeFormat(toonPipe, 'TOON (Pipe)', () => toonPipe)
//   ];

//   // Display comparison table
//   console.log('\n📊 Comparison Metrics:');
//   console.log(''.padEnd(20) + 'Bytes'.padStart(12) + 'Chars'.padStart(12) + 'Lines'.padStart(12) + 'GPT-4o'.padStart(12));
//   console.log('-'.repeat(80));

//   results.forEach(result => {
//     const tokens = result.metrics.tokens['gpt-4o'] || result.metrics.tokens['gpt-4'] || result.metrics.tokens['cl100k_base'] || 'N/A';
//     console.log(
//       result.format.padEnd(20) +
//       result.metrics.bytes.toString().padStart(12) +
//       result.metrics.characters.toString().padStart(12) +
//       result.metrics.lines.toString().padStart(12) +
//       tokens.toString().padStart(12)
//     );
//   });

//   // Calculate savings
//   const jsonBaseline = results.find(r => r.format === 'JSON (Pretty)');
//   const toonBest = results
//     .filter(r => r.format.startsWith('TOON'))
//     .sort((a, b) => {
//       const aTokens = a.metrics.tokens['gpt-4o'] || 0;
//       const bTokens = b.metrics.tokens['gpt-4o'] || 0;
//       return aTokens - bTokens;
//     })[0];

//   if (jsonBaseline && toonBest) {
//     const jsonTokens = jsonBaseline.metrics.tokens['gpt-4o'] || jsonBaseline.metrics.tokens['gpt-4'] || 0;
//     const toonTokens = toonBest.metrics.tokens['gpt-4o'] || toonBest.metrics.tokens['gpt-4'] || 0;
    
//     if (jsonTokens > 0) {
//       const reduction = ((jsonTokens - toonTokens) / jsonTokens * 100).toFixed(1);
//       console.log('\n✅ Best TOON format:', toonBest.format);
//       console.log(`💡 Token reduction: ${reduction}% (${jsonTokens} → ${toonTokens} tokens)`);
//     }
//   }

//   // Show samples
//   console.log('\n📄 Sample Outputs:');
//   console.log('\n--- JSON (Pretty) ---');
//   console.log(results[1].content.substring(0, 400) + (results[1].content.length > 400 ? '...' : ''));
//   console.log('\n--- ' + toonBest.format + ' ---');
//   console.log(toonBest.content.substring(0, 400) + (toonBest.content.length > 400 ? '...' : ''));

//   return { dataset: dataset.name, results, bestFormat: toonBest.format };
// }

// // Main execution
// async function main() {
//   console.log('🚀 JSON vs TOON Comparison Tool');
//   console.log('Using tokenizer from tiktoken library');
  
//   const allResults = [];
  
//   for (const key in testDatasets) {
//     const result = compareDataset(testDatasets[key]);
//     allResults.push(result);
//   }

//   // Summary
//   console.log('\n\n' + '='.repeat(80));
//   console.log('📋 SUMMARY');
//   console.log('='.repeat(80));
  
//   allResults.forEach(result => {
//     console.log(`\n${result.dataset}`);
//     console.log(`  Best format: ${result.bestFormat}`);
//   });

//   console.log('\n✅ Comparison complete!');
//   console.log('\n💡 Key Findings:');
//   console.log('  - TOON reduces tokens by eliminating repeated keys in arrays');
//   console.log('  - Tab delimiters often tokenize better than commas');
//   console.log('  - TOON is most effective for uniform object arrays');
//   console.log('  - Real savings: ~40-60% token reduction for tabular data');
// }

// main().catch(console.error);
