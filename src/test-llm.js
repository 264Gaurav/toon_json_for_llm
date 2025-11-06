/**
 * Live LLM testing with Ollama
 * Sends both JSON and TOON formatted data to the model and compares responses
 * 
 * OLLAMA MODELS EXPLAINED:
 * - Ollama is a tool for running large language models locally
 * - It allows you to run LLMs on your own machine without API costs
 * - Popular models include:
 *   - llama3.1 / llama3.1:8b - Meta's Llama 3.1 (8B parameter version)
 *   - llama3 - Meta's Llama 3
 *   - mistral - Mistral AI's model
 *   - codellama - Code-specialized Llama model
 * - Models must be downloaded first: ollama pull llama3.1
 * - Ollama runs a local server that this script connects to
 * - This allows testing TOON format with real LLM responses
 */

import { encode } from './toon.js';
import { testData, testPrompt } from './test-data.js';
import ollama from 'ollama';

/**
 * Warmup function to check if Ollama model is ready
 * Sends a simple "hi" message to initialize the model before actual tests
 * This ensures accurate timing measurements for JSON vs TOON comparisons
 * 
 * @param {string} modelName - Name of the Ollama model to warmup
 * @returns {Promise<boolean>} - Returns true if warmup successful, false otherwise
 */
async function warmupModel(modelName) {
  console.log('🔥 Warming up model (this may take a moment on first run)...');
  
  try {
    const warmupStart = Date.now();
    const response = await ollama.chat({
      model: modelName,
      messages: [
        { role: 'user', content: 'Hi, are you ready?' }
      ]
    });
    const warmupTime = Date.now() - warmupStart;
    
    console.log(`✅ Model is ready (warmup took ${warmupTime}ms)`);
    return true;
  } catch (error) {
    console.error('❌ Warmup failed:', error.message);
    return false;
  }
}

/**
 * Checks if a model is available and ready
 * 
 * @param {string} modelName - Name of the model to check
 * @returns {Promise<boolean>} - Returns true if model is available and ready
 */
async function checkModelReady(modelName) {
  try {
    const models = await ollama.list();
    const isAvailable = models.models.some(m => 
      m.name === modelName || m.name.includes(modelName.split(':')[0])
    );
    
    if (!isAvailable) {
      return false;
    }
    
    // Warmup the model to ensure it's ready
    return await warmupModel(modelName);
  } catch (error) {
    console.error('❌ Error checking model:', error.message);
    return false;
  }
}

/**
 * Sends a prompt to the Ollama model and measures response time
 * 
 * @param {string} modelName - Name of the Ollama model
 * @param {string} prompt - The prompt to send
 * @param {string} formatType - Type of format ('json' or 'toon')
 * @returns {Promise<Object|null>} - Response metrics or null if error
 */
async function sendPrompt(modelName, prompt, formatType) {
  try {
    const startTime = Date.now();
    
    const response = await ollama.chat({
      model: modelName,
      messages: [
        { role: 'system', content: 'You are a helpful assistant that analyzes data accurately.' },
        { role: 'user', content: prompt }
      ]
    });
    
    const responseTime = Date.now() - startTime;
    
    return {
      time: responseTime,
      contentLength: response.message.content.length,
      promptLength: prompt.length,
      content: response.message.content,
      tokens: response.eval_count || 'N/A'
    };
  } catch (error) {
    console.error(`❌ Error with ${formatType} format:`, error.message);
    return null;
  }
}

/**
 * Tests a specific Ollama model with both JSON and TOON formats
 * 
 * @param {string} modelName - Name of the Ollama model to test
 * @returns {Promise<Object|null>} - Test results or null if error
 */
