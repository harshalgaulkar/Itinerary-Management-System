# API Endpoints Documentation

Complete documentation of all available API endpoints in the IMS Frontend application.

## Base Configuration

- **Base URL**: `http://localhost:4000` (or `VITE_API_URL` from environment)
- **Timeout**: 10 seconds
- **Authentication**: Bearer token in Authorization header
- **User ID**: Passed in `user_id` header

---

## User APIs

### Authentication

#### Sign In
```javascript
userAPI.signin(email, password)
POST /users/signin
```
- **Parameters**: `email` (string), `password` (string)
- **Returns**: User object with token and role

#### Sign Up
```javascript
userAPI.signup(userData)
POST /users/signup
```
- **Parameters**: `userData` (object with email, password, full_name, phone, etc.)
- **Returns**: User object with token and role

### Profile Management

#### Get Profile
```javascript
userAPI.getProfile(userId)
GET /users/profile/{userId}
```
- **Parameters**: `userId` (string/number)
- **Returns**: User profile object

#### Update Profile
```javascript
userAPI.updateProfile(userId, userData)
PUT /users/update/{userId}
```
- **Parameters**: `userId` (string/number), `userData` (object with updated fields)
- **Returns**: Updated user object

#### Update Password
```javascript
userAPI.updatePassword(userId, oldPassword, newPassword)
PUT /users/{userId}/password
```
- **Parameters**: `userId`, `oldPassword`, `newPassword` (all strings)
- **Returns**: Success confirmation

#### Delete Account
```javascript
userAPI.deleteAccount(userId)
DELETE /users/delete/{userId}
```
- **Parameters**: `userId`
- **Returns**: Success confirmation

### User Information

#### Get User by ID
```javascript
userAPI.getUserById(userId)
GET /users/{userId}
```
- **Returns**: User object

#### Get All Users
```javascript
userAPI.getAllUsers()
GET /users
```
- **Returns**: Array of user objects (admin only)

#### Get User Bookings
```javascript
userAPI.getUserBookings(userId)
GET /users/bookings/{userId}
```
- **Returns**: Array of user's booking objects

---

## Destination APIs

#### Get All Destinations
```javascript
destinationAPI.getAll(page = 1, limit = 10, filters = {})
GET /destinations
```
- **Parameters**: 
  - `page` (number): Page number for pagination
  - `limit` (number): Items per page
  - `filters` (object): Additional filters like name, category, etc.
- **Returns**: Paginated list of destinations

#### Get Destination by ID
```javascript
destinationAPI.getById(id)
GET /destinations/{id}
```
- **Returns**: Single destination object

#### Get Destination Packages
```javascript
destinationAPI.getPackages(id)
GET /destinations/{id}/packages
```
- **Returns**: Array of packages available for destination

#### Search Destinations
```javascript
destinationAPI.search(searchTerm)
GET /destinations/search
```
- **Parameters**: `searchTerm` (string)
- **Returns**: Array of matching destinations

#### Create Destination (Admin)
```javascript
destinationAPI.create(data)
POST /destinations
```
- **Parameters**: `data` (object with name, description, image_url, etc.)
- **Returns**: Created destination object

#### Update Destination (Admin)
```javascript
destinationAPI.update(id, data)
PUT /destinations/{id}
```
- **Parameters**: `id`, `data` (object with fields to update)
- **Returns**: Updated destination object

#### Delete Destination (Admin)
```javascript
destinationAPI.delete(id)
DELETE /destinations/{id}
```
- **Returns**: Success confirmation

---

## Package APIs

#### Get All Packages
```javascript
packageAPI.getAll(page = 1, limit = 10, filters = {})
GET /packages
```
- **Parameters**: `page`, `limit`, `filters` (title, destination, price range, duration, etc.)
- **Returns**: Paginated list of packages

#### Get Package by ID
```javascript
packageAPI.getById(id)
GET /packages/{id}
```
- **Returns**: Single package object

#### Get Package Dates
```javascript
packageAPI.getDates(id)
GET /packages/{id}/dates
```
- **Returns**: Array of available travel dates

