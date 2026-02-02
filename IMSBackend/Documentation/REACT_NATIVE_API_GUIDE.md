# IMS Backend - API Endpoints Guide for React Native

**Version:** 1.0
**Last Updated:** January 19, 2026
**Total Endpoints:** 65+
**Authentication:** JWT Token-based with user_id header

---

## Table of Contents
1. [Base Configuration](#base-configuration)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Admin Endpoints](#admin-endpoints)
4. [User Endpoints](#user-endpoints)
5. [Destination Endpoints](#destination-endpoints)
6. [Package Endpoints](#package-endpoints)
7. [Package Master Endpoints](#package-master-endpoints)
8. [Package Itinerary Endpoints](#package-itinerary-endpoints)
9. [Booking Endpoints](#booking-endpoints)
10. [Payment Endpoints](#payment-endpoints)
11. [Review Endpoints](#review-endpoints)
12. [Response Format](#response-format)
13. [Error Handling](#error-handling)

---

## Base Configuration

### Server Details
```
Base URL: http://localhost:4000
Protocol: HTTP/HTTPS
Content-Type: application/json
```

### Request Headers (All Authenticated Requests)
```
Headers: {
  "Content-Type": "application/json",
  "user_id": "<user_id>",
  "Authorization": "Bearer <token>" (optional)
}
```

### Environment Configuration
```javascript
// React Native Config
const API_BASE_URL = 'http://192.168.x.x:4000'; // Use your server IP
const TIMEOUT = 10000; // 10 seconds
```

---

## Authentication Endpoints

### 1. User Sign Up
**Endpoint:** `POST /users/signup`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "9876543210"
}
```

**Response (Success):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user_id": 1,
    "full_name": "John Doe",
    "email": "user@example.com",
    "phone": "9876543210",
    "role": "user"
  }
}
```

**React Native Implementation:**
```javascript
const signUp = async (email, password, fullName, phone) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        phone
      }),
      timeout: TIMEOUT
    });
    return await response.json();
  } catch (error) {
    console.error('SignUp Error:', error);
    throw error;
  }
};
```

---

### 2. User Sign In
**Endpoint:** `POST /users/signin`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user_id": 1,
    "full_name": "John Doe",
    "email": "user@example.com",
    "phone": "9876543210",
    "role": "admin"
  }
}
```

**React Native Implementation:**
```javascript
const signIn = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      timeout: TIMEOUT
    });
    const data = await response.json();
    if (data.status === 'success') {
      // Save token and user_id to AsyncStorage
      await AsyncStorage.setItem('token', data.data.token);
      await AsyncStorage.setItem('user_id', data.data.user_id.toString());
      return data.data;
    }
    throw new Error(data.error);
  } catch (error) {
    console.error('SignIn Error:', error);
    throw error;
  }
};
```

---

## Admin Endpoints

### 1. Create User (Admin Only)
**Endpoint:** `POST /admin/signup/user`
**Auth Required:** Yes (First admin doesn't require token)

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "full_name": "Jane Doe",
  "phone": "9876543210",
  "role": "user"
}
```

**Headers:**
```
user_id: 2
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "message": "User created successfully",
    "user_id": 5,
    "email": "newuser@example.com",
    "full_name": "Jane Doe",
    "role": "user"
  }
}
```

---

### 2. Get All Users (Admin Only)
**Endpoint:** `GET /admin/users`
**Auth Required:** Yes (Admin only)

**Headers:**
```
user_id: 2
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "user_id": 1,
      "email": "user1@example.com",
      "full_name": "User One",
      "phone": "1234567890",
      "role": "user",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 3. Update User Role (Admin Only)
**Endpoint:** `PUT /admin/user/:user_id/role`
**Auth Required:** Yes (Admin only)

**URL:** `PUT /admin/user/3/role`

**Request:**
```json
{
  "role": "manager"
}
```

**Headers:**
```
user_id: 2
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "message": "User role updated successfully",
    "user_id": 3,
    "role": "manager"
  }
}
```

---

### 4. Delete User (Admin Only)
**Endpoint:** `DELETE /admin/user/:user_id`
**Auth Required:** Yes (Admin only)

**URL:** `DELETE /admin/user/5`

**Headers:**
```
user_id: 2
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "message": "User deleted successfully",
    "user_id": 5
  }
}
```

---

## User Endpoints

### 1. Get User Profile
**Endpoint:** `GET /users/profile/:user_id`
**Auth Required:** Yes

**URL:** `GET /users/profile/1`

**Headers:**
```
user_id: 1
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user_id": 1,
    "full_name": "John Doe",
    "email": "user@example.com",
    "phone": "1234567890",
    "role": "user",
    "created_at": "2024-01-10T08:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### 2. Update User Profile
