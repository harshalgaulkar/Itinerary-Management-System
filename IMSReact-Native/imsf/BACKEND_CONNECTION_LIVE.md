# Backend Connection Guide - Live Setup

Your backend is running at: `http://10.64.205.48:4000`

## Status ✅

The backend server is **ONLINE** and responding to requests.

---

## Quick Start

### 1. Log In First

Your app requires authentication. Users must log in to get a JWT token before making API calls.

**Login Endpoint:**
```
POST /users/signin
```

**In your app:**
- Open login screen
- Enter your credentials
- The token will be stored automatically
- All subsequent requests will include this token

### 2. Test the Connection

Run this command to verify all endpoints:

```bash
node test-backend-connection.js
```

---

## How Backend Connection Works

### Current Flow:

1. **User logs in** → Gets JWT token (stored in local storage)
2. **Token sent with requests** → Every API call includes `Authorization: Bearer <token>`
3. **Backend validates token** → If valid, processes request
4. **Response returned** → Success or error based on operation

### Response Format:

**Success Response:**
```json
{
  "status": "success",
  "data": {
    "dest_id": 1,
    "name": "Paris",
    "country": "France",
    "description": "City of Light"
  }
}
```

**Error Response:**
```json
{
  "status": "error",
  "error": "Destination not found",
  "statusCode": 404
}
```

---

## Frontend Code Already Configured

The following files are **ready for backend connection**:

### Services (No demo mode):
- ✅ `src/services/destinationService.js` - All CRUD operations
- ✅ `src/services/packageMasterService.js` - Package management
- ✅ `src/utils/result.js` - Response handler (updated to match backend format)

### Key Changes Made:
1. **Removed demo mode fallback** - Now connects directly to real backend
2. **Updated response handler** - Handles `{"status":"success","data":{...}}` format
3. **Added token validation** - Checks for auth token before API calls
4. **Error handling** - Proper error messages for debugging

---

## Testing in Your App

### Step 1: Make sure you're logged in
- Open the app
- Login with your credentials
- You'll see the dashboard

### Step 2: Test Admin Features

**Create a Destination:**
1. Open Admin tab
2. Click "Manage Destinations" 
3. Enter destination details
4. Click "Add Destination"
5. Check console for success/error message

**Expected console output:**
```
🌐 Fetching destinations from: http://10.64.205.48:4000/destinations
📡 Response status: 200
📡 Result: {success: true, data: [...]}
```

**Manage Packages:**
1. Open Admin tab
2. Click "Manage Packages"
3. Create/Edit/Delete packages
4. Watch console for API calls

### Step 3: Monitor Console

All API calls log details:
- 🌐 Request URL
- 📡 Response status
- ✅ Success data
- ❌ Error messages

---

## Common Issues & Solutions

### Issue: "Token is Missing"
**Cause:** User not logged in
**Solution:** Login first before using admin features

### Issue: "Unauthorized access"
**Cause:** Token expired or invalid
**Solution:** Re-login to get new token

### Issue: 404 Not Found
**Cause:** Endpoint doesn't exist on backend
**Solution:** Check that all routes are registered in backend server

### Issue: "Failed to fetch"
**Cause:** Backend server down
**Solution:** Check if `http://10.64.205.48:4000` is reachable

---

## Backend Configuration Checklist

For backend team, ensure these routes exist:

- [ ] `GET /destinations` - Get all destinations
- [ ] `POST /destinations/create` - Create destination
- [ ] `PUT /destinations/:id` - Update destination  
- [ ] `DELETE /destinations/:id` - Delete destination
- [ ] `GET /packageMaster` - Get all packages
- [ ] `POST /packageMaster/create` - Create package
- [ ] `PUT /packageMaster/:id` - Update package
- [ ] `DELETE /packageMaster/:id` - Delete package
- [ ] `POST /packageMaster/:id/dates` - Add dates
- [ ] `PUT /packageMaster/:id/dates/:dateId` - Update dates
- [ ] `DELETE /packageMaster/:id/dates/:dateId` - Delete dates

All endpoints should:
✅ Require `Authorization: Bearer <token>` header
✅ Return JSON with `{"status":"success","data":{...}}` format
✅ Support GET, POST, PUT, DELETE methods
✅ Include proper error handling

---

## Next Steps

1. **Login to the app** using your credentials
2. **Open Admin tab** to test CRUD operations
3. **Watch console** for API request/response logs
4. **Create destinations/packages** to verify backend integration
5. **Check backend logs** if operations fail

---

## Development Commands

### To run this app:
```bash
npm start
```

### To test backend connection:
```bash
node test-backend-connection.js
```

### To check logs:
- React Native: Check Metro bundler console
- Browser: Open DevTools → Console tab
- Android: Use Android Studio logcat

---

## Deployment Considerations

Once everything works locally:

1. **Database Persistence**: Ensure data persists across restarts
2. **Token Management**: Refresh tokens when they expire
3. **Error Handling**: Show user-friendly error messages
4. **Security**: Don't log sensitive data in production
5. **Performance**: Test with multiple concurrent requests

---

**Questions?** Check the backend logs or contact the backend team for specific endpoint issues.

