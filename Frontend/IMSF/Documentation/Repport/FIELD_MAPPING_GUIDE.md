# API Field Mapping & Debugging Guide

## Current Status (From Console Logs)

### ✅ What's Working:
- Packages: 3 ✓
- Bookings: 2 ✓
- Users: 8 ✓

### ❌ What Needs Fixing:
- **Revenue: ₹0** - Bookings fetching but amounts not found
- **Transactions: 0** - Payments API returns Object but empty

---

## 1. BOOKING REVENUE ISSUE (₹0)

### Problem:
Your bookings are fetching but revenue shows ₹0. This means the amount/price field is not being found.

### Solution - Add Debug:
After refreshing, look in console for:
```
📊 Sample booking structure: {...}
```

This will show you the actual booking object structure. Look for fields like:
- `amount` ← most common
- `total_amount` ← alternative
- `price` ← possible
- `total_price` ← alternative
- `package_price` ← alternative

### What We're Already Checking:
The code now checks: `total_amount` → `amount` → `price` → `total_price` → `package_price`

If it's still showing ₹0, the field might have a different name. Tell me what field name you see in the console and I'll add it.

---

## 2. TRANSACTION ISSUE (0 transactions)

### Problem:
API endpoint `/payments` is returning but 0 transactions show up.

### Solution - Check Response Structure:
Look in console for:
```
📥 API Response received: Object {...}
📊 Total transactions fetched: 0
📋 Sample transaction: undefined
```

### What Might Be Wrong:

**Option 1: Data is nested deeper**
- Current code checks: `response.data`, `response.payments`, `response.transactions`
- If data is at `response.data.payments` or `response.data.data`, it won't find it
- **Fix**: Tell me the actual structure you see in Network tab

**Option 2: Different field names in transaction object**
- We look for: `id`, `amount`, `status`, `booking_id`, `created_at`
- Your API might use: `transaction_id`, `payment_amount`, `payment_status`, etc.
- **Fix**: Check the sample transaction in console

**Option 3: Status values are different**
- We check for: `success`, `completed`, `confirmed`, `pending`, `processing`, `failed`, `rejected`, `declined`
- Your API might use: `SUCCESS`, `COMPLETED`, `0`, `1`, etc.
- **Fix**: Check the status value in sample transaction

---

## How to Debug (Step by Step)

### Step 1: Open Console (F12 → Console tab)

### Step 2: Refresh Page and Wait for Logs

### Step 3: Find These Messages:
1. **For Bookings:**
   ```
   📊 Sample booking structure: {
     id: 1,
     status: "confirmed",
     [AMOUNT_FIELD]: 5000,    ← LOOK FOR THIS
     package_date: "2026-02-15",
     ...
   }
   ```

2. **For Transactions:**
   ```
   📊 Total transactions fetched: 0
   📋 Sample transaction: undefined  ← Should NOT be undefined
   ```

### Step 4: Report Back With:
- The exact field names you see
- The exact status values (if 0 or 1 instead of text)
- Any nested structure like `response.data.data` or `response.payload`

---

## Quick Fixes to Try

### If Bookings Show Amount but Revenue is ₹0:
The amount might be stored as STRING instead of number.
Already fixed! Code converts with `parseFloat(amount)`

### If Transactions Show 0:
The response might not have a `.data` property.
Check Network tab:
1. F12 → Network tab
2. Refresh page
3. Click on `/payments` request
4. Look at Response → What's the structure?

---

## Fields Being Checked

### Booking Fields:
```javascript
Amount: total_amount || amount || price || total_price || package_price
Date: package_date || trip_date || start_date || date
```

### Transaction Fields:
```javascript
ID: id || transaction_id
Amount: amount || total_amount || price || payment_amount
Status: status (lowercase)
Booking: booking_id || booking || order_id
Date: created_at || transaction_date || date || payment_date
```

---

## What to Share If Still Not Working

1. **Console output** - Full log messages
2. **Network response** - Screenshot of /payments response JSON
3. **Sample booking** - What's shown in "Sample booking structure"
4. **Sample transaction** - What's shown in "Sample transaction"

This will help identify the exact field names your API uses! 🔍
