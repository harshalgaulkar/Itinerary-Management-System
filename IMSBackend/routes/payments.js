// Payments routes for IMSBackend
const express = require('express')
const { body, query, validationResult } = require('express-validator')
const router = express.Router()

const pool = require('../utils/db')
const result = require('../utils/result')

// ===== HELPERS =====
function checkAdmin(userId, cb) {
    if (!userId) return cb(null, false)
    const sql = 'SELECT role FROM users WHERE user_id = ? LIMIT 1'
    pool.query(sql, [userId], (err, rows) => {
        if (err) return cb(err)
        if (!rows || rows.length === 0) return cb(null, false)
        return cb(null, rows[0].role === 'admin')
    })
}

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(result.createResult('Validation error: ' + errors.array().map(e => e.msg).join(', ')))
    }
    next()
}

// ===== VALIDATORS =====
const paginationValidators = [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('booking_id').optional().isInt(),
    query('status').optional().isIn(['success', 'failed', 'pending']),
    query('method').optional().isIn(['card', 'upi', 'netbanking', 'cash', 'other'])
]

const paymentBodyValidators = [
    body('booking_id').notEmpty().isInt().withMessage('Booking ID is required and must be a valid integer'),
    body('amount').notEmpty().isDecimal({ decimal_digits: '1,2' }).withMessage('Amount is required and must be a valid decimal'),
    body('method').optional().isIn(['card', 'upi', 'netbanking', 'cash', 'other']).withMessage('Invalid payment method'),
    body('txn_reference').optional().trim().isLength({ max: 255 }).withMessage('Transaction reference must be max 255 chars')
]

// ===== GET ALL PAYMENTS WITH FILTERS =====
// GET /payments - List payments with optional filters (admin see all, users see their own)
router.get('/',
    ...paginationValidators,
    handleValidationErrors,
    (req, res) => {
        const user_id = req.headers.user_id
        const { booking_id, status, method } = req.query
        const page = Math.max(req.query.page || 1, 1)
        const limit = Math.min(req.query.limit || 10, 100)
        const offset = (page - 1) * limit

        checkAdmin(user_id, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Error checking admin status'))
            }

            let sql = `SELECT p.payment_id, p.booking_id, p.paid_on, p.amount, p.method, p.status, p.txn_reference,
                        b.user_id, b.total_price as booking_total, b.status as booking_status,
                        u.full_name, u.email,
                        pkg.title as package_title, d.name as destination_name
                        FROM payments p
                        LEFT JOIN bookings b ON p.booking_id = b.booking_id
                        LEFT JOIN users u ON b.user_id = u.user_id
                        LEFT JOIN package_dates pd ON b.package_date_id = pd.package_date_id
                        LEFT JOIN packages pkg ON pd.package_id = pkg.package_id
                        LEFT JOIN destinations d ON pkg.dest_id = d.dest_id
                        WHERE 1=1`
            const params = []

            // Non-admins see only their payments
            if (!isAdmin) {
                sql += ' AND b.user_id = ?'
                params.push(user_id)
            }

            if (booking_id) {
                sql += ' AND p.booking_id = ?'
                params.push(booking_id)
            }
            if (status) {
                sql += ' AND p.status = ?'
                params.push(status)
            }
            if (method) {
                sql += ' AND p.method = ?'
                params.push(method)
            }

            sql += ' ORDER BY p.paid_on DESC LIMIT ? OFFSET ?'
            params.push(limit, offset)

            pool.query(sql, params, (err, rows) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Database error'))
                }
                res.json(result.createResult(null, { page, limit, data: rows }))
            })
        })
    }
)

