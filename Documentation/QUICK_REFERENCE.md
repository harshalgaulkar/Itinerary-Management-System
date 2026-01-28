# IMS Backend - Quick Reference Guide

## Routes Summary

### 1. /users (7 endpoints)
```
POST   /users/signin              - User login
POST   /users/signup              - User registration
GET    /users/profile/:user_id    - Get user profile
GET    /users                     - Get all users (admin)
PUT    /users/update/:user_id     - Update user info
DELETE /users/delete/:user_id     - Delete user (admin)
GET    /users/bookings/:user_id   - Get user's bookings
```

### 2. /destinations (6 endpoints)
```
GET    /destinations              - List destinations (paginated)
GET    /destinations/:id          - Get destination details
GET    /destinations/:id/packages - Get packages for destination
POST   /destinations              - Create destination (admin)
PUT    /destinations/:id          - Update destination (admin)
DELETE /destinations/:id          - Delete destination (admin)
```

### 3. /packages (6 endpoints)
```
GET    /packages                  - List packages (paginated)
GET    /packages/:id              - Get package details
GET    /packages/:id/dates        - Get package dates
GET    /packages/:id/itineraries  - Get package itinerary
POST   /packages                  - Create package (admin)
PUT    /packages/:id              - Update package (admin)
DELETE /packages/:id              - Delete package (admin)
```

### 4. /packageMaster (11 endpoints)
```
GET    /packageMaster             - List packages with destination
GET    /packageMaster/:id         - Get package with destination
GET    /packageMaster/:id/itineraries  - Get itineraries
GET    /packageMaster/:id/dates   - Get available dates
POST   /packageMaster/:id/dates   - Add package date (admin)
PUT    /packageMaster/:id/dates/:date_id  - Update date (admin)
DELETE /packageMaster/:id/dates/:date_id  - Delete date (admin)
POST   /packageMaster/:id/itineraries    - Add itinerary (admin)
PUT    /packageMaster/:id/itineraries/:id - Update itinerary (admin)
DELETE /packageMaster/:id/itineraries/:id - Delete itinerary (admin)
```

### 5. /packageItenerary (7 endpoints)
```
GET    /packageItenerary          - List itineraries (paginated)
GET    /packageItenerary/:id      - Get itinerary details
GET    /packageItenerary/package/:package_id  - Get package itineraries
POST   /packageItenerary          - Create itinerary (admin)
PUT    /packageItenerary/:id      - Update itinerary (admin)
DELETE /packageItenerary/:id      - Delete itinerary (admin)
DELETE /packageItenerary/package/:package_id - Delete all itineraries (admin)
```

### 6. /bookings (9 endpoints)
```
GET    /bookings                  - List bookings (filtered by user if not admin)
GET    /bookings/:id              - Get booking details
GET    /bookings/user/:user_id    - Get user's bookings
POST   /bookings                  - Create booking
PUT    /bookings/:id              - Update booking
PUT    /bookings/:id/confirm      - Confirm booking (admin)
PUT    /bookings/:id/cancel       - Cancel booking
PUT    /bookings/:id/complete     - Mark as completed (admin)
DELETE /bookings/:id              - Delete booking (admin)
```

### 7. /payments (9 endpoints) ✨ NEW
```
GET    /payments                  - List payments (filtered by user if not admin)
GET    /payments/:id              - Get payment details
GET    /payments/booking/:booking_id  - Get booking's payments
GET    /payments/booking/:booking_id/summary  - Get payment summary
POST   /payments                  - Create payment
PUT    /payments/:id              - Update payment (admin)
PUT    /payments/:id/confirm      - Confirm payment (admin)
PUT    /payments/:id/reject       - Reject payment (admin)
DELETE /payments/:id              - Delete payment (admin)
```

### 8. /reviews (6 endpoints) ✨ NEW
```
GET    /reviews                   - List reviews (with filters)
GET    /reviews/:id               - Get review details
GET    /reviews/package/:package_id  - Get package reviews with avg rating
POST   /reviews                   - Create review
PUT    /reviews/:id               - Update review
DELETE /reviews/:id               - Delete review
```

---

## Authentication Header

```
All protected routes require:
user_id: <numeric_user_id>
```

---

## Common Request/Response Examples

### Signin
**Request:**
```json
POST /users/signin
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "error": null,
  "data": {
    "token": "eyJhbGc...",
    "user_id": 1,
    "full_name": "John Doe",
    "email": "user@example.com",
    "phone": "1234567890",
    "role": "user"
  }
}
```

### Create Booking
**Request:**
```json
POST /bookings
Header: user_id: 1

{
  "package_date_id": 1,
  "persons": 2,
  "total_price": 20000,
  "contact_phone": "1234567890",
  "notes": "Special dietary requirements"
}
```

**Response:**
```json
{
  "error": null,
  "data": {
    "booking_id": 5,
    "message": "Booking created successfully"
  }
}
```

### Make Payment
**Request:**
```json
POST /payments
Header: user_id: 1

{
  "booking_id": 1,
  "amount": 10000,
  "method": "card",
  "txn_reference": "TXN123456789"
}
```

**Response:**
```json
{
  "error": null,
  "data": {
    "payment_id": 3,
    "message": "Payment created successfully"
  }
}
```

### Get Payment Summary
**Request:**
```
GET /payments/booking/1/summary
Header: user_id: 1
```

**Response:**
```json
{
  "error": null,
  "data": {
    "booking_id": 1,
    "booking_total": 20000,
    "total_paid": 15000,
    "balance_due": 5000,
    "payment_status": "partial",
    "total_payments": 2,
    "successful_payments": 1,
    "failed_payments": 1,
    "pending_payments": 0,
    "first_payment_date": "2026-01-15T10:30:00Z",
    "last_payment_date": "2026-01-18T14:45:30Z"
  }
}
```

