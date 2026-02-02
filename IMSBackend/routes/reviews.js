// Reviews and Ratings routes for IMSBackend
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
    query('package_id').optional().isInt(),
    query('user_id').optional().isInt(),
    query('min_rating').optional().isInt({ min: 1, max: 5 }),
    query('max_rating').optional().isInt({ min: 1, max: 5 })
]

const reviewBodyValidators = [
    body('package_id').notEmpty().isInt().withMessage('Package ID is required and must be a valid integer'),
    body('booking_id').notEmpty().isInt().withMessage('Booking ID is required and must be a valid integer'),
    body('rating').notEmpty().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('title').trim().notEmpty().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be 1-200 chars'),
    body('comment').optional().trim().isLength({ max: 5000 }).withMessage('Comment must be max 5000 chars')
]

// ===== GET ALL REVIEWS =====
// GET /reviews - List all reviews with optional filters
router.get('/',
    ...paginationValidators,
    handleValidationErrors,
    (req, res) => {
        const { package_id, user_id, min_rating, max_rating } = req.query
        const page = Math.max(req.query.page || 1, 1)
        const limit = Math.min(req.query.limit || 10, 100)
        const offset = (page - 1) * limit

        let sql = `SELECT r.review_id, r.package_id, r.booking_id, r.user_id, r.rating, r.title, r.comment, 
                        r.created_at, r.updated_at,
                        u.full_name, u.email,
                        p.title as package_title, p.duration_days,
                        d.name as destination_name
                        FROM reviews r
                        LEFT JOIN users u ON r.user_id = u.user_id
                        LEFT JOIN packages p ON r.package_id = p.package_id
                        LEFT JOIN destinations d ON p.dest_id = d.dest_id
                        WHERE 1=1`
        const params = []

        if (package_id) {
            sql += ' AND r.package_id = ?'
            params.push(package_id)
        }
        if (user_id) {
            sql += ' AND r.user_id = ?'
            params.push(user_id)
        }
        if (min_rating) {
            sql += ' AND r.rating >= ?'
            params.push(min_rating)
        }
        if (max_rating) {
            sql += ' AND r.rating <= ?'
            params.push(max_rating)
        }

        sql += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?'
        params.push(limit, offset)

        pool.query(sql, params, (err, rows) => {
            if (err) {
                console.error(err)
                return res.json(result.createResult('Database error'))
            }
            res.json(result.createResult(null, { page, limit, data: rows }))
        })
    }
)

// ===== GET SINGLE REVIEW =====
// GET /reviews/:id - Get single review by ID
router.get('/:id', (req, res) => {
    const review_id = req.params.id

    if (!Number.isInteger(parseInt(review_id))) {
        return res.json(result.createResult('Invalid review ID'))
    }

    const sql = `SELECT r.review_id, r.package_id, r.booking_id, r.user_id, r.rating, r.title, r.comment, 
                    r.created_at, r.updated_at,
                    u.full_name, u.email,
                    p.title as package_title, p.duration_days, p.base_price,
                    d.name as destination_name, d.country
                    FROM reviews r
                    LEFT JOIN users u ON r.user_id = u.user_id
                    LEFT JOIN packages p ON r.package_id = p.package_id
                    LEFT JOIN destinations d ON p.dest_id = d.dest_id
                    WHERE r.review_id = ?`

    pool.query(sql, [review_id], (err, rows) => {
        if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
        }
        if (!rows || rows.length === 0) {
            return res.json(result.createResult('Review not found'))
        }
        res.json(result.createResult(null, rows[0]))
    })
})

