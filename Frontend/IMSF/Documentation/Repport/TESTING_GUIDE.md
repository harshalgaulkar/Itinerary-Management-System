# 🧪 TESTING GUIDE - CONFIRMED STATUS & PAYMENT FLOW

## ✅ How to Test the CONFIRMED Status Update

### **Step-by-Step Testing Procedure**

#### **Step 1: Create a Booking**
1. Go to http://localhost:5173/packages
2. Select any package
3. Click "Book Package"
4. Fill in booking details:
   - Number of persons: 1-5
   - Contact phone: valid 10-digit number
   - Special requests: (optional)
5. Click "Create Booking"
6. ✅ You should see "Booking successful!" message
7. Go to "My Bookings" from navbar

#### **Step 2: Verify PENDING Status**
1. Open "My Bookings" page
2. Look for your newly created booking
3. ✅ Status badge should show **PENDING** (yellow/orange)
4. You should see **"💳 Pay Now"** button on the booking card

#### **Step 3: Test Payment Processing**
1. Click **"💳 Pay Now"** button on PENDING booking
2. You should be taken to Payment page
3. ✅ Payment form should load WITHOUT errors
4. Form should show:
   - Booking details (package name, amount, etc.)
   - Card payment form
   - Payment method options

#### **Step 4: Fill Payment Form**
```
Test Card Details (ALL FIELDS REQUIRED):
- Card Number: 1234567890123456
- Cardholder Name: admin (or any name, 3+ chars)
- Expiry: 12/25 (MM/YY format)
- CVV: 123
```

1. Enter all card details
2. Select payment method (if multiple options available)
3. Click **"Pay"** button

#### **Step 5: Verify Payment Processing**
Open browser console (F12) and check for these logs:
```
💳 Processing payment for booking: [booking_id]
📤 Creating payment: {payment_data}
✓ Payment created: {response}
🔄 Updating booking status to confirmed...
✓ Booking confirmed response: {response}
✅ Payment and booking confirmation successful!
```

#### **Step 6: Verify Success Page**
1. ✅ You should see "Payment Successful!" message
2. ✅ Booking details should be displayed
3. ✅ Success page should auto-redirect after 3 seconds
4. If not auto-redirecting, click "View My Bookings" button

#### **Step 7: Verify CONFIRMED Status (KEY TEST)**
1. After payment, you're redirected to My Bookings
2. 🟢 **MOST IMPORTANT**: Look for your booking
3. ✅ Status badge should now show **CONFIRMED** (green)
4. ✅ The **"💳 Pay Now"** button should be GONE
5. ✅ Success message should show at top: "✅ Payment successful! Your booking has been confirmed."

### **What Each Status Badge Looks Like**

| Status | Color | Location | Actions |
|--------|-------|----------|---------|
| PENDING | 🟡 Yellow/Orange | Booking card | "💳 Pay Now" button visible |
| CONFIRMED | 🟢 Green | Booking card | "Pay Now" button hidden |
| COMPLETED | 🔵 Blue | (After trip) | Trip completed status |
| CANCELLED | 🔴 Red | (If cancelled) | No actions available |

## 🔍 Debugging the CONFIRMED Status

### **If Status Still Shows PENDING After Payment**

#### **Check 1: Browser Console**
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for error messages in red
4. Expected logs:
   - ✅ "🔄 Refreshing bookings after payment..."
   - ✅ "📋 Fetching bookings for user..."
   - ✅ Success message display

**If you see errors**: Note the error message and report

#### **Check 2: Network Tab**
1. Open Network tab (F12)
2. Look for requests to:
   - POST `/payments` - Should return status 200-201
   - PUT `/bookings/{id}/confirm` - Should return status 200
   - GET `/bookings/user/{userId}` - Should return updated booking
3. Click each request to see:
   - Response status
   - Response body (should show "success")

**Expected Flow**:
```
POST /payments → 200/201 ✅
PUT /bookings/{id}/confirm → 200 ✅
GET /bookings/user/{userId} → 200 ✅ (returns CONFIRMED status)
```

#### **Check 3: Application State**
1. Go to Application tab (F12)
2. Check Local Storage:
   - `token` should exist
   - `userId` should be stored
3. Verify values are correct (not null/undefined)

#### **Check 4: API Response Format**
Look at the actual API response in Network tab:

**Payment Response Should Look Like**:
```json
{
  "status": "success",
  "data": {
    "payment_id": 5,
    "booking_id": 2,
    "amount": 2000.00,
    "status": "completed"
  }
}
```

**Booking Confirm Response Should Look Like**:
```json
{
  "status": "success",
  "data": {
    "booking_id": 2,
    "status": "confirmed",
    "total_price": 2000.00
  }
}
```

**Bookings List Should Show**:
```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "booking_id": 2,
        "status": "confirmed",  // ← THIS SHOULD BE "confirmed"
        "package_title": "Manali",
        "total_price": 2000.00
      }
    ]
  }
}
```

## 🧪 Testing Admin Features

### **Test Admin Booking Management** (/admin/bookings)
1. Log in as admin user
2. Go to http://localhost:5173/admin/bookings
3. You should see:
   - ✅ All bookings in a table
   - ✅ Filter by status
   - ✅ Search by ID/phone
   - ✅ Booking details when clicked
