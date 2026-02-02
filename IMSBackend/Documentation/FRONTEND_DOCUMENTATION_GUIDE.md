# IMS Backend - Frontend Documentation Package

## 📦 Available Documentation Files

### For React Native Developer - Choose Based on Your Preference:

#### 1. **REACT_NATIVE_API_GUIDE.md** (RECOMMENDED)
- **Format**: Markdown
- **Best For**: Reading in GitHub, IDE, or web viewers
- **Size**: Comprehensive with code examples
- **Features**:
  - Complete endpoint documentation
  - Request/response examples
  - React Native implementation guides
  - Error handling patterns
  - Testing checklist

**How to use**:
- Open in VS Code, Sublime, or any text editor
- View on GitHub
- Print to PDF using Print button in VS Code

---

#### 2. **REACT_NATIVE_API_GUIDE.html** (PDF-READY)
- **Format**: HTML with Print-to-PDF styling
- **Best For**: Printing to PDF or viewing in browser
- **Features**:
  - Professional formatting
  - Color-coded API methods (GET/POST/PUT/DELETE)
  - Responsive design
  - Print-optimized

**How to use**:
1. Open in any web browser (Chrome, Firefox, etc.)
2. Press Ctrl+P (Cmd+P on Mac)
3. Save as PDF
4. Share with team

---

#### 3. **QUICK_REFERENCE.txt** (CHEAT SHEET)
- **Format**: Plain text, concise format
- **Best For**: Quick lookup while coding
- **Size**: Compact reference guide
- **Features**:
  - All endpoints in compact format
  - Quick syntax examples
  - Common errors table
  - Implementation template

**How to use**:
- Keep open in another editor window
- Reference while coding
- Good for mobile viewing

---

### 📚 Complete Documentation Package Includes:

1. ✅ **65+ API Endpoints** documented
2. ✅ **Full CRUD Operations** for all resources
3. ✅ **Request/Response Examples** for each endpoint
4. ✅ **Error Handling Guide** with common errors
5. ✅ **React Native Code Samples** ready to use
6. ✅ **Authentication Details** with token management
7. ✅ **Role-based Access Control** explained
8. ✅ **Payment Integration** examples
9. ✅ **Booking Workflow** with status transitions
10. ✅ **Testing Checklist** for QA

---

## 🚀 Quick Start for Frontend Dev

### Step 1: Choose Your Documentation Format
```
For Reading:   Use REACT_NATIVE_API_GUIDE.md
For PDF:       Use REACT_NATIVE_API_GUIDE.html (Print to PDF)
For Reference: Use QUICK_REFERENCE.txt
```

### Step 2: Setup Your Project
```bash
# Install required packages
npm install axios  # or fetch API is built-in
npm install @react-native-async-storage/async-storage

# Or for bare React Native
yarn add axios @react-native-async-storage/async-storage
```

### Step 3: Configure API Service
```javascript
// Create utils/api.js
const API_BASE_URL = 'http://192.168.x.x:4000'; // Use your server IP

const apiCall = async (endpoint, method = 'GET', body = null) => {
  const userId = await AsyncStorage.getItem('user_id');
  const headers = { 'Content-Type': 'application/json' };
  
  if (userId) headers['user_id'] = userId;
  
  const options = { method, headers, timeout: 10000 };
  if (body) options.body = JSON.stringify(body);
  
  const response = await fetch(API_BASE_URL + endpoint, options);
  const data = await response.json();
  
  if (data.status === 'error') throw new Error(data.error);
  return data.data;
};

export default apiCall;
```

### Step 4: Start Implementing
```javascript
// Example: Sign In
import apiCall from './utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const signIn = async (email, password) => {
  try {
    const user = await apiCall('/users/signin', 'POST', { email, password });
    await AsyncStorage.setItem('user_id', user.user_id.toString());
    return user;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
```

---

## 📋 API Endpoint Summary

| Route | Count | Endpoints |
|-------|-------|-----------|
| Users | 7 | Sign In/Up, Profile, Bookings |
| Admin | 4 | Create User, List Users, Update Role, Delete |
| Destinations | 6 | CRUD Operations |
| Packages | 6 | CRUD Operations |
| Package Master | 11 | Advanced Package Info |
| Itineraries | 7 | Day-wise Itinerary |
| Bookings | 9 | Create, List, Update, Cancel, Confirm |
| Payments | 9 | Create, List, Summary, Confirm, Reject |
| Reviews | 6 | Create, List, Update, Delete |
| **TOTAL** | **65+** | **All endpoints documented** |

---

## 🔐 Key Authentication Details

### Login Flow
1. User signs up/in at `/users/signin`
2. Backend returns `user_id` and optional `token`
3. Store `user_id` in AsyncStorage
4. Include `user_id` in header for all authenticated requests

