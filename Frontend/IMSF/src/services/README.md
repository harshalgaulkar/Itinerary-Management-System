# API Services Documentation

This directory contains all API service files and configurations for the IMS Frontend application.

## File Structure

```
services/
├── api.js              # Axios instance with interceptors
├── endpoints.js        # All API endpoint definitions
├── index.js           # API service wrapper and factory
└── README.md          # This file
```

## Files Overview

### api.js
Main axios client configuration with:
- Base URL setup
- Request interceptor (adds auth token and user ID)
- Response interceptor (handles 401/403 errors)
- Error handler utility function

**Exports:**
- `apiClient` - Configured axios instance (default export)
- `handleApiError()` - Error standardization function

**Usage:**
```javascript
import apiClient from './api';
import { handleApiError } from './api';
```

### endpoints.js
Centralized API endpoint definitions organized by module:
- **userAPI** - Authentication, profile, bookings
- **destinationAPI** - Destination management
- **packageAPI** - Package listings and details
- **packageMasterAPI** - Master package management
- **bookingAPI** - Booking operations
- **paymentAPI** - Payment processing
- **reviewAPI** - Reviews and ratings
- **adminAPI** - Admin operations and dashboard

Each API object contains methods that return promises (axios calls).

**Usage:**
```javascript
import { packageAPI, bookingAPI } from './endpoints';

// Simple usage
const packages = await packageAPI.getAll(1, 10);

// With error handling
try {
  const booking = await bookingAPI.create(bookingData);
} catch (error) {
  console.error('Booking failed:', error);
}
```

### index.js
Provides multiple ways to use the API:

1. **Direct Re-exports**
   ```javascript
   import { packageAPI, bookingAPI } from './services';
   ```

2. **API Service Factory**
   ```javascript
   import { apiService } from './services';
   
   const result = await apiService.packages.getAll(1, 10);
   if (result.success) {
     // handle success
   } else {
     // handle error - result.error contains error info
   }
   ```

## How to Use

### Method 1: Direct Endpoint Calls (Most Common)
```javascript
import { packageAPI } from './services/endpoints';

try {
  const response = await packageAPI.getAll(1, 10);
  console.log(response.data);
} catch (error) {
  console.error('Error:', error);
}
```

### Method 2: Using Custom Hooks (Recommended for React)
```javascript
import { useFetch, useMutation } from '../hooks/useAPI';
import { packageAPI, bookingAPI } from './endpoints';

// For read operations
const { data, loading, error, refetch } = useFetch(
  () => packageAPI.getAll(1, 10),
  []
);

// For write operations
const { mutate: createBooking, loading, error } = useMutation(
  bookingAPI.create
);

async function handleBooking(bookingData) {
  try {
    const result = await createBooking(bookingData);
  } catch (err) {
    // Handle error
  }
}
```

### Method 3: Using API Service Factory (with built-in error handling)
```javascript
import { apiService } from './services';

const result = await apiService.packages.getAll(1, 10);

if (result.success) {
  console.log('Data:', result.data);
} else {
  console.error('Error:', result.error.message);
}
```

## Error Handling

### Automatic Error Handling
The API client automatically handles:
- **401 Unauthorized**: Clears session and redirects to login
- **403 Forbidden**: Redirects to home page
- **Connection errors**: Logs error details

### Manual Error Handling
```javascript
import { handleApiError } from './api';

try {
  await packageAPI.getById(id);
} catch (error) {
  const errorInfo = handleApiError(error);
  console.error('Status:', errorInfo.status);
  console.error('Message:', errorInfo.message);
  console.error('Data:', errorInfo.data);
}
```

## API Response Format

### Success Response
```javascript
{
  status: 200,
  data: {
    // API response data
  },
  // ... other properties from axios
}
```

Access the actual data with `response.data` or `response.data.data` depending on backend format.

### Error Response
```javascript
{
  response: {
    status: 400,
    data: {
      error: "Validation failed",
      message: "Invalid email format"
    }
  }
}
```

## Authentication

### Token Management
- Token is automatically added to all requests via `Authorization: Bearer {token}` header
- Token comes from `localStorage.getItem('authToken')`
- User ID comes from `localStorage.getItem('userId')`

### Login Flow
```javascript
import { userAPI } from './endpoints';

const response = await userAPI.signin(email, password);
const { token, user_id, role } = response.data.data;

// Store in localStorage
localStorage.setItem('authToken', token);
localStorage.setItem('userId', user_id);
localStorage.setItem('userRole', role);
```

## Environment Configuration

Set the API base URL in `.env`:
```
VITE_API_URL=http://localhost:4000
```

The API client automatically uses this URL, falling back to `http://localhost:4000` if not set.

## Common API Operations

### Get All Items with Pagination
```javascript
const packages = await packageAPI.getAll(
  page = 1,
  limit = 10,
  filters = { title: 'Beach' }
);
```

### Get Single Item
```javascript
const package = await packageAPI.getById(id);
```

### Create Item
```javascript
const newPackage = await packageAPI.create({
  title: 'Beach Vacation',
  duration_days: 5,
  base_price: 50000,
  // ... other fields
});
```

### Update Item
```javascript
const updated = await packageAPI.update(id, {
  title: 'Updated Title',
  // ... fields to update
});
```

### Delete Item
```javascript
await packageAPI.delete(id);
```

## Debugging

### Enable API Logging
The API client logs all requests/responses in development mode:
```javascript
// In api.js - already configured for development
if (import.meta.env.DEV) {
  console.log('API Response:', response.config.url, response.data);
}
```

### Check Stored Data
```javascript
console.log('Token:', localStorage.getItem('authToken'));
console.log('User ID:', localStorage.getItem('userId'));
console.log('Role:', localStorage.getItem('userRole'));
```

## Adding New Endpoints

1. Add new method to the appropriate API object in `endpoints.js`:
```javascript
export const packageAPI = {
  // ... existing methods
  
  // New method
  archivePackage: (id) => apiClient.put(`/packages/${id}/archive`),
};
```

2. Use it in your components:
```javascript
await packageAPI.archivePackage(id);
```

## Performance Tips

1. **Use pagination**: Always specify page and limit for list endpoints
2. **Use filters**: Pass filters to reduce data transferred
3. **Cache data**: Use custom hooks or state management to avoid duplicate calls
4. **Parallel requests**: Use Promise.all() for independent requests:
```javascript
const [pkgs, destinations] = await Promise.all([
  packageAPI.getAll(1, 10),
  destinationAPI.getAll(1, 10)
]);
```

## Troubleshooting

### Token Expired
- The app automatically redirects to login when token expires (401 response)
- Or clear localStorage and refresh

### CORS Errors
- Check that API base URL is correct in `.env`
- Ensure backend has CORS enabled

### Network Errors
- Check if backend is running
- Verify network connectivity
- Check browser console for detailed error messages

## See Also

- [API Endpoints Documentation](../API_DOCUMENTATION.md)
- [Custom Hooks Documentation](../hooks/useAPI.js)
- [Auth Context Documentation](../context/AuthContext.jsx)
