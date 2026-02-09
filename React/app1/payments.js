// Payments routes for IMSBackend
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const pool = require('../utils/db');
const result = require('../utils/result');

// Helper: generate unique transaction ID
function generateTransactionId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TXN${timestamp}${random}`;
}

// Middleware: handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(result.createResult('Validation error: ' + errors.array().map(e => e.msg).join(', ')));
  }
  next();
};

// POST /payments/process - Process a payment for a booking
router.post('/process',
  body('bookingId').isInt().withMessage('Booking ID must be a valid integer'),
  body('method').isIn(['card', 'upi', 'netbanking']).withMessage('Invalid payment method'),
  body('amount').optional(),
  handleValidationErrors,
  (req, res) => {
    const user_id = req.headers.user_id;
    console.log('[Payments Route] POST /payments/process');
    console.log('[Payments Route] user_id from header:', user_id);
    console.log('[Payments Route] Request body:', req.body);
    
    if (!user_id) {
      console.log('[Payments Route] ERROR: No user_id in headers');
      return res.json(result.createResult('Unauthorized: User ID required'));
    }

    const { bookingId, method, amount } = req.body;
    console.log('[Payments Route] Extracted: bookingId=%d, method=%s, amount=%s', bookingId, method, amount);

    // Verify the booking exists and belongs to the user
    const checkBookingSql = 'SELECT booking_id, user_id, status, total_price FROM bookings WHERE booking_id = ?';
    console.log('[Payments Route] Executing query:', checkBookingSql, [bookingId]);
    
    pool.query(checkBookingSql, [bookingId], (err, rows) => {
      if (err) {
        console.error('[Payments Route] ERROR fetching booking:', err);
        return res.json(result.createResult('Database error: ' + err.message));
      }
      
      console.log('[Payments Route] Booking query result:', rows);
      
      if (!rows || rows.length === 0) {
        console.log('[Payments Route] ERROR: Booking not found for bookingId:', bookingId);
        return res.json(result.createResult('Booking not found'));
      }

      const booking = rows[0];
      console.log('[Payments Route] Booking found:', booking);

      // Check if user owns this booking
      if (booking.user_id != user_id) {
        console.log('[Payments Route] ERROR: User %d does not own booking %d (owner: %d)', user_id, bookingId, booking.user_id);
        return res.json(result.createResult('Unauthorized: Cannot process payment for other users bookings'));
      }

      // Check if already paid
      if (booking.status === 'confirmed' || booking.status === 'completed') {
        console.log('[Payments Route] ERROR: Booking already paid. Status:', booking.status);
        return res.json(result.createResult('Booking already paid'));
      }

      // Use booking total_price as amount if not provided
      const paymentAmount = amount || booking.total_price;
      console.log('[Payments Route] Payment amount to process:', paymentAmount);

      // Verify amount matches booking total_price (if amount was provided)
      if (amount && parseFloat(amount) !== parseFloat(booking.total_price)) {
        console.log('[Payments Route] ERROR: Amount mismatch. Provided: %f, Booking total: %f', amount, booking.total_price);
        return res.json(result.createResult('Payment amount does not match booking total'));
      }

      // Generate transaction ID
      const transactionId = generateTransactionId();
      console.log('[Payments Route] Generated transaction ID:', transactionId);

      // Insert into payments table using current DB schema: txn_reference and paid_on
      const paymentSql = `
        INSERT INTO payments (booking_id, txn_reference, amount, method, status, paid_on)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;

      console.log('[Payments Route] Executing payment insert:', paymentSql);
      console.log('[Payments Route] With values:', [bookingId, transactionId, paymentAmount, method, 'success']);

      pool.query(
        paymentSql,
        [bookingId, transactionId, paymentAmount, method, 'success'],
        (err, paymentResult) => {
          if (err) {
            console.error('[Payments Route] ERROR inserting payment:', err);
            return res.json(result.createResult('Failed to process payment: ' + err.message));
          }

          console.log('[Payments Route] ✅ Payment inserted successfully:', paymentResult);

          // Update booking status to confirmed
          const updateBookingSql = 'UPDATE bookings SET status = ? WHERE booking_id = ?';
          console.log('[Payments Route] Executing booking update:', updateBookingSql, ['confirmed', bookingId]);
          
          pool.query(updateBookingSql, ['confirmed', bookingId], (err) => {
            if (err) {
              console.error('[Payments Route] ERROR updating booking:', err);
              return res.json(result.createResult('Payment processed but failed to update booking: ' + err.message));
            }

            console.log('[Payments Route] ✅ Booking status updated to confirmed');

            // Return success with transaction details
            const successResponse = {
              success: true,
              transactionId: transactionId,
              bookingId: bookingId,
              amount: paymentAmount,
              method: method,
              status: 'success',
              message: 'Payment processed successfully',
            };
            
            console.log('[Payments Route] ✅ Sending success response:', successResponse);
            res.json(result.createResult(null, successResponse));
          });
        }
      );
    });
  }
);

// GET /payments/status/:transactionId - Get payment status
router.get('/status/:transactionId', (req, res) => {
  const user_id = req.headers.user_id;
  if (!user_id) {
    return res.json(result.createResult('Unauthorized: User ID required'));
  }

  const { transactionId } = req.params;

  const sql = `
    SELECT p.payment_id, p.booking_id, b.user_id, p.txn_reference AS transaction_id, p.amount, p.method, 
           p.status, p.paid_on AS created_at
    FROM payments p
    JOIN bookings b ON p.booking_id = b.booking_id
    WHERE p.txn_reference = ? AND b.user_id = ?
  `;

  pool.query(sql, [transactionId, user_id], (err, rows) => {
    if (err) {
      console.error(err);
      return res.json(result.createResult('Database error'));
    }
    if (!rows || rows.length === 0) {
      return res.json(result.createResult('Payment not found'));
    }

    const payment = rows[0];
    res.json(result.createResult(null, payment));
  });
});

// GET /payments/history - Get payment history for logged in user
router.get('/history', (req, res) => {
  const user_id = req.headers.user_id;
  if (!user_id) {
    return res.json(result.createResult('Unauthorized: User ID required'));
  }

  const sql = `
    SELECT p.payment_id, p.booking_id, b.user_id, p.txn_reference AS transaction_id, p.amount, p.method, 
           p.status, p.paid_on AS created_at
    FROM payments p
    JOIN bookings b ON p.booking_id = b.booking_id
    WHERE b.user_id = ?
    ORDER BY p.paid_on DESC
  `;

  pool.query(sql, [user_id], (err, rows) => {
    if (err) {
      console.error(err);
      return res.json(result.createResult('Database error'));
    }

    res.json(result.createResult(null, rows || []));
  });
});

module.exports = router;
