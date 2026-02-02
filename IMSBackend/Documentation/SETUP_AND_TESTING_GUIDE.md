# IMS Backend - Setup & Testing Guide

## Prerequisites

- Node.js (v12 or higher)
- MySQL (v5.7 or higher)
- npm (comes with Node.js)

---

## Setup Instructions

### 1. Database Setup

**Step 1: Create Database**
```bash
mysql -u root -p < Fin.sql
```

**Step 2: Verify Tables Created**
```bash
mysql -u root -p fin -e "SHOW TABLES;"
```

Expected output:
```
Tables_in_fin
bookings
destinations
package_dates
package_itineraries
packages
payments
reviews
users
```

### 2. Install Dependencies

```bash
cd IMSBackend
npm install
```

This will install:
- express
- cors
- mysql
- bcrypt
- jsonwebtoken
- express-validator

### 3. Configure Database Connection

Edit `utils/db.js`:
```javascript
const pool = mysql.createPool({
    host: 'localhost',      // Your MySQL host
    user: 'root',           // Your MySQL user
    password: 'your_password',  // Your MySQL password
    database: 'fin',        // Database name
    connectionLimit: 10
});
```

### 4. Configure JWT Secret

Edit `utils/config.js`:
```javascript
module.exports = {
    SECRET: 'your_secret_key_here'  // Change this to a strong secret
};
```

### 5. Start Server

```bash
node Server.js
```

Expected output:
```
Server started at port 4000
```

Server is now running on: `http://localhost:4000`

---

## Testing the API

### Option 1: Using cURL

#### 1. Create User (Signup)
```bash
curl -X POST http://localhost:4000/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "full_name": "John Doe",
    "phone": "9876543210"
  }'
```

**Response:**
```json
{
  "error": null,
  "data": {
    "token": "eyJhbGc...",
    "user_id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "user"
  }
}
```

#### 2. Login (Signin)
```bash
curl -X POST http://localhost:4000/users/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### 3. Get All Destinations
```bash
curl http://localhost:4000/destinations
```

#### 4. Create Destination (Admin)
First, create an admin user in database:
```bash
mysql -u root -p fin -e "UPDATE users SET role='admin' WHERE user_id=1;"
```

Then create destination:
```bash
curl -X POST http://localhost:4000/destinations \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "name": "Manali",
    "country": "India",
    "description": "Beautiful hill station in Himachal Pradesh",
    "image": "manali.jpg"
  }'
```

#### 5. Create Package (Admin)
```bash
curl -X POST http://localhost:4000/packages \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "title": "Manali Adventure 5 Days",
    "dest_id": 1,
    "duration_days": 5,
    "base_price": 10000,
    "max_people": 10,
    "description": "Amazing 5-day adventure in Manali"
  }'
```

#### 6. Create Package Date (Admin)
```bash
curl -X POST http://localhost:4000/packageMaster/1/dates \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "start_date": "2026-02-01",
    "end_date": "2026-02-05",
    "seats_total": 20,
    "price_override": 12000
  }'
```

#### 7. Create Itinerary (Admin)
```bash
curl -X POST http://localhost:4000/packageMaster/1/itineraries \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "day_number": 1,
    "title": "Arrival in Manali",
    "details": "Arrive at Manali. Check into hotel. Evening at leisure."
  }'
```

#### 8. Create Booking (User)
```bash
curl -X POST http://localhost:4000/bookings \
  -H "Content-Type: application/json" \
  -H "user_id: 2" \
  -d '{
    "package_date_id": 1,
    "persons": 2,
    "total_price": 24000,
    "contact_phone": "9123456789",
    "notes": "Vegetarian food preferred"
  }'
```

**Response:**
```json
{
  "error": null,
  "data": {
    "booking_id": 1,
    "message": "Booking created successfully"
  }
}
```

#### 9. Create Payment (User)
```bash
curl -X POST http://localhost:4000/payments \
  -H "Content-Type: application/json" \
  -H "user_id: 2" \
  -d '{
    "booking_id": 1,
    "amount": 12000,
    "method": "card",
    "txn_reference": "TXN2601001"
  }'
