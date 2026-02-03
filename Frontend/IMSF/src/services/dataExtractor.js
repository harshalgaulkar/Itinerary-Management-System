/**
 * Data Extraction Utility
 * Helps extract data from various API response formats
 */

/**
 * Extract array data from various response formats
 * Handles multiple backend response structures
 */
export const extractArrayData = (response) => {
  if (!response) return [];

  // Direct array response
  if (Array.isArray(response)) {
    return response;
  }

  // response.data.data.data format
  if (Array.isArray(response?.data?.data?.data)) {
    return response.data.data.data;
  }

  // response.data.data format
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  // response.data.users format
  if (Array.isArray(response?.data?.users)) {
    return response.data.users;
  }

  // response.data.user format
  if (Array.isArray(response?.data?.user)) {
    return response.data.user;
  }

  // response.data.result format
  if (Array.isArray(response?.data?.result)) {
    return response.data.result;
  }

  // response.data.results format
  if (Array.isArray(response?.data?.results)) {
    return response.data.results;
  }

  // response.result format
  if (Array.isArray(response?.result)) {
    return response.result;
  }

  // response.results format
  if (Array.isArray(response?.results)) {
    return response.results;
  }

  // response.data is array
  if (Array.isArray(response?.data)) {
    return response.data;
  }

  // Single object response
  if (response && typeof response === 'object') {
    // Try to find first array property
    const firstArray = Object.values(response).find(val => Array.isArray(val));
    if (firstArray) {
      return firstArray;
    }
  }

  return [];

  return [];
};

/**
 * Extract single object data from response
 */
export const extractObjectData = (response) => {
  if (!response) return null;

  // Direct object response
  if (response && typeof response === 'object' && !Array.isArray(response)) {
    // If it's an axios response with data property
    if (response.data) {
      // If response.data is an object (not array)
      if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        // If response.data.data exists
        if (response.data.data) {
          return response.data.data;
        }
        return response.data;
      }
    }
    return response;
  }

  return null;
};

/**
 * Extract count/length from various response formats
 */
export const extractCount = (response) => {
  const data = extractArrayData(response);
  return Array.isArray(data) ? data.length : 0;
};

/**
 * Log response format for debugging
 */
export const logResponseFormat = (response, label = 'Response') => {
  console.log(`\n=== ${label} ===`);
  console.log('Raw response:', response);
  
  if (response?.data) {
    console.log('response.data:', response.data);
    console.log('response.data keys:', Object.keys(response.data || {}));
  }
  
  const extracted = extractArrayData(response);
  console.log(`Extracted array length: ${extracted.length}`);
  console.log(`=== End ${label} ===\n`);
};
