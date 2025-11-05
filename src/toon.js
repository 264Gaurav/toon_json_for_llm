/**
 * TOON (Token-Oriented Object Notation) Encoder
 * Based on the TOON specification for LLM-optimized data serialization
 * 
 * TOON is designed to reduce token count for LLMs by:
 * - Declaring keys once in array headers instead of repeating them
 * - Using compact delimiters instead of verbose JSON syntax
 * - Minimizing quotes and special characters
 * 
 * This encoder converts JavaScript objects/arrays into TOON format strings.
 */

/**
 * Main encode function - converts JavaScript value to TOON format string
 * 
 * @param {*} value - The JavaScript value to encode (object, array, primitive)
 * @param {Object} options - Configuration options
 * @param {number} options.indent - Number of spaces per indentation level (default: 2)
 * @param {string} options.delimiter - Character to separate values (default: ',')
 *                                    Common choices: ',', '\t' (tab), '|' (pipe)
 *                                    Tab often tokenizes better than comma
 * @param {string} options.lengthMarker - Prefix for array length markers (default: '')
 * @returns {string} - TOON formatted string
 * 
 * 'export' keyword: makes this function available for import in other modules
 * 'function' keyword: declares a named function
 * 'options = {}' - default parameter: if options not provided, uses empty object
 */
export function encode(value, options = {}) {
  // Destructuring assignment: extracts properties from options object
  // Default values: if property doesn't exist in options, use the value after =
  // indent = 2 means if options.indent is undefined, use 2
  const {
    indent = 2,
    delimiter = ',',
    lengthMarker = ''
  } = options;

  // repeat() - string method that repeats the string N times
  // Creates a string of spaces for indentation (e.g., '  ' for indent=2)
  const indentation = ' '.repeat(indent);

  /**
   * Recursive function to encode any JavaScript value to TOON format
   * 
   * @param {*} val - The value to encode
   * @param {number} depth - Current nesting depth (for indentation)
   * @returns {string} - Encoded TOON string
   * 
   * RECURSION: This function calls itself to handle nested structures
   * Depth parameter tracks how deeply nested we are (for proper indentation)
   */
  function encodeValue(val, depth = 0) {
    // Calculate indentation string for current depth level
    // depth 0 = no indentation, depth 1 = 1 level, etc.
    const indentStr = ' '.repeat(indent * depth);

    // Type checking and primitive encoding
    // === operator: strict equality (checks value AND type)
    // null is a primitive value representing absence of value
    if (val === null) {
      return 'null';
    }
    
    // typeof operator: returns the type of a value as a string
    // 'boolean' - true or false values
    // toString() - converts value to string representation
    if (typeof val === 'boolean') {
      return val.toString();
    }
    
    // 'number' - numeric values (integers and floats)
    if (typeof val === 'number') {
      return val.toString();
    }
    
    // 'string' - text values
    // Quote if contains delimiter, quotes, or spaces
    if (typeof val === 'string') {
      // needsQuoting() checks if string needs quotes (has special chars)
      // Template literal: backticks allow embedded expressions
      // replace() - string method that replaces all matches of a pattern
      // /"/g - regular expression: /"/ is pattern for quote, g flag = global (all matches)
      // '\\"' - escape sequence: \\ = backslash, \" = escaped quote
      if (needsQuoting(val, delimiter)) {
        return `"${val.replace(/"/g, '\\"')}"`;
      }
      return val; // Return unquoted string if no special characters
    }

    // Array.isArray() - checks if value is an array
    // Arrays are handled differently based on their contents
    if (Array.isArray(val)) {
      // Empty array: return minimal format with length marker
      if (val.length === 0) {
        return `[${lengthMarker}0]:`;
      }

      // Check if array of uniform objects (all objects have same keys)
      // This is the key optimization: declare keys once in header
      // Example: [3]{id,name,role}: instead of repeating keys 3 times
      if (isUniformObjectArray(val)) {
        return encodeUniformArray(val, depth, indentStr, delimiter, lengthMarker);
      }

      // Check if primitive array (only strings, numbers, booleans, nulls)
      // Can be encoded inline: [3]: 1,2,3
      if (isPrimitiveArray(val)) {
        // map() - array method: transforms each element using provided function
        // encodeValue(v, 0) - encode each value with no extra indentation
        // join(delimiter) - joins array elements with delimiter
        const encoded = val.map(v => encodeValue(v, 0)).join(delimiter);
        return `[${lengthMarker}${val.length}]: ${encoded}`;
      }

      // List format for mixed/complex arrays (nested objects/arrays)
      // Each item on its own line with bullet point
      const items = val.map(item => {
        // Recursive call: encode nested items with increased depth
        const encoded = encodeValue(item, depth + 1);
        // Bullet point format: - item (indented)
        return `${indentStr}${indentation}- ${encoded}`;
      }).join('\n'); // join() - joins with newline character

      return `[${lengthMarker}${val.length}]:\n${items}`;
    }

    // Objects (plain objects, not arrays or null)
    // typeof null returns 'object' (JavaScript quirk), but we handled null above
    if (typeof val === 'object') {
      // Object.keys() - returns array of object's property names
      // Empty object: return empty string
      if (Object.keys(val).length === 0) {
        return '';
      }

      // Object.entries() - returns array of [key, value] pairs
      // Example: {a: 1, b: 2} => [['a', 1], ['b', 2]]
      const entries = Object.entries(val)
        .map(([key, value]) => {
          // Array destructuring: [key, value] extracts from [key, value] pair
          // Recursive call: encode nested value with increased depth
          const encoded = encodeValue(value, depth + 1);
          const lines = encoded.split('\n');
          
          // Single line value: key: value
          if (lines.length === 1) {
            return `${indentStr}${key}: ${encoded}`;
          }
          
          // Multi-line value: key on first line, value indented below
          const firstLine = `${indentStr}${key}:`;
          // map() - adds indentation to each line of multi-line value
          // trim() - removes whitespace from both ends
          const rest = lines.map(line => {
            if (line.trim() === '') return line; // Preserve empty lines
            return indentStr + line; // Add indentation
          }).join('\n');
          
          return `${firstLine}\n${rest}`;
        })
        .filter(line => line.trim() !== ''); // filter() - removes empty lines

      return entries.join('\n'); // Join all entries with newlines
    }

    // Fallback: convert any other type to string
    // String() - converts value to string
    return String(val);
  }

  // Call recursive encoding function with root value at depth 0
  const result = encodeValue(value);
  return result;
}