### Header Format
```javascript
headers: {
  'Content-Type': 'application/json',
  'user_id': userId  // Required for authenticated endpoints
}
```

### Admin Operations
- All admin endpoints check if user has `role: 'admin'`
- First admin can be created without authentication
- Subsequent admins require existing admin to create them

---

## 🎯 Common Implementation Tasks

### 1. User Authentication
```javascript
// See: Auth Endpoints section
POST /users/signup
POST /users/signin
```

### 2. Browse Packages
```javascript
// See: Package Endpoints section
GET /packages
GET /packageMaster/:package_id  // Includes dates, itinerary, reviews
```

### 3. Create Booking
```javascript
// See: Booking Endpoints section
POST /bookings
```

### 4. Make Payment
```javascript
// See: Payment Endpoints section
POST /payments
GET /payments/booking/:booking_id/summary
```

### 5. Leave Review
```javascript
// See: Review Endpoints section
POST /reviews
```

---

## ⚠️ Important Notes for Frontend Dev

1. **Server IP**: Change `localhost` to your actual server IP
   ```javascript
   // Wrong
   const API = 'http://localhost:4000';
   
   // Right
   const API = 'http://192.168.1.100:4000';
   ```

2. **CORS**: Already configured in backend
   
3. **Error Handling**: Always check `data.status === 'error'`
   ```javascript
   if (response.status === 'error') {
     throw new Error(response.error);
   }
   ```

4. **Async Storage**: Always save `user_id` after login
   ```javascript
   await AsyncStorage.setItem('user_id', user.user_id.toString());
   ```

5. **Role Values**: Use lowercase
   - `user` (default)
   - `manager`
   - `admin`

6. **Payment Methods**: Supported
   - `card`
   - `upi`
   - `netbanking`
   - `cash`
   - `other`

7. **Booking Status**: Track these states
   - `pending` → Awaiting confirmation
   - `confirmed` → Confirmed by admin
   - `cancelled` → User cancelled
   - `completed` → Trip completed

---

## 🧪 Testing Your Implementation

### Manual Testing Order
1. ✅ Sign Up
2. ✅ Sign In
3. ✅ View Profile
4. ✅ Browse Destinations
5. ✅ Browse Packages
6. ✅ View Package Details (with dates)
7. ✅ Create Booking
8. ✅ View Bookings
9. ✅ Make Payment
10. ✅ View Payment Summary
11. ✅ Create Review
12. ✅ Update Profile
13. ✅ Cancel Booking

### Using Postman/Insomnia (For Testing Before React Native)
```bash
1. Import API endpoints
2. Set Base URL to http://localhost:4000
3. Test each endpoint manually
4. Copy successful requests to your React Native code
```

---

## 📞 Need Help?

### Common Issues & Solutions

**Issue**: "Cannot fetch from server"
- **Fix**: Check server IP in API_BASE_URL
- **Fix**: Ensure backend is running: `node Server.js`
- **Fix**: Check firewall settings

**Issue**: "Unauthorized: Only admins can create users"
- **Fix**: Use existing admin to create users
- **Fix**: First admin needs to be created without header

**Issue**: "User already exists"
- **Fix**: Use different email address

**Issue**: "Invalid booking/payment"
- **Fix**: Verify booking exists with correct status
- **Fix**: Check if seats are available

---

## 📁 File Locations

All documentation files are in:
```
d:\IMS\IMSBackend\
├── REACT_NATIVE_API_GUIDE.md      ← Main Documentation
├── REACT_NATIVE_API_GUIDE.html    ← For PDF Printing
├── QUICK_REFERENCE.txt             ← Quick Lookup
├── API_DOCUMENTATION.md            ← Extended Details
└── IMPLEMENTATION_SUMMARY.md       ← Project Summary
```

---

## ✅ Verification Checklist

Before submitting your code for review:

- [ ] All endpoints are implemented
- [ ] Error handling is in place
- [ ] User_id header is sent with authenticated requests
- [ ] Token/user data is stored in AsyncStorage
- [ ] Password reset flow works (if implemented)
- [ ] Forms have proper validation
- [ ] Loading states are shown during API calls
- [ ] Error messages are user-friendly
- [ ] Network timeout handling is implemented
- [ ] API responses are properly typed (if using TypeScript)

---

## 🎉 Ready to Build!

You have everything you need to build the React Native frontend!

**Start with**: `REACT_NATIVE_API_GUIDE.md`
**Keep handy**: `QUICK_REFERENCE.txt`
**Share with team**: `REACT_NATIVE_API_GUIDE.html` (Print to PDF)

Good luck! 🚀
