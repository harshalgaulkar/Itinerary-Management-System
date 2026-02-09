# Testing Guide for IMS Mobile App

## Testing Overview

This document provides comprehensive testing guidelines for the IMS Mobile App.

## Test Environment Setup

### Prerequisites
- Node.js and npm installed
- Test device or emulator set up
- Backend API running
- Test user credentials available

### Initial Setup
```bash
cd d:\IMS\app1
npm install
npm start
```

## Manual Testing Scenarios

### 1. Authentication Testing

#### Login with Valid Credentials
**Steps:**
1. Launch app
2. Enter valid email
3. Enter valid password
4. Tap "Sign In"

**Expected Result:**
- Loading spinner appears
- User redirected to packages screen
- Token stored securely
- User data displayed

#### Login with Invalid Credentials
**Steps:**
1. Enter invalid email
2. Enter incorrect password
3. Tap "Sign In"

**Expected Result:**
- Error message displayed
- User remains on login screen
- No navigation occurs

#### Registration Flow
**Steps:**
1. Tap "Don't have an account? Sign Up"
2. Fill all fields correctly
3. Tap "Create Account"

**Expected Result:**
- Form validation passes
- User created on backend
- Token received
- Redirected to packages

#### Logout
**Steps:**
1. Login successfully
2. Access navigation menu
3. Select logout

**Expected Result:**
- User token cleared
- Redirected to login screen
- Secure storage cleared

### 2. Package Management Testing

#### Browse Packages
**Steps:**
1. Login successfully
2. Navigate to Packages tab
3. Scroll through package list

**Expected Result:**
- All packages loaded
- Images display correctly
- Package cards show price and duration
- No loading errors

#### View Package Details
**Steps:**
1. From package list, tap a package card
2. Scroll through details

**Expected Result:**
- Full package information displays
- Images load properly
- All sections visible (itinerary, inclusions, exclusions)
- Book Now button visible

#### Search/Filter (if implemented)
**Steps:**
1. Use search or filter options
2. Apply filters
3. View filtered results

**Expected Result:**
- Relevant packages displayed
- Results updated correctly
- Loading state managed

### 3. Destination Testing

#### Browse Destinations
**Steps:**
1. Navigate to Destinations tab
2. Scroll through destination list

**Expected Result:**
- All destinations loaded
- Cards display properly
- Package count shown
- Images load correctly

#### Explore Destination Packages
**Steps:**
1. Tap "Explore" on a destination
2. View filtered packages

**Expected Result:**
- Only packages for that destination shown
- Navigation works properly
- Can return to destinations list

### 4. Payment Testing

#### Initiate Payment
**Steps:**
1. View booking details
2. Fill payment information
3. Submit payment

**Expected Result:**
- Form validates
- Loading state shows
- Payment processed (or test response)
- Success/error message displayed

#### Payment Method Selection
**Steps:**
1. Select different payment methods
2. Fill respective forms

**Expected Result:**
- Forms update based on selection
- Validation works for each method
- Form requirements clear

#### Payment History
**Steps:**
1. View payment history
2. Check transaction details

**Expected Result:**
- All transactions listed
- Details accurate
- Dates and amounts display correctly

### 5. Reviews Testing

#### View Reviews
**Steps:**
1. Navigate to package reviews
2. Scroll through reviews

**Expected Result:**
- All reviews displayed
- Ratings shown with stars
- User names visible
- Dates accurate

#### Write Review
**Steps:**
1. Tap "Write a Review"
2. Select rating (1-5 stars)
3. Enter title
4. Enter comment
5. Submit

**Expected Result:**
- Form validates
- Review submitted
- New review appears in list
- Success message shows

#### Edit Review (if applicable)
**Steps:**
1. Tap on your review
2. Edit content
3. Save changes

**Expected Result:**
- Changes saved
- List updates
- Confirmation message

### 6. Error Handling Testing

#### Network Error
**Steps:**
1. Turn off internet
2. Attempt API call
3. Observe error handling

**Expected Result:**
- Error message displayed
- Retry button available
- App doesn't crash
- Graceful degradation

#### Invalid Data
**Steps:**
1. Enter invalid form data
2. Submit form

**Expected Result:**
- Validation error shows
- Form doesn't submit
- Helpful error message

#### Server Error (500)
**Steps:**
1. Mock server 500 error
2. Attempt action

**Expected Result:**
- User-friendly error message
- Retry option available
- No data loss

### 7. Navigation Testing

#### Tab Navigation
**Steps:**
1. Tap each tab
2. Verify screen switches

**Expected Result:**
- Smooth transitions
- Tab indicator updates
- Screen content changes
- State preserved

#### Stack Navigation
**Steps:**
1. Navigate to detail screen
2. Tap back button
3. Navigate forward again

**Expected Result:**
- Back button works
- Previous state restored
- Navigation stack managed correctly

#### Deep Linking (if implemented)
**Steps:**
1. Use deep link URL
2. Verify correct screen opens

**Expected Result:**
- Correct screen displayed
- Parameters passed correctly
- Navigation state valid

### 8. Data Persistence Testing

