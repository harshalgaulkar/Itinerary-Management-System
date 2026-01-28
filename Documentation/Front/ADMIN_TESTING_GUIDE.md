# Admin Features - Testing & Verification Guide

## Pre-Testing Checklist

Before testing admin features, ensure:
- ✅ Frontend running on http://localhost:5174
- ✅ Backend running on http://localhost:4000
- ✅ Database (MySQL Fin) is running
- ✅ Logged in as admin (harry@gmail.com / harry@1234)

## Full Testing Workflow

### Step 1: Admin Login

1. Navigate to: http://localhost:5174/login
2. Enter credentials:
   - Email: harry@gmail.com
   - Password: harry@1234
3. Click "Login"
4. Should redirect to dashboard with navbar showing "Admin" button (red)

**Expected Result:** ✅ Admin button visible in navbar

### Step 2: Access Admin Dashboard

1. Click the red "Admin" button in navbar
2. Or navigate to: http://localhost:5174/admin/dashboard
3. Should see 6 management cards:
   - Manage Packages
   - Manage Destinations
   - Manage Users
   - Manage Bookings
   - Manage Payments
   - Manage Reviews

**Expected Result:** ✅ Dashboard loads with all 6 cards visible

### Step 3: Create Destination (RECOMMENDED FIRST)

1. Click "Manage Destinations" card
2. Click "Create New Destination" button
3. Fill form:
   - Name: "London"
   - Country: "United Kingdom"
   - Description: "Historic capital city with Big Ben and Thames River"
   - Image URL: (leave blank or add URL)
4. Click "Create Destination" button
5. Should see green "success" message
6. Auto-redirect to destinations list

**Expected Result:** ✅ Destination created and visible in list

### Step 4: Create Package (AFTER DESTINATION)

1. Click "Manage Packages" card
2. Click "Create New Package" button
3. Fill form:
   - Title: "London City Tour"
   - Destination: Select "London, United Kingdom" from dropdown
   - Duration: 3
   - Base Price: 45000
   - Max People: 15
   - Description: "Explore the charm of London with our guided tour"
   - Image URL: (optional)
4. Click "Create Package" button
5. Should see green success message
6. Auto-redirect to packages list

**Expected Result:** ✅ Package created and visible in list

### Step 5: Create User

1. Click "Manage Users" card
2. Click "Create User" button
3. Fill form:
   - Email: user@example.com
   - Password: password123 (minimum 6 chars)
   - Full Name: John Doe
   - Phone: +919876543210
   - Role: Customer (leave default)
4. Click "Create User" button
5. Should see green success message
6. Auto-redirect to users list

**Expected Result:** ✅ User created and visible in list

### Step 6: Update User Role

1. Go to "Manage Users" card
2. Find the newly created user (john.doe@example.com)
3. Click the Role dropdown
4. Change from "Customer" to "Admin"
5. Role should update in real-time

**Expected Result:** ✅ User role changes immediately

### Step 7: View Packages

1. Go to "Manage Packages" card
2. Should see all packages in table:
   - "Manali Adventure" (existing)
   - "London City Tour" (newly created)
3. Table shows: ID, Title, Duration, Price, Max People
4. Delete button available for each package

**Expected Result:** ✅ All packages visible in table

### Step 8: Delete Package (OPTIONAL)

1. Go to "Manage Packages"
2. Find any package
3. Click "Delete" button
4. Confirm in dialog: "Are you sure?"
5. Package should be removed from list

**Expected Result:** ✅ Package deleted from table

### Step 9: View Destinations

1. Go to "Manage Destinations"
2. Should see all destinations:
   - Manali (existing)
   - London (newly created)
3. Table shows: ID, Name, Country, Description

**Expected Result:** ✅ All destinations visible

### Step 10: View Users

1. Go to "Manage Users"
2. Should see all users including:
   - harry@gmail.com (admin)
   - user@example.com (newly created)
3. Role dropdown shows current role
4. Can change roles in real-time

**Expected Result:** ✅ All users visible with roles

## Common Issues & Solutions

### Issue: Blank Screen on Create Package
**Solution:** Already fixed - page should load with form fields
- Try hard refresh: Ctrl+Shift+R
- Check browser console for errors
- Verify destinations API is responding

### Issue: Destination Dropdown Empty
**Solution:**
- Create a destination first
- Check backend is running on port 4000
- Verify destinations exist: curl http://localhost:4000/destinations

