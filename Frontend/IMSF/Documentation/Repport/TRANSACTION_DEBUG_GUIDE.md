# Transaction Fetching - Debug Guide

## 🔍 How to Debug Transaction Fetch Issues

### Step 1: Open Browser Console
1. Go to Admin Dashboard
2. Press **F12** or **Ctrl+Shift+I** to open Developer Tools
3. Click on the **Console** tab

### Step 2: Look for Log Messages
You should see messages like:
```
🔄 Fetching transactions...
📥 API Response received: {...}
✓ Extracted from response.data
📊 Total transactions fetched: 5
✓ Transactions loaded successfully!
  → Total: 5
  → Successful: 4 | Pending: 0 | Failed: 1
```

### Step 3: If You See Errors

#### Error 1: "❌ Error fetching transactions"
```
❌ Error fetching transactions: Error: ...
Error message: Network Error / 404 / 401
Error response: {...}
```

**Solutions:**
- Check if API endpoint `/payments` exists on backend
- Verify authentication token is valid (check Network tab → Headers)
- Ensure backend server is running

#### Error 2: "⚠ Could not extract transaction data from response"
```
📥 API Response received: {...}
⚠ Could not extract transaction data from response
```

**Solutions:**
- The response structure doesn't match expected format
- Check the actual response structure in Network tab
- Common structures:
  - `response.data` ✓
  - `response.payments` ✓
  - Direct array `[]` ✓

#### Error 3: "⚠ No transaction data found"
```
📊 Total transactions fetched: 0
⚠ No transaction data found
```

**Solutions:**
- API returned empty array (no transactions in database)
- Create some test transactions first
- Or check if data is being stored correctly

### Step 4: Check Network Tab
1. Open Developer Tools (F12)
2. Click **Network** tab
3. Refresh page
4. Look for `/payments` request
5. Click on it to see:
   - **Status**: Should be 200 (success)
   - **Response**: Actual data returned by API
   - **Headers**: Authorization token, content-type, etc.

### Step 5: Check Response Structure
In the Network tab, look at the Response JSON. Should be one of these:

**Format 1: data property**
```json
{
  "status": "success",
  "data": [
    { "id": 1, "amount": 1000, "status": "success" },
    { "id": 2, "amount": 2000, "status": "pending" }
  ]
}
```

**Format 2: payments property**
```json
{
  "status": "success",
  "payments": [
    { "id": 1, "amount": 1000, "status": "success" }
  ]
}
```

**Format 3: Direct array**
```json
[
  { "id": 1, "amount": 1000, "status": "success" },
  { "id": 2, "amount": 2000, "status": "pending" }
]
```

### Step 6: Common Transaction Fields
The code looks for these fields:
- `id` - Transaction ID (required)
- `amount` or `total_amount` - Payment amount
- `status` - Payment status (success, pending, failed, etc.)
- `booking_id` - Associated booking
- `created_at` or `transaction_date` or `date` - Transaction date

If your API returns different field names, they need to be mapped.

## 🛠️ How to Fix Common Issues

### Issue: Wrong Field Names
If API returns `payment_amount` instead of `amount`:

Edit line in `AdminDashboard.jsx`:
```javascript
// Current:
₹{(transaction.amount || transaction.total_amount || 0).toLocaleString()}

// Change to:
₹{(transaction.payment_amount || transaction.amount || transaction.total_amount || 0).toLocaleString()}
```

### Issue: Wrong Status Values
If API returns `COMPLETED` instead of `success`:

Edit the filter logic:
```javascript
// Current:
t.status?.toLowerCase() === 'success' || t.status?.toLowerCase() === 'completed'

// Add:
|| t.status?.toLowerCase() === 'completed' // This is already there!
|| t.status?.toLowerCase() === 'successful'
```

### Issue: API Endpoint is Different
If transactions are at `/api/transactions` instead of `/payments`:

Edit `endpoints.js`:
```javascript
export const paymentAPI = {
  getAll: (filters = {}) => 
    apiClient.get('/transactions', { params: filters }), // Change /payments to /transactions
```

## 📋 Checklist for Testing

- [ ] Can see "🔄 Fetching transactions..." in console
- [ ] Can see "✓ Transactions loaded successfully!" in console
- [ ] Transaction stats show correct numbers
- [ ] Recent transactions table displays data
- [ ] Status badges are color-coded correctly
- [ ] "View All Transactions" button works
- [ ] No 404 or 401 errors in Network tab

## 🆘 Still Not Working?

1. **Share the console output** - Copy entire console log
2. **Check Network Response** - Take screenshot of response JSON
3. **Verify API endpoint** - Test `/payments` endpoint directly in Postman/Insomnia
4. **Check authentication** - Ensure token is valid and API allows this endpoint

## 📞 Quick Reference

| Issue | Check |
|-------|-------|
| No data | Network tab → Status 200? → Response has data? |
| Wrong numbers | Console → Extraction successful? → Filter logic correct? |
| No columns showing | Check transaction object field names |
| Dates not showing | Check date field name (created_at/transaction_date/date) |
| Status badges wrong color | Check status values returned by API |
