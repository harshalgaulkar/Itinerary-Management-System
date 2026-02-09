# IMS Mobile App - Setup & Deployment Guide

## Quick Start

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

### Installation Steps

1. **Navigate to project directory**
   ```bash
   cd d:\IMS\app1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   Or if you prefer yarn:
   ```bash
   yarn install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your backend API URL:
   ```
   REACT_APP_API_BASE_URL=http://your-backend-url:3000/api
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Run on your device or emulator**

   **Android:**
   ```bash
   npm run android
   ```
   
   **iOS:**
   ```bash
   npm run ios
   ```
   
   **Web:**
   ```bash
   npm run web
   ```

## Project Structure Explained

```
d:\IMS\app1/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── CommonComponents.js  # Loading, Error, Empty states
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context/                 # State management with Context API
│   │   └── AuthContext.js       # Authentication state
│   │
│   ├── hooks/                   # Custom React hooks
│   │   └── useAPI.js           # API request hook
│   │
│   ├── pages/                   # Screen components
│   │   ├── login.js            # User login screen
│   │   ├── register.js         # User registration
│   │   ├── splash.js           # Loading splash screen
│   │   ├── package.js          # Package list screen
│   │   ├── packagemaster.js    # Package details screen
│   │   ├── payments.js         # Payment processing screen
│   │   ├── reviews.js          # Reviews and ratings screen
│   │   └── destination.js      # Destination browsing
│   │
│   └── services/                # API and utilities
│       ├── api.js              # Axios API client
│       ├── config.js           # App configuration
│       ├── constants.js        # Constants and enums
│       ├── utils.js            # Utility functions
│       └── index.js            # Service exports
│
├── App.js                       # Main app with navigation setup
├── app.json                     # Expo configuration
├── package.json                 # Dependencies and scripts
├── index.js                     # Entry point
├── .env.example                 # Environment template
├── README.md                    # Project documentation
└── SETUP.md                     # This file

```

## File Descriptions

### Core Files

**App.js**
- Main application component
- Navigation setup (Stack and Tab navigators)
- Auth flow management
- Renders appropriate navigation based on authentication state

**AuthContext.js**
- Global authentication state management
- Methods: `sign_in()`, `sign_up()`, `sign_out()`
- Token persistence with Secure Store
- User data management

**api.js**
- Centralized API client using Axios
- Request/response interceptors
- Authentication header injection
- Error handling
- Organized endpoints by feature

### Page Components

**login.js** - User Login
- Email and password input fields
- Form validation
- Error message display
- Link to registration page
- Loading state handling

**register.js** - User Registration
- Multi-field form (First name, Last name, email, phone, password)
- Password confirmation validation
- Length and complexity requirements
- Link back to login

**splash.js** - Splash Screen
- Initial loading screen
- Token checking
- Navigation based on auth state
- Animated loading indicator

**package.js** - Package Listing
- Displays all available packages
- Card-based layout
- Package information display
- Navigation to package details
- Pull-to-refresh capability

**packagemaster.js** - Package Details
- Detailed package information
- Price and duration display
- Itinerary and inclusions
- Book now button
- Reviews link

**payments.js** - Payment Processing
- Booking summary display
- Payment method selection
- Card details form
- Payment processing
- Success/error handling

**reviews.js** - Package Reviews
- Display all package reviews
- Star rating system
- Write review form
- Submit review functionality
- User feedback management

**destination.js** - Destinations
- Browse all destinations
- Destination cards with images
- Package count per destination
- Navigation to packages

## API Integration

### Connecting to Backend

1. Update `src/services/api.js`
   - Change `API_BASE_URL` to your backend URL
   - Modify headers if needed
   - Add additional interceptors if required

2. Example:
   ```javascript
   const API_BASE_URL = 'http://localhost:3000/api';
   // or
   const API_BASE_URL = 'https://your-production-api.com/api';
   ```

### API Endpoints Required

The app expects the following endpoints:

```
Auth:
- POST /auth/login
- POST /auth/register
- POST /auth/logout
- GET /auth/profile

Packages:
- GET /packages
- GET /packages/:id
- POST /packages (admin)

Destinations:
- GET /destinations
- GET /destinations/:id

Bookings:
- GET /bookings
- POST /bookings
- GET /bookings/:id

Payments:
- POST /payments/initiate
- GET /payments/history