**Endpoint:** `PUT /users/update/:user_id`
**Auth Required:** Yes

**URL:** `PUT /users/update/1`

**Request:**
```json
{
  "full_name": "Jane Doe",
  "email": "newemail@example.com",
  "phone": "9876543210"
}
```

**Headers:**
```
user_id: 1
```

**Response:**
```json
{
  "status": "success",
  "data": "User information updated successfully"
}
```

---

### 3. Get User Bookings
**Endpoint:** `GET /users/bookings/:user_id`
**Auth Required:** Yes

**URL:** `GET /users/bookings/1`

**Headers:**
```
user_id: 1
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "booking_id": 1,
      "user_id": 1,
      "package_date_id": 2,
      "booked_on": "2024-01-15T10:30:00Z",
      "persons": 2,
      "total_price": 20000,
      "status": "confirmed",
      "contact_phone": "9876543210",
      "notes": "Special requirements: Vegetarian meals",
      "package_title": "Taj Mahal Tour",
      "duration_days": 3,
      "destination_name": "Agra",
      "start_date": "2024-02-01",
      "end_date": "2024-02-04"
    }
  ]
}
```

---

## Destination Endpoints

### 1. Get All Destinations
**Endpoint:** `GET /destinations`
**Auth Required:** No

**Query Parameters:**
```
page=1 (optional, default: 1)
limit=10 (optional, default: 10, max: 100)
search=Agra (optional)
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "dest_id": 1,
      "name": "Agra",
      "country": "India",
      "description": "Home of the Taj Mahal",
      "image": "agra.jpg",
      "created_at": "2024-01-10T08:00:00Z"
    }
  ]
}
```

---

### 2. Get Single Destination
**Endpoint:** `GET /destinations/:dest_id`
**Auth Required:** No

**URL:** `GET /destinations/1`

**Response:**
```json
{
  "status": "success",
  "data": {
    "dest_id": 1,
    "name": "Agra",
    "country": "India",
    "description": "Home of the Taj Mahal",
    "image": "agra.jpg"
  }
}
```

---

### 3. Create Destination (Admin Only)
**Endpoint:** `POST /destinations`
**Auth Required:** Yes (Admin only)

**Request:**
```json
{
  "name": "Jaipur",
  "country": "India",
  "description": "Pink City of India",
  "image": "jaipur.jpg"
}
```

**Headers:**
```
user_id: 2
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "dest_id": 5,
    "name": "Jaipur",
    "country": "India",
    "description": "Pink City of India",
    "image": "jaipur.jpg"
  }
}
```

---

## Package Endpoints

### 1. Get All Packages
**Endpoint:** `GET /packages`
**Auth Required:** No

**Query Parameters:**
```
dest_id=1 (optional)
page=1 (optional)
limit=10 (optional)
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "package_id": 1,
      "title": "Taj Mahal Tour",
      "dest_id": 1,
      "destination_name": "Agra",
      "duration_days": 3,
      "base_price": 10000,
      "max_people": 50,
      "description": "3-day tour of Taj Mahal",
      "created_by": 2,
      "created_at": "2024-01-10T08:00:00Z"
    }
  ]
}
```

---

### 2. Get Single Package
**Endpoint:** `GET /packages/:package_id`
**Auth Required:** No

**URL:** `GET /packages/1`

