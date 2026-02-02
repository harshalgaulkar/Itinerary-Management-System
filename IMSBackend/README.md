# IMS Backend - Travel Itinerary Management System

A robust Node.js and Express-based backend API for a comprehensive Travel Itinerary Management System. This system provides complete functionality for managing travel packages, destinations, bookings, payments, reviews, and user accounts with role-based access control.

## Features

### Core Functionality
- **User Management**: Registration, login, profile management with JWT authentication
- **Destination Management**: Browse and manage travel destinations
- **Package Management**: Create, read, update, and delete travel packages
- **Package Itinerary**: Detailed day-by-day package itineraries with activities and details
- **Booking System**: Complete booking workflow with status tracking
- **Payment Integration**: Secure payment processing and tracking
- **Reviews & Ratings**: User feedback and ratings for packages and destinations
- **Admin Panel**: Comprehensive admin dashboard for system management

### Security Features
- **JWT-based Authentication**: Secure token-based user authentication
- **Password Encryption**: bcrypt-based password hashing for data security
- **Role-Based Access Control**: Different permission levels for users and administrators
- **CORS Support**: Cross-Origin Resource Sharing for frontend integration
- **Input Validation**: Express-validator for robust input validation

## Tech Stack

- **Runtime**: Node.js (JavaScript)
- **Framework**: Express.js 5.2.1
- **Database**: MySQL 2 (mysql2)
- **Authentication**: JWT (jsonwebtoken)
- **Encryption**: bcrypt
- **Middleware**: CORS, express-validator
- **File Upload**: Multer

## Dependencies

```json
{
  "bcrypt": "^6.0.0",
  "cors": "^2.8.5",
  "express": "^5.2.1",
  "express-validator": "^7.3.1",
  "jsonwebtoken": "^9.0.3",
  "multer": "^2.0.2",
  "mysql2": "^3.15.3"
}
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL Database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd IMSBackend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure database**
   - Create a MySQL database
   - Update database credentials in `utils/config.js`
   - Ensure your database credentials match the configuration

4. **Start the server**
   ```bash
   node Server.js
   ```

The server will start on `http://localhost:4000`

## Project Structure

```
IMSBackend/
├── Server.js                 # Main application entry point
├── package.json             # Project dependencies
├── routes/                  # API route handlers
│   ├── user.js             # User authentication and profile
│   ├── admin.js            # Admin panel operations
│   ├── destination.js      # Destination management
│   ├── packages.js         # Package management
│   ├── packagemaster.js    # Package master data
│   ├── packageItenerary.js # Itinerary details
│   ├── bookings.js         # Booking operations
│   ├── payments.js         # Payment processing
│   └── reviews.js          # Reviews and ratings
├── utils/                  # Utility functions
│   ├── authuser.js         # JWT authentication middleware
│   ├── config.js           # Database configuration
│   ├── db.js              # Database connection
│   └── result.js          # Response formatting
├── scripts/               # Helper scripts
│   └── check_conn.js      # Database connection verification
└── Documentation/         # Comprehensive documentation
    ├── README.md
    ├── API_DOCUMENTATION.md
    ├── QUICK_REFERENCE.md
    └── SETUP_AND_TESTING_GUIDE.md
```

## API Routes

### Public Routes (No Authentication Required)
- **Users**: `POST /users/register`, `POST /users/login`
- **Destinations**: `GET /destinations`, `GET /destinations/:id`
- **Packages**: `GET /packages`, `GET /packages/:id`
- **Admin**: Initial admin setup and management

### Protected Routes (Authentication Required)
- **Package Master**: `GET /packageMaster`, `POST /packageMaster`
- **Package Itinerary**: `GET /packageItenerary`, `POST /packageItenerary`
- **Bookings**: `GET /bookings`, `POST /bookings`, `PUT /bookings/:id`
- **Payments**: `GET /payments`, `POST /payments`
- **Reviews**: `GET /reviews`, `POST /reviews`