async function testWithModel(modelName) {
  console.log(`\n🤖 Testing with model: ${modelName}`);
  console.log('='.repeat(80));

  // Prepare data formats
  const jsonFormat = JSON.stringify(testData, null, 2);
  const toonFormat = encode(testData, { delimiter: '\t' });

  // Calculate input sizes (data only, not including prompt wrapper)
  const jsonDataSize = {
    chars: jsonFormat.length,
    bytes: Buffer.byteLength(jsonFormat, 'utf8')
  };
  
  const toonDataSize = {
    chars: toonFormat.length,
    bytes: Buffer.byteLength(toonFormat, 'utf8')
  };

  // Build prompts
  const jsonPrompt = `${testPrompt}\n\nProduct data in JSON format:\n\`\`\`json\n${jsonFormat}\n\`\`\``;
  const toonPrompt = `${testPrompt}\n\nProduct data in TOON format:\n\`\`\`toon\n${toonFormat}\n\`\`\``;

  // Test 1: JSON Format
  console.log('\n📊 Test 1: JSON Format');
  console.log('─'.repeat(80));
  console.log('JSON data:', jsonFormat);
  console.log(`📏 JSON data size: ${jsonDataSize.chars} chars, ${jsonDataSize.bytes} bytes`);
  console.log('─'.repeat(30));
  
  const jsonMetrics = await sendPrompt(modelName, jsonPrompt, 'json');
  
  if (!jsonMetrics) {
    return null;
  }
  
  console.log(`⏱️  Response time: ${jsonMetrics.time}ms`);
  console.log(`📝 Response length: ${jsonMetrics.contentLength} chars`);
  console.log(`🔢 Tokens used: ${jsonMetrics.tokens}`);
  console.log('\nResponse:');
  console.log(jsonMetrics.content.substring(0, 300) + (jsonMetrics.content.length > 300 ? '...' : ''));

  // Test 2: TOON Format
  console.log('\n📊 Test 2: TOON Format');
  console.log('─'.repeat(80));
  console.log('TOON data:', toonFormat);
  console.log(`📏 TOON data size: ${toonDataSize.chars} chars, ${toonDataSize.bytes} bytes`);
  console.log('─'.repeat(30));
  
  const toonMetrics = await sendPrompt(modelName, toonPrompt, 'toon');
  
  if (!toonMetrics) {
    return null;
  }
  
  console.log(`⏱️  Response time: ${toonMetrics.time}ms`);
  console.log(`📝 Response length: ${toonMetrics.contentLength} chars`);
  console.log(`🔢 Tokens used: ${toonMetrics.tokens}`);
  console.log('\nResponse:');
  console.log(toonMetrics.content.substring(0, 300) + (toonMetrics.content.length > 300 ? '...' : ''));

  // Comparison
  console.log('\n📊 Comparison');
  console.log('='.repeat(80));
  
  // Input size comparison (data only)
  const dataSizeReductionChars = ((jsonDataSize.chars - toonDataSize.chars) / jsonDataSize.chars * 100).toFixed(1);
  const dataSizeReductionBytes = ((jsonDataSize.bytes - toonDataSize.bytes) / jsonDataSize.bytes * 100).toFixed(1);
  
  console.log('\n📦 INPUT SIZE COMPARISON (Data Only):');
  console.log('─'.repeat(80));
  console.log(`JSON Format:  ${jsonDataSize.chars} chars, ${jsonDataSize.bytes} bytes`);
  console.log(`TOON Format:  ${toonDataSize.chars} chars, ${toonDataSize.bytes} bytes`);
  console.log(`\n💾 Size Reduction:`);
  console.log(`   Characters: ${dataSizeReductionChars}% (${jsonDataSize.chars} → ${toonDataSize.chars} chars)`);
  console.log(`   Bytes:      ${dataSizeReductionBytes}% (${jsonDataSize.bytes} → ${toonDataSize.bytes} bytes)`);
  
  if (toonDataSize.chars < jsonDataSize.chars) {
    console.log('   ✅ TOON is smaller!');
  } else {
    console.log('   ⚠️  JSON is smaller');
  }
  
  // Full prompt size comparison
  const promptReduction = ((jsonMetrics.promptLength - toonMetrics.promptLength) / jsonMetrics.promptLength * 100).toFixed(1);
  
  console.log('\n📝 FULL PROMPT SIZE COMPARISON:');
  console.log('─'.repeat(80));
  console.log(`JSON Prompt:  ${jsonMetrics.promptLength} chars`);
  console.log(`TOON Prompt:  ${toonMetrics.promptLength} chars`);
  console.log(`Reduction:    ${promptReduction}% (${jsonMetrics.promptLength} → ${toonMetrics.promptLength} chars)`);
  
  // Response time comparison
  const timeDifference = ((toonMetrics.time - jsonMetrics.time) / jsonMetrics.time * 100).toFixed(1);
  
  console.log('\n⏱️  RESPONSE TIME COMPARISON:');
  console.log('─'.repeat(80));
  console.log(`JSON:  ${jsonMetrics.time}ms`);
  console.log(`TOON:  ${toonMetrics.time}ms`);
  console.log(`Difference: ${timeDifference}% (${jsonMetrics.time}ms → ${toonMetrics.time}ms)`);
  
  if (toonMetrics.time < jsonMetrics.time) {
    console.log('✅ TOON is faster!');
  } else {
    console.log('⚠️  JSON is faster (may vary by test)');
  }

  return { 
    jsonMetrics, 
    toonMetrics,
    inputSizes: {
      json: jsonDataSize,
      toon: toonDataSize,
      reduction: {
        chars: parseFloat(dataSizeReductionChars),
        bytes: parseFloat(dataSizeReductionBytes)
      }
    }
  };
}