**Response:**
```json
{
  "status": "success",
  "data": {
    "package_id": 1,
    "title": "Taj Mahal Tour",
    "dest_id": 1,
    "destination_name": "Agra",
    "duration_days": 3,
    "base_price": 10000,
    "max_people": 50,
    "description": "3-day tour of Taj Mahal",
    "created_by": 2,
    "created_at": "2024-01-10T08:00:00Z"
  }
}
```

---

### 3. Create Package (Admin Only)
**Endpoint:** `POST /packages`
**Auth Required:** Yes (Admin only)

**Request:**
```json
{
  "title": "Taj Mahal Tour",
  "dest_id": 1,
  "duration_days": 3,
  "base_price": 10000,
  "max_people": 50,
  "description": "3-day tour of Taj Mahal"
}
```

**Headers:**
```
user_id: 2
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "package_id": 1,
    "title": "Taj Mahal Tour",
    "dest_id": 1,
    "duration_days": 3,
    "base_price": 10000,
    "max_people": 50
  }
}
```

---

## Package Master Endpoints

### 1. Get All Package Masters
**Endpoint:** `GET /packageMaster`
**Auth Required:** No

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "package_id": 1,
      "title": "Taj Mahal Tour",
      "destination_name": "Agra",
      "duration_days": 3,
      "base_price": 10000,
      "max_people": 50,
      "average_rating": 4.5,
      "total_reviews": 12
    }
  ]
}
```

---

### 2. Get Package Details with Dates
**Endpoint:** `GET /packageMaster/:package_id`
**Auth Required:** No

**URL:** `GET /packageMaster/1`

**Response:**
```json
{
  "status": "success",
  "data": {
    "package_id": 1,
    "title": "Taj Mahal Tour",
    "destination_name": "Agra",
    "duration_days": 3,
    "base_price": 10000,
    "max_people": 50,
    "description": "3-day tour",
    "average_rating": 4.5,
    "total_reviews": 12,
    "dates": [
      {
        "package_date_id": 10,
        "start_date": "2024-02-01",
        "end_date": "2024-02-04",
        "seats_available": 45,
        "price": 10000
      }
    ],
    "itinerary": [
      {
        "day_number": 1,
        "title": "Arrival Day",
        "details": "Arrive and settle in hotel"
      }
    ]
  }
}
```

---

## Package Itinerary Endpoints

### 1. Get Package Itinerary
**Endpoint:** `GET /packageItenerary/:package_id`
**Auth Required:** No

**URL:** `GET /packageItenerary/1`

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "itinerary_id": 1,
      "package_id": 1,
      "day_number": 1,
      "title": "Arrival Day",
      "details": "Arrive at airport, transfer to hotel"
    },
    {
      "itinerary_id": 2,
      "package_id": 1,
      "day_number": 2,
      "title": "Taj Mahal Visit",
      "details": "Visit Taj Mahal in the morning"
    }
  ]
}
```

---

### 2. Create Itinerary (Admin Only)
**Endpoint:** `POST /packageItenerary`
**Auth Required:** Yes (Admin only)

**Request:**
```json
{
  "package_id": 1,
  "day_number": 1,
  "title": "Arrival Day",
  "details": "Arrive at airport, transfer to hotel"
}
```

**Headers:**
```
user_id: 2
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "itinerary_id": 1,
    "package_id": 1,
    "day_number": 1,
    "title": "Arrival Day",
    "details": "Arrive at airport, transfer to hotel"
  }
}
```

---

## Booking Endpoints

### 1. Create Booking
**Endpoint:** `POST /bookings`
**Auth Required:** Yes

**Request:**
```json
{
  "package_date_id": 10,
  "persons": 2,
  "total_price": 20000,
  "contact_phone": "9876543210",
  "notes": "Vegetarian meals required"
}
```

**Headers:**
```
user_id: 1
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "booking_id": 5,
    "user_id": 1,
    "package_date_id": 10,
    "booked_on": "2024-01-19T10:30:00Z",
    "persons": 2,
    "total_price": 20000,
    "status": "pending",
    "contact_phone": "9876543210",
    "notes": "Vegetarian meals required"
  }
}
```

---