// ===== GET SINGLE PAYMENT =====
// GET /payments/:id - Get single payment with full details
router.get('/:id', (req, res) => {
    const user_id = req.headers.user_id
    const payment_id = req.params.id

    if (!Number.isInteger(parseInt(payment_id))) {
        return res.json(result.createResult('Invalid payment ID'))
    }

    const sql = `SELECT p.payment_id, p.booking_id, p.paid_on, p.amount, p.method, p.status, p.txn_reference,
                    b.user_id, b.persons, b.total_price, b.status as booking_status, b.contact_phone,
                    u.full_name, u.email, u.phone,
                    pkg.title as package_title, pkg.duration_days, pkg.base_price,
                    d.name as destination_name, d.country,
                    pd.start_date, pd.end_date
                    FROM payments p
                    LEFT JOIN bookings b ON p.booking_id = b.booking_id
                    LEFT JOIN users u ON b.user_id = u.user_id
                    LEFT JOIN package_dates pd ON b.package_date_id = pd.package_date_id
                    LEFT JOIN packages pkg ON pd.package_id = pkg.package_id
                    LEFT JOIN destinations d ON pkg.dest_id = d.dest_id
                    WHERE p.payment_id = ?`

    pool.query(sql, [payment_id], (err, rows) => {
        if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
        }
        if (!rows || rows.length === 0) {
            return res.json(result.createResult('Payment not found'))
        }

        // Check authorization: admin or owner of booking
        checkAdmin(user_id, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Error checking admin status'))
            }
            if (!isAdmin && rows[0].user_id != user_id) {
                return res.json(result.createResult('Unauthorized: Cannot view other users payments'))
            }
            res.json(result.createResult(null, rows[0]))
        })
    })
})

// ===== GET PAYMENTS BY BOOKING =====
// GET /payments/booking/:booking_id - Get all payments for a specific booking
router.get('/booking/:booking_id', (req, res) => {
    const user_id = req.headers.user_id
    const booking_id = req.params.booking_id

    if (!Number.isInteger(parseInt(booking_id))) {
        return res.json(result.createResult('Invalid booking ID'))
    }

    // First verify booking exists and check authorization
    const bookingCheckSql = 'SELECT booking_id, user_id FROM bookings WHERE booking_id = ?'
    pool.query(bookingCheckSql, [booking_id], (err, bookingRows) => {
        if (err) {
            return res.json(result.createResult('Database error'))
        }
        if (!bookingRows || bookingRows.length === 0) {
            return res.json(result.createResult('Booking not found'))
        }

        checkAdmin(user_id, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Error checking admin status'))
            }
            if (!isAdmin && bookingRows[0].user_id != user_id) {
                return res.json(result.createResult('Unauthorized: Cannot view other users payments'))
            }

            const sql = `SELECT p.payment_id, p.booking_id, p.paid_on, p.amount, p.method, p.status, p.txn_reference
                            FROM payments p
                            WHERE p.booking_id = ?
                            ORDER BY p.paid_on DESC`

            pool.query(sql, [booking_id], (err, rows) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Database error'))
                }
                res.json(result.createResult(null, rows || []))
            })
        })
    })
})

