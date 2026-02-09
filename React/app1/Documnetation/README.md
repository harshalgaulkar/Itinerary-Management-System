# IMS - Inventory Management System (Mobile App)

A React Native mobile application for managing inventory, packages, bookings, payments, and reviews using Expo.

## Features

✅ **User Authentication**
- User Registration and Login
- Secure token storage with Expo Secure Store
- Persistent authentication state

✅ **Package Management**
- Browse all available packages
- View detailed package information
- Search and filter packages

✅ **Destinations**
- Explore destinations
- View destination details
- See packages available for each destination

✅ **Bookings**
- Create bookings for packages
- View booking history
- Cancel bookings

✅ **Payments**
- Secure payment processing
- Multiple payment methods (Card, UPI)
- Payment history

✅ **Reviews**
- Read and write reviews
- Rate packages
- View community feedback

## Technology Stack

- **Frontend Framework**: React Native 0.81.5
- **Build Tool**: Expo 54.0.32
- **Navigation**: React Navigation 6.x
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Secure Storage**: Expo Secure Store
- **Local Storage**: @react-native-async-storage/async-storage

## Project Structure

```
app1/
├── src/
│   ├── components/         # Reusable components
│   ├── context/           # AuthContext and state management
│   │   └── AuthContext.js
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Screen components
│   │   ├── login.js
│   │   ├── register.js
│   │   ├── splash.js
│   │   ├── package.js
│   │   ├── packagemaster.js
│   │   ├── payments.js
│   │   ├── reviews.js
│   │   └── destination.js
│   └── services/          # API integration
│       └── api.js
├── App.js                 # Main app file with navigation
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── index.js              # Entry point
```

## Installation

### Prerequisites
- Node.js 16+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Android Studio or Xcode (for native builds)

### Setup Steps

1. **Clone or navigate to the project**
```bash
cd d:\IMS\app1
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API endpoint**
- Copy `.env.example` to `.env`
- Update the `API_BASE_URL` to point to your backend server

4. **Start the development server**
```bash
npm start
```

5. **Run on Android**
```bash
npm run android
```

6. **Run on iOS**
```bash
npm run ios
```

7. **Run on Web**
```bash
npm run web
```

## API Endpoints

The app communicates with the following backend endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Packages
- `GET /api/packages` - Get all packages
- `GET /api/packages/:id` - Get package details
- `POST /api/packages` - Create package (admin)
- `PUT /api/packages/:id` - Update package (admin)
- `DELETE /api/packages/:id` - Delete package (admin)

### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get destination details
- `POST /api/destinations` - Create destination (admin)
- `PUT /api/destinations/:id` - Update destination (admin)
- `DELETE /api/destinations/:id` - Delete destination (admin)

### Bookings
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `POST /api/bookings/:id/cancel` - Cancel booking

### Payments
- `POST /api/payments/initiate` - Initiate payment
- `GET /api/payments/status/:transactionId` - Get payment status
- `GET /api/payments/history` - Get payment history

### Reviews
- `GET /api/reviews/package/:packageId` - Get package reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## File Descriptions

### AuthContext.js
Manages user authentication state and provides auth methods:
- `sign_in()` - Authenticate user
- `sign_up()` - Register new user
- `sign_out()` - Logout user
- Token persistence with Expo Secure Store

### api.js
Centralized API client with:
- Axios interceptors for authentication
- Pre-configured endpoints for all features
- Automatic token attachment to requests
- Error handling

### Pages
- **login.js** - User login interface
- **register.js** - User registration form
- **splash.js** - Splash/loading screen
- **package.js** - Package listing and browsing
- **packagemaster.js** - Detailed package view
- **payments.js** - Payment processing interface
- **reviews.js** - Package reviews and ratings
- **destination.js** - Destination listing

## Authentication Flow

1. User launches app
2. Splash screen checks for existing auth token
3. If token exists → Show app tabs
4. If no token → Show login/register screens
5. On successful login → Token saved securely → Navigate to app
6. On logout → Token deleted → Return to login

## State Management

Uses React Context API with:
- **AuthContext** - Manages user authentication state
- **useContext** hook - Access auth state in components
- **Async Storage** - Persist user data locally
- **Secure Store** - Store tokens securely

## Error Handling

- API errors caught and displayed with Alert
- Token expiration handled automatically
- Network errors with retry options
- Form validation before submission

## Security Features

- Secure token storage with Expo Secure Store
- Bearer token authentication
- Automatic request/response interceptors
- Secure HTTPS communication (in production)
- Password validation on registration

## Development

### Adding a New Page
1. Create `.js` file in `src/pages/`
2. Import in `App.js`
3. Add route/navigation configuration

### Adding a New API Endpoint
1. Add function to appropriate API section in `services/api.js`
2. Use in components with async/await

### Styling
- Uses React Native StyleSheet
- Consistent color scheme throughout
- Responsive design for all screen sizes

## Testing

To test the app:

1. **Login/Register**
   - Test with valid and invalid credentials
   - Check error messages display correctly

2. **Package Browsing**
   - Verify packages load
   - Test package details
   - Check filtering options

3. **Payments**
   - Test payment form validation
   - Verify successful/failed payments

4. **Reviews**
   - Submit new reviews
   - View existing reviews
   - Check rating system

## Troubleshooting

### Port Already in Use
```bash
expo start --clear
```

### Dependencies Issues
```bash
rm -rf node_modules
npm install
```

### Token Expiration
- Automatically handled by API interceptors
- User will be redirected to login

### Network Issues
- Check backend server is running
- Verify API_BASE_URL is correct
- Check internet connection

## Backend Integration

This app is designed to work with the **IMSBackend** API server.

To connect:
1. Ensure backend is running on `http://localhost:3000`
2. Update `API_BASE_URL` in `services/api.js` if using different URL
3. Verify all required endpoints are implemented

## Environment Variables

Create `.env` file from `.env.example`:
```
REACT_APP_API_BASE_URL=http://localhost:3000/api
APP_NAME=IMS - Inventory Management System
DEBUG=false
```

## Performance Tips

- Lazy load heavy components
- Use FlatList for long lists
- Optimize image sizes
- Use proper loading states
- Clear state when navigating

## Contributing

1. Create a new branch for features
2. Follow existing code structure
3. Test thoroughly before submitting
4. Update documentation

## License

All rights reserved

## Support

For issues or questions, check:
- Backend API documentation
- React Native docs: https://reactnative.dev
- Expo docs: https://docs.expo.dev
- React Navigation: https://reactnavigation.org