4. Test each action:
   - Click "Manage" button
   - Try "Confirm Booking" on PENDING
   - Try "Cancel Booking" and add reason
   - Try "Mark Complete" on confirmed bookings
5. ✅ Status should update in real-time

### **Test Admin User Profiles** (/admin/user-profiles)
1. Go to http://localhost:5173/admin/user-profiles
2. You should see:
   - ✅ All users in a grid
   - ✅ Search users
   - ✅ User details when clicked
3. Click any user to see:
   - ✅ User's personal info
   - ✅ All their bookings
   - ✅ Booking status and amounts

### **Test Admin Payment History** (/admin/payments)
1. Go to http://localhost:5173/admin/payments
2. You should see:
   - ✅ Statistics cards (total payments, revenue, etc.)
   - ✅ Filter by status and method
   - ✅ Search payments
   - ✅ All payments in a table
3. Click any payment to see:
   - ✅ Full payment details
   - ✅ Transaction ID
   - ✅ Associated booking and user

## ✨ Expected User Journey (Complete Flow)

```
Start: Home Page
    ↓
1. Browse Packages (/packages) [Status: 🟡 BROWSING]
    ↓
2. Click Package Details (/packages/:id) [Status: 🟡 VIEWING]
    ↓
3. Click "Book Package" (/packages/:id/book) [Status: 🟡 BOOKING]
    ↓
4. Fill & Submit Booking Form [Status: 🟡 PENDING]
    ↓
    Success: Booking created, redirect to /my-bookings
    ↓
5. View My Bookings (/my-bookings) [Status: 🟡 PENDING]
    ↓
6. Click "💳 Pay Now" button (/payment/:bookingId) [Status: 💳 PAYMENT]
    ↓
7. Fill Payment Form & Submit [Status: ⏳ PROCESSING]
    ↓
    Backend: Create payment + Confirm booking
    ↓
8. Success Page Shown (3 sec) [Status: ✅ SUCCESS]
    ↓
9. Auto-redirect to /my-bookings [Status: 🟢 CONFIRMED]
    ↓
10. See Booking with CONFIRMED Status [Status: 🟢 CONFIRMED] ✅
```

## 📊 Test Data

### **Sample Booking Data**
```javascript
{
  package_date_id: 1,
  persons: 2,
  total_price: 5000.00,
  contact_phone: "9876543210",
  notes: "Group booking, special requests"
}
```

### **Sample Payment Data**
```javascript
{
  booking_id: 1,
  user_id: 1,
  total_amount: 5000.00,
  payment_method: "credit_card",
  payment_status: "completed",
  transaction_id: "TXN-1234567890",
  notes: "Payment for booking #1"
}
```

## ⚠️ Common Issues & Solutions

### **Issue 1: "Payment successful" but status still PENDING**
**Solution**: 
- Check Network tab for PUT /bookings/:id/confirm response
- Verify response contains status: "confirmed"
- Clear localStorage and login again
- Check backend confirm endpoint is working

### **Issue 2: Payment page shows "No booking found"**
**Solution**:
- Make sure you clicked "Pay Now" from My Bookings (not direct URL)
- Browser must support localStorage for session state
- Clear cache and try again

### **Issue 3: Payment form shows validation errors**
**Solution**:
- All fields required: card, name, expiry, CVV
- Card must be 16 digits
- CVV must be 3 digits
- Expiry format: MM/YY (01-12 for month)

### **Issue 4: Auto-redirect doesn't work**
**Solution**:
- JavaScript timeout might be blocked
- Click "View My Bookings" manually
- Refresh page to see updated status
- Check console for errors

### **Issue 5: Success message doesn't show**
**Solution**:
- Booking data might not be passing correctly
- Check location.state in browser DevTools
- Verify /my-bookings is receiving refresh flag

## 🎯 Success Criteria Checklist

- [ ] Can create booking with all fields filled
- [ ] Booking appears in My Bookings with PENDING status
- [ ] Can click "Pay Now" without errors
- [ ] Payment page loads with booking details
- [ ] Can fill and submit payment form
- [ ] Success page appears for 3 seconds
- [ ] Auto-redirects to My Bookings
- [ ] ✅ **BOOKING STATUS CHANGED TO CONFIRMED** ✅
- [ ] "Pay Now" button is GONE (only shows for PENDING)
- [ ] Success message displays at top
- [ ] Can view admin booking management page
- [ ] Can view admin user profiles
- [ ] Can view admin payment history
- [ ] All pages load without console errors

## 🚀 Performance Metrics

**Expected Times**:
- Payment page load: < 1 second
- Payment processing: 1-2 seconds
- Booking refresh: < 1 second
- Status update visible: Immediate after refresh

**Build Size**:
- Total JS: 441 KB
- Gzipped: 117.74 KB
- Build time: ~3-4 seconds

## 📞 If Tests Fail

**Collect Information**:
1. Screenshot of the issue
2. Browser console errors (F12 → Console)
3. Network requests (F12 → Network)
4. Steps to reproduce
5. Expected vs actual behavior

**Then Report Issue With**:
- Browser type and version
- Operating system
- Backend API status
- Recent changes made
