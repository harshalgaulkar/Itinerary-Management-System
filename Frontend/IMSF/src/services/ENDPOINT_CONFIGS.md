/**
 * BACKEND ENDPOINT CONFIGURATIONS
 * 
 * This file contains different endpoint configurations for various backend setups.
 * Choose the one that matches your backend or use as reference to debug.
 */

// ============================================================================
// CONFIGURATION 1: Standard REST API (Most Common)
// ============================================================================
export const CONFIG_STANDARD = {
  user: {
    signin: '/users/signin',
    signup: '/users/signup',
    getProfile: '/users/profile/:id',
    updateProfile: '/users/:id',
    deleteAccount: '/users/:id',
  },
  admin: {
    createUser: '/admin/signup/user',  // POST
    getAllUsers: '/admin/users',        // GET
    getUserById: '/admin/users/:id',    // GET
    updateUserRole: '/admin/user/:id/role',  // PUT
    deleteUser: '/admin/user/:id',      // DELETE
    
    createDestination: '/destinations',       // POST
    getAllDestinations: '/destinations',      // GET
    updateDestination: '/destinations/:id',   // PUT
    deleteDestination: '/destinations/:id',   // DELETE
    
    createPackage: '/packages',         // POST
    getAllPackages: '/packages',        // GET
    updatePackage: '/packages/:id',     // PUT
    deletePackage: '/packages/:id',     // DELETE
  },
};

// ============================================================================
// CONFIGURATION 2: Nested Admin Endpoints
// ============================================================================
export const CONFIG_NESTED_ADMIN = {
  admin: {
    createUser: '/admin/users/create',
    getAllUsers: '/admin/users',
    getUserById: '/admin/users/:id',
    updateUserRole: '/admin/users/:id/role',
    deleteUser: '/admin/users/:id',
    
    createDestination: '/admin/destinations/create',
    getAllDestinations: '/admin/destinations',
    updateDestination: '/admin/destinations/:id',
    deleteDestination: '/admin/destinations/:id',
    
    createPackage: '/admin/packages/create',
    getAllPackages: '/admin/packages',
    updatePackage: '/admin/packages/:id',
    deletePackage: '/admin/packages/:id',
  },
};

// ============================================================================
// CONFIGURATION 3: Mixed Endpoints (Hybrid)
// ============================================================================
export const CONFIG_MIXED = {
  admin: {
    createUser: '/admin/signup/user',
    getAllUsers: '/users',              // Gets from /users instead of /admin/users
    getUserById: '/users/:id',
    updateUserRole: '/admin/user/:id/role',
    deleteUser: '/admin/user/:id',
  },
};

// ============================================================================
// ENDPOINT RESPONSE FORMATS
// ============================================================================

/**
 * SUCCESS RESPONSE FORMATS
 * Your backend returns data in one of these formats
 */

// Format 1: Direct array
export const RESPONSE_DIRECT = [
  { user_id: 1, email: 'user1@example.com', full_name: 'John Doe' },
  { user_id: 2, email: 'user2@example.com', full_name: 'Jane Doe' },
];

// Format 2: Wrapped in data object
export const RESPONSE_DATA = {
  data: [
    { user_id: 1, email: 'user1@example.com', full_name: 'John Doe' },
    { user_id: 2, email: 'user2@example.com', full_name: 'Jane Doe' },
  ]
};

// Format 3: Success flag with data
export const RESPONSE_SUCCESS = {
  success: true,
  data: [
    { user_id: 1, email: 'user1@example.com', full_name: 'John Doe' },
    { user_id: 2, email: 'user2@example.com', full_name: 'Jane Doe' },
  ]
};

// Format 4: Message with data
export const RESPONSE_MESSAGE = {
  message: 'Users retrieved successfully',
  data: [
    { user_id: 1, email: 'user1@example.com', full_name: 'John Doe' },
    { user_id: 2, email: 'user2@example.com', full_name: 'Jane Doe' },
  ]
};

// Format 5: Different key name
export const RESPONSE_USERS_KEY = {
  users: [
    { user_id: 1, email: 'user1@example.com', full_name: 'John Doe' },
    { user_id: 2, email: 'user2@example.com', full_name: 'Jane Doe' },
  ]
};

