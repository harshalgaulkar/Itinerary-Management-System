const express = require('express')
const cors = require('cors')


const app = express()
// Middleware
app.use(cors())
app.use(express.json())

// Routes
const userRouter = require('./routes/user')
const destinationRouter = require('./routes/destination')
const packageRouter = require('./routes/packages')
const packageMasterRouter = require('./routes/packagemaster')
const packageItineraryRouter = require('./routes/packageItenerary')
const bookingsRouter = require('./routes/bookings')
const paymentsRouter = require('./routes/payments')
const reviewsRouter = require('./routes/reviews')
const adminRouter = require('./routes/admin')
const authorizeUser = require('./utils/authuser')

// Public Routes (no authentication required)
app.use('/users', userRouter)
app.use('/destinations', destinationRouter)
app.use('/packages', packageRouter)
app.use('/admin', adminRouter); // Admin routes must be before auth middleware for first admin signup

// Protected Routes (authentication required)
app.use(authorizeUser)
app.use('/packageMaster', packageMasterRouter)
app.use('/packageItenerary', packageItineraryRouter)
app.use('/bookings', bookingsRouter)
app.use('/payments', paymentsRouter)
app.use('/reviews', reviewsRouter);

// Start the server on port 4000
app.listen(4000, () => {
    console.log('Server started at port 4000')
})