// ===== GET REVIEWS FOR PACKAGE =====
// GET /reviews/package/:package_id - Get all reviews for a specific package
router.get('/package/:package_id', (req, res) => {
    const package_id = req.params.package_id

    if (!Number.isInteger(parseInt(package_id))) {
        return res.json(result.createResult('Invalid package ID'))
    }

    // Verify package exists
    const packageCheckSql = 'SELECT package_id FROM packages WHERE package_id = ?'
    pool.query(packageCheckSql, [package_id], (err, pkgRows) => {
        if (err) {
            return res.json(result.createResult('Database error'))
        }
        if (!pkgRows || pkgRows.length === 0) {
            return res.json(result.createResult('Package not found'))
        }

        const sql = `SELECT r.review_id, r.package_id, r.booking_id, r.user_id, r.rating, r.title, r.comment, 
                        r.created_at, r.updated_at,
                        u.full_name, u.email
                        FROM reviews r
                        LEFT JOIN users u ON r.user_id = u.user_id
                        WHERE r.package_id = ?
                        ORDER BY r.rating DESC, r.created_at DESC`

        pool.query(sql, [package_id], (err, rows) => {
            if (err) {
                console.error(err)
                return res.json(result.createResult('Database error'))
            }

            // Calculate average rating
            const avgRatingSql = 'SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE package_id = ?'
            pool.query(avgRatingSql, [package_id], (err, avgRows) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Database error'))
                }

                const avgData = avgRows[0] || { avg_rating: 0, total_reviews: 0 }
                res.json(result.createResult(null, {
                    package_id: package_id,
                    average_rating: parseFloat(avgData.avg_rating) || 0,
                    total_reviews: avgData.total_reviews,
                    reviews: rows || []
                }))
            })
        })
    })
})

// ===== POST CREATE REVIEW =====
// POST /reviews - Create new review
router.post('/',
    ...reviewBodyValidators,
    handleValidationErrors,
    (req, res) => {
        const user_id = req.headers.user_id
        if (!user_id) {
            return res.json(result.createResult('Unauthorized: User ID required'))
        }

        const { package_id, booking_id, rating, title, comment } = req.body

        // Verify user exists
        const userCheckSql = 'SELECT user_id FROM users WHERE user_id = ?'
        pool.query(userCheckSql, [user_id], (err, userRows) => {
            if (err) {
                return res.json(result.createResult('Database error'))
            }
            if (!userRows || userRows.length === 0) {
                return res.json(result.createResult('User not found'))
            }

            // Verify package exists
            const packageCheckSql = 'SELECT package_id FROM packages WHERE package_id = ?'
            pool.query(packageCheckSql, [package_id], (err, pkgRows) => {
                if (err) {
                    return res.json(result.createResult('Database error'))
                }
                if (!pkgRows || pkgRows.length === 0) {
                    return res.json(result.createResult('Package not found'))
                }

                // Verify booking exists and belongs to user
                const bookingCheckSql = 'SELECT booking_id, user_id, status FROM bookings WHERE booking_id = ?'
                pool.query(bookingCheckSql, [booking_id], (err, bookingRows) => {
                    if (err) {
                        return res.json(result.createResult('Database error'))
                    }
                    if (!bookingRows || bookingRows.length === 0) {
                        return res.json(result.createResult('Booking not found'))
                    }

                    const booking = bookingRows[0]
                    if (booking.user_id != user_id) {
                        return res.json(result.createResult('Unauthorized: Cannot review bookings that are not yours'))
                    }

                    // Check if booking is completed or at least confirmed
                    if (booking.status !== 'completed' && booking.status !== 'confirmed') {
                        return res.json(result.createResult('Cannot review a booking that is not confirmed or completed'))
                    }

                    // Check if user already reviewed this booking
                    const existingReviewSql = 'SELECT review_id FROM reviews WHERE booking_id = ?'
                    pool.query(existingReviewSql, [booking_id], (err, reviewRows) => {
                        if (err) {
                            return res.json(result.createResult('Database error'))
                        }
                        if (reviewRows && reviewRows.length > 0) {
                            return res.json(result.createResult('You have already reviewed this booking'))
                        }

                        // Create review
                        const insertSql = `INSERT INTO reviews (package_id, booking_id, user_id, rating, title, comment, created_at, updated_at)
                                        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`

                        pool.query(insertSql, [package_id, booking_id, user_id, rating, title, comment || null], (err, insertRes) => {
                            if (err) {
                                console.error(err)
                                return res.json(result.createResult('Error creating review'))
                            }
                            res.json(result.createResult(null, {
                                review_id: insertRes.insertId,
                                message: 'Review created successfully'
                            }))
                        })
                    })
                })
            })
        })
    }
)

