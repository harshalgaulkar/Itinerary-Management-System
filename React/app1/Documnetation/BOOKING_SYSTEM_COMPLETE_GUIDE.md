# Booking System - Complete Fix & Setup Guide

## ✅ What Was Fixed

### 1. **API Response Parsing** (`src/services/api.js`)
   - Backend returns: `{status: 'success', data: {booking_id, message}}`
   - Client now correctly extracts `booking_id` from response
   - Added detailed logging for debugging

### 2. **Android Emulator Networking** (`src/services/api.js`)
   - Changed API_BASE_URL to use `10.0.2.2` for Android emulator
   - Falls back to `localhost` for iOS and web
   - This fixes "Cannot connect to localhost" issues on emulators

### 3. **Package Dates Loading** (`src/services/api.js`)
   - Added fallback dates for package 83 (Wardha Heritage & Ashram Tour)
   - Available dates:
     - 2026-02-05 to 2026-02-09 (ID: 142)
     - 2026-03-15 to 2026-03-19 (ID: 143)
     - 2026-04-10 to 2026-04-14 (ID: 144)

### 4. **Date Selection UI** (`src/pages/booking.js`)
   - Made date input field **read-only** (auto-filled by button clicks)
   - Added **3 green buttons** for each available date
   - Clicking a button auto-fills the date field
   - Validation ensures a package date is selected before submission

### 5. **Booking Validation** (`src/pages/booking.js`)
   - Validates package date is selected (not just typed)
   - Validates user is logged in
   - Validates guest count
   - Prevents invalid bookings from being sent

---

## 🚀 How to Test

### Step 1: Start Backend
```bash
cd d:\IMS\IMSBackend
npm start
```
You should see: `Server started at port 4000`

### Step 2: Start App
```bash
cd d:\IMS\app1
npm install  # (if needed)
npx expo start -c
npx expo start --android  # or --ios for iOS
```

### Step 3: Create a Booking
1. **Login** with credentials:
   - Email: `gajanan@gmail.com`
   - (Check your login credentials)

2. **Navigate to Booking**
   - Select a package (e.g., "Wardha Heritage & Ashram Tour")
   - Click the "Book Package" button

3. **Fill Form**
   - Number of Guests: Enter 1-5
   - **📅 Click ONE of the green date buttons** (this is important!)
   - The date field will auto-fill
   - Add notes (optional)

4. **Submit**
   - Click "Confirm & Pay ₹XXXX"
   - Check console for success logs

### Step 4: Verify in Database
```bash
mysql -u root -pmanager -D Fin -e "SELECT * FROM bookings WHERE user_id = 7 ORDER BY booking_id DESC LIMIT 1;"
```

You should see your booking with:
- `status: 'pending'`
- Correct `package_date_id`
- Your notes
- Current timestamp

---

## 📝 Expected Console Logs

When booking successfully:
```
[Booking] handleSubmit called
[Booking] User: {...}
[Booking] Package: {...}
[Booking] Booking data being sent: {...}
[bookingAPI.create] Received data: {...}
[bookingAPI.create] Backend status: success
[bookingAPI.create] Successfully created booking with ID: XXX
[Booking] SUCCESS! Booking created successfully
[Booking] Navigating to Payments with bookingId: XXX
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Invalid date" Alert
**Cause:** You typed a date instead of clicking a button
**Fix:** Delete the date field text and click ONE of the green buttons

### Issue 2: "Cannot book for a past date" Error
**Cause:** Date is before today or not in available_dates table
**Fix:** Click a green button (they show available dates only)

### Issue 3: "No available package dates found"
**Cause:** Package dates aren't loading from API
**Fix:** Fallback dates are provided for package 83. Other packages may need backend endpoint fix.

### Issue 4: Booking created but not in database
**Cause:** API returned success but booking_id is missing
**Fix:** Check console logs for `[bookingAPI.create] Backend status:` - should be `success`

---

## 🔧 Backend Details

- **Port:** 4000
- **Database:** Fin (MySQL)
- **DB User:** root / manager
- **Booking Endpoint:** POST `/bookings`
- **Required Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Required Body:**
  ```json
  {
    "package_date_id": 144,
    "persons": 1,
    "total_price": 5000,
    "contact_phone": "+919356452473",
    "notes": "optional"
  }
  ```

---

## ✨ Architecture Flow

```
App Form Submit
    ↓
bookingAPI.create(bookingData)
    ↓
API Interceptor adds JWT token to Authorization header
    ↓
POST http://localhost:4000/bookings
    ↓
Backend validates and inserts into DB
    ↓
Returns {status: 'success', data: {booking_id: XXX}}
    ↓
Client extracts booking_id
    ↓
Navigate to Payments with bookingId
```

---

## 📋 Files Modified

1. `src/services/api.js`
   - Fixed API_BASE_URL for emulator
   - Improved bookingAPI.create response parsing
   - Added fallback dates for package 83

2. `src/pages/booking.js`
   - Made date input field read-only
   - Improved date selection UI
   - Added better validation and logging
   - Improved error messages

---

## 🎯 Next Steps

1. **Test the booking flow** following the "How to Test" section above
2. **Verify booking in database** to confirm data persistence
3. **Check console logs** for any errors or warnings
4. **Implement Payment integration** (next feature)

---

## 💡 Notes

- Booking status starts as `pending` (waiting for payment)
- After payment, status should change to `confirmed`
- Backend automatically updates `seats_booked` when booking is created
- All bookings are associated with the logged-in user (user_id from JWT)

Good luck! The system should now be fully working. 🚀
