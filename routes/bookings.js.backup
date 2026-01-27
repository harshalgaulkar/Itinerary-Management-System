// Bookings routes for IMSBackend
const express = require('express')
const { body, query, validationResult } = require('express-validator')
const router = express.Router()

const pool = require('../utils/db')
const result = require('../utils/result')

// Helper: check if a user is admin by user_id (from req.headers.user_id)
function checkAdmin(userId, cb) {
    if (!userId) return cb(null, false)
    const sql = 'SELECT role FROM users WHERE user_id = ? LIMIT 1'
    pool.query(sql, [userId], (err, rows) => {
        if (err) return cb(err)
        if (!rows || rows.length === 0) return cb(null, false)
        return cb(null, rows[0].role === 'admin')
    })
}

// Middleware: handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(result.createResult('Validation error: ' + errors.array().map(e => e.msg).join(', ')))
    }
    next()
}

// GET /bookings - Get all bookings with optional filters (admin can see all, users see their own)
router.get('/',
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('user_id').optional().isInt(),
    query('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed']),
    query('package_date_id').optional().isInt(),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.headers.user_id
        const { status, package_date_id } = req.query
        let { user_id: filter_user_id } = req.query
        const page = Math.max(req.query.page || 1, 1)
        const limit = Math.min(req.query.limit || 10, 100)
        const offset = (page - 1) * limit

        // Check if user is admin
        checkAdmin(user_id, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Error checking admin status'))
            }

            // Non-admins can only see their own bookings
            if (!isAdmin && filter_user_id && filter_user_id != user_id) {
                return res.json(result.createResult('Unauthorized: Cannot view other users bookings'))
            }
            if (!isAdmin) {
                filter_user_id = user_id
            }

            let sql = `SELECT b.booking_id, b.user_id, b.package_date_id, b.booked_on, b.persons, 
                        b.total_price, b.status, b.contact_phone, b.notes, b.updated_at,
                        u.full_name, u.email,
                        p.title as package_title, p.duration_days, p.base_price,
                        d.name as destination_name,
                        pd.start_date, pd.end_date
                        FROM bookings b
                        LEFT JOIN users u ON b.user_id = u.user_id
                        LEFT JOIN package_dates pd ON b.package_date_id = pd.package_date_id
                        LEFT JOIN packages p ON pd.package_id = p.package_id
                        LEFT JOIN destinations d ON p.dest_id = d.dest_id
                        WHERE 1=1`
            const params = []

            if (filter_user_id) {
                sql += ' AND b.user_id = ?'
                params.push(filter_user_id)
            }
            if (status) {
                sql += ' AND b.status = ?'
                params.push(status)
            }
            if (package_date_id) {
                sql += ' AND b.package_date_id = ?'
                params.push(package_date_id)
            }

            sql += ' ORDER BY b.booked_on DESC LIMIT ? OFFSET ?'
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

// GET /bookings/:id - Get single booking by ID
router.get('/:id',
    query('id').isInt(),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.headers.user_id
        const booking_id = req.params.id

        const sql = `SELECT b.booking_id, b.user_id, b.package_date_id, b.booked_on, b.persons, 
                        b.total_price, b.status, b.contact_phone, b.notes, b.updated_at,
                        u.full_name, u.email, u.phone as user_phone,
                        p.title as package_title, p.duration_days, p.base_price, p.description,
                        d.name as destination_name, d.country,
                        pd.start_date, pd.end_date, pd.seats_total, pd.seats_booked
                        FROM bookings b
                        LEFT JOIN users u ON b.user_id = u.user_id
                        LEFT JOIN package_dates pd ON b.package_date_id = pd.package_date_id
                        LEFT JOIN packages p ON pd.package_id = p.package_id
                        LEFT JOIN destinations d ON p.dest_id = d.dest_id
                        WHERE b.booking_id = ?`

        pool.query(sql, [booking_id], (err, rows) => {
            if (err) {
                console.error(err)
                return res.json(result.createResult('Database error'))
            }
            if (!rows || rows.length === 0) {
                return res.json(result.createResult('Booking not found'))
            }

            // Check if user is admin or owner of the booking
            checkAdmin(user_id, (err, isAdmin) => {
                if (err) {
                    return res.json(result.createResult('Error checking admin status'))
                }
                if (!isAdmin && rows[0].user_id != user_id) {
                    return res.json(result.createResult('Unauthorized: Cannot view other users bookings'))
                }
                res.json(result.createResult(null, rows[0]))
            })
        })
    }
)

