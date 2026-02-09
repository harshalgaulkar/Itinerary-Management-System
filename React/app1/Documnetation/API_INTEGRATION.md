# API Integration Guide for IMS Mobile App

## Overview

This guide explains how the IMS Mobile App integrates with the IMSBackend API and provides examples for common operations.

## Backend Requirements

The backend must implement the following endpoints:

### Base URL
```
Development: http://localhost:3000/api
Production: https://your-api-domain.com/api
```

## Authentication Endpoints

### User Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "phone": "+919876543210",
    "role": "customer"
  }
}
```

### User Registration
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "password123",
  "phone": "+919876543210"
}

Response (201):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com"
  }
}
```

### Get Profile
```http
GET /auth/profile
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "phone": "+919876543210",
  "createdAt": "2024-01-20T10:00:00Z"
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer {token}

Response (200):
{
  "message": "Logged out successfully"
}
```

## Package Endpoints

### Get All Packages
```http
GET /packages?page=1&limit=10&destination=goa
Authorization: Bearer {token}

Response (200):
{
  "data": [
    {
      "id": 1,
      "name": "Goa Beach Paradise",
      "destination": "Goa",
      "description": "3 day beach vacation",
      "price": 15000,
      "duration": 3,
      "imageUrl": "https://...",
      "rating": 4.5,
      "reviews": 45,
      "availableSeats": 10
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

### Get Package Details
```http
GET /packages/:id
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "name": "Goa Beach Paradise",
  "destination": "Goa",
  "description": "Experience the best of Goa",
  "price": 15000,
  "duration": 3,
  "imageUrl": "https://...",
  "itinerary": "Day 1: Arrival...\nDay 2: Beach...",
  "inclusions": "Hotel, Meals, Transport",
  "exclusions": "Flight",
  "rating": 4.5,
  "reviews": 45,
  "availableSeats": 10,
  "createdAt": "2024-01-15T00:00:00Z"
}
```

### Create Package (Admin)
```http
POST /packages
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "New Package",
  "destination": "Goa",
  "description": "Description",
  "price": 15000,
  "duration": 3,
  "imageUrl": "https://...",
  "itinerary": "Day 1...",
  "inclusions": "Hotel, Meals",
  "exclusions": "Flight"
}

Response (201):
{
  "id": 2,
  "name": "New Package",
  ...
}
```

## Destination Endpoints

### Get All Destinations
```http
GET /destinations
Authorization: Bearer {token}

Response (200):
{
  "data": [
    {
      "id": 1,
      "name": "Goa",
      "description": "Beautiful beaches",
      "imageUrl": "https://...",
      "packageCount": 5
    }
  ]
}
```

### Get Destination Details
```http
GET /destinations/:id
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "name": "Goa",
  "description": "Beautiful beaches and nightlife",
  "imageUrl": "https://...",
  "packages": [
    { "id": 1, "name": "Package 1", ... }
  ]
}
```

## Booking Endpoints

### Create Booking
```http
POST /bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "packageId": 1,
  "travelDate": "2024-02-15",
  "numberOfTravelers": 2,
  "specialRequests": "Window seat preferred"
}

Response (201):
{
  "id": 1,
  "packageId": 1,
  "packageName": "Goa Beach Paradise",
  "userId": 1,
  "travelDate": "2024-02-15",
  "numberOfTravelers": 2,
  "totalAmount": 30000,
  "status": "pending",
  "createdAt": "2024-01-20T10:00:00Z"
}
```

### Get User Bookings
```http
GET /bookings
Authorization: Bearer {token}

Response (200):
{
  "data": [
    {
      "id": 1,
      "packageId": 1,
      "packageName": "Goa Beach Paradise",
      "travelDate": "2024-02-15",
      "numberOfTravelers": 2,
      "totalAmount": 30000,
      "status": "confirmed"
    }
  ]
}
```

### Get Booking Details
```http
GET /bookings/:id
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "packageId": 1,
  "packageName": "Goa Beach Paradise",
  "userId": 1,
  "travelDate": "2024-02-15",
  "numberOfTravelers": 2,
  "totalAmount": 30000,
  "status": "confirmed",
  "specialRequests": "Window seat preferred"
}
```

### Cancel Booking
```http
POST /bookings/:id/cancel
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "status": "cancelled",
  "cancelledAt": "2024-01-20T11:00:00Z"
}
```

## Payment Endpoints

### Initiate Payment
```http
POST /payments/initiate
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": 1,
  "amount": 30000,
  "method": "card",
  "cardNumber": "4111111111111111",
  "cardholderName": "John Doe",
  "expiryDate": "12/25",
  "cvv": "123"
}