/**
 * Checks if array contains uniform objects (all objects have same keys)
 * 
 * UNIFORM OBJECT ARRAY CONCEPT:
 * - All objects must have the same number of keys
 * - All objects must have the same key names (order doesn't matter)
 * - This allows TOON to declare keys once in header: [3]{id,name,role}:
 * - Then just list values: 1,Alice,admin
 * 
 * @param {Array} arr - Array to check
 * @returns {boolean} - True if all objects have identical keys
 */
function isUniformObjectArray(arr) {
  // Check: array must not be empty AND all items must be objects (not arrays, not null)
  // every() - array method: returns true if all elements pass the test
  // ! operator: logical NOT (negation)
  if (arr.length === 0 || !arr.every(item => typeof item === 'object' && item !== null && !Array.isArray(item))) {
    return false;
  }

  // Get keys from first object as reference
  const firstKeys = Object.keys(arr[0]);
  
  // Check if every object has the same keys as the first object
  return arr.every(item => {
    const keys = Object.keys(item);
    // Same length AND every key in item exists in firstKeys
    // includes() - array method: checks if array contains value
    return keys.length === firstKeys.length && keys.every(key => firstKeys.includes(key));
  });
}

/**
 * Checks if array contains only primitive values
 * 
 * PRIMITIVE VALUES: strings, numbers, booleans, null
 * (Not objects or arrays)
 * 
 * @param {Array} arr - Array to check
 * @returns {boolean} - True if all elements are primitives
 */
function isPrimitiveArray(arr) {
  // every() - checks if all elements pass the test
  return arr.every(item => {
    const type = typeof item;
    // || operator: logical OR - returns true if any condition is true
    // Check if item is a primitive type
    return type === 'string' || type === 'number' || type === 'boolean' || item === null;
  });
}