// ===== GET PAYMENT SUMMARY FOR BOOKING =====
// GET /payments/booking/:booking_id/summary - Get comprehensive payment summary
router.get('/booking/:booking_id/summary', (req, res) => {
    const user_id = req.headers.user_id
    const booking_id = req.params.booking_id

    if (!Number.isInteger(parseInt(booking_id))) {
        return res.json(result.createResult('Invalid booking ID'))
    }

    // Verify booking exists
    const bookingCheckSql = 'SELECT booking_id, user_id, total_price, status FROM bookings WHERE booking_id = ?'
    pool.query(bookingCheckSql, [booking_id], (err, bookingRows) => {
        if (err) {
            return res.json(result.createResult('Database error'))
        }
        if (!bookingRows || bookingRows.length === 0) {
            return res.json(result.createResult('Booking not found'))
        }

        checkAdmin(user_id, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Error checking admin status'))
            }
            if (!isAdmin && bookingRows[0].user_id != user_id) {
                return res.json(result.createResult('Unauthorized: Cannot view other users payments'))
            }

            const booking = bookingRows[0]

            // Get payment summary
            const summarySql = `SELECT 
                                COUNT(*) as total_payments,
                                SUM(CASE WHEN status = 'success' THEN amount ELSE 0 END) as total_paid,
                                SUM(CASE WHEN status = 'failed' THEN amount ELSE 0 END) as total_failed,
                                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
                                COUNT(CASE WHEN status = 'success' THEN 1 END) as success_count,
                                MIN(paid_on) as first_payment_date,
                                MAX(paid_on) as last_payment_date
                                FROM payments
                                WHERE booking_id = ?`

            pool.query(summarySql, [booking_id], (err, summaryRows) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Database error'))
                }

                const summary = summaryRows[0] || {}
                const totalPaid = parseFloat(summary.total_paid) || 0
                const balanceDue = booking.total_price - totalPaid

                // Determine payment status
                let paymentStatus = 'pending'
                if (balanceDue <= 0) {
                    paymentStatus = 'paid'
                } else if (totalPaid > 0) {
                    paymentStatus = 'partial'
                }

                res.json(result.createResult(null, {
                    booking_id: booking_id,
                    booking_total: booking.total_price,
                    total_paid: totalPaid,
                    balance_due: Math.max(balanceDue, 0),
                    payment_status: paymentStatus,
                    total_payments: summary.total_payments || 0,
                    successful_payments: summary.success_count || 0,
                    failed_payments: summary.total_failed || 0,
                    pending_payments: summary.pending_count || 0,
                    first_payment_date: summary.first_payment_date,
                    last_payment_date: summary.last_payment_date
                }))
            })
        })
    })
})

// ===== POST CREATE PAYMENT =====
// POST /payments - Create new payment
router.post('/',
    ...paymentBodyValidators,
    handleValidationErrors,
    (req, res) => {
        const user_id = req.headers.user_id
        if (!user_id) {
            return res.json(result.createResult('Unauthorized: User ID required'))
        }

        const { booking_id, amount, method = 'card', txn_reference } = req.body

        // Verify booking exists and belongs to user (or user is admin)
        const bookingCheckSql = 'SELECT booking_id, user_id, total_price, status FROM bookings WHERE booking_id = ?'
        pool.query(bookingCheckSql, [booking_id], (err, bookingRows) => {
            if (err) {
                return res.json(result.createResult('Database error'))
            }
            if (!bookingRows || bookingRows.length === 0) {
                return res.json(result.createResult('Booking not found'))
            }

            const booking = bookingRows[0]

            // Check authorization
            checkAdmin(user_id, (err, isAdmin) => {
                if (err) {
                    return res.json(result.createResult('Error checking admin status'))
                }
                if (!isAdmin && booking.user_id != user_id) {
                    return res.json(result.createResult('Unauthorized: Cannot pay for other users bookings'))
                }

                // Check booking status - cannot pay for cancelled bookings
                if (booking.status === 'cancelled') {
                    return res.json(result.createResult('Cannot make payment for a cancelled booking'))
                }

                // Check amount doesn't exceed booking total
                if (amount > booking.total_price) {
                    return res.json(result.createResult(`Payment amount cannot exceed booking total of ${booking.total_price}`))
                }

                // Get total already paid
                const paidCheckSql = 'SELECT COALESCE(SUM(amount), 0) as total_paid FROM payments WHERE booking_id = ? AND status = "success"'
                pool.query(paidCheckSql, [booking_id], (err, paidRows) => {
                    if (err) {
                        return res.json(result.createResult('Database error'))
                    }

                    const totalPaid = parseFloat(paidRows[0].total_paid) || 0
                    const balanceRemaining = booking.total_price - totalPaid

                    if (amount > balanceRemaining) {
                        return res.json(result.createResult(`Payment exceeds remaining balance of ${balanceRemaining}`))
                    }

                    // Create payment
                    const insertSql = `INSERT INTO payments (booking_id, amount, method, status, txn_reference, paid_on)
                                    VALUES (?, ?, ?, 'pending', ?, NOW())`

                    pool.query(insertSql, [booking_id, amount, method, txn_reference || null], (err, insertRes) => {
                        if (err) {
                            console.error(err)
                            return res.json(result.createResult('Error creating payment'))
                        }
                        res.json(result.createResult(null, {
                            payment_id: insertRes.insertId,
                            message: 'Payment created successfully'
                        }))
                    })
                })
            })
        })
    }
)