#### Get Package Itineraries
```javascript
packageAPI.getItineraries(id)
GET /packages/{id}/itineraries
```
- **Returns**: Array of itinerary items with daily details

#### Get Package Reviews
```javascript
packageAPI.getReviews(id)
GET /packages/{id}/reviews
```
- **Returns**: Array of customer reviews

#### Get Featured Packages
```javascript
packageAPI.getFeatured()
GET /packages/featured
```
- **Returns**: Array of featured/promoted packages

#### Search Packages
```javascript
packageAPI.search(searchTerm)
GET /packages/search
```
- **Parameters**: `searchTerm`
- **Returns**: Array of matching packages

#### Create Package (Admin)
```javascript
packageAPI.create(data)
POST /packages
```
- **Parameters**: `data` (object with title, description, duration_days, base_price, etc.)
- **Returns**: Created package object

#### Update Package (Admin)
```javascript
packageAPI.update(id, data)
PUT /packages/{id}
```
- **Returns**: Updated package object

#### Delete Package (Admin)
```javascript
packageAPI.delete(id)
DELETE /packages/{id}
```
- **Returns**: Success confirmation

---

## Package Master APIs

Master packages are template packages with dates and itineraries managed separately.

#### Get All Master Packages
```javascript
packageMasterAPI.getAll(page = 1, limit = 10)
GET /packageMaster
```
- **Returns**: Paginated list of master packages

#### Get Master Package by ID
```javascript
packageMasterAPI.getById(id)
GET /packageMaster/{id}
```
- **Returns**: Single master package object

#### Get Master Package Itineraries
```javascript
packageMasterAPI.getItineraries(id)
GET /packageMaster/{id}/itineraries
```
- **Returns**: Array of itinerary items

#### Get Master Package Dates
```javascript
packageMasterAPI.getDates(id)
GET /packageMaster/{id}/dates
```
- **Returns**: Array of available dates

### Date Management

#### Add Date to Master Package
```javascript
packageMasterAPI.addDate(packageId, data)
POST /packageMaster/{packageId}/dates
```
- **Parameters**: `data` (start_date, end_date, available_seats, price_override, etc.)
- **Returns**: Created date record

#### Update Date
```javascript
packageMasterAPI.updateDate(packageId, dateId, data)
PUT /packageMaster/{packageId}/dates/{dateId}
```
- **Returns**: Updated date record

#### Delete Date
```javascript
packageMasterAPI.deleteDate(packageId, dateId)
DELETE /packageMaster/{packageId}/dates/{dateId}
```
- **Returns**: Success confirmation

### Itinerary Management

#### Add Itinerary
```javascript
packageMasterAPI.addItinerary(packageId, data)
POST /packageMaster/{packageId}/itineraries
```
- **Parameters**: `data` (day_number, title, description, activities, meals, etc.)
- **Returns**: Created itinerary record

#### Update Itinerary
```javascript
packageMasterAPI.updateItinerary(packageId, itineraryId, data)
PUT /packageMaster/{packageId}/itineraries/{itineraryId}
```
- **Returns**: Updated itinerary record

#### Delete Itinerary
```javascript
packageMasterAPI.deleteItinerary(packageId, itineraryId)
DELETE /packageMaster/{packageId}/itineraries/{itineraryId}
```
- **Returns**: Success confirmation

---

## Booking APIs

#### Get All Bookings (Admin)
```javascript
bookingAPI.getAll(filters = {})
GET /bookings
```
- **Parameters**: `filters` (status, date range, user, etc.)
- **Returns**: List of bookings

#### Get Booking by ID
```javascript
bookingAPI.getById(id)
GET /bookings/{id}
```
- **Returns**: Single booking object

#### Get User Bookings
```javascript
bookingAPI.getByUser(userId)
GET /bookings/user/{userId}
```
- **Returns**: Array of user's bookings

#### Get Booking Summary
```javascript
bookingAPI.getSummary(userId)
GET /bookings/user/{userId}/summary
```
- **Returns**: Summary statistics for user's bookings