### Create Review
**Request:**
```json
POST /reviews
Header: user_id: 1

{
  "package_id": 1,
  "booking_id": 1,
  "rating": 5,
  "title": "Amazing Experience!",
  "comment": "The best trip I've ever been on. Amazing hotels and great guides."
}
```

**Response:**
```json
{
  "error": null,
  "data": {
    "review_id": 2,
    "message": "Review created successfully"
  }
}
```

### Get Package Reviews
**Request:**
```
GET /reviews/package/1
```

**Response:**
```json
{
  "error": null,
  "data": {
    "package_id": 1,
    "average_rating": 4.5,
    "total_reviews": 4,
    "reviews": [
      {
        "review_id": 1,
        "user_id": 1,
        "rating": 5,
        "title": "Amazing!",
        "comment": "Best trip ever",
        "full_name": "John Doe",
        "email": "john@example.com",
        "created_at": "2026-01-15T10:30:00Z"
      },
      ...
    ]
  }
}
```

---

## Booking Status Workflow

```
pending → confirmed → completed
   ↓
cancelled
```

- **pending**: Initial state when booking is created
- **confirmed**: Admin confirms or full payment received
- **completed**: Admin marks trip as completed
- **cancelled**: User or admin cancels the booking

---

## Payment Status Workflow

```
pending → success (or) failed
```

- **pending**: Initial state
- **success**: Payment confirmed by admin
- **failed**: Payment rejected by admin

---

## Query Parameters

### Pagination
```
?page=1&limit=10
```
- Default page: 1
- Default limit: 10
- Max limit: 100

### Filtering Examples
```
GET /bookings?status=confirmed&user_id=1
GET /destinations?country=India&name=Manali
GET /reviews?package_id=1&min_rating=4
GET /payments?booking_id=1&method=card
```

---

## HTTP Status Codes

- **200** - Success
- **400** - Bad Request (validation failed)
- **401** - Unauthorized (missing auth)
- **403** - Forbidden (insufficient permission)
- **404** - Not Found
- **500** - Server Error

---

## Features by Role

| Feature | User | Admin |
|---------|------|-------|
| View own profile | ✓ | ✓ |
| View all users | ✗ | ✓ |
| Create booking | ✓ | ✓ |
| View own bookings | ✓ | ✓ |
| View all bookings | ✗ | ✓ |
| Cancel own booking | ✓ | ✓ |
| Confirm/complete booking | ✗ | ✓ |
| Create payment | ✓ | ✓ |
| View own payments | ✓ | ✓ |
| View all payments | ✗ | ✓ |
| Confirm/reject payment | ✗ | ✓ |
| Create review | ✓ | ✓ |
| Update own review | ✓ | ✓ |
| Update any review | ✗ | ✓ |
| Delete own review | ✓ | ✓ |
| Delete any review | ✗ | ✓ |
| Manage destinations | ✗ | ✓ |
| Manage packages | ✗ | ✓ |
| Manage itineraries | ✗ | ✓ |

---

## Starting the Server

```bash
cd IMSBackend
node Server.js
```

Server runs on: `http://localhost:4000`

---

## Important Notes

1. **Password Hashing**: Passwords are hashed with bcrypt (10 rounds)
2. **JWT Token**: Provided in signin/signup response
3. **Email Unique**: Each email can only be registered once
4. **One Review Per Booking**: Users can only review a booking once
5. **Seat Management**: Seats are automatically updated on booking/cancellation
6. **Full Payment Auto-confirm**: Bookings are auto-confirmed when full payment is received
7. **Audit Trail**: Confirmed payments cannot be deleted
8. **Authorization**: All protected routes check user_id header

---

## File Structure

```
IMSBackend/
├── Server.js                    - Main server file
├── routes/
│   ├── user.js                 - User management
│   ├── destinations.js         - Destinations
│   ├── packages.js             - Package listing
│   ├── packagemaster.js        - Package management
│   ├── packageItenerary.js     - Itinerary management
│   ├── bookings.js             - Booking management
│   ├── payments.js             - Payment processing
│   └── reviews.js              - Review system
├── utils/
│   ├── db.js                   - Database connection
│   ├── config.js               - Configuration
│   ├── authuser.js             - Auth middleware
│   └── result.js               - Response formatter
├── API_DOCUMENTATION.md         - Full API docs
└── IMPLEMENTATION_SUMMARY.md    - What was built
```

---

## Common Errors & Solutions

### "Validation error: Email already registered"
- User already exists with this email
- Use different email or signin instead

### "Unauthorized: Admin access required"
- User is not an admin
- Only admins can perform this action

### "Cannot book for a past date"
- Package start date is in the past
- Choose a future date

### "Only X seats available"
- Not enough seats for requested persons
- Reduce persons or choose different date

### "Cannot review a booking that is not confirmed or completed"
- Booking status is pending or cancelled
- Wait for booking confirmation

### "You have already reviewed this booking"
- One review per booking limit
- Update existing review or delete and create new one

---

## Testing Commands

### Create Test User
```bash
curl -X POST http://localhost:4000/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "phone": "1234567890"
  }'
```

### Get All Destinations
```bash
curl http://localhost:4000/destinations
```

### Create Booking
```bash
curl -X POST http://localhost:4000/bookings \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "package_date_id": 1,
    "persons": 2,
    "total_price": 20000,
    "contact_phone": "1234567890"
  }'
```

---

**Happy Coding! 🚀**