Response (200):
{
  "transactionId": "TXN_123456",
  "status": "success",
  "message": "Payment processed successfully",
  "amount": 30000,
  "currency": "INR"
}
```

### Get Payment Status
```http
GET /payments/status/:transactionId
Authorization: Bearer {token}

Response (200):
{
  "transactionId": "TXN_123456",
  "status": "success",
  "amount": 30000,
  "timestamp": "2024-01-20T10:00:00Z"
}
```

### Get Payment History
```http
GET /payments/history
Authorization: Bearer {token}

Response (200):
{
  "data": [
    {
      "transactionId": "TXN_123456",
      "bookingId": 1,
      "amount": 30000,
      "status": "success",
      "timestamp": "2024-01-20T10:00:00Z"
    }
  ]
}
```

## Review Endpoints

### Get Package Reviews
```http
GET /reviews/package/:packageId
Authorization: Bearer {token}

Response (200):
{
  "data": [
    {
      "id": 1,
      "packageId": 1,
      "userId": 1,
      "userName": "John Doe",
      "rating": 5,
      "title": "Excellent package!",
      "comment": "Had a great time",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Create Review
```http
POST /reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "packageId": 1,
  "rating": 5,
  "title": "Excellent package!",
  "comment": "Had a wonderful experience"
}

Response (201):
{
  "id": 1,
  "packageId": 1,
  "userId": 1,
  "rating": 5,
  "title": "Excellent package!",
  "comment": "Had a wonderful experience",
  "createdAt": "2024-01-20T10:00:00Z"
}
```

### Update Review
```http
PUT /reviews/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 4,
  "title": "Good package",
  "comment": "Updated review"
}

Response (200):
{
  "id": 1,
  "rating": 4,
  "title": "Good package",
  "comment": "Updated review",
  "updatedAt": "2024-01-20T11:00:00Z"
}
```

### Delete Review
```http
DELETE /reviews/:id
Authorization: Bearer {token}

Response (200):
{
  "message": "Review deleted successfully"
}
```

## Error Response Format

All error responses follow this format:

```json
{
  "status": "error",
  "code": 400,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Common Error Codes
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

## Pagination

List endpoints support pagination:

```
GET /packages?page=1&limit=10

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10, max: 100)

Response includes:
{
  "data": [...],
  "total": 50,
  "page": 1,
  "limit": 10,
  "pages": 5
}
```

## Filtering

Package endpoint supports filtering:

```
GET /packages?destination=goa&minPrice=5000&maxPrice=20000&rating=4

Query Parameters:
- destination: Filter by destination name
- minPrice: Minimum price
- maxPrice: Maximum price
- rating: Minimum rating (0-5)
- search: Search in name/description
```

## Rate Limiting

API implements rate limiting:
- 100 requests per hour per IP
- 1000 requests per hour per authenticated user

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642684800
```

## Token Format

Tokens are JWT tokens in the format:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQyNjc4NDAwfQ.signature
```

Token Expiry: 24 hours

## Testing API Endpoints

### Using cURL
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get packages with token
curl -X GET http://localhost:3000/api/packages \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman
1. Create new request
2. Select method (GET/POST/etc)
3. Enter URL
4. Add Authorization header with Bearer token
5. Send request

## Implementation Notes

### Handling Token Expiration
```javascript
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      // Token expired, redirect to login
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);
```

### Retry Logic
```javascript
const retryRequest = async (config, retries = 3) => {
  try {
    return await api.request(config);
  } catch (error) {
    if (retries > 0) {
      return retryRequest(config, retries - 1);
    }
    throw error;
  }
};
```

### Timeout Handling
```javascript
const axiosInstance = axios.create({
  timeout: 10000 // 10 seconds
});
```

## Production Considerations

1. **HTTPS Only**: Use HTTPS in production
2. **CORS**: Configure CORS on backend
3. **Rate Limiting**: Implement rate limiting
4. **Logging**: Log all API errors
5. **Monitoring**: Monitor API health
6. **Caching**: Cache responses where appropriate
7. **Versioning**: Version your API endpoints

## Support

For API integration issues:
1. Check backend API logs
2. Verify endpoint URLs
3. Check request/response formats
4. Test with Postman first
5. Check token validity
6. Verify CORS configuration

---
**Last Updated**: January 30, 2026
**Version**: 1.0.0