// ===== PUT CONFIRM PAYMENT =====
// PUT /payments/:id/confirm - Confirm payment (admin only)
router.put('/:id/confirm', (req, res) => {
    const user_id = req.headers.user_id
    const payment_id = req.params.id

    if (!Number.isInteger(parseInt(payment_id))) {
        return res.json(result.createResult('Invalid payment ID'))
    }

    // Check if user is admin
    checkAdmin(user_id, (err, isAdmin) => {
        if (err) {
            return res.json(result.createResult('Error checking admin status'))
        }
        if (!isAdmin) {
            return res.json(result.createResult('Unauthorized: Admin access required'))
        }

        // Get payment details
        const paymentCheckSql = 'SELECT payment_id, booking_id, amount, status FROM payments WHERE payment_id = ?'
        pool.query(paymentCheckSql, [payment_id], (err, paymentRows) => {
            if (err) {
                return res.json(result.createResult('Database error'))
            }
            if (!paymentRows || paymentRows.length === 0) {
                return res.json(result.createResult('Payment not found'))
            }

            const payment = paymentRows[0]

            // Update payment status to success
            const updatePaymentSql = 'UPDATE payments SET status = ? WHERE payment_id = ?'
            pool.query(updatePaymentSql, ['success', payment_id], (err) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Error confirming payment'))
                }

                // Check if full payment is now received
                const checkBookingSql = 'SELECT total_price FROM bookings WHERE booking_id = ?'
                pool.query(checkBookingSql, [payment.booking_id], (err, bookingRows) => {
                    if (err) {
                        return res.json(result.createResult('Database error'))
                    }

                    const booking = bookingRows[0]
                    const getSumSql = 'SELECT COALESCE(SUM(amount), 0) as total_paid FROM payments WHERE booking_id = ? AND status = "success"'
                    pool.query(getSumSql, [payment.booking_id], (err, sumRows) => {
                        if (err) {
                            return res.json(result.createResult('Database error'))
                        }

                        const totalPaid = parseFloat(sumRows[0].total_paid) || 0

                        // If full payment received, auto-confirm booking
                        if (totalPaid >= booking.total_price) {
                            const updateBookingSql = 'UPDATE bookings SET status = ? WHERE booking_id = ? AND status = ?'
                            pool.query(updateBookingSql, ['confirmed', payment.booking_id, 'pending'], (err) => {
                                if (err) console.error(err)
                            })
                        }

                        res.json(result.createResult(null, 'Payment confirmed successfully'))
                    })
                })
            })
        })
    })
})

// ===== PUT REJECT PAYMENT =====
// PUT /payments/:id/reject - Reject/fail payment (admin only)
router.put('/:id/reject', (req, res) => {
    const user_id = req.headers.user_id
    const payment_id = req.params.id

    if (!Number.isInteger(parseInt(payment_id))) {
        return res.json(result.createResult('Invalid payment ID'))
    }

    // Check if user is admin
    checkAdmin(user_id, (err, isAdmin) => {
        if (err) {
            return res.json(result.createResult('Error checking admin status'))
        }
        if (!isAdmin) {
            return res.json(result.createResult('Unauthorized: Admin access required'))
        }

        // Get payment details
        const paymentCheckSql = 'SELECT payment_id, status FROM payments WHERE payment_id = ?'
        pool.query(paymentCheckSql, [payment_id], (err, paymentRows) => {
            if (err) {
                return res.json(result.createResult('Database error'))
            }
            if (!paymentRows || paymentRows.length === 0) {
                return res.json(result.createResult('Payment not found'))
            }

            // Cannot reject already confirmed payments
            if (paymentRows[0].status === 'success') {
                return res.json(result.createResult('Cannot reject an already confirmed payment'))
            }

            // Update payment status to failed
            const updateSql = 'UPDATE payments SET status = ? WHERE payment_id = ?'
            pool.query(updateSql, ['failed', payment_id], (err) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Error rejecting payment'))
                }
                res.json(result.createResult(null, 'Payment rejected successfully'))
            })
        })
    })
})