### 2. Get All Bookings
**Endpoint:** `GET /bookings`
**Auth Required:** Yes

**Query Parameters:**
```
page=1 (optional)
limit=10 (optional)
user_id=1 (optional, users can only see own)
status=pending (optional: pending/confirmed/cancelled/completed)
```

**Headers:**
```
user_id: 1
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "booking_id": 5,
      "user_id": 1,
      "package_date_id": 10,
      "booked_on": "2024-01-19T10:30:00Z",
      "persons": 2,
      "total_price": 20000,
      "status": "pending",
      "contact_phone": "9876543210",
      "notes": "Vegetarian meals required",
      "updated_at": "2024-01-19T10:30:00Z",
      "full_name": "John Doe",
      "email": "user@example.com",
      "package_title": "Taj Mahal Tour",
      "duration_days": 3,
      "destination_name": "Agra",
      "start_date": "2024-02-01",
      "end_date": "2024-02-04"
    }
  ]
}
```

---

### 3. Get Booking Details
**Endpoint:** `GET /bookings/:booking_id`
**Auth Required:** Yes

**URL:** `GET /bookings/5`

**Headers:**
```
user_id: 1
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "booking_id": 5,
    "user_id": 1,
    "package_date_id": 10,
    "booked_on": "2024-01-19T10:30:00Z",
    "persons": 2,
    "total_price": 20000,
    "status": "pending",
    "contact_phone": "9876543210",
    "notes": "Vegetarian meals required",
    "updated_at": "2024-01-19T10:30:00Z",
    "full_name": "John Doe",
    "email": "user@example.com",
    "package_title": "Taj Mahal Tour",
    "duration_days": 3,
    "destination_name": "Agra",
    "start_date": "2024-02-01",
    "end_date": "2024-02-04"
  }
}
```

---

### 4. Update Booking
**Endpoint:** `PUT /bookings/:booking_id`
**Auth Required:** Yes

**URL:** `PUT /bookings/5`

**Request:**
```json
{
  "persons": 3,
  "contact_phone": "9876543210",
  "notes": "Updated notes"
}
```

**Headers:**
```
user_id: 1
```

**Response:**
```json
{
  "status": "success",
  "data": "Booking updated successfully"
}
```

---

### 5. Confirm Booking (Admin Only)
**Endpoint:** `PUT /bookings/:booking_id/confirm`
**Auth Required:** Yes (Admin only)

**URL:** `PUT /bookings/5/confirm`

**Headers:**
```
user_id: 2
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "booking_id": 5,
    "status": "confirmed",
    "message": "Booking confirmed successfully"
  }
}
```

---

### 6. Cancel Booking
**Endpoint:** `PUT /bookings/:booking_id/cancel`
**Auth Required:** Yes

**URL:** `PUT /bookings/5/cancel`

**Headers:**
```
user_id: 1
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "booking_id": 5,
    "status": "cancelled",
    "message": "Booking cancelled, refund initiated"
  }
}
```

---

## Payment Endpoints

### 1. Create Payment
**Endpoint:** `POST /payments`
**Auth Required:** Yes

**Request:**
```json
{
  "booking_id": 5,
  "amount": 10000,
  "method": "card",
  "txn_reference": "TXN123456789"
}
```

**Headers:**
```
user_id: 1
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "payment_id": 8,
    "booking_id": 5,
    "paid_on": "2024-01-19T10:35:00Z",
    "amount": 10000,
    "method": "card",
    "status": "success",
    "txn_reference": "TXN123456789"
  }
}
```

---

### 2. Get All Payments
**Endpoint:** `GET /payments`
**Auth Required:** Yes

**Query Parameters:**
```
page=1 (optional)
limit=10 (optional)
booking_id=5 (optional)
status=success (optional: success/failed/pending)
method=card (optional: card/upi/netbanking/cash/other)
```

**Headers:**
```
user_id: 1
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "payment_id": 8,
      "booking_id": 5,
      "paid_on": "2024-01-19T10:35:00Z",
      "amount": 10000,
      "method": "card",
      "status": "success",
      "txn_reference": "TXN123456789",
      "user_name": "John Doe",
      "package_title": "Taj Mahal Tour"
    }
  ]
}
```