// Format 6: Nested data
export const RESPONSE_NESTED = {
  data: {
    data: [
      { user_id: 1, email: 'user1@example.com', full_name: 'John Doe' },
      { user_id: 2, email: 'user2@example.com', full_name: 'Jane Doe' },
    ]
  }
};

// ============================================================================
// DEBUGGING HELPER
// ============================================================================

/**
 * Helper function to extract data from any response format
 * Use this in your components to handle all formats automatically
 */
export const extractDataFromResponse = (response) => {
  if (!response) return [];
  
  const data = response.data;
  
  // Try different extraction paths
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.result)) return data.result;
  if (Array.isArray(data?.results)) return data.results;
  
  return [];
};

/**
 * Helper to log and debug response structure
 */
export const debugResponse = (response, label = 'Response') => {
  console.group(`🔍 ${label} Structure`);
  console.log('Full response:', response);
  console.log('response.data:', response?.data);
  console.log('response.data.data:', response?.data?.data);
  console.log('response.data.users:', response?.data?.users);
  console.log('Extracted data:', extractDataFromResponse(response));
  console.groupEnd();
};

// ============================================================================
// COMMON BACKEND PATTERNS
// ============================================================================

/**
 * Pattern 1: Express.js with standard REST
 * POST /admin/signup/user
 * GET /admin/users
 * PUT /admin/user/:id/role
 */
export const PATTERN_EXPRESS_REST = {
  description: 'Standard Express.js REST API',
  endpoints: {
    createUser: 'POST /admin/signup/user',
    getAllUsers: 'GET /admin/users',
    updateUserRole: 'PUT /admin/user/:id/role',
  }
};

/**
 * Pattern 2: Node.js with nested structure
 * POST /admin/users/create
 * GET /admin/users
 * PUT /admin/users/:id/role
 */
export const PATTERN_NESTED = {
  description: 'Nested admin structure',
  endpoints: {
    createUser: 'POST /admin/users/create',
    getAllUsers: 'GET /admin/users',
    updateUserRole: 'PUT /admin/users/:id/role',
  }
};

/**
 * Pattern 3: Mixed endpoints
 * Creates in admin, reads from regular endpoint
 */
export const PATTERN_MIXED = {
  description: 'Mixed admin/regular endpoints',
  endpoints: {
    createUser: 'POST /admin/signup/user',
    getAllUsers: 'GET /users',
    updateUserRole: 'PUT /admin/user/:id/role',
  }
};

// ============================================================================
// REQUEST BODY FORMATS
// ============================================================================

/**
 * Create User Request
 */
export const CREATE_USER_REQUEST = {
  email: 'newuser@example.com',
  password: 'password123',
  full_name: 'John Doe',
  phone: '+1234567890',
  role: 'customer', // or 'admin'
};

/**
 * Update Role Request
 */
export const UPDATE_ROLE_REQUEST = {
  role: 'admin',
};

// OR (alternative format)
export const UPDATE_ROLE_REQUEST_ALT = {
  status: 'admin',  // Some backends use 'status' instead
};

// ============================================================================
// TROUBLESHOOTING CHECKLIST
// ============================================================================

/**
 * Debug Checklist:
 * 
 * 1. Check API Base URL in .env.local
 *    - Should be: http://localhost:4000
 *    - Verify backend is running on same port
 * 
 * 2. Check endpoint paths in network tab (F12 -> Network)
 *    - Look at actual requests being made
 *    - Compare with backend routes
 * 
 * 3. Check response format in Network tab
 *    - Is it wrapped in { data: ... }?
 *    - Is it direct array?
 *    - Different key names?
 * 
 * 4. Check error messages in Console (F12 -> Console)
 *    - Error messages indicate endpoint mismatch
 *    - Look for 404 (endpoint not found)
 *    - Look for 401 (unauthorized)
 * 
 * 5. Test endpoint directly with curl/Postman
 *    - curl http://localhost:4000/admin/users
 *    - Verify backend response format
 */

export default {
  CONFIG_STANDARD,
  CONFIG_NESTED_ADMIN,
  CONFIG_MIXED,
  extractDataFromResponse,
  debugResponse,
  PATTERN_EXPRESS_REST,
  PATTERN_NESTED,
  PATTERN_MIXED,
};
