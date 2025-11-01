/**
 * Live LLM testing with Ollama
 * Sends both JSON and TOON formatted data to the model and compares responses
 */

import { encode } from './toon.js';
import ollama from 'ollama';

// Sample data for testing
const testData = {
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

const jsonFormat = JSON.stringify(testData, null, 2);
const toonFormat = encode(testData, { delimiter: '\t' });

async function testWithModel(modelName) {
  console.log(`\n🤖 Testing with model: ${modelName}`);
  console.log('='.repeat(80));

  const prompt = `You are a helpful assistant. Analyze the product data below and list all products that are:
1. In the "Electronics" category
2. Currently in stock
3. Price is less than $50

Format your response as a simple list.`;

  // Test 1: JSON Format
  console.log('\n📊 Test 1: JSON Format');
  console.log('─'.repeat(80));
  
  const jsonPrompt = `${prompt}\n\nProduct data in JSON format:\n\`\`\`json\n${jsonFormat}\n\`\`\``;
  
  try {
    const jsonStart = Date.now();
    const jsonResponse = await ollama.chat({
      model: modelName,
      messages: [
        { role: 'system', content: 'You are a helpful assistant that analyzes data accurately.' },
        { role: 'user', content: jsonPrompt }
      ]
    });
    const jsonTime = Date.now() - jsonStart;
    
    console.log(`⏱️  Response time: ${jsonTime}ms`);
    console.log(`📝 Response length: ${jsonResponse.message.content.length} chars`);
    console.log(`🔢 Tokens used: ${jsonResponse.eval_count || 'N/A'}`);
    console.log('\nResponse:');
    console.log(jsonResponse.message.content.substring(0, 300) + (jsonResponse.message.content.length > 300 ? '...' : ''));
    
    const jsonMetrics = {
      time: jsonTime,
      contentLength: jsonResponse.message.content.length,
      promptLength: jsonPrompt.length
    };

    // Test 2: TOON Format
    console.log('\n📊 Test 2: TOON Format');
    console.log('─'.repeat(80));
    
    const toonPrompt = `${prompt}\n\nProduct data in TOON format:\n\`\`\`toon\n${toonFormat}\n\`\`\``;
    
    const toonStart = Date.now();
    const toonResponse = await ollama.chat({
      model: modelName,
      messages: [
        { role: 'system', content: 'You are a helpful assistant that analyzes data accurately.' },
        { role: 'user', content: toonPrompt }
      ]
    });
    const toonTime = Date.now() - toonStart;
    
    console.log(`⏱️  Response time: ${toonTime}ms`);
    console.log(`📝 Response length: ${toonResponse.message.content.length} chars`);
    console.log(`🔢 Tokens used: ${toonResponse.eval_count || 'N/A'}`);
    console.log('\nResponse:');
    console.log(toonResponse.message.content.substring(0, 300) + (toonResponse.message.content.length > 300 ? '...' : ''));
    
    const toonMetrics = {
      time: toonTime,
      contentLength: toonResponse.message.content.length,
      promptLength: toonPrompt.length
    };

    // Comparison
    console.log('\n📊 Comparison');
    console.log('─'.repeat(80));
    const promptReduction = ((jsonMetrics.promptLength - toonMetrics.promptLength) / jsonMetrics.promptLength * 100).toFixed(1);
    const timeDifference = ((toonMetrics.time - jsonMetrics.time) / jsonMetrics.time * 100).toFixed(1);
    
    console.log(`Input size reduction: ${promptReduction}% (${jsonMetrics.promptLength} → ${toonMetrics.promptLength} chars)`);
    console.log(`Response time difference: ${timeDifference}% (${jsonMetrics.time}ms → ${toonMetrics.time}ms)`);
    
    if (toonMetrics.time < jsonMetrics.time) {
      console.log('✅ TOON is faster!');
    } else {
      console.log('⚠️  JSON is faster (may vary by test)');
    }

    return { jsonMetrics, toonMetrics };

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure Ollama is running and the model is available:');
    console.log('   ollama pull llama3.1');
    console.log('   ollama serve');
    return null;
  }
}

async function main() {
  console.log('🚀 LLM Format Comparison Test');
  console.log('Testing JSON vs TOON with Ollama\n');
  
  // Check if Ollama is available
  try {
    const models = await ollama.list();
    console.log('✅ Ollama is running');
    console.log('Available models:', models.models.map(m => m.name).join(', '));
    
    // Try different models in order of preference
    const modelsToTry = [
      'llama3.1',
      'llama3.1:8b',
      'llama3',
      'mistral',
      'codellama'
    ];
    
    let modelFound = false;
    for (const model of modelsToTry) {
      const available = models.models.some(m => m.name.includes(model.split(':')[0]));
      if (available) {
        const actualModel = models.models.find(m => m.name.includes(model.split(':')[0]))?.name || model;
        await testWithModel(actualModel);
        modelFound = true;
        break;
      }
    }
    
    if (!modelFound) {
      console.log('\n⚠️  None of the preferred models found. Using first available model.');
      if (models.models.length > 0) {
        await testWithModel(models.models[0].name);
      } else {
        console.log('❌ No models available. Please install a model:');
        console.log('   ollama pull llama3.1');
      }
    }
    
  } catch (error) {
    console.error('❌ Ollama is not running or not available');
    console.log('\n💡 To get started:');
    console.log('   1. Install Ollama: https://ollama.ai');
    console.log('   2. Download a model: ollama pull llama3.1');
    console.log('   3. Start Ollama: ollama serve');
    console.log('   4. Run this script again');
  }
  
  console.log('\n✅ Test complete!');
}

main().catch(console.error);