Reviews:
- GET /reviews/package/:packageId
- POST /reviews
```

## Development Workflow

### Starting Development Server

```bash
npm start
```

This shows a menu with options:
- `a` - Open on Android emulator/device
- `i` - Open on iOS simulator
- `w` - Open web browser
- `r` - Reload
- `q` - Quit

### Hot Reload

Changes to files automatically reload the app during development.

### Debugging

1. **Console Logs**
   ```bash
   # View logs in terminal where npm start is running
   npm start
   ```

2. **React DevTools**
   - Install: `npm install -g @react-devtools/core`
   - Use: `react-devtools` command

3. **Network Inspector**
   - Use browser DevTools for web version
   - Check network requests to API

## Building for Production

### Android APK Build

```bash
expo build:android -t apk
```

### iOS Build (requires paid Apple Developer account)

```bash
expo build:ios -t app
```

### Web Build

```bash
expo export:web
```

## Troubleshooting

### Common Issues

**1. Port 19000 Already in Use**
```bash
# Kill the process using the port
lsof -ti:19000 | xargs kill -9
# Or start on different port
expo start --port 19001
```

**2. Module Not Found Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
expo start --clear
```

**3. Token Expiration Issues**
- Check if backend is returning valid tokens
- Verify token format is correct (JWT)
- Check Secure Store is working

**4. API Connection Issues**
- Verify backend is running
- Check API_BASE_URL is correct
- Use tools like Postman to test endpoints
- Check CORS configuration on backend

**5. Android Emulator Issues**
```bash
# Clear Android emulator data
emulator -avd Pixel_API_30 -wipe-data

# Reset expo cache
expo start --clear
```

**6. Dependency Conflicts**
```bash
# Use npm audit to find issues
npm audit
npm audit fix

# Force specific versions if needed
npm install package-name@version --save
```

## Environment Variables

Create `.env` file in project root:

```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3000/api

# App Settings
APP_NAME=IMS - Inventory Management System
DEBUG=false

# Feature Flags
ENABLE_ADMIN=true
ENABLE_PAYMENTS=true
ENABLE_REVIEWS=true
```

## Performance Optimization

1. **Image Optimization**
   - Compress images before deploying
   - Use WebP format where possible
   - Implement lazy loading

2. **Code Splitting**
   - Use React.lazy for screen components
   - Dynamic imports for large modules

3. **State Management**
   - Use Context efficiently
   - Avoid unnecessary re-renders
   - Memoize components with React.memo

4. **API Calls**
   - Implement caching
   - Batch requests when possible
   - Use pagination for lists

## Security Best Practices

1. **Token Management**
   - Store tokens in Secure Store only
   - Never store in AsyncStorage
   - Implement token refresh logic

2. **API Security**
   - Always use HTTPS in production
   - Validate all user inputs
   - Implement rate limiting

3. **Sensitive Data**
   - Never commit secrets to git
   - Use environment variables
   - Encrypt sensitive data

## Testing

### Manual Testing Checklist

- [ ] User can login with valid credentials
- [ ] User cannot login with invalid credentials
- [ ] User can register new account
- [ ] User can view all packages
- [ ] User can view package details
- [ ] User can make bookings
- [ ] User can process payments
- [ ] User can submit reviews
- [ ] User can view reviews
- [ ] User can logout
- [ ] App handles network errors gracefully
- [ ] App persists login state after restart

## Deployment Checklist

- [ ] Update API URLs for production
- [ ] Set environment variables
- [ ] Remove all console.log statements
- [ ] Test all features thoroughly
- [ ] Update version number in package.json
- [ ] Create release notes
- [ ] Build APK/IPA files
- [ ] Test on real devices
- [ ] Submit to app stores

## Support Resources

- React Native Docs: https://reactnative.dev
- Expo Docs: https://docs.expo.dev
- React Navigation: https://reactnavigation.org
- Axios: https://axios-http.com
- Secure Store: https://docs.expo.dev/modules/expo-secure-store/

## Next Steps

1. Set up the backend API (IMSBackend)
2. Configure database and authentication
3. Deploy to development/staging environment
4. Conduct thorough testing
5. Deploy to production
6. Monitor performance and errors
7. Gather user feedback
8. Plan for updates and improvements

## Contact & Support

For issues or questions:
1. Check the README.md
2. Review error logs
3. Check backend API status
4. Verify network connectivity
5. Test with different devices

---

**Last Updated**: January 30, 2026
**Version**: 1.0.0
