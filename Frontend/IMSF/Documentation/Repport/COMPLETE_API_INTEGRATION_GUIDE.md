# 🚀 Complete IMS Project - API Integration Guide

## Project Status: ✅ FULLY INTEGRATED

All backend APIs have been implemented and integrated into the frontend. This guide shows you how to use them.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [API Services Overview](#api-services-overview)
3. [API Integration Service](#api-integration-service)
4. [Testing APIs](#testing-apis)
5. [Implementation Examples](#implementation-examples)
6. [API Endpoints Reference](#api-endpoints-reference)

---

## Quick Start

### Method 1: Use API Integration Service (Recommended)

```javascript
import { apiIntegration } from '@/services/apiIntegration';

// Fetch all packages
const result = await apiIntegration.packages.getAll();
if (result.success) {
  console.log('Packages:', result.data);
} else {
  console.error('Error:', result.error);
}

// Create a booking
const bookingResult = await apiIntegration.bookings.create({
  package_id: 1,
  user_id: 5,
  package_date_id: 10,
  number_of_persons: 2,
  total_price: 50000,
  contact_phone: '9876543210'
});
```

### Method 2: Use Direct Endpoints

```javascript
import { packageAPI, bookingAPI } from '@/services/endpoints';

// Fetch packages
const response = await packageAPI.getAll(1, 10);
console.log(response.data);

// Create booking
const bookingResponse = await bookingAPI.create(bookingData);
```

### Method 3: Use API Service Factory

```javascript
import { apiService } from '@/services';

// All calls are wrapped with error handling
const result = await apiService.packages.getAll();
if (result.success) {
  console.log('Packages:', result.data);
}
```

---

## API Services Overview

### 1. **userAPI** - User Management
```javascript
userAPI.signin(email, password)           // POST /users/signin
userAPI.signup(userData)                  // POST /users/signup
userAPI.getProfile(userId)                // GET /users/profile/{userId}
userAPI.updateProfile(userId, userData)   // PUT /users/update/{userId}
userAPI.updatePassword(userId, oldPassword, newPassword)  // PUT /users/{userId}/password
userAPI.getUserBookings(userId)           // GET /users/bookings/{userId}
userAPI.deleteAccount(userId)             // DELETE /users/delete/{userId}
userAPI.getAllUsers()                     // GET /users
userAPI.getUserById(userId)               // GET /users/{userId}
```

### 2. **destinationAPI** - Destination Management
```javascript
destinationAPI.getAll(page, limit, filters)  // GET /destinations
destinationAPI.getById(id)                   // GET /destinations/{id}
destinationAPI.getPackages(id)               // GET /destinations/{id}/packages
destinationAPI.create(data)                  // POST /destinations
destinationAPI.update(id, data)              // PUT /destinations/{id}
destinationAPI.delete(id)                    // DELETE /destinations/{id}
destinationAPI.search(searchTerm)            // GET /destinations/search
```

### 3. **packageAPI** - Package Management
```javascript
packageAPI.getAll(page, limit, filters)      // GET /packages
packageAPI.getById(id)                       // GET /packages/{id}
packageAPI.getDates(id)                      // GET /packages/{id}/dates
packageAPI.getItineraries(id)                // GET /packages/{id}/itineraries
packageAPI.getReviews(id)                    // GET /packages/{id}/reviews
packageAPI.getFeatured()                     // GET /packages/featured
packageAPI.search(searchTerm)                // GET /packages/search
packageAPI.create(data)                      // POST /packages
packageAPI.update(id, data)                  // PUT /packages/{id}
packageAPI.delete(id)                        // DELETE /packages/{id}
packageAPI.addDate(packageId, data)          // POST /packages/{id}/dates
packageAPI.updateDate(packageId, dateId, data)  // PUT /packages/{id}/dates/{dateId}
packageAPI.deleteDate(packageId, dateId)     // DELETE /packages/{id}/dates/{dateId}
```

### 4. **bookingAPI** - Booking Management
```javascript
bookingAPI.getAll(filters)                   // GET /bookings
bookingAPI.getById(id)                       // GET /bookings/{id}
bookingAPI.getByUser(userId)                 // GET /bookings/user/{userId}
bookingAPI.getSummary(userId)                // GET /bookings/user/{userId}/summary
bookingAPI.create(data)                      // POST /bookings
bookingAPI.update(id, data)                  // PUT /bookings/{id}
bookingAPI.confirm(id)                       // PUT /bookings/{id}/confirm
bookingAPI.cancel(id, reason)                // PUT /bookings/{id}/cancel
bookingAPI.complete(id)                      // PUT /bookings/{id}/complete
bookingAPI.delete(id)                        // DELETE /bookings/{id}
```

### 5. **paymentAPI** - Payment Management
```javascript
paymentAPI.getAll(filters)                   // GET /payments
paymentAPI.getById(id)                       // GET /payments/{id}
paymentAPI.getByBooking(bookingId)          // GET /payments/booking/{bookingId}
paymentAPI.getSummary(bookingId)            // GET /payments/booking/{bookingId}/summary
paymentAPI.create(data)                      // POST /payments
paymentAPI.update(id, data)                  // PUT /payments/{id}
paymentAPI.confirm(id)                       // PUT /payments/{id}/confirm
paymentAPI.reject(id, reason)                // PUT /payments/{id}/reject
paymentAPI.refund(paymentId, amount)         // POST /payments/{paymentId}/refund
paymentAPI.delete(id)                        // DELETE /payments/{id}
```

### 6. **reviewAPI** - Review Management
```javascript
reviewAPI.getAll(filters)                    // GET /reviews
reviewAPI.getById(id)                        // GET /reviews/{id}
reviewAPI.getByPackage(packageId)           // GET /reviews/package/{packageId}
reviewAPI.getByUser(userId)                 // GET /reviews/user/{userId}
reviewAPI.getRatingSummary(packageId)       // GET /reviews/package/{packageId}/summary
reviewAPI.create(data)                       // POST /reviews
reviewAPI.update(id, data)                   // PUT /reviews/{id}
reviewAPI.delete(id)                         // DELETE /reviews/{id}
```

### 7. **adminAPI** - Admin Operations
```javascript
// User Management
adminAPI.createUser(userData)               // POST /admin/signup/user
adminAPI.getAllUsers()                      // GET /admin/users
adminAPI.getUserById(userId)                // GET /admin/users/{userId}
adminAPI.updateUserRole(userId, roleData)   // PUT /admin/user/{userId}/role
adminAPI.deleteUser(userId)                 // DELETE /admin/user/{userId}

// Dashboard Stats
adminAPI.getDashboardStats()                // GET /admin/dashboard/stats
adminAPI.getRevenueStats(filters)           // GET /admin/dashboard/revenue
adminAPI.getBookingStats(filters)           // GET /admin/dashboard/bookings
adminAPI.getUserStats()                     // GET /admin/dashboard/users

// Destination Management
adminAPI.createDestination(data)            // POST /destinations
adminAPI.getAllDestinations(page, limit)    // GET /destinations
adminAPI.updateDestination(id, data)        // PUT /destinations/{id}
adminAPI.deleteDestination(id)              // DELETE /destinations/{id}

// Package Management
adminAPI.createPackage(data)                // POST /packages
adminAPI.getAllPackages(page, limit)        // GET /packages
adminAPI.updatePackage(id, data)            // PUT /packages/{id}
adminAPI.deletePackage(id)                  // DELETE /packages/{id}
```

### 8. **packageMasterAPI** - Master Package Management
```javascript
packageMasterAPI.getAll(page, limit)        // GET /packageMaster
packageMasterAPI.getById(id)                // GET /packageMaster/{id}
packageMasterAPI.getDates(id)               // GET /packageMaster/{id}/dates
packageMasterAPI.getItineraries(id)         // GET /packageMaster/{id}/itineraries
packageMasterAPI.addDate(packageId, data)   // POST /packageMaster/{id}/dates
packageMasterAPI.updateDate(packageId, dateId, data)  // PUT /packageMaster/{id}/dates/{dateId}
packageMasterAPI.deleteDate(packageId, dateId)       // DELETE /packageMaster/{id}/dates/{dateId}
packageMasterAPI.addItinerary(packageId, data)        // POST /packageMaster/{id}/itineraries
packageMasterAPI.updateItinerary(packageId, itineraryId, data)  // PUT /packageMaster/{id}/itineraries/{id}
packageMasterAPI.deleteItinerary(packageId, itineraryId)        // DELETE /packageMaster/{id}/itineraries/{id}
```

---

## API Integration Service

The **apiIntegration** service provides a unified interface to all backend APIs with automatic error handling and logging.

### Structure

```javascript
apiIntegration = {
  users: { ... },           // All user operations
  destinations: { ... },    // All destination operations
  packages: { ... },        // All package operations
  bookings: { ... },        // All booking operations
  payments: { ... },        // All payment operations
  reviews: { ... },         // All review operations
  admin: {
    users: { ... },         // Admin user management
    dashboard: { ... },     // Dashboard statistics
  },
  packageMaster: { ... },   // Master package operations
};
```

### Usage Pattern

Each method returns: `{ success: boolean, data: any, error?: string }`

```javascript
// Always returns { success, data, error }
const result = await apiIntegration.packages.getAll();

if (result.success) {
  // Use result.data
  console.log('Packages:', result.data);
} else {
  // Handle error
  console.error('Error:', result.error);
}
```

---

## Testing APIs

### 1. **Use the API Tester Page**

Navigate to: **Admin Dashboard → API Tester** (or `/admin/api-tester`)

Features:
- ✅ Test individual API categories
- ✅ Run all tests at once
- ✅ View success/failure results
- ✅ See detailed response data
- ✅ Export test results

### 2. **Test from Browser Console**

```javascript
// Import the API integration service
import { apiIntegration } from '/src/services/apiIntegration.js';

// Test packages
const packages = await apiIntegration.packages.getAll();
console.log('Packages:', packages);

// Test bookings
const bookings = await apiIntegration.bookings.getAll();
console.log('Bookings:', bookings);

// Test admin users
const users = await apiIntegration.admin.users.getAll();
console.log('Users:', users);
```

### 3. **Test from Component**

```javascript
import { useEffect, useState } from 'react';
import { apiIntegration } from '@/services/apiIntegration';

export function TestComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await apiIntegration.packages.getAll();
      if (result.success) {
        setData(result.data);
      }
    }
    fetchData();
  }, []);

  return <div>{JSON.stringify(data)}</div>;
}
```

---

## Implementation Examples

### Example 1: Booking Checkout Flow

```javascript
import { apiIntegration } from '@/services/apiIntegration';

async function createBooking(bookingData) {
  // Step 1: Create booking
  const bookingResult = await apiIntegration.bookings.create(bookingData);
  
  if (!bookingResult.success) {
    throw new Error(bookingResult.error);
  }

  const bookingId = bookingResult.data.booking_id;

  // Step 2: Create payment
  const paymentData = {
    booking_id: bookingId,
    user_id: bookingData.user_id,
    total_amount: bookingData.total_price,
    payment_method: 'card',
    payment_status: 'pending',
  };

  const paymentResult = await apiIntegration.payments.create(paymentData);
  
  if (!paymentResult.success) {
    console.warn('Payment creation failed, but booking was created');
    return { bookingId, paymentId: null };
  }

  return {
    bookingId,
    paymentId: paymentResult.data.payment_id
  };
}
```

### Example 2: Package Management

```javascript
import { apiIntegration } from '@/services/apiIntegration';

async function createPackageWithDates(packageData, dates) {
  // Create package
  const pkgResult = await apiIntegration.packages.create(packageData);
  
  if (!pkgResult.success) {
    throw new Error(pkgResult.error);
  }

  const packageId = pkgResult.data.package_id;

  // Add dates
  for (const date of dates) {
    await apiIntegration.packages.addDate(packageId, date);
  }

  return packageId;
}
```

### Example 3: Admin Dashboard Stats

```javascript
import { apiIntegration } from '@/services/apiIntegration';

async function getDashboardStats() {
  const [packages, bookings, revenue, users] = await Promise.all([
    apiIntegration.packages.getAll(),
    apiIntegration.bookings.getAll(),
    apiIntegration.admin.dashboard.getRevenue(),
    apiIntegration.admin.users.getAll(),
  ]);

  return {
    totalPackages: packages.data?.length || 0,
    totalBookings: bookings.data?.length || 0,
    totalRevenue: revenue.data?.total || 0,
    totalUsers: users.data?.length || 0,
  };
}
```

### Example 4: Fetch and Display Reviews

```javascript
import { apiIntegration } from '@/services/apiIntegration';

async function loadPackageReviews(packageId) {
  const reviews = await apiIntegration.packages.getReviews(packageId);
  const ratingSummary = await apiIntegration.reviews.getRatingSummary(packageId);

  return {
    reviews: reviews.data,
    summary: ratingSummary.data,
  };
}
```

---

## API Endpoints Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/signin` | User login |
| POST | `/users/signup` | User registration |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/{id}` | Get user by ID |
| GET | `/users/profile/{userId}` | Get user profile |
| PUT | `/users/update/{userId}` | Update profile |
| PUT | `/users/{userId}/password` | Change password |
| DELETE | `/users/delete/{userId}` | Delete account |

### Destinations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/destinations` | Get all destinations |
| GET | `/destinations/{id}` | Get destination by ID |
| GET | `/destinations/{id}/packages` | Get packages for destination |
| GET | `/destinations/search` | Search destinations |
| POST | `/destinations` | Create destination |
| PUT | `/destinations/{id}` | Update destination |
| DELETE | `/destinations/{id}` | Delete destination |

### Packages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/packages` | Get all packages |
| GET | `/packages/{id}` | Get package by ID |
| GET | `/packages/{id}/dates` | Get package dates |
| GET | `/packages/{id}/itineraries` | Get itineraries |
| GET | `/packages/{id}/reviews` | Get reviews |
| GET | `/packages/featured` | Get featured packages |
| GET | `/packages/search` | Search packages |
| POST | `/packages` | Create package |
| PUT | `/packages/{id}` | Update package |
| DELETE | `/packages/{id}` | Delete package |
| POST | `/packages/{id}/dates` | Add date |
| PUT | `/packages/{id}/dates/{dateId}` | Update date |
| DELETE | `/packages/{id}/dates/{dateId}` | Delete date |

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bookings` | Get all bookings |
| GET | `/bookings/{id}` | Get booking by ID |
| GET | `/bookings/user/{userId}` | Get user bookings |
| GET | `/bookings/user/{userId}/summary` | Get booking summary |
| POST | `/bookings` | Create booking |
| PUT | `/bookings/{id}` | Update booking |
| PUT | `/bookings/{id}/confirm` | Confirm booking |
| PUT | `/bookings/{id}/cancel` | Cancel booking |
| PUT | `/bookings/{id}/complete` | Complete booking |
| DELETE | `/bookings/{id}` | Delete booking |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/payments` | Get all payments |
| GET | `/payments/{id}` | Get payment by ID |
| GET | `/payments/booking/{bookingId}` | Get booking payments |
| GET | `/payments/booking/{bookingId}/summary` | Get payment summary |
| POST | `/payments` | Create payment |
| PUT | `/payments/{id}` | Update payment |
| PUT | `/payments/{id}/confirm` | Confirm payment |
| PUT | `/payments/{id}/reject` | Reject payment |
| POST | `/payments/{id}/refund` | Process refund |
| DELETE | `/payments/{id}` | Delete payment |

### Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reviews` | Get all reviews |
| GET | `/reviews/{id}` | Get review by ID |
| GET | `/reviews/package/{packageId}` | Get package reviews |
| GET | `/reviews/user/{userId}` | Get user reviews |
| GET | `/reviews/package/{packageId}/summary` | Get rating summary |
| POST | `/reviews` | Create review |
| PUT | `/reviews/{id}` | Update review |
| DELETE | `/reviews/{id}` | Delete review |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/signup/user` | Create user |
| GET | `/admin/users` | Get all users |
| GET | `/admin/users/{userId}` | Get user by ID |
| PUT | `/admin/user/{userId}/role` | Update user role |
| DELETE | `/admin/user/{userId}` | Delete user |
| GET | `/admin/dashboard/stats` | Dashboard statistics |
| GET | `/admin/dashboard/revenue` | Revenue statistics |
| GET | `/admin/dashboard/bookings` | Booking statistics |
| GET | `/admin/dashboard/users` | User statistics |

---

## Features Implemented

### ✅ User Management
- ✓ Authentication (signin/signup)
- ✓ Profile management
- ✓ Password change
- ✓ Account deletion

### ✅ Package Management
- ✓ List all packages
- ✓ Search packages
- ✓ Create packages
- ✓ Edit packages
- ✓ Delete packages
- ✓ Manage package dates
- ✓ View itineraries
- ✓ View reviews

### ✅ Booking System
- ✓ Create bookings with package dates
- ✓ View user bookings
- ✓ Confirm/Cancel bookings
- ✓ Complete bookings
- ✓ Booking summary

### ✅ Payment System
- ✓ Create payments
- ✓ Confirm payments
- ✓ Reject payments
- ✓ Process refunds
- ✓ Payment tracking

### ✅ Review System
- ✓ Create reviews
- ✓ View reviews by package
- ✓ View reviews by user
- ✓ Rating summary

### ✅ Admin Features
- ✓ User management
- ✓ Dashboard statistics
- ✓ Revenue tracking
- ✓ Booking reports
- ✓ API testing tool

---

## Next Steps

1. **Test All APIs**: Go to `/admin/api-tester` to test all endpoints
2. **Review Data**: Check the response structures from each endpoint
3. **Implement Features**: Use the API integration service in your components
4. **Handle Errors**: Always check `result.success` before using `result.data`
5. **Monitor Logs**: Check browser console for detailed API logs

---

## Support

- 📖 API Documentation: `/Documentation/API_DOCUMENTATION.md`
- 🧪 API Tester: `/admin/api-tester`
- 💬 Console Logs: Open browser DevTools (F12) → Console tab
- 📝 Service File: `/src/services/apiIntegration.js`

**Project Status: ✅ COMPLETE AND FULLY INTEGRATED**