// GET /bookings/user/:user_id - Get all bookings for a specific user
router.get('/user/:user_id', (req, res) => {
    const user_id = req.headers.user_id
    const target_user_id = req.params.user_id

    // Check if user is admin or requesting their own bookings
    checkAdmin(user_id, (err, isAdmin) => {
        if (err) {
            return res.json(result.createResult('Error checking admin status'))
        }
        if (!isAdmin && user_id != target_user_id) {
            return res.json(result.createResult('Unauthorized: Cannot view other users bookings'))
        }

        if (!Number.isInteger(parseInt(target_user_id))) {
            return res.json(result.createResult('Invalid user ID'))
        }

        const sql = `SELECT b.booking_id, b.user_id, b.package_date_id, b.booked_on, b.persons, 
                        b.total_price, b.status, b.contact_phone, b.notes, b.updated_at,
                        p.title as package_title, p.duration_days, p.base_price,
                        d.name as destination_name,
                        pd.start_date, pd.end_date
                        FROM bookings b
                        LEFT JOIN package_dates pd ON b.package_date_id = pd.package_date_id
                        LEFT JOIN packages p ON pd.package_id = p.package_id
                        LEFT JOIN destinations d ON p.dest_id = d.dest_id
                        WHERE b.user_id = ?
                        ORDER BY b.booked_on DESC`

        pool.query(sql, [target_user_id], (err, rows) => {
            if (err) {
                console.error(err)
                return res.json(result.createResult('Database error'))
            }
            res.json(result.createResult(null, rows || []))
        })
    })
})

// POST /bookings - Create new booking
router.post('/',
    body('package_date_id').isInt().withMessage('Package date ID must be a valid integer'),
    body('persons').isInt({ min: 1, max: 1000 }).withMessage('Number of persons must be between 1 and 1000'),
    body('total_price').isDecimal({ decimal_digits: '1,2' }).withMessage('Total price must be a valid decimal'),
    body('contact_phone').trim().isLength({ min: 5, max: 30 }).withMessage('Contact phone must be 5-30 chars'),
    body('notes').optional().trim(),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.headers.user_id
        if (!user_id) {
            return res.json(result.createResult('Unauthorized: User ID required'))
        }

        const { package_date_id, persons, total_price, contact_phone, notes } = req.body

        // Verify user exists
        const userCheckSql = 'SELECT user_id FROM users WHERE user_id = ?'
        pool.query(userCheckSql, [user_id], (err, userRows) => {
            if (err) {
                return res.json(result.createResult('Database error'))
            }
            if (!userRows || userRows.length === 0) {
                return res.json(result.createResult('User not found'))
            }

            // Verify package_date exists and has available seats
            const dateCheckSql = `SELECT pd.package_date_id, pd.seats_total, pd.seats_booked, pd.start_date, pd.end_date, pd.is_active,
                                    p.max_people, p.package_id
                                    FROM package_dates pd
                                    LEFT JOIN packages p ON pd.package_id = p.package_id
                                    WHERE pd.package_date_id = ?`
            pool.query(dateCheckSql, [package_date_id], (err, dateRows) => {
                if (err) {
                    return res.json(result.createResult('Database error'))
                }
                if (!dateRows || dateRows.length === 0) {
                    return res.json(result.createResult('Package date not found'))
                }

                const packageDate = dateRows[0]

                // Check if package date is active
                if (!packageDate.is_active) {
                    return res.json(result.createResult('This package date is no longer active'))
                }

                // Check seat availability
                if (packageDate.seats_total > 0) {
                    const availableSeats = packageDate.seats_total - packageDate.seats_booked
                    if (persons > availableSeats) {
                        return res.json(result.createResult(`Only ${availableSeats} seats available`))
                    }
                }

                // Check package max_people limit
                if (packageDate.max_people > 0 && persons > packageDate.max_people) {
                    return res.json(result.createResult(`Maximum ${packageDate.max_people} persons per booking allowed`))
                }

                // Check if start_date is in the future
                const startDate = new Date(packageDate.start_date)
                if (startDate < new Date()) {
                    return res.json(result.createResult('Cannot book for a past date'))
                }

                const sql = `INSERT INTO bookings (user_id, package_date_id, persons, total_price, contact_phone, notes, status)
                            VALUES (?, ?, ?, ?, ?, ?, 'pending')`

                pool.query(sql, [user_id, package_date_id, persons, total_price, contact_phone, notes || null], (err, data) => {
                    if (err) {
                        console.error(err)
                        return res.json(result.createResult('Error creating booking'))
                    }

                    // Update seats_booked in package_dates
                    const updateSeatsSQL = `UPDATE package_dates SET seats_booked = seats_booked + ? WHERE package_date_id = ?`
                    pool.query(updateSeatsSQL, [persons, package_date_id], (err) => {
                        if (err) {
                            console.error(err)
                        }
                    })

                    res.json(result.createResult(null, {
                        booking_id: data.insertId,
                        message: 'Booking created successfully'
                    }))
                })
            })
        })
    }
)