#### Create Booking
```javascript
bookingAPI.create(data)
POST /bookings
```
- **Parameters**: `data` (package_id, user_id, travel_date, seats, special_requests, etc.)
- **Returns**: Created booking object

#### Update Booking
```javascript
bookingAPI.update(id, data)
PUT /bookings/{id}
```
- **Parameters**: `data` (fields to update)
- **Returns**: Updated booking object

#### Confirm Booking
```javascript
bookingAPI.confirm(id)
PUT /bookings/{id}/confirm
```
- **Returns**: Confirmed booking object

#### Cancel Booking
```javascript
bookingAPI.cancel(id, reason = '')
PUT /bookings/{id}/cancel
```
- **Parameters**: `reason` (optional cancellation reason)
- **Returns**: Cancelled booking object

#### Complete Booking
```javascript
bookingAPI.complete(id)
PUT /bookings/{id}/complete
```
- **Returns**: Completed booking object

#### Delete Booking (Admin)
```javascript
bookingAPI.delete(id)
DELETE /bookings/{id}
```
- **Returns**: Success confirmation

---

## Payment APIs

#### Get All Payments (Admin)
```javascript
paymentAPI.getAll(filters = {})
GET /payments
```
- **Parameters**: `filters` (status, date range, user, booking, etc.)
- **Returns**: List of payments

#### Get Payment by ID
```javascript
paymentAPI.getById(id)
GET /payments/{id}
```
- **Returns**: Single payment object

#### Get Payments for Booking
```javascript
paymentAPI.getByBooking(bookingId)
GET /payments/booking/{bookingId}
```
- **Returns**: Array of payments for booking

#### Get Payment Summary
```javascript
paymentAPI.getSummary(bookingId)
GET /payments/booking/{bookingId}/summary
```
- **Returns**: Payment summary for booking

#### Create Payment
```javascript
paymentAPI.create(data)
POST /payments
```
- **Parameters**: `data` (booking_id, amount, method, reference, etc.)
- **Returns**: Created payment object

#### Update Payment
```javascript
paymentAPI.update(id, data)
PUT /payments/{id}
```
- **Returns**: Updated payment object

#### Confirm Payment
```javascript
paymentAPI.confirm(id)
PUT /payments/{id}/confirm
```
- **Returns**: Confirmed payment object

#### Reject Payment
```javascript
paymentAPI.reject(id, reason = '')
PUT /payments/{id}/reject
```
- **Parameters**: `reason` (optional rejection reason)
- **Returns**: Rejected payment object

#### Process Refund
```javascript
paymentAPI.refund(paymentId, amount = null)
POST /payments/{paymentId}/refund
```
- **Parameters**: `amount` (optional, full refund if null)
- **Returns**: Refund record

#### Delete Payment (Admin)
```javascript
paymentAPI.delete(id)
DELETE /payments/{id}
```
- **Returns**: Success confirmation

---

## Review APIs

#### Get All Reviews (Admin)
```javascript
reviewAPI.getAll(filters = {})
GET /reviews
```
- **Parameters**: `filters` (rating, date range, user, package, etc.)
- **Returns**: List of reviews

#### Get Review by ID
```javascript
reviewAPI.getById(id)
GET /reviews/{id}
```
- **Returns**: Single review object

#### Get Reviews for Package
```javascript
reviewAPI.getByPackage(packageId)
GET /reviews/package/{packageId}
```
- **Returns**: Array of reviews for package

#### Get Reviews by User
```javascript
reviewAPI.getByUser(userId)
GET /reviews/user/{userId}
```
- **Returns**: Array of reviews by user

#### Get Rating Summary
```javascript
reviewAPI.getRatingSummary(packageId)
GET /reviews/package/{packageId}/summary
```
- **Returns**: Rating statistics (average, count, distribution)

#### Create Review
```javascript
reviewAPI.create(data)
POST /reviews
```
- **Parameters**: `data` (package_id, user_id, rating, title, content, etc.)
- **Returns**: Created review object

#### Update Review
```javascript
reviewAPI.update(id, data)
PUT /reviews/{id}
```
- **Returns**: Updated review object