/**
 * Encodes uniform object array in compact TOON format
 * 
 * TOON UNIFORM ARRAY FORMAT:
 * Header: [length]{key1,key2,key3}:
 * Rows:   value1,value2,value3
 *         value1,value2,value3
 * 
 * Example:
 * [3]{id,name,role}:
 *   1,Alice,admin
 *   2,Bob,user
 *   3,Charlie,moderator
 * 
 * This is the KEY OPTIMIZATION: keys declared once, not repeated per object
 * 
 * @param {Array} arr - Array of uniform objects
 * @param {number} depth - Current nesting depth
 * @param {string} indentStr - Indentation string for this depth
 * @param {string} delimiter - Character to separate values
 * @param {string} lengthMarker - Prefix for length marker
 * @returns {string} - TOON formatted string
 */
function encodeUniformArray(arr, depth, indentStr, delimiter, lengthMarker) {
  // Get keys from first object (all objects have same keys)
  const keys = Object.keys(arr[0]);
  
  // Build header: [length]{key1,key2,key3}:
  // Template literal: embeds expressions
  // join(delimiter) - joins keys with delimiter
  const header = `[${lengthMarker}${arr.length}${delimiter}]{${keys.join(delimiter)}}:`;
  
  // Map each object to a row of values
  const rows = arr.map(obj => {
    // Extract values in same order as keys
    const values = keys.map(key => {
      // obj[key] - bracket notation to access object property by key name
      const val = obj[key];
      
      // Handle primitives (same as encodeValue but inline)
      if (val === null) return 'null';
      if (typeof val === 'boolean') return val.toString();
      if (typeof val === 'number') return val.toString();
      if (typeof val === 'string') {
        if (needsQuoting(val, delimiter)) {
          return `"${val.replace(/"/g, '\\"')}"`;
        }
        return val;
      }
      // For nested objects/arrays, fallback to JSON (not ideal, but works)
      // JSON.stringify() - converts to JSON string
      return JSON.stringify(val);
    });
    // Join values with delimiter: value1,value2,value3
    return `${indentStr}${values.join(delimiter)}`;
  }).join('\n'); // Join rows with newlines

  // Return header + rows
  return `${header}\n${rows}`;
}

/**
 * Determines if a string needs quotes in TOON format
 * 
 * Strings need quotes if they contain:
 * - The delimiter character (would break parsing)
 * - Quotes (would break parsing)
 * - Spaces (would break parsing)
 * - Newlines or tabs (special characters)
 * - Reserved keywords (true, false, null)
 * 
 * @param {string} str - String to check
 * @param {string} delimiter - The delimiter character used
 * @returns {boolean} - True if string needs quotes
 */
function needsQuoting(str, delimiter) {
  // includes() - string method: checks if string contains substring
  // || operator: logical OR - returns true if any condition is true
  return str.includes(delimiter) || 
         str.includes('"') || 
         str.includes(' ') ||
         str.includes('\n') ||  // \n - escape sequence for newline
         str.includes('\t') ||  // \t - escape sequence for tab
         str.includes(',') ||   // Always quote if contains comma (common delimiter)
         str === 'true' ||      // Reserved keyword
         str === 'false' ||     // Reserved keyword
         str === 'null';        // Reserved keyword
}

/**
 * Decode function (not implemented)
 * 
 * This function would convert TOON format back to JavaScript objects/arrays
 * For this demo, we only need encoding to compare formats with LLMs
 * Decoding is more complex and requires parsing the TOON syntax
 * 
 * @param {string} input - TOON formatted string
 * @param {Object} options - Decoding options
 * @throws {Error} - Always throws error (not implemented)
 * 
 * 'throw' keyword: throws an exception/error
 * 'Error' - built-in error object constructor
 */
export function decode(input, options = {}) {
  // For this demo, we'll focus on encoding
  // Decoding is more complex and not needed for comparison
  throw new Error('Decode not implemented in this demo. Focus is on encoding for LLM comparison.');
}
