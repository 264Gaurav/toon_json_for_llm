/**
 * TOON (Token-Oriented Object Notation) Encoder
 * Based on the TOON specification for LLM-optimized data serialization
 */

export function encode(value, options = {}) {
  const {
    indent = 2,
    delimiter = ',',
    lengthMarker = ''
  } = options;

  const indentation = ' '.repeat(indent);

  function encodeValue(val, depth = 0) {
    const indentStr = ' '.repeat(indent * depth);

    if (val === null) {
      return 'null';
    }
    if (typeof val === 'boolean') {
      return val.toString();
    }
    if (typeof val === 'number') {
      return val.toString();
    }
    if (typeof val === 'string') {
      // Quote if contains delimiter, quotes, or spaces
      if (needsQuoting(val, delimiter)) {
        return `"${val.replace(/"/g, '\\"')}"`;
      }
      return val;
    }

    if (Array.isArray(val)) {
      if (val.length === 0) {
        return `[${lengthMarker}0]:`;
      }

      // Check if array of uniform objects
      if (isUniformObjectArray(val)) {
        return encodeUniformArray(val, depth, indentStr, delimiter, lengthMarker);
      }

      // Check if primitive array (can fit inline)
      if (isPrimitiveArray(val)) {
        const encoded = val.map(v => encodeValue(v, 0)).join(delimiter);
        return `[${lengthMarker}${val.length}]: ${encoded}`;
      }

      // List format for mixed/complex arrays
      const items = val.map(item => {
        const encoded = encodeValue(item, depth + 1);
        return `${indentStr}${indentation}- ${encoded}`;
      }).join('\n');

      return `[${lengthMarker}${val.length}]:\n${items}`;
    }

    if (typeof val === 'object') {
      if (Object.keys(val).length === 0) {
        return '';
      }

      const entries = Object.entries(val)
        .map(([key, value]) => {
          const encoded = encodeValue(value, depth + 1);
          const lines = encoded.split('\n');
          
          if (lines.length === 1) {
            return `${indentStr}${key}: ${encoded}`;
          }
          
          const firstLine = `${indentStr}${key}:`;
          const rest = lines.map(line => {
            if (line.trim() === '') return line;
            return indentStr + line;
          }).join('\n');
          
          return `${firstLine}\n${rest}`;
        })
        .filter(line => line.trim() !== '');

      return entries.join('\n');
    }

    return String(val);
  }

  const result = encodeValue(value);
  return result;
}

function isUniformObjectArray(arr) {
  if (arr.length === 0 || !arr.every(item => typeof item === 'object' && item !== null && !Array.isArray(item))) {
    return false;
  }

  const firstKeys = Object.keys(arr[0]);
  return arr.every(item => {
    const keys = Object.keys(item);
    return keys.length === firstKeys.length && keys.every(key => firstKeys.includes(key));
  });
}

function isPrimitiveArray(arr) {
  return arr.every(item => {
    const type = typeof item;
    return type === 'string' || type === 'number' || type === 'boolean' || item === null;
  });
}

function encodeUniformArray(arr, depth, indentStr, delimiter, lengthMarker) {
  const keys = Object.keys(arr[0]);
  const header = `[${lengthMarker}${arr.length}${delimiter}]{${keys.join(delimiter)}}:`;
  
  const rows = arr.map(obj => {
    const values = keys.map(key => {
      const val = obj[key];
      // Handle primitives
      if (val === null) return 'null';
      if (typeof val === 'boolean') return val.toString();
      if (typeof val === 'number') return val.toString();
      if (typeof val === 'string') {
        if (needsQuoting(val, delimiter)) {
          return `"${val.replace(/"/g, '\\"')}"`;
        }
        return val;
      }
      // For nested objects/arrays, encode inline
      return JSON.stringify(val);
    });
    return `${indentStr}${values.join(delimiter)}`;
  }).join('\n');

  return `${header}\n${rows}`;
}

function needsQuoting(str, delimiter) {
  return str.includes(delimiter) || 
         str.includes('"') || 
         str.includes(' ') ||
         str.includes('\n') ||
         str.includes('\t') ||
         str.includes(',') ||
         str === 'true' ||
         str === 'false' ||
         str === 'null';
}

export function decode(input, options = {}) {
  // For this demo, we'll focus on encoding
  // Decoding is more complex and not needed for comparison
  throw new Error('Decode not implemented in this demo. Focus is on encoding for LLM comparison.');
}