---

### 3. Get Payment Summary
**Endpoint:** `GET /payments/booking/:booking_id/summary`
**Auth Required:** Yes

**URL:** `GET /payments/booking/5/summary`

**Headers:**
```
user_id: 1
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "booking_id": 5,
    "booking_total": 20000,
    "total_paid": 15000,
    "balance_due": 5000,
    "payment_status": "partial",
    "total_payments": 2,
    "successful_payments": 1,
    "failed_payments": 1,
    "pending_payments": 0
  }
}
```

---

### 4. Confirm Payment (Admin Only)
**Endpoint:** `PUT /payments/:payment_id/confirm`
**Auth Required:** Yes (Admin only)

**URL:** `PUT /payments/8/confirm`

**Headers:**
```
user_id: 2
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "payment_id": 8,
    "status": "success",
    "message": "Payment confirmed"
  }
}
```

---

### 5. Reject Payment (Admin Only)
**Endpoint:** `PUT /payments/:payment_id/reject`
**Auth Required:** Yes (Admin only)

**URL:** `PUT /payments/8/reject`

**Request:**
```json
{
  "reason": "Card declined"
}
```

**Headers:**
```
user_id: 2
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "payment_id": 8,
    "status": "failed",
    "message": "Payment rejected"
  }
}
```

---

## Review Endpoints

### 1. Create Review
**Endpoint:** `POST /reviews`
**Auth Required:** Yes

**Request:**
```json
{
  "package_id": 1,
  "booking_id": 5,
  "rating": 5,
  "title": "Amazing Trip!",
  "comment": "Had an incredible experience visiting Taj Mahal"
}
```

**Headers:**
```
user_id: 1
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "review_id": 15,
    "package_id": 1,
    "booking_id": 5,
    "user_id": 1,
    "rating": 5,
    "title": "Amazing Trip!",
    "comment": "Had an incredible experience visiting Taj Mahal",
    "created_at": "2024-01-19T10:40:00Z"
  }
}
```

---

### 2. Get All Reviews
**Endpoint:** `GET /reviews`
**Auth Required:** No

**Query Parameters:**
```
page=1 (optional)
limit=10 (optional)
package_id=1 (optional)
rating=5 (optional: 1-5)
sort_by=created_at (optional)
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "review_id": 15,
      "package_id": 1,
      "user_id": 1,
      "rating": 5,
      "title": "Amazing Trip!",
      "comment": "Had an incredible experience",
      "created_at": "2024-01-19T10:40:00Z",
      "user_name": "John Doe"
    }
  ]
}
```

---

### 3. Get Package Reviews
**Endpoint:** `GET /reviews/package/:package_id`
**Auth Required:** No

**URL:** `GET /reviews/package/1`

**Response:**
```json
{
  "status": "success",
  "data": {
    "package_id": 1,
    "package_title": "Taj Mahal Tour",
    "average_rating": 4.5,
    "total_reviews": 12,
    "reviews": [
      {
        "review_id": 15,
        "user_id": 1,
        "rating": 5,
        "title": "Amazing Trip!",
        "comment": "Had an incredible experience",
        "created_at": "2024-01-19T10:40:00Z",
        "user_name": "John Doe"
      }
    ]
  }
}
```

---

### 4. Update Review
**Endpoint:** `PUT /reviews/:review_id`
**Auth Required:** Yes

**URL:** `PUT /reviews/15`

**Request:**
```json
{
  "rating": 4,
  "title": "Great Trip!",
  "comment": "Updated comment"
}
```

**Headers:**
```
user_id: 1
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "review_id": 15,
    "rating": 4,
    "title": "Great Trip!",
    "message": "Review updated successfully"
  }
}
```

---

### 5. Delete Review
**Endpoint:** `DELETE /reviews/:review_id`
**Auth Required:** Yes

**URL:** `DELETE /reviews/15`

**Headers:**
```
user_id: 1
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "review_id": 15,
    "message": "Review deleted successfully"
  }
}
```