/**
 * Finds an available model from the preferred list
 * 
 * @param {Array} availableModels - List of available models from Ollama
 * @param {Array} preferredModels - List of preferred model names to try
 * @returns {string|null} - Name of the first available preferred model, or null
 */
function findPreferredModel(availableModels, preferredModels) {
  for (const model of preferredModels) {
    const modelBase = model.split(':')[0];
    const found = availableModels.find(m => 
      m.name === model || m.name.includes(modelBase)
    );
    
    if (found) {
      return found.name;
    }
  }
  
  return null;
}

/**
 * Main function: orchestrates the LLM testing
 * 
 * This function:
 * 1. Checks if Ollama is running
 * 2. Lists available models
 * 3. Finds a preferred model
 * 4. Warms up the model to ensure accurate timing
 * 5. Runs comparison tests
 */
async function main() {
  console.log('🚀 LLM Format Comparison Test');
  console.log('Testing JSON vs TOON with Ollama\n');
  
  try {
    // Check if Ollama is available
    const models = await ollama.list();
    console.log('✅ Ollama is running');
    console.log('Available models:', models.models.map(m => m.name).join(', '));
    
    // Preferred models in order of preference
    const preferredModels = [
      'llama3.1',
      'llama3.1:8b',
      'llama3',
      'mistral',
      'codellama'
    ];
    
    // Find a preferred model
    let modelToUse = findPreferredModel(models.models, preferredModels);
    
    if (!modelToUse) {
      if (models.models.length > 0) {
        console.log('\n⚠️  None of the preferred models found. Using first available model.');
        modelToUse = models.models[0].name;
      } else {
        console.log('❌ No models available. Please install a model:');
        console.log('   ollama pull llama3.1');
        return;
      }
    }
    
    // Check if model is ready and warmup
    console.log(`\n🔍 Checking if model "${modelToUse}" is ready...`);
    const isReady = await checkModelReady(modelToUse);
    
    if (!isReady) {
      console.log('\n❌ Model is not ready. Please ensure:');
      console.log('   1. Ollama is running: ollama serve');
      console.log('   2. Model is installed: ollama pull llama3.1');
      return;
    }
    
    // Run the actual tests
    await testWithModel(modelToUse);
    
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

// Call main function and catch any unhandled errors
main().catch(console.error);