For detailed API documentation, see [API_DOCUMENTATION.md](./Documentation/API_DOCUMENTATION.md)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login**: Obtain a JWT token
2. **Request**: Include token in `Authorization: Bearer <token>` header
3. **Access**: Protected routes verify and validate the token

## Database Schema

The system uses MySQL with the following primary tables:
- `users` - User accounts and profiles
- `destinations` - Travel destinations
- `packages` - Travel packages
- `packageitinerary` - Day-by-day itinerary details
- `bookings` - User bookings
- `payments` - Payment records
- `reviews` - User reviews and ratings
- `admin` - Administrator accounts

## Testing

### Using cURL
```bash
# Register a new user
curl -X POST http://localhost:4000/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'

# Get all packages
curl http://localhost:4000/packages
```

### Using Postman
1. Import the API endpoints
2. Set up collection variables for base URL and token
3. Test endpoints with pre-configured requests

For comprehensive testing guide, see [SETUP_AND_TESTING_GUIDE.md](./Documentation/SETUP_AND_TESTING_GUIDE.md)

## Deployment

The application is production-ready and can be deployed to:
- Local servers (Linux/Windows)
- Cloud platforms (AWS, Azure, Heroku, etc.)
- Docker containers
- VPS/Dedicated servers

### Environment Configuration
- Update database credentials for production
- Configure CORS origins for your frontend domain
- Set appropriate JWT secret keys
- Enable HTTPS in production

## Documentation

Comprehensive documentation is available in the `Documentation/` folder:

- **[PROJECT_COMPLETION_REPORT.md](./Documentation/PROJECT_COMPLETION_REPORT.md)** - Executive summary and project overview
- **[API_DOCUMENTATION.md](./Documentation/API_DOCUMENTATION.md)** - Complete API reference
- **[QUICK_REFERENCE.md](./Documentation/QUICK_REFERENCE.md)** - Quick lookup guide
- **[SETUP_AND_TESTING_GUIDE.md](./Documentation/SETUP_AND_TESTING_GUIDE.md)** - Setup and testing instructions
- **[IMPLEMENTATION_SUMMARY.md](./Documentation/IMPLEMENTATION_SUMMARY.md)** - Implementation details

## API Features by Role

### Customer Role
- View destinations and packages
- Create and manage personal bookings
- Make payments
- Submit reviews and ratings
- Update personal profile

### Admin Role
- Create and manage packages
- Manage destinations
- View all bookings and payments
- Monitor system activities
- User management

## Important Notes

- **Database Setup Required**: MySQL database must be configured before running
- **Port 4000**: The server runs on port 4000 by default
- **JWT Secret**: Ensure JWT secret is configured in production
- **CORS Configuration**: Configure CORS origins for your frontend application

## Troubleshooting

### Connection Issues
```bash
# Verify database connection
node scripts/check_conn.js
```

### Common Problems
- Database connection failure: Check `utils/config.js` for correct credentials
- Port already in use: Change port in `Server.js`
- Module not found: Run `npm install` to install dependencies

## License

This project is part of the IMS (Itinerary Management System) suite.

## Development

### Code Structure
- Clean separation of concerns with route modules
- Middleware for authentication and validation
- Utility functions for database operations
- Comprehensive error handling

### Best Practices
- Input validation on all endpoints
- Password encryption for security
- JWT token expiration
- Proper HTTP status codes
- CORS configuration for cross-origin requests

## Workflow

1. **User Registration**: Create account with email and password
2. **Authentication**: Login to get JWT token
3. **Browse Content**: View destinations and packages
4. **Create Booking**: Select package and book
5. **Payment**: Process payment for booking
6. **Review**: Leave feedback after travel

## Support

For issues, questions, or contributions, please refer to the documentation in the `Documentation/` folder or contact the development team.

---

**Happy Travels!**

*Last Updated: January 2026*
