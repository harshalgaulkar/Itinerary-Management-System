# Quick Login Testing Guide

## 🎯 What to Do Now

Your backend is running successfully on port 4000! The fixes I made are ready to test.

### Option 1: Register a New Test Account (Recommended)

This is the easiest way to get valid credentials:

1. **Start the app in web browser:**
   ```bash
   cd d:\IMS\app1
   npx expo start -c
   ```
   Then go to: http://localhost:8081

2. **Register a new account:**
   - Click "Sign Up" link on login page
   - Fill in:
     - First Name: `Test`
     - Last Name: `User`
     - Email: `test@example.com`
     - Phone: `9876543210`
     - Password: `Test@123`
   - Click "Create Account"
   - You should be logged in automatically

3. **Check console logs:**
   ```
   [AuthContext] Attempting registration with email: test@example.com
   [AuthContext] Registration response: { status: 'success', data: { token: '...', ... } }
   [AuthContext] Registration successful, token received
   [AuthContext] ✓ userToken state set: true
   [RootNavigator] userToken changed: true
   [RootNavigator] ✓ User authenticated, switching to app stack
   ```

### Option 2: Try Existing Account

If `gajanan@gmail.com` account exists, the password might be one of these common ones:
- Try registering your own test account instead (more reliable)

## Testing Your Login Fix

Once you have an account:

1. **Verify error handling works:**
   - Log out
   - Try logging in with wrong password
   - You should see: `[AuthContext] ✗ Backend returned error: Invalid Password`
   - Clear error message in app: "Invalid Password"

2. **Verify successful login:**
   - Log in with correct credentials
   - Should see all the success logs above
   - Should navigate to Packages tab

3. **Verify logout:**
   - Click Profile button
   - Click Logout
   - Should see: `[RootNavigator] ✓ Resetting navigation to auth stack`
   - Should navigate back to login

## Expected Console Logs

### Successful Registration
```
[AuthContext] Attempting registration with email: test@example.com
[AuthContext] Registration response: { status: 'success', data: { token: '...', ... } }
[AuthContext] Registration successful, token received
[AuthContext] Token and user data saved to storage
[AuthContext] ✓ userToken state set: true
[RootNavigator] userToken changed: true
[RootNavigator] ✓ User authenticated, switching to app stack
[RootNavigator] NavigationContainer is ready
```

### Successful Login
```
[AuthContext] Attempting login with email: test@example.com
[AuthContext] Login response: { status: 'success', data: { token: '...', ... } }
[AuthContext] Login successful, token received
[AuthContext] Token and user data saved to storage
[AuthContext] ✓ userToken state set: true
[RootNavigator] userToken changed: true
[RootNavigator] ✓ User authenticated, switching to app stack
```

### Failed Login (Wrong Password)
```
[AuthContext] Attempting login with email: test@example.com
[AuthContext] Login response: { status: 'error', error: 'Invalid Password' }
[AuthContext] ✗ Backend returned error: Invalid Password
```

## ✅ Summary of Fixes Applied

1. **AuthContext.js** - Added error response handling for login/signup
2. **App.js** - Fixed navigation timing issues with setTimeout
3. **Better logging** - All errors now clearly shown in console

The app should now work properly! Let me know when you've tested it.