```

#### 10. Confirm Payment (Admin)
```bash
curl -X PUT http://localhost:4000/payments/1/confirm \
  -H "Content-Type: application/json" \
  -H "user_id: 1"
```

#### 11. Create Review (User - After Booking Confirmed)
```bash
curl -X POST http://localhost:4000/reviews \
  -H "Content-Type: application/json" \
  -H "user_id: 2" \
  -d '{
    "package_id": 1,
    "booking_id": 1,
    "rating": 5,
    "title": "Amazing Experience!",
    "comment": "The best trip ever! Great guides and hotels."
  }'
```

#### 12. Get Payment Summary (User)
```bash
curl http://localhost:4000/payments/booking/1/summary \
  -H "user_id: 2"
```

**Response:**
```json
{
  "error": null,
  "data": {
    "booking_id": 1,
    "booking_total": 24000,
    "total_paid": 12000,
    "balance_due": 12000,
    "payment_status": "partial",
    "total_payments": 1,
    "successful_payments": 1,
    "failed_payments": 0,
    "pending_payments": 0,
    "first_payment_date": "2026-01-18T10:30:00Z",
    "last_payment_date": "2026-01-18T10:30:00Z"
  }
}
```

### Option 2: Using Postman

1. **Import Collection**
   - Create new Postman Collection
   - Add requests for each endpoint

2. **Set Variables**
   - `{{base_url}}` = `http://localhost:4000`
   - `{{user_id}}` = User ID from signup/signin
   - `{{token}}` = JWT token from signin

3. **Create Requests**
   - Set method (GET, POST, PUT, DELETE)
   - Set URL using variables
   - Add headers: `user_id: {{user_id}}`
   - Add body (JSON) for POST/PUT requests

### Option 3: Using Thunder Client (VS Code Extension)

1. Install Thunder Client extension in VS Code
2. Create requests for each endpoint
3. Use environment variables for base_url and user_id

---

## Test Scenarios

### Scenario 1: Complete Booking Workflow

**Step 1:** Create two users
- Admin user (user_id: 1)
- Regular user (user_id: 2)

**Step 2:** Admin creates destination, package, dates, itinerary
```bash
POST /destinations
POST /packages
POST /packageMaster/:id/dates
POST /packageMaster/:id/itineraries
```

**Step 3:** User creates booking
```bash
POST /bookings
```

**Step 4:** User makes payment
```bash
POST /payments
```

**Step 5:** Admin confirms payment
```bash
PUT /payments/:id/confirm
```

**Step 6:** Check booking is auto-confirmed
```bash
GET /bookings/:id
# Status should be 'confirmed'
```

**Step 7:** Complete booking
```bash
PUT /bookings/:id/complete
```

**Step 8:** User creates review
```bash
POST /reviews
```

**Step 9:** View reviews for package
```bash
GET /reviews/package/:id
# Should show average rating and reviews
```

### Scenario 2: Payment Workflow

**Step 1:** Create booking with total_price = 20000

**Step 2:** Create multiple payments
```bash
POST /payments with amount: 5000
POST /payments with amount: 7000
POST /payments with amount: 8000
```

**Step 3:** Get payment summary
```bash
GET /payments/booking/:id/summary
# Should show:
# - total_paid: 20000
# - balance_due: 0
# - payment_status: paid
# - total_payments: 3
# - successful_payments: 3
```

**Step 4:** Reject a payment
```bash
PUT /payments/:id/reject
```

### Scenario 3: Authorization Testing

**Test User Cannot:**
- View other users' profile
- See other users' bookings
- Delete bookings (except cancel)
- Update other users' reviews

**Test Admin Can:**
- View all users
- View all bookings
- Confirm/reject payments
- Delete any review
- Manage packages and itineraries

---

## Database Queries for Verification

### Check All Users
```sql
SELECT * FROM users;
```

