# Booking Database Issue - Diagnosis Guide

## Problem
Bookings are not being saved to the backend database after users complete the booking form.

## Root Causes (Most Likely)

### 1. **Incorrect Field Names**
The frontend is sending field names that don't match what the backend expects.

**Frontend sends:**
```json
{
  "package_id": 1,
  "user_id": 2,
  "number_of_seats": 2,
  "travel_date": "2026-02-15",
  "special_requests": "Test",
  "booking_date": "2026-01-23",
  "booking_status": "pending"
}
```

**Check your backend to confirm it expects these exact field names!**

---

## Diagnostic Steps

### Step 1: Test the Booking API
1. Go to: **http://localhost:5173/booking-test**
2. Click the **"Run Booking Test"** button
3. Check the output for:
   - ✓ Shows "BOOKING CREATED SUCCESSFULLY" with booking_id
   - ❌ Shows error message explaining why it failed

### Step 2: Check Browser Console
1. Go to booking page
2. Open Developer Tools (F12)
3. Go to **Console** tab
4. Try to book a package
5. Look for detailed logs showing:
   - Full request payload
   - API response status
   - Error messages if any

The new logs will show:
```
============================================================
📝 BOOKING CREATION STARTED
============================================================
Package ID: 1
User ID: 2
Form data: {...}
📤 Booking payload being sent: {...}
API Endpoint: POST /bookings
```

### Step 3: Verify Backend is Receiving Requests
1. Check your backend logs while submitting a booking
2. Should show incoming POST request to `/bookings`
3. If not seeing the request, there's a connection issue

### Step 4: Check Backend Response
Look for the API response in console logs:
```
✓ Booking API Response: {
  "status": "success",
  "data": {
    "booking_id": 123,
    ...
  }
}
```

If you see an error instead:
```
❌ Booking API Error:
Status: 400
Error data: {
  "error": "Field 'xyz' is required"
}
```

---

## Common Issues & Solutions

### Issue: "Token is Missing"
**Cause:** Backend requires authentication but frontend token is invalid or missing
**Solution:**
1. Make sure you're logged in (check localStorage in console)
2. Token might be expired - try logging out and back in
3. Check backend is sending token properly

### Issue: 400 Bad Request - Field Errors
**Cause:** Field names in request don't match backend expectations
**Solution:**
1. Note which field is causing the error
2. Compare with backend model/schema
3. Update endpoints.js with correct field names
4. Common mismatches:
   - `number_of_seats` vs `num_seats` vs `seats`
   - `booking_status` vs `status`
   - `package_id` vs `packageId`
   - `travel_date` vs `travelDate`

### Issue: 500 Internal Server Error
**Cause:** Backend crashed or has an unhandled error
**Solution:**
1. Check backend console/logs for the error
2. Verify database connection
3. Check for typos in backend code

### Issue: Connection Refused (Port 4000)
**Cause:** Backend server not running
**Solution:**
```bash
# Start backend server
cd path/to/backend
npm start
# OR
node server.js
```

---

## Testing Checklist

Use the **Booking Tester** at `/booking-test` to verify:

- [ ] Can POST to `/bookings` endpoint
- [ ] Response includes booking_id
- [ ] No authentication errors
- [ ] Booking appears when fetching user bookings
- [ ] Backend logs show incoming request
- [ ] Database has new booking record

---

## API Endpoint Details

**Create Booking**
- **URL:** POST `/bookings`
- **Auth Required:** Yes (Bearer token)
- **Request Body:** 
  ```json
  {
    "package_id": number,
    "user_id": number,
    "number_of_seats": number,
    "travel_date": "YYYY-MM-DD",
    "special_requests": "string (optional)",
    "booking_date": "YYYY-MM-DD",
    "booking_status": "pending|confirmed|cancelled"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "status": "success",
    "data": {
      "booking_id": number,
      "package_id": number,
      ...
    }
  }
  ```

**Get User Bookings**
- **URL:** GET `/bookings/user/:userId`
- **Auth Required:** Yes
- **Response:** Array of booking objects

---

## Next Steps

1. **Run the Booking Test** at `/booking-test`
2. **Check the output** for any errors
3. **Report the error message** if booking creation fails
4. **Check browser console** (F12 → Console tab) for detailed logs
5. **Verify backend is running** and database is connected

---

## Files Modified for Debugging

1. **BookingCheckout.jsx** - Enhanced with detailed logging
2. **BookingTester.jsx** - NEW: Tool to test booking API
3. **App.jsx** - Added route `/booking-test`

All console logs now show:
- Full request/response payloads
- Step-by-step progress
- Exact error messages
- Booking IDs when successful