// PUT /bookings/:id - Update booking (user can update their own, admin can update any)
router.put('/:id',
    body('persons').optional().isInt({ min: 1, max: 1000 }).withMessage('Number of persons must be between 1 and 1000'),
    body('total_price').optional().isDecimal({ decimal_digits: '1,2' }).withMessage('Total price must be a valid decimal'),
    body('contact_phone').optional().trim().isLength({ min: 5, max: 30 }).withMessage('Contact phone must be 5-30 chars'),
    body('notes').optional().trim(),
    body('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed']).withMessage('Invalid status'),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.headers.user_id
        const booking_id = req.params.id

        // Check booking exists and user has permission
        const checkSql = 'SELECT booking_id, user_id, status FROM bookings WHERE booking_id = ?'
        pool.query(checkSql, [booking_id], (err, rows) => {
            if (err) {
                return res.json(result.createResult('Database error'))
            }
            if (!rows || rows.length === 0) {
                return res.json(result.createResult('Booking not found'))
            }

            const booking = rows[0]

            // Check if user is admin or owner
            checkAdmin(user_id, (err, isAdmin) => {
                if (err) {
                    return res.json(result.createResult('Error checking admin status'))
                }
                if (!isAdmin && booking.user_id != user_id) {
                    return res.json(result.createResult('Unauthorized: Cannot update other users bookings'))
                }

                // Non-admins cannot change status
                const { persons, total_price, contact_phone, notes, status } = req.body
                if (!isAdmin && status) {
                    return res.json(result.createResult('Unauthorized: Only admins can change booking status'))
                }

                let sql = 'UPDATE bookings SET '
                const params = []
                const updates = []

                if (persons) {
                    updates.push('persons = ?')
                    params.push(persons)
                }
                if (total_price) {
                    updates.push('total_price = ?')
                    params.push(total_price)
                }
                if (contact_phone) {
                    updates.push('contact_phone = ?')
                    params.push(contact_phone)
                }
                if (notes !== undefined) {
                    updates.push('notes = ?')
                    params.push(notes)
                }
                if (status && isAdmin) {
                    updates.push('status = ?')
                    params.push(status)
                }

                if (updates.length === 0) {
                    return res.json(result.createResult('No fields to update'))
                }

                sql += updates.join(', ') + ' WHERE booking_id = ?'
                params.push(booking_id)

                pool.query(sql, params, (err, data) => {
                    if (err) {
                        console.error(err)
                        return res.json(result.createResult('Error updating booking'))
                    }
                    res.json(result.createResult(null, 'Booking updated successfully'))
                })
            })
        })
    }
)

// PUT /bookings/:id/confirm - Confirm pending booking (admin only)
router.put('/:id/confirm', (req, res) => {
    const user_id = req.headers.user_id
    const booking_id = req.params.id

    // Check if user is admin
    checkAdmin(user_id, (err, isAdmin) => {
        if (err) {
            return res.json(result.createResult('Error checking admin status'))
        }
        if (!isAdmin) {
            return res.json(result.createResult('Unauthorized: Admin access required'))
        }

        // Check booking exists and is pending
        const checkSql = 'SELECT booking_id, status FROM bookings WHERE booking_id = ?'
        pool.query(checkSql, [booking_id], (err, rows) => {
            if (err) {
                return res.json(result.createResult('Database error'))
            }
            if (!rows || rows.length === 0) {
                return res.json(result.createResult('Booking not found'))
            }

            if (rows[0].status !== 'pending') {
                return res.json(result.createResult(`Cannot confirm booking with status: ${rows[0].status}`))
            }

            const sql = 'UPDATE bookings SET status = ? WHERE booking_id = ?'
            pool.query(sql, ['confirmed', booking_id], (err, data) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Error confirming booking'))
                }
                res.json(result.createResult(null, 'Booking confirmed successfully'))
            })
        })
    })
})

