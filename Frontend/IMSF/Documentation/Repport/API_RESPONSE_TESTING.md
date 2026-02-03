# API Testing & Response Structure Guide

## Quick Test URLs

You can test these endpoints in Postman or your browser:

```
GET /packages
GET /bookings
GET /payments
GET /admin/users
```

---

## Expected Response Formats

### Scenario 1: Response with .data property
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Flight",
      "amount": 5000,
      "status": "confirmed",
      "created_at": "2026-01-26T10:00:00Z"
    }
  ]
}
```
✅ **This will work** - Code extracts from `response.data`

---

### Scenario 2: Response with nested data.data
```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "id": 1,
        "amount": 5000,
        "status": "confirmed"
      }
    ]
  }
}
```
⚠️ **This WON'T work** - Code needs to check `response.data.data`
**Fix Needed**: Update extraction logic

---

### Scenario 3: Response with .payments property
```json
{
  "status": "success",
  "payments": [
    {
      "id": 1,
      "amount": 5000,
      "status": "success"
    }
  ]
}
```
✅ **This will work** - Code extracts from `response.payments`

---

### Scenario 4: Direct array response
```json
[
  {
    "id": 1,
    "amount": 5000,
    "status": "success"
  }
]
```
✅ **This will work** - Code checks if response is array

---

## Field Names to Check

### Bookings - Amount Fields
Your API might return amounts in any of these fields:
- `amount` ← Most common
- `total_amount` ← Common in total fields
- `price` ← Simple price
- `total_price` ← Total with tax/fees
- `package_price` ← Package specific
- `cost` ← Alternative
- `payment_amount` ← Payment specific

**How to Find:**
1. F12 → Network tab
2. Refresh page
3. Find `/bookings` request
4. Click → Response tab
5. Look at a booking object → what amount field exists?

---

### Transactions - Status Values
Your API might use different status formats:
- `status: "success"` ← Text format
- `status: "SUCCESS"` ← Uppercase (auto-converted to lowercase)
- `status: "completed"` ← Alternative text
- `status: "confirmed"` ← Alternative
- `payment_status: "success"` ← Different field name
- `state: "completed"` ← Different field name entirely

**Current Matches:**
```javascript
// Success matches
"success", "completed", "confirmed"

// Pending matches
"pending", "processing"

// Failed matches
"failed", "rejected", "declined"
```

**How to Find:**
1. F12 → Network tab
2. Find `/payments` request
3. Look at a transaction object
4. Note the exact `status` value

---

## Console Output Reference

### When Everything Works:
```
✓ Packages: 3
✓ Bookings: 2
  → Pending: 0 (₹0) | Confirmed: 2 (₹50000) | Cancelled: 0 (₹0)
  → Upcoming: 2 (₹50000) | Completed: 0 (₹0)
  → Total Revenue: ₹ 50000
  → Avg Revenue per Booking: ₹ 25000
✓ Users: 8
✓ Transactions: 10
  → Successful: 8 | Pending: 1 | Failed: 1
```

### When Bookings Amount is Missing:
```
📊 Sample booking structure: {
  id: 1,
  booking_id: "BK-001",
  status: "confirmed",
  // NO amount field visible!
  package_date: "2026-02-15",
  ...
}
```
**Action**: Look for the amount in a different field name

### When Transactions Show 0:
```
📥 API Response received: Object {status: "success"}
⚠️ Could not extract transaction data from response
📊 Total transactions fetched: 0
```
**Action**: Response structure doesn't match expected formats

---

## Step-by-Step Debugging

### 1. Check Bookings Revenue

```
Console shows: ✓ Bookings: 2
But revenue shows: ₹0
```

**Run This in Console:**
```javascript
// Copy-paste this to see actual structure
fetch('/api/bookings')
  .then(r => r.json())
  .then(d => {
    console.log('FULL RESPONSE:', d);
    if (d.data?.[0]) console.log('FIRST BOOKING:', d.data[0]);
  });
```

**Look for**: Any field containing a number (the price)

---

### 2. Check Transactions

```
Console shows: ✓ Transactions: 0
Or shows: ⚠️ Could not extract transaction data
```

**Run This in Console:**
```javascript
fetch('/api/payments')
  .then(r => r.json())
  .then(d => {
    console.log('FULL RESPONSE:', d);
    console.log('RESPONSE.DATA:', d.data);
    console.log('RESPONSE.PAYMENTS:', d.payments);
    if (d.data?.[0]) console.log('FIRST PAYMENT:', d.data[0]);
  });
```

**Look for**: Where the array actually is

---

## Common Issues & Fixes

| Issue | Check | Fix |
|-------|-------|-----|
| ₹0 revenue | Sample booking structure | Add field name to amount check |
| 0 transactions | Sample transaction is undefined | Check response structure |
| Wrong counts | Console status logs | Check status field name/values |
| Dates not showing | Transaction date fields | Add date field names |

---

## When You Have the Answer

Once you know:
1. **Booking amount field name** (e.g., `package_total`)
2. **Transaction response structure** (e.g., `response.data.items`)
3. **Transaction status values** (e.g., `"PAID"` instead of `"success"`)

Tell me and I'll update the code immediately! ✅

---

## File Locations to Update

If you find different field names:

**For Bookings (₹0 issue):**
- File: `AdminDashboard.jsx` Line ~92-95
- Field: `total_amount || amount || price || ...`

**For Transactions (0 count issue):**
- File: `AdminDashboard.jsx` Line ~193-206
- Response extraction logic

**For Status values:**
- File: `AdminDashboard.jsx` Line ~253-268
- Status filtering logic