#### Login State Persistence
**Steps:**
1. Login
2. Kill and restart app
3. Check if still logged in

**Expected Result:**
- App remembers login
- No re-authentication needed
- User data preserved

#### Draft Saving (if applicable)
**Steps:**
1. Start filling a form
2. Navigate away
3. Return to form

**Expected Result:**
- Form data preserved
- Or appropriate empty state

### 9. Performance Testing

#### Large List Loading
**Steps:**
1. Load package list with 100+ items
2. Scroll rapidly
3. Monitor performance

**Expected Result:**
- Smooth scrolling
- No lag or jank
- Memory usage reasonable
- No crashes

#### Image Loading
**Steps:**
1. Load page with multiple images
2. Scroll through content

**Expected Result:**
- Images load quickly
- No layout shift
- Placeholder visible while loading

#### API Response Time
**Steps:**
1. Monitor API calls in network tab
2. Check response times

**Expected Result:**
- Responses under 5 seconds
- Proper timeout handling
- Loading indicators shown

### 10. Device Compatibility Testing

#### Different Screen Sizes
**Steps:**
1. Test on different screen sizes
2. Verify layout responsiveness

**Expected Result:**
- Layout adapts to screen size
- Text readable
- Buttons accessible
- Images scale properly

#### Different Orientations
**Steps:**
1. Rotate device
2. Verify layout updates

**Expected Result:**
- Layout reflows correctly
- No UI elements hidden
- Readable in both orientations

#### Different Android/iOS Versions
**Steps:**
1. Test on different OS versions
2. Verify functionality

**Expected Result:**
- App works on target versions
- No version-specific crashes
- Features functional

## Automated Testing Setup

### Unit Tests Example
```javascript
// utils.test.js
import { formatCurrency, isValidEmail } from '../services/utils';

describe('Utility Functions', () => {
  test('formatCurrency formats correctly', () => {
    expect(formatCurrency(1000)).toBe('₹1000.00');
  });

  test('isValidEmail validates email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid')).toBe(false);
  });
});
```

### Integration Tests Example
```javascript
// AuthContext.test.js
import { renderHook, act } from '@testing-library/react-native';
import { AuthContext, AuthProvider } from '../context/AuthContext';

describe('AuthContext', () => {
  test('login sets user token', async () => {
    // Test implementation
  });
});
```

## Test Checklist

### Pre-Release Testing
- [ ] All authentication flows tested
- [ ] All screens tested for crashes
- [ ] Navigation flows verified
- [ ] API calls working
- [ ] Error handling tested
- [ ] Performance acceptable
- [ ] UI elements properly positioned
- [ ] Images loading correctly
- [ ] Forms validating correctly
- [ ] Payments processed correctly
- [ ] Reviews submitting successfully
- [ ] Network errors handled gracefully
- [ ] Tested on multiple devices
- [ ] Tested on multiple OS versions
- [ ] Accessibility checked

### Regression Testing
- [ ] Previous features still working
- [ ] No new crashes
- [ ] Performance maintained
- [ ] No UI regressions

## Bug Reporting Template

When reporting bugs, include:
1. **Device/OS**: Device model and OS version
2. **Steps to Reproduce**: Exact steps that cause issue
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happened
5. **Screenshots/Video**: Visual evidence
6. **Logs**: Console or error logs
7. **Environment**: Production/staging/development

Example:
```
**Device**: iPhone 12, iOS 15.0
**Steps**: 
1. Login with test@example.com
2. Navigate to packages
3. Scroll to bottom
4. Tap on first package

**Expected**: Package details screen opens
**Actual**: App crashes

**Error Log**: [paste error]
```

## Performance Benchmarks

### Target Metrics
- **App Launch**: < 3 seconds
- **Screen Transition**: < 500ms
- **API Response**: < 5 seconds
- **List Scroll**: 60 FPS
- **Image Load**: < 2 seconds
- **Form Submission**: < 2 seconds

### Monitoring Tools
- React Native Debugger
- Redux DevTools
- Network Inspector
- Performance Monitor
- Memory Profiler

## Continuous Testing

### CI/CD Integration
- Automated tests run on every commit
- Pre-release test suite
- Performance benchmarks
- Coverage tracking

### Test Metrics
- Code coverage: Aim for 80%+
- Bug find rate: Track issues per release
- Performance: Monitor key metrics

## Testing Best Practices

1. **Test User Flows**: Focus on complete user journeys
2. **Test Edge Cases**: Empty states, errors, timeouts
3. **Test Accessibility**: Keyboard navigation, screen readers
4. **Automate Repetitive**: Use automation for regression
5. **Manual for UX**: Manual testing for user experience
6. **Document Issues**: Clear bug reports
7. **Test Early**: Test during development
8. **Test Often**: Regular testing cycles

## Resources

- React Native Testing: https://reactnative.dev/docs/testing-overview
- Testing Library: https://testing-library.com/docs/react-native-testing-library/intro
- Jest: https://jestjs.io/docs/getting-started
- Detox (E2E): https://wix.github.io/Detox/docs/intro/welcome

---
**Last Updated**: January 30, 2026
**Version**: 1.0.0