// ===== PUT UPDATE REVIEW =====
// PUT /reviews/:id - Update review (user can update their own, admin can update any)
router.put('/:id',
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be 1-200 chars'),
    body('comment').optional().trim().isLength({ max: 5000 }).withMessage('Comment must be max 5000 chars'),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.headers.user_id
        const review_id = req.params.id

        if (!Number.isInteger(parseInt(review_id))) {
            return res.json(result.createResult('Invalid review ID'))
        }

        // Check review exists
        const reviewCheckSql = 'SELECT review_id, user_id FROM reviews WHERE review_id = ?'
        pool.query(reviewCheckSql, [review_id], (err, reviewRows) => {
            if (err) {
                return res.json(result.createResult('Database error'))
            }
            if (!reviewRows || reviewRows.length === 0) {
                return res.json(result.createResult('Review not found'))
            }

            const review = reviewRows[0]

            // Check authorization
            checkAdmin(user_id, (err, isAdmin) => {
                if (err) {
                    return res.json(result.createResult('Error checking admin status'))
                }
                if (!isAdmin && review.user_id != user_id) {
                    return res.json(result.createResult('Unauthorized: Cannot update other users reviews'))
                }

                const { rating, title, comment } = req.body
                let updateSql = 'UPDATE reviews SET '
                const params = []
                const updates = []

                if (rating) {
                    updates.push('rating = ?')
                    params.push(rating)
                }
                if (title) {
                    updates.push('title = ?')
                    params.push(title)
                }
                if (comment !== undefined) {
                    updates.push('comment = ?')
                    params.push(comment)
                }

                if (updates.length === 0) {
                    return res.json(result.createResult('No fields to update'))
                }

                updates.push('updated_at = NOW()')
                updateSql += updates.join(', ') + ' WHERE review_id = ?'
                params.push(review_id)

                pool.query(updateSql, params, (err) => {
                    if (err) {
                        console.error(err)
                        return res.json(result.createResult('Error updating review'))
                    }
                    res.json(result.createResult(null, 'Review updated successfully'))
                })
            })
        })
    }
)

// ===== DELETE REVIEW =====
// DELETE /reviews/:id - Delete review (user can delete their own, admin can delete any)
router.delete('/:id', (req, res) => {
    const user_id = req.headers.user_id
    const review_id = req.params.id

    if (!Number.isInteger(parseInt(review_id))) {
        return res.json(result.createResult('Invalid review ID'))
    }

    // Check review exists
    const reviewCheckSql = 'SELECT review_id, user_id FROM reviews WHERE review_id = ?'
    pool.query(reviewCheckSql, [review_id], (err, reviewRows) => {
        if (err) {
            return res.json(result.createResult('Database error'))
        }
        if (!reviewRows || reviewRows.length === 0) {
            return res.json(result.createResult('Review not found'))
        }

        const review = reviewRows[0]

        // Check authorization
        checkAdmin(user_id, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Error checking admin status'))
            }
            if (!isAdmin && review.user_id != user_id) {
                return res.json(result.createResult('Unauthorized: Cannot delete other users reviews'))
            }

            // Delete review
            const deleteSql = 'DELETE FROM reviews WHERE review_id = ?'
            pool.query(deleteSql, [review_id], (err) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Error deleting review'))
                }
                res.json(result.createResult(null, 'Review deleted successfully'))
            })
        })
    })
})

module.exports = router