#### Delete Review
```javascript
reviewAPI.delete(id)
DELETE /reviews/{id}
```
- **Returns**: Success confirmation

---

## Admin APIs

### User Management

#### Create User
```javascript
adminAPI.createUser(userData)
POST /admin/users/create
```
- **Parameters**: `userData` (email, password, full_name, phone, role, etc.)
- **Returns**: Created user object

#### Get All Users
```javascript
adminAPI.getAllUsers()
GET /admin/users
```
- **Returns**: List of all users

#### Get User by ID
```javascript
adminAPI.getUserById(userId)
GET /admin/users/{userId}
```
- **Returns**: User object

#### Update User Role
```javascript
adminAPI.updateUserRole(userId, roleData)
PUT /admin/users/{userId}/role
```
- **Parameters**: `roleData` (object with role: 'admin' | 'customer')
- **Returns**: Updated user object

#### Delete User
```javascript
adminAPI.deleteUser(userId)
DELETE /admin/users/{userId}
```
- **Returns**: Success confirmation

### Dashboard Statistics

#### Get Dashboard Stats
```javascript
adminAPI.getDashboardStats()
GET /admin/dashboard/stats
```
- **Returns**: Overall dashboard statistics (bookings, revenue, users, etc.)

#### Get Revenue Stats
```javascript
adminAPI.getRevenueStats(filters = {})
GET /admin/dashboard/revenue
```
- **Parameters**: `filters` (date range, destination, package, etc.)
- **Returns**: Revenue statistics

#### Get Booking Stats
```javascript
adminAPI.getBookingStats(filters = {})
GET /admin/dashboard/bookings
```
- **Parameters**: `filters` (status, date range, destination, etc.)
- **Returns**: Booking statistics

#### Get User Stats
```javascript
adminAPI.getUserStats()
GET /admin/dashboard/users
```
- **Returns**: User statistics (total, active, new, etc.)

### Destination Management

#### Create Destination
```javascript
adminAPI.createDestination(data)
POST /admin/destinations/create
```
- **Returns**: Created destination

#### Update Destination
```javascript
adminAPI.updateDestination(id, data)
PUT /admin/destinations/{id}
```
- **Returns**: Updated destination

#### Delete Destination
```javascript
adminAPI.deleteDestination(id)
DELETE /admin/destinations/{id}
```
- **Returns**: Success confirmation

### Package Management

#### Create Package
```javascript
adminAPI.createPackage(data)
POST /admin/packages/create
```
- **Returns**: Created package

#### Update Package
```javascript
adminAPI.updatePackage(id, data)
PUT /admin/packages/{id}
```
- **Returns**: Updated package

#### Delete Package
```javascript
adminAPI.deletePackage(id)
DELETE /admin/packages/{id}
```
- **Returns**: Success confirmation

---

## Error Handling

All API calls can throw errors. Use try-catch blocks or the custom hooks provided:

```javascript
import { useMutation } from './hooks/useAPI';
import { userAPI } from './services/endpoints';

const { mutate: login, loading, error } = useMutation(userAPI.signin);

try {
  await login(email, password);
} catch (err) {
  console.error('Login failed:', error);
}
```

Common error status codes:
- **400**: Bad request (validation error)
- **401**: Unauthorized (invalid/expired token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not found
- **500**: Server error

---

## Usage Examples

### Using Direct API Calls

```javascript
import { packageAPI } from '@/services/endpoints';

const packages = await packageAPI.getAll(1, 10, { title: 'Beach' });
```

### Using Custom Hooks

```javascript
import { useFetch, useMutation } from '@/hooks/useAPI';
import { packageAPI, bookingAPI } from '@/services/endpoints';

// Fetch packages
const { data: packages, loading, error, refetch } = useFetch(
  () => packageAPI.getAll(1, 10),
  []
);

// Create booking
const { mutate: createBooking, loading: creating } = useMutation(
  bookingAPI.create
);
```

### Using API Service Factory

```javascript
import { apiService } from '@/services';

const result = await apiService.packages.getAll(1, 10);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```
