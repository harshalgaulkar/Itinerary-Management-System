# IMS Backend - Complete API Documentation

## Overview
Complete REST API for Itinerary Management System with 8 route modules and 60+ endpoints.

**Base URL:** `http://localhost:4000`
**Authentication:** JWT Token in header: `user_id: <user_id>`

---

## 1. Users Route (`/users`)

### POST /users/signin
Login user and get JWT token
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:** User object with JWT token, user_id, full_name, email, phone, role

### POST /users/signup
Register new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "1234567890"
}
```
**Response:** User object with JWT token

### GET /users/profile/:user_id
Get user profile (user can see own, admin can see any)
**Auth Required:** Yes

### GET /users
Get all users (admin only)
**Auth Required:** Yes (Admin)

### PUT /users/update/:user_id
Update user info (user can update own, admin can update any)
```json
{
  "full_name": "Jane Doe",
  "email": "newemail@example.com",
  "phone": "9876543210"
}
```
**Auth Required:** Yes

### DELETE /users/delete/:user_id
Delete user (admin only)
**Auth Required:** Yes (Admin)

### GET /users/bookings/:user_id
Get all bookings for a user(user)
**Auth Required:** Yes

---

## 2. Destinations Route (`/destinations`)

### GET /destinations
List all destinations with pagination and filters
**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `country`: Filter by country
- `name`: Search by name (partial match)

### GET /destinations/:id
Get single destination details

### GET /destinations/:id/packages
Get all packages for a destination

### POST /destinations (Admin Only)
Create new destination
```json
{
  "name": "Manali",
  "country": "India",
  "description": "Beautiful hill station",
  "image": "manali.jpg"
}
```

### PUT /destinations/:id (Admin Only)
Update destination

### DELETE /destinations/:id (Admin Only)
Delete destination

---

## 3. Packages Route (`/packages`)

### GET /packages(users only)
List all packages with pagination and filters
**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `dest_id`: Filter by destination
- `title`: Search by title
- `duration_days`: Filter by duration

### GET /packages/:id(users only)
Get package details

### GET /packages/:id/dates
Get all available dates for a package

### GET /packages/:id/itineraries
Get itinerary for a package

### POST /packages (Admin Only)
Create new package
```json
{
  "title": "Manali Adventure",
  "dest_id": 1,
  "duration_days": 5,
  "base_price": 10000,
  "max_people": 10,
  "description": "Amazing adventure package"
}
```

### PUT /packages/:id (Admin Only)
Update package details

### DELETE /packages/:id (Admin Only)
Delete package

---

## 4. Package Master Route (`/packageMaster`)

### GET /packageMaster
List all packages with destination info

### GET /packageMaster/:id
Get package details with destination

### GET /packageMaster/:id/itineraries
Get itineraries for package

### GET /packageMaster/:id/dates
Get available dates for package

### POST /packageMaster/:id/dates (Admin Only)
Add available package date
```json
{
  "start_date": "2026-02-01",
  "end_date": "2026-02-05",
  "seats_total": 20,
  "price_override": 12000
}
```

### PUT /packageMaster/:id/dates/:date_id (Admin Only)
Update package date/pricing

### DELETE /packageMaster/:id/dates/:date_id (Admin Only)
Delete package date

### POST /packageMaster/:id/itineraries (Admin Only)
Add itinerary for a day
```json
{
  "day_number": 1,
  "title": "Day 1: Arrival",
  "details": "Arrive and settle in hotel"
}
```

### PUT /packageMaster/:id/itineraries/:itinerary_id (Admin Only)
Update itinerary

### DELETE /packageMaster/:id/itineraries/:itinerary_id (Admin Only)
Delete itinerary

---

## 5. Package Itinerary Route (`/packageItenerary`)

### GET /packageItenerary
List all itineraries with pagination and filters
**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `package_id`: Filter by package

### GET /packageItenerary/:id
Get single itinerary details

### GET /packageItenerary/package/:package_id
Get all itineraries for a package (ordered by day)

### POST /packageItenerary (Admin Only)
Create itinerary
```json
{
  "package_id": 1,
  "day_number": 1,
  "title": "Day 1: Arrival",
  "details": "Arrival and check-in"
}
```

### PUT /packageItenerary/:id (Admin Only)
Update itinerary

### DELETE /packageItenerary/:id (Admin Only)
Delete single itinerary

### DELETE /packageItenerary/package/:package_id (Admin Only)
Delete all itineraries for a package

---

## 6. Bookings Route (`/bookings`)

### GET /bookings
List bookings with filters (non-admins see only their own)
**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `user_id`: Filter by user (admin only)
- `status`: Filter by status (pending, confirmed, cancelled, completed)
- `package_date_id`: Filter by package date

### GET /bookings/:id
Get single booking details with full trip info

### GET /bookings/user/:user_id
Get all bookings for a specific user

### POST /bookings
Create new booking
```json
{
  "package_date_id": 1,
  "persons": 2,
  "total_price": 20000,
  "contact_phone": "1234567890",
  "notes": "Special requirements"
}
```
**Validation:**
- Checks seat availability
- Validates package max_people limit
- Ensures future date
- Updates seats_booked automatically

### PUT /bookings/:id
Update booking (persons, phone, notes)
- Non-admins cannot change status

### PUT /bookings/:id/confirm (Admin Only)
Confirm pending booking

### PUT /bookings/:id/cancel
Cancel booking (user can cancel own, admin any)
- Automatically refunds seats

### PUT /bookings/:id/complete (Admin Only)
Mark booking as completed

### DELETE /bookings/:id (Admin Only)
Delete booking with seat refund

---

## 7. Payments Route (`/payments`)

### GET /payments
List payments with filters (non-admins see only their own)
**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `booking_id`: Filter by booking
- `status`: Filter by status (success, failed, pending)
- `method`: Filter by method (card, upi, netbanking, cash, other)

### GET /payments/:id
Get single payment with booking and package details

### GET /payments/booking/:booking_id
Get all payments for a specific booking

### GET /payments/booking/:booking_id/summary
Get comprehensive payment summary
**Response:**
```json
{
  "booking_id": 1,
  "booking_total": 20000,
  "total_paid": 15000,
  "balance_due": 5000,
  "payment_status": "partial",
  "total_payments": 2,
  "successful_payments": 1,
  "failed_payments": 1,
  "pending_payments": 0,
  "first_payment_date": "2026-01-15",
  "last_payment_date": "2026-01-18"
}
```

### POST /payments
Create new payment
```json
{
  "booking_id": 1,
  "amount": 10000,
  "method": "card",
  "txn_reference": "TXN123456"
}
```
**Validation:**
- Verifies booking exists and belongs to user
- Checks amount doesn't exceed booking total
- Prevents payment for cancelled bookings
- Prevents exceeding remaining balance

### PUT /payments/:id
Update payment (status, txn_reference - admin only)
```json
{
  "status": "success",
  "txn_reference": "TXN789012"
}
```

### PUT /payments/:id/confirm (Admin Only)
Confirm payment
- Changes status to success
- Auto-confirms booking if full payment received

### PUT /payments/:id/reject (Admin Only)
Reject/fail payment
- Cannot reject already confirmed payments

### DELETE /payments/:id (Admin Only)
Delete payment
- Cannot delete confirmed payments (audit trail protection)

---

## 8. Reviews Route (`/reviews`)

### GET /reviews
List all reviews with pagination and filters
**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `package_id`: Filter by package
- `user_id`: Filter by reviewer
- `min_rating`: Filter by minimum rating
- `max_rating`: Filter by maximum rating

### GET /reviews/:id
Get single review details

### GET /reviews/package/:package_id
Get all reviews for a package with average rating
**Response:**
```json
{
  "package_id": 1,
  "average_rating": 4.5,
  "total_reviews": 4,
  "reviews": [...]
}
```

### POST /reviews
Create new review
```json
{
  "package_id": 1,
  "booking_id": 1,
  "rating": 5,
  "title": "Amazing Experience",
  "comment": "Best trip ever!"
}
```
**Validation:**
- User must own the booking
- Booking must be confirmed or completed
- Only one review per booking
- Rating must be 1-5

### PUT /reviews/:id
Update review (user can update own, admin any)
```json
{
  "rating": 4,
  "title": "Updated title",
  "comment": "Updated comment"
}
```

### DELETE /reviews/:id
Delete review (user can delete own, admin any)

---

## Database Schema

### 1. users
- user_id (PK)
- email (UNIQUE)
- password_hash
- full_name
- phone
- role (user/admin)
- created_at, updated_at

### 2. destinations
- dest_id (PK)
- name, country
- description
- image
- created_at
- UNIQUE(name, country)

### 3. packages
- package_id (PK)
- title, dest_id (FK)
- duration_days
- base_price, max_people
- description
- created_by (FK users)
- created_at

### 4. package_dates
- package_date_id (PK)
- package_id (FK)
- start_date, end_date
- seats_total, seats_booked
- price_override
- is_active
- created_at

### 5. package_itineraries
- itinerary_id (PK)
- package_id (FK)
- day_number
- title, details
- UNIQUE(package_id, day_number)

### 6. bookings
- booking_id (PK)
- user_id (FK)
- package_date_id (FK)
- booked_on
- persons
- total_price
- status (pending/confirmed/cancelled/completed)
- contact_phone
- notes
- updated_at

### 7. payments
- payment_id (PK)
- booking_id (FK)
- paid_on
- amount
- method (card/upi/netbanking/cash/other)
- status (success/failed/pending)
- txn_reference

### 8. reviews (NEW)
- review_id (PK)
- package_id (FK)
- booking_id (FK, UNIQUE)
- user_id (FK)
- rating (1-5)
- title, comment
- created_at, updated_at
- UNIQUE(booking_id)

---

## Response Format

All API responses follow this standard format:

```json
{
  "error": null,
  "data": {
    // response data
  }
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "data": null
}
```

---

## Authentication

All protected routes require the `user_id` header:
```
Headers:
user_id: <numeric_user_id>
```

Token is obtained from `/users/signin` response.

---

## Authorization

| Feature | Guest | User | Admin |
|---------|-------|------|-------|
| GET destinations | ✓ | ✓ | ✓ |
| POST/PUT/DELETE destinations | ✗ | ✗ | ✓ |
| Create booking | ✗ | ✓ | ✓ |
| View own bookings | ✗ | ✓ | ✓ |
| View all bookings | ✗ | ✗ | ✓ |
| Cancel own booking | ✗ | ✓ | ✓ |
| Admin booking ops | ✗ | ✗ | ✓ |
| Create payment | ✗ | ✓* | ✓ |
| View own payments | ✗ | ✓ | ✓ |
| View all payments | ✗ | ✗ | ✓ |
| Confirm/reject payment | ✗ | ✗ | ✓ |
| Create review | ✗ | ✓* | ✓ |
| Update own review | ✗ | ✓ | ✓ |
| Delete own review | ✗ | ✓ | ✓ |
| Admin review ops | ✗ | ✗ | ✓ |

\* Users can only manage their own bookings/payments/reviews

---

## Status Codes

- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Totals

- **Routes:** 8
- **Endpoints:** 60+
- **Database Tables:** 8
- **Features:** Complete travel booking system with payments and reviews
