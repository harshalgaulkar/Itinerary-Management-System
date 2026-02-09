# IMS Mobile App - Architecture Documentation

## Overview

The IMS Mobile App is a React Native application built with Expo that provides a user interface for browsing travel packages, making bookings, processing payments, and reading/writing reviews.

## Architecture Layers

### 1. Presentation Layer (UI Components)
- **Location**: `src/pages/`, `src/components/`
- **Responsibility**: Render UI screens and handle user interactions
- **Technologies**: React Native, React Navigation
- **Components**:
  - Screen components (pages)
  - UI components (buttons, inputs, cards)
  - Navigation containers

### 2. State Management Layer
- **Location**: `src/context/`
- **Responsibility**: Manage application state
- **Technologies**: React Context API, Expo Secure Store, AsyncStorage
- **Components**:
  - AuthContext - manages user authentication state
  - Token storage and retrieval
  - User session management

### 3. API Integration Layer
- **Location**: `src/services/`
- **Responsibility**: Handle all backend communication
- **Technologies**: Axios, HTTP client
- **Features**:
  - Request/response interceptors
  - Automatic authentication token injection
  - Error handling and formatting
  - Organized endpoints by feature

### 4. Utilities & Helpers
- **Location**: `src/services/utils.js`, `src/hooks/`
- **Responsibility**: Provide reusable functions and hooks
- **Functions**:
  - Date/time formatting
  - Currency formatting
  - Input validation
  - Data transformation

## Data Flow

### Authentication Flow
```
User Input (Email/Password)
    ↓
AuthContext.sign_in()
    ↓
API Call: POST /auth/login
    ↓
Response: Token + User Data
    ↓
SecureStore.setItemAsync(token)
AsyncStorage.setItem(userData)
    ↓
Update AuthContext state
    ↓
Navigate to App Tabs
```

### Package Listing Flow
```
Page Component mounts
    ↓
useEffect calls fetchPackages()
    ↓
packageAPI.getAll()
    ↓
API Call with Auth Token
    ↓
Response: Package Array
    ↓
setState(packages)
    ↓
Render FlatList with packages
```

### Payment Flow
```
User navigates to Payment screen
    ↓
fetchBookingDetails()
    ↓
API Call: GET /bookings/:id
    ↓
Display booking summary
    ↓
User enters payment details
    ↓
User submits form
    ↓
Validate payment data
    ↓
paymentAPI.initiatePayment()
    ↓
API Call: POST /payments/initiate
    ↓
Success/Error response
    ↓
Display result and navigate
```

## File Structure and Responsibilities

```
App.js
├── Creates navigation structure
├── Manages auth-based routing
├── Sets up Stack and Tab navigators
└── Renders RootNavigator

AuthContext.js
├── Creates auth context
├── Manages user login/logout
├── Handles token storage
├── Provides auth methods to components
└── Manages loading states

api.js
├── Creates Axios instance
├── Sets up interceptors
├── Defines API endpoints
├── Exports organized API methods
└── Handles request/response

Pages (login.js, package.js, etc.)
├── Receive props from navigation
├── Use Context for state
├── Call API services
├── Manage local component state
└── Render UI

Services/utils.js
├── Provides formatting functions
├── Validation helpers
├── Data transformation
└── Utility functions
```

## State Management Strategy

### Global State (Context)
- User authentication state
- User token
- User data (profile)
- Loading and error states

### Local State (useState)
- Form inputs
- UI state (modals, tabs)
- Pagination
- Component-specific data

### Storage
- **SecureStore**: Authentication tokens
- **AsyncStorage**: User data, preferences
- **Memory**: Temporary API responses

## Error Handling Strategy

```
API Request
    ↓
Interceptor: Add auth header
    ↓
Make request
    ↓
Response interceptor:
    - 401 → Clear token, redirect to login
    - 4xx → Pass error to component
    - 5xx → Show error message
    ↓
Component catches error
    ↓
Display Alert or Error message
    ↓
Offer retry option
```

## Navigation Structure

```
RootNavigator
├── AuthStack (if no token)
│   ├── Login
│   └── Register
└── AppTabs (if authenticated)
    ├── Packages Stack
    │   ├── PackageHome
    │   ├── PackageDetails
    │   └── Reviews
    ├── Destinations Stack
    │   └── DestinationHome
    └── Payments Stack
        └── PaymentHome
```

## Component Communication

### Parent to Child
- Props passing
- Example: `<PackageCard package={item} onPress={handlePress} />`

### Child to Parent
- Callbacks via props
- Example: `<Button onPress={() => handleDelete(id)} />`

### Between Screens
- Navigation params
- Example: `navigation.navigate('Reviews', { packageId: 123 })`

### Global State
- Context API
- Example: `const { user } = useContext(AuthContext)`

## Performance Considerations

1. **Rendering**
   - Use FlatList for long lists
   - Implement PureComponent or React.memo
   - Avoid unnecessary re-renders

2. **Images**
   - Cache images locally
   - Optimize image sizes
   - Use lazy loading

3. **API Calls**
   - Implement request caching
   - Debounce search requests
   - Batch requests when possible

4. **Bundle Size**
   - Code splitting
   - Tree shaking
   - Remove unused dependencies

## Security Considerations

1. **Authentication**
   - Tokens stored in Secure Store
   - Automatic token attachment to requests
   - Token validation on app start

2. **Data Encryption**
   - Use HTTPS only
   - Encrypt sensitive data in transit
   - Never store passwords

3. **Input Validation**
   - Validate on client side
   - Sanitize user inputs
   - Validate on server side

4. **Error Messages**
   - Don't expose sensitive information
   - Generic error messages for users
   - Detailed logs for developers

## Scalability Considerations

### Adding New Features
1. Create new page component in `src/pages/`
2. Add API endpoints in `src/services/api.js`
3. Create new navigation screen
4. Add route to appropriate Stack Navigator
5. Implement state management if needed

### Adding New Screens
1. Create screen component
2. Add to navigation
3. Configure route params
4. Test navigation flow

### Adding New API Endpoints
1. Add function in `src/services/api.js`
2. Import in components
3. Use in async functions
4. Handle errors

## Testing Strategy

### Unit Tests
- Utility functions
- Validation functions
- Date formatting

### Integration Tests
- API calls
- State management
- Navigation flow

### E2E Tests
- User workflows
- Payment flow
- Authentication flow

## Deployment Workflow

1. Development (localhost)
2. Staging (test server)
3. Production (live server)
4. Build APK/IPA for app stores
5. Monitor and log errors

## Dependencies and Versions

- React: 19.1.0
- React Native: 0.81.5
- Expo: 54.0.32
- React Navigation: 6.x
- Axios: 1.6.2
- Secure Store: 13.0.2

## Future Enhancements

1. Implement Redux for complex state
2. Add offline-first capabilities
3. Implement background sync
4. Add push notifications
5. Implement analytics
6. Add dark mode support
7. Multi-language support
8. Enhanced caching strategy

## Documentation Links

- React Native: https://reactnative.dev/docs/getting-started
- Expo: https://docs.expo.dev
- Navigation: https://reactnavigation.org/docs/getting-started
- Axios: https://axios-http.com/docs/intro

---
**Last Updated**: January 30, 2026
**Version**: 1.0.0