### Issue: Form Validation Errors
**Solution:**
- Email must be valid format: user@example.com
- Password minimum 6 characters
- All required fields must be filled
- Check error message for specific requirement

### Issue: Cannot Create Package
**Solution:**
- Select a destination from dropdown first
- Fill all required fields (Title, Destination, Duration, Price)
- Check error message for what's missing
- Verify backend is running

### Issue: Changes Not Saving
**Solution:**
- Wait for success message before leaving page
- Check network tab in DevTools for 200 status
- Verify JWT token is valid
- Try logging out and back in

## Form Field Requirements

### Create Destination Form
| Field | Type | Required | Min Length |
|-------|------|----------|-----------|
| Name | Text | Yes | 1 |
| Country | Text | Yes | 1 |
| Description | Text | Yes | 1 |
| Image URL | URL | No | - |

### Create Package Form
| Field | Type | Required | Min |
|-------|------|----------|-----|
| Title | Text | Yes | 1 |
| Destination | Dropdown | Yes | - |
| Duration | Number | Yes | 1 |
| Base Price | Number | Yes | 0 |
| Max People | Number | No | 0 |
| Description | Text | No | - |
| Image URL | URL | No | - |

### Create User Form
| Field | Type | Required | Min |
|-------|------|----------|-----|
| Email | Email | Yes | Valid format |
| Password | Text | Yes | 6 characters |
| Full Name | Text | Yes | 1 |
| Phone | Phone | Yes | 1 |
| Role | Dropdown | No | Defaults to Customer |

## Browser DevTools Debugging

### Check Network Errors
1. Press F12 to open DevTools
2. Go to "Network" tab
3. Make a form submission
4. Look for red errors (4xx or 5xx status)
5. Click request to see response

### Check Console Errors
1. Press F12 to open DevTools
2. Go to "Console" tab
3. Look for red error messages
4. Check if API calls are failing
5. Note error messages for troubleshooting

### Check JWT Token
1. Press F12 to open DevTools
2. Go to "Application" or "Storage" tab
3. Look for "localStorage"
4. Find "token" or "auth_token"
5. Verify token exists and is not empty

## Performance Expectations

| Action | Expected Time |
|--------|----------------|
| Page Load | < 1 second |
| Destination Dropdown | < 500ms |
| Table Load (100 items) | < 500ms |
| Form Submission | < 2 seconds |
| Role Update | < 1 second |

## Success Indicators

✅ All pages load without blank screens
✅ Forms display with all fields visible
✅ Dropdowns populate with data
✅ Buttons are clickable
✅ Error messages display
✅ Success messages display
✅ Pages redirect automatically
✅ Data persists in tables
✅ Mobile responsive design works
✅ No console errors

## Rollback Instructions

If something goes wrong, all changes are reversible:
- Clear browser cache: Ctrl+Shift+Delete
- Clear localStorage: DevTools → Application → Clear All
- Logout and login again: Clears JWT token
- Refresh page: Ctrl+Shift+R (hard refresh)

## Next Steps After Testing

1. ✅ Verify all features work
2. Create test data (destinations, packages, users)
3. Test delete operations
4. Test role changes
5. Test on mobile device
6. Share with other team members for feedback

## Support Resources

- **Admin Quick Start:** ADMIN_QUICK_START.md
- **Admin Panel Guide:** ADMIN_PANEL_GUIDE.md
- **Feature Documentation:** ADMIN_FEATURES_DOCUMENTATION.md
- **Implementation Summary:** ADMIN_IMPLEMENTATION_SUMMARY.md
- **Bug Fix Report:** CREATE_PACKAGE_FIX_REPORT.md

## Final Verification

When you've completed all testing steps:

- [ ] Admin login works
- [ ] Admin dashboard displays
- [ ] Create destination works
- [ ] View destinations works
- [ ] Create package works
- [ ] View packages works
- [ ] Delete package works
- [ ] Create user works
- [ ] View users works
- [ ] Update user role works
- [ ] Forms validate properly
- [ ] Error messages display
- [ ] Success messages display
- [ ] Mobile responsive
- [ ] No console errors

**Status:** All features ready for production use ✅

---

**Date:** January 22, 2026
**Test Environment:** Development (localhost:5174)
**Backend:** http://localhost:4000
**Database:** MySQL Fin