---

## Response Format

### Standard Success Response
```json
{
  "status": "success",
  "data": {
    // Response data
  }
}
```

### Standard Error Response
```json
{
  "status": "error",
  "error": "Error message describing what went wrong"
}
```

### Validation Error Response
```json
{
  "status": "error",
  "error": "Validation error: Email is required, Password must be at least 6 characters"
}
```

---

## Error Handling

### Common Error Codes

| Status Code | Error Message | Solution |
|-------------|---------------|----------|
| 400 | Validation error | Check request body for missing/invalid fields |
| 401 | Invalid credentials | Verify email and password |
| 401 | Unauthorized | Add user_id header or ensure user is admin |
| 404 | User/Booking/Payment not found | Verify the ID exists |
| 409 | Email already registered | Use different email |
| 500 | Database error | Contact support |

### React Native Error Handling
```javascript
const handleApiError = (error) => {
  if (error.status === 'error') {
    // Handle validation errors
    if (error.error.includes('Validation')) {
      showAlert('Invalid Input', error.error);
    }
    // Handle authentication errors
    else if (error.error.includes('Unauthorized') || error.error.includes('Invalid credentials')) {
      resetAuth();
      navigateToLogin();
    }
    // Handle not found errors
    else if (error.error.includes('not found')) {
      showAlert('Not Found', error.error);
    }
    // Handle other errors
    else {
      showAlert('Error', error.error);
    }
  }
};
```

---

## React Native Implementation Guide

### 1. Setup Base Service
```javascript
// api/ApiService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.100:4000'; // Change to your server IP
const TIMEOUT = 10000;

export const apiCall = async (endpoint, method = 'GET', body = null) => {
  try {
    const user_id = await AsyncStorage.getItem('user_id');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (user_id) {
      headers['user_id'] = user_id;
    }

    const options = {
      method,
      headers,
      timeout: TIMEOUT,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    if (data.status === 'error') {
      throw new Error(data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};
```

### 2. Auth Service
```javascript
// services/AuthService.js
import { apiCall } from '../api/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const signUp = (email, password, fullName, phone) => {
  return apiCall('/users/signup', 'POST', {
    email,
    password,
    full_name: fullName,
    phone,
  });
};

export const signIn = async (email, password) => {
  const data = await apiCall('/users/signin', 'POST', { email, password });
  await AsyncStorage.setItem('user_id', data.user_id.toString());
  return data;
};

export const logout = async () => {
  await AsyncStorage.removeItem('user_id');
};
```

### 3. Booking Service
```javascript
// services/BookingService.js
import { apiCall } from '../api/ApiService';

export const getBookings = (filters = {}) => {
  let endpoint = '/bookings';
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page);
  if (filters.status) params.append('status', filters.status);
  
  if (params.toString()) {
    endpoint += '?' + params.toString();
  }
  
  return apiCall(endpoint, 'GET');
};

export const createBooking = (booking) => {
  return apiCall('/bookings', 'POST', booking);
};

export const getBookingDetails = (bookingId) => {
  return apiCall(`/bookings/${bookingId}`, 'GET');
};
```

---

## Testing Checklist for Frontend

- [ ] User Registration works
- [ ] User Login works and saves token
- [ ] User can view profile
- [ ] User can update profile
- [ ] User can view destinations
- [ ] User can view packages
- [ ] User can view package details with dates
- [ ] User can create booking
- [ ] User can view their bookings
- [ ] User can update booking
- [ ] User can cancel booking
- [ ] User can make payment
- [ ] User can view payment history
- [ ] User can create review
- [ ] User can view reviews
- [ ] Admin can create users
- [ ] Admin can view all users
- [ ] Admin can update user roles
- [ ] Admin can delete users
- [ ] Admin can confirm bookings
- [ ] Error handling works correctly

---

## Support & Documentation

**API Base URL:** http://localhost:4000
**Database:** MySQL
**Framework:** Express.js
**Version:** 1.0
**Last Updated:** January 19, 2026

For issues or clarifications, please contact the backend team.

---

**End of Documentation**