// ===== PUT UPDATE PAYMENT =====
// PUT /payments/:id - Update payment (admin only)
router.put('/:id',
    body('status').optional().isIn(['success', 'failed', 'pending']).withMessage('Invalid status'),
    body('txn_reference').optional().trim().isLength({ max: 255 }).withMessage('Transaction reference must be max 255 chars'),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.headers.user_id
        const payment_id = req.params.id

        if (!Number.isInteger(parseInt(payment_id))) {
            return res.json(result.createResult('Invalid payment ID'))
        }

        // Check if user is admin
        checkAdmin(user_id, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Error checking admin status'))
            }
            if (!isAdmin) {
                return res.json(result.createResult('Unauthorized: Admin access required'))
            }

            // Check payment exists
            const paymentCheckSql = 'SELECT payment_id FROM payments WHERE payment_id = ?'
            pool.query(paymentCheckSql, [payment_id], (err, paymentRows) => {
                if (err) {
                    return res.json(result.createResult('Database error'))
                }
                if (!paymentRows || paymentRows.length === 0) {
                    return res.json(result.createResult('Payment not found'))
                }

                const { status, txn_reference } = req.body
                let updateSql = 'UPDATE payments SET '
                const params = []
                const updates = []

                if (status) {
                    updates.push('status = ?')
                    params.push(status)
                }
                if (txn_reference !== undefined) {
                    updates.push('txn_reference = ?')
                    params.push(txn_reference)
                }

                if (updates.length === 0) {
                    return res.json(result.createResult('No fields to update'))
                }

                updateSql += updates.join(', ') + ' WHERE payment_id = ?'
                params.push(payment_id)

                pool.query(updateSql, params, (err) => {
                    if (err) {
                        console.error(err)
                        return res.json(result.createResult('Error updating payment'))
                    }
                    res.json(result.createResult(null, 'Payment updated successfully'))
                })
            })
        })
    }
)

// ===== DELETE PAYMENT =====
// DELETE /payments/:id - Delete payment (admin only, cannot delete confirmed payments)
router.delete('/:id', (req, res) => {
    const user_id = req.headers.user_id
    const payment_id = req.params.id

    if (!Number.isInteger(parseInt(payment_id))) {
        return res.json(result.createResult('Invalid payment ID'))
    }

    // Check if user is admin
    checkAdmin(user_id, (err, isAdmin) => {
        if (err) {
            return res.json(result.createResult('Error checking admin status'))
        }
        if (!isAdmin) {
            return res.json(result.createResult('Unauthorized: Admin access required'))
        }

        // Check payment exists
        const paymentCheckSql = 'SELECT payment_id, status FROM payments WHERE payment_id = ?'
        pool.query(paymentCheckSql, [payment_id], (err, paymentRows) => {
            if (err) {
                return res.json(result.createResult('Database error'))
            }
            if (!paymentRows || paymentRows.length === 0) {
                return res.json(result.createResult('Payment not found'))
            }

            // Cannot delete confirmed payments (audit trail protection)
            if (paymentRows[0].status === 'success') {
                return res.json(result.createResult('Cannot delete a confirmed payment (audit trail protection)'))
            }

            // Delete payment
            const deleteSql = 'DELETE FROM payments WHERE payment_id = ?'
            pool.query(deleteSql, [payment_id], (err) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Error deleting payment'))
                }
                res.json(result.createResult(null, 'Payment deleted successfully'))
            })
        })
    })
})

module.exports = router