// PUT /bookings/:id/cancel - Cancel booking (user can cancel their own, admin can cancel any)
router.put('/:id/cancel', (req, res) => {
    const user_id = req.headers.user_id
    const booking_id = req.params.id

    // Check booking exists
    const checkSql = 'SELECT booking_id, user_id, status, persons, package_date_id FROM bookings WHERE booking_id = ?'
    pool.query(checkSql, [booking_id], (err, rows) => {
        if (err) {
            return res.json(result.createResult('Database error'))
        }
        if (!rows || rows.length === 0) {
            return res.json(result.createResult('Booking not found'))
        }

        const booking = rows[0]

        // Check if user is admin or owner
        checkAdmin(user_id, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Error checking admin status'))
            }
            if (!isAdmin && booking.user_id != user_id) {
                return res.json(result.createResult('Unauthorized: Cannot cancel other users bookings'))
            }

            // Cannot cancel completed bookings
            if (booking.status === 'completed') {
                return res.json(result.createResult('Cannot cancel a completed booking'))
            }

            const sql = 'UPDATE bookings SET status = ? WHERE booking_id = ?'
            pool.query(sql, ['cancelled', booking_id], (err, data) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Error cancelling booking'))
                }

                // Refund the seats
                const refundSeatsSQL = `UPDATE package_dates SET seats_booked = seats_booked - ? WHERE package_date_id = ?`
                pool.query(refundSeatsSQL, [booking.persons, booking.package_date_id], (err) => {
                    if (err) {
                        console.error(err)
                    }
                })

                res.json(result.createResult(null, 'Booking cancelled successfully'))
            })
        })
    })
})

// PUT /bookings/:id/complete - Mark booking as completed (admin only)
router.put('/:id/complete', (req, res) => {
    const user_id = req.headers.user_id
    const booking_id = req.params.id

    // Check if user is admin
    checkAdmin(user_id, (err, isAdmin) => {
        if (err) {
            return res.json(result.createResult('Error checking admin status'))
        }
        if (!isAdmin) {
            return res.json(result.createResult('Unauthorized: Admin access required'))
        }

        // Check booking exists and is confirmed
        const checkSql = 'SELECT booking_id, status FROM bookings WHERE booking_id = ?'
        pool.query(checkSql, [booking_id], (err, rows) => {
            if (err) {
                return res.json(result.createResult('Database error'))
            }
            if (!rows || rows.length === 0) {
                return res.json(result.createResult('Booking not found'))
            }

            if (rows[0].status === 'completed') {
                return res.json(result.createResult('Booking is already completed'))
            }
            if (rows[0].status === 'cancelled') {
                return res.json(result.createResult('Cannot complete a cancelled booking'))
            }

            const sql = 'UPDATE bookings SET status = ? WHERE booking_id = ?'
            pool.query(sql, ['completed', booking_id], (err, data) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Error completing booking'))
                }
                res.json(result.createResult(null, 'Booking marked as completed successfully'))
            })
        })
    })
})

// DELETE /bookings/:id - Delete booking (admin only)
router.delete('/:id', (req, res) => {
    const user_id = req.headers.user_id
    const booking_id = req.params.id

    // Check if user is admin
    checkAdmin(user_id, (err, isAdmin) => {
        if (err) {
            return res.json(result.createResult('Error checking admin status'))
        }
        if (!isAdmin) {
            return res.json(result.createResult('Unauthorized: Admin access required'))
        }

        // Check booking exists
        const checkSql = 'SELECT booking_id, persons, package_date_id FROM bookings WHERE booking_id = ?'
        pool.query(checkSql, [booking_id], (err, rows) => {
            if (err) {
                return res.json(result.createResult('Database error'))
            }
            if (!rows || rows.length === 0) {
                return res.json(result.createResult('Booking not found'))
            }

            const booking = rows[0]
            const sql = 'DELETE FROM bookings WHERE booking_id = ?'
            pool.query(sql, [booking_id], (err, data) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Error deleting booking'))
                }

                // Refund the seats if booking wasn't cancelled
                const refundSeatsSQL = `UPDATE package_dates SET seats_booked = seats_booked - ? WHERE package_date_id = ?`
                pool.query(refundSeatsSQL, [booking.persons, booking.package_date_id], (err) => {
                    if (err) {
                        console.error(err)
                    }
                })

                res.json(result.createResult(null, 'Booking deleted successfully'))
            })
        })
    })
})

module.exports = router