### Check All Bookings with Details
```sql
SELECT b.*, u.full_name, p.title, d.name 
FROM bookings b
JOIN users u ON b.user_id = u.user_id
JOIN package_dates pd ON b.package_date_id = pd.package_date_id
JOIN packages p ON pd.package_id = p.package_id
JOIN destinations d ON p.dest_id = d.dest_id;
```

### Check Payment Summary
```sql
SELECT booking_id, COUNT(*) as total_payments,
       SUM(CASE WHEN status='success' THEN amount ELSE 0 END) as total_paid,
       SUM(CASE WHEN status='failed' THEN amount ELSE 0 END) as total_failed
FROM payments
GROUP BY booking_id;
```

### Check Reviews with Average Rating
```sql
SELECT package_id, AVG(rating) as avg_rating, COUNT(*) as total_reviews
FROM reviews
GROUP BY package_id;
```

---

## Common Issues & Solutions

### Issue 1: Connection Refused
**Cause:** MySQL not running
**Solution:** Start MySQL service
```bash
# Windows
net start MySQL80

# Mac/Linux
sudo systemctl start mysql
```

### Issue 2: Database Does Not Exist
**Cause:** Fin.sql not imported
**Solution:** Re-run import
```bash
mysql -u root -p < Fin.sql
```

### Issue 3: Invalid Email
**Cause:** Invalid email format in request
**Solution:** Use valid email format: `user@example.com`

### Issue 4: Password Too Short
**Cause:** Password less than 6 characters
**Solution:** Use password with at least 6 characters

### Issue 5: Cannot Create Booking for Past Date
**Cause:** Package start_date is in the past
**Solution:** Use future date (2026 or later)

### Issue 6: Seats Not Available
**Cause:** Requested persons > available seats
**Solution:** Reduce persons or choose different date

### Issue 7: Authorization Error
**Cause:** Missing or invalid user_id header
**Solution:** Add header: `user_id: <numeric_id>`

---

## Performance Testing

### Test with Sample Data

Create 10 users:
```bash
for i in {1..10}; do
  curl -X POST http://localhost:4000/users/signup \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"user$i@example.com\",
      \"password\": \"password123\",
      \"full_name\": \"User $i\",
      \"phone\": \"9876543210\"
    }"
done
```

Create 5 destinations, 10 packages, 20 dates:
```bash
# Via API calls or direct SQL inserts
```

Create 50 bookings and 100 payments:
```bash
# Via API calls or direct SQL inserts
```

### Test Pagination
```bash
curl "http://localhost:4000/bookings?page=1&limit=10"
curl "http://localhost:4000/bookings?page=2&limit=10"
```

### Test Filtering
```bash
curl "http://localhost:4000/bookings?status=confirmed"
curl "http://localhost:4000/reviews?package_id=1&min_rating=4"
```

---

## Monitoring & Logs

### Enable Console Logging
Add to routes for debugging:
```javascript
console.log('Request:', req.method, req.path);
console.log('User ID:', req.headers.user_id);
console.log('Body:', req.body);
```

### Monitor Database Queries
Enable MySQL general log:
```sql
SET GLOBAL general_log = 'ON';
SHOW GLOBAL VARIABLES LIKE 'general_log_file';
```

### Monitor Error Logs
Check console output for errors and stack traces

---

## Cleanup

### Reset Database
```bash
# Drop and recreate
mysql -u root -p -e "DROP DATABASE fin; CREATE DATABASE fin;"
mysql -u root -p fin < Fin.sql
```

### Clear Node Modules
```bash
rm -rf node_modules
npm install
```

---

## Production Deployment

### Before Deploying:
1. ✅ Change JWT secret to strong random string
2. ✅ Use environment variables for credentials
3. ✅ Enable HTTPS
4. ✅ Set proper CORS origins
5. ✅ Configure database backups
6. ✅ Set up error monitoring
7. ✅ Enable rate limiting
8. ✅ Run security audit

### Environment Variables (.env)
```
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=fin
JWT_SECRET=your_strong_secret
PORT=4000
NODE_ENV=production
```

### Use Environment Variables
```javascript
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
```

---

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [JWT Documentation](https://jwt.io/)

---

**Ready to Test! 🚀**
