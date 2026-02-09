# Payment Backend Setup Instructions

## Overview
The payment processing system requires backend setup in your IMSBackend server.

## Files to Add

### 1. Database Table
**File**: `create_payments_table.sql`
**Action**: Run this SQL script in your MySQL database to create the payments table.

```sql
-- Run in MySQL Workbench or MySQL command line
SOURCE d:\IMS\app1\create_payments_table.sql;
```

### 2. Backend Route File
**File to Copy**: `payments.js` (in app1 root directory)
**Destination**: `d:\IMS\IMSBackend\routes\payments.js`

**Copy Command (Windows PowerShell)**:
```powershell
Copy-Item "d:\IMS\app1\payments.js" "d:\IMS\IMSBackend\routes\payments.js"
```

**Copy Command (Windows CMD)**:
```cmd
copy "d:\IMS\app1\payments.js" "d:\IMS\IMSBackend\routes\payments.js"
```

### 3. Register Route in Backend Server

**Edit File**: `d:\IMS\IMSBackend\Server.js`

**Find the routes section** (around line 20-50) that looks like:
```javascript
// Routes
app.use('/auth', require('./routes/auth'));
app.use('/packages', require('./routes/packages'));
app.use('/bookings', require('./routes/bookings'));
// ... other routes
```

**Add this line** with other routes:
```javascript
app.use('/payments', require('./routes/payments'));
```

**Complete example**:
```javascript
// Routes
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/packages', require('./routes/packages'));
app.use('/bookings', require('./routes/bookings'));
app.use('/payments', require('./routes/payments'));  // ← ADD THIS LINE
app.use('/packageDates', require('./routes/packageDates'));
app.use('/reviews', require('./routes/reviews'));
// ... other routes
```

## Step-by-Step Setup

### Step 1: Create Database Table
1. Open MySQL Workbench or command line
2. Connect to your database
3. Run the SQL commands from `create_payments_table.sql`
4. Verify table was created:
   ```sql
   DESCRIBE payments;
   SHOW TABLES LIKE 'payments';
   ```

### Step 2: Copy Payment Route to Backend
1. Navigate to `d:\IMS\app1\`
2. Copy `payments.js`
3. Paste to `d:\IMS\IMSBackend\routes\payments.js`

### Step 3: Update Server.js
1. Open `d:\IMS\IMSBackend\Server.js`
2. Find the routes section
3. Add the line: `app.use('/payments', require('./routes/payments'));`
4. Save the file

### Step 4: Restart Backend Server
1. Stop the currently running backend (Ctrl+C)
2. Navigate to backend:
   ```bash
   cd d:\IMS\IMSBackend
   ```
3. Start the server:
   ```bash
   npm start
   # or
   node Server.js
   ```
4. Verify output shows payment route loaded

## API Endpoints Available

### POST /payments/process
Process a payment for a booking
```
Request:
{
  "bookingId": 132,
  "method": "upi",
  "amount": 5000
}

Response:
{
  "success": true,
  "transactionId": "TXN1707411234567ABC123",
  "bookingId": 132,
  "amount": 5000,
  "method": "upi",
  "status": "success"
}
```

### GET /payments/status/:transactionId
Get payment status
```
Example: GET /payments/status/TXN1707411234567ABC123

Response:
{
  "payment_id": 1,
  "transaction_id": "TXN1707411234567ABC123",
  "status": "success",
  "amount": 5000
}
```

### GET /payments/history
Get payment history for logged-in user
```
Response: Array of payment records
```

## Troubleshooting

### Error: "payments table doesn't exist"
- Ensure you ran the SQL script to create the table
- Verify database connection in backend

### Error: "Cannot find module payments"
- Check that `payments.js` was copied to `routes/payments.js` in backend
- Verify file path is correct

### Error: "POST /payments/process 404"
- Ensure the route is mounted in `Server.js`
- Check the line `app.use('/payments', require('./routes/payments'));` exists
- Restart the backend server after making changes

### Error: "Booking not found" when processing payment
- Ensure the bookingId being sent matches an existing booking
- Check user_id header is being sent correctly

## Testing

### Test Payment Processing
1. Create a booking first (bookingId = 132)
2. In payments.js, click "Pay" button
3. Should see "Payment Successful" alert with Transaction ID
4. Check database: `SELECT * FROM payments;`

### Verify Transaction ID Created
```sql
-- In MySQL
USE your_database_name;
SELECT * FROM payments ORDER BY created_at DESC LIMIT 1;
```

Should show:
- transaction_id: TXN followed by timestamp and random characters
- booking_id: matching the booking you paid for
- status: success
- method: card or upi
