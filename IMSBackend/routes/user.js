// User routes for IMSBackend
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { body, query, param, validationResult } = require('express-validator')

const pool = require('../utils/db')
const result = require('../utils/result')
const config = require('../utils/config')

const router = express.Router()

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

// ===== POST SIGNIN =====
// User Signin with validation
router.post('/signin',
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().isLength({ min: 6 }).withMessage('Password is required (min 6 chars)'),
    handleValidationErrors,
    (req, res) => {
        // accept either `password` (preferred) or `password_hash` sent by some clients
        const { email } = req.body
        const password = req.body.password || req.body.password_hash
        const sql = `SELECT * FROM users WHERE email = ?`
        pool.query(sql, [email], (err, data) => {
            if (err) {
                console.error(err)
                res.json(result.createResult(err))
            } else if (data.length == 0) {
                res.json(result.createResult("Invalid Email"))
            } else {
                bcrypt.compare(password, data[0].password_hash, (err, passwordStatus) => {
                    if (err) {
                        res.json(result.createResult(err))
                    } else if (passwordStatus) {
                        const payload = {
                            user_id: data[0].user_id,
                        }
                        const token = jwt.sign(payload, config.SECRET)
                        const user = {
                            token,
                            user_id: data[0].user_id,
                            full_name: data[0].full_name,
                            email: data[0].email,
                            phone: data[0].phone,
                            role: data[0].role
                        }
                        res.json(result.createResult(null, user))
                    }
                    else
                        res.json(result.createResult('Invalid Password'))
                })
            }
        })
    }
)

// ===== POST SIGNUP =====
// User Signup with validation
router.post('/signup',
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().isLength({ min: 6 }).withMessage('Password is required (min 6 chars)'),
    body('full_name').trim().notEmpty().isLength({ min: 1, max: 150 }).withMessage('Full name is required (1-150 chars)'),
    body('phone').trim().optional().isLength({ min: 5, max: 30 }).withMessage('Phone must be 5-30 chars'),
    handleValidationErrors,
    (req, res) => {
        const { email, password, full_name, phone } = req.body
        
        // Check if user already exists
        const checkSql = `SELECT * FROM users WHERE email = ?`
        pool.query(checkSql, [email], (err, data) => {
            if (err) {
                res.json(result.createResult(err))
            } else if (data.length > 0) {
                res.json(result.createResult("Email already registered"))
            } else {
                // Hash the password
                bcrypt.hash(password, 10, (err, hashedPassword) => {
                    if (err) {
                        res.json(result.createResult(err))
                    } else {
                        // Insert new user
                        const insertSql = `INSERT INTO users (email, password_hash, full_name, phone, role) VALUES (?, ?, ?, ?, 'user')`
                        pool.query(insertSql, [email, hashedPassword, full_name, phone || null], (err, result_data) => {
                            if (err) {
                                console.error(err)
                                res.json(result.createResult(err))
                            } else {
                                // Create JWT token for new user
                                const payload = {
                                    user_id: result_data.insertId,
                                }
                                const token = jwt.sign(payload, config.SECRET)
                                const user = {
                                    token,
                                    user_id: result_data.insertId,
                                    full_name: full_name,
                                    email: email,
                                    phone: phone,
                                    role: 'user'
                                }
                                res.json(result.createResult(null, user))
                            }
                        })
                    }
                })
            }
        })
    }
)


// ===== GET USER PROFILE =====
// Get user profile by user_id (user can get their own, admin can get any)
router.get('/profile/:user_id',
    param('user_id').isInt().withMessage('User ID must be a valid integer'),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.params.user_id
        const requestedBy = req.headers.user_id

        // Check authorization: can view own profile or admin
        checkAdmin(requestedBy, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Error checking admin status'))
            }
            if (!isAdmin && requestedBy != user_id) {
                return res.json(result.createResult('Unauthorized: Cannot view other users profiles'))
            }

            const sql = `SELECT user_id, full_name, email, phone, role, created_at, updated_at FROM users WHERE user_id = ?`
            pool.query(sql, [user_id], (err, data) => {
                if (err) {
                    console.error(err)
                    res.json(result.createResult(err))
                } else if (data.length == 0) {
                    res.json(result.createResult("User not found"))
                } else {
                    res.json(result.createResult(null, data[0]))
                }
            })
        })
    }
)

// ===== GET ALL USERS =====
// Get all users (for admin purposes only)
router.get('/', (req, res) => {
    const user_id = req.headers.user_id
    
    // Check if user is admin
    checkAdmin(user_id, (err, isAdmin) => {
        if (err) {
            return res.json(result.createResult('Error checking admin status'))
        }
        if (!isAdmin) {
            return res.json(result.createResult('Unauthorized: Admin access required'))
        }

        const sql = `SELECT user_id, full_name, email, phone, role, created_at, updated_at FROM users ORDER BY created_at DESC`
        pool.query(sql, (err, data) => {
            if (err) {
                console.error(err)
                res.json(result.createResult(err))
            } else {
                res.json(result.createResult(null, data || []))
            }
        })
    })
})


// ===== PUT UPDATE USER =====
// Update user info (user can update their own, admin can update any)
router.put('/update/:user_id',
    param('user_id').isInt().withMessage('User ID must be a valid integer'),
    body('full_name').optional().trim().isLength({ min: 1, max: 150 }).withMessage('Full name must be 1-150 chars'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').optional().trim().isLength({ min: 5, max: 30 }).withMessage('Phone must be 5-30 chars'),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.params.user_id
        const requestedBy = req.headers.user_id
        const { full_name, email, phone } = req.body

        // Check authorization
        checkAdmin(requestedBy, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Error checking admin status'))
            }
            if (!isAdmin && requestedBy != user_id) {
                return res.json(result.createResult('Unauthorized: Cannot update other users'))
            }

            // Check if user exists
            const checkSql = 'SELECT user_id FROM users WHERE user_id = ?'
            pool.query(checkSql, [user_id], (err, rows) => {
                if (err) {
                    return res.json(result.createResult('Database error'))
                }
                if (!rows || rows.length === 0) {
                    return res.json(result.createResult('User not found'))
                }

                // Check if new email is already taken (if changing email)
                if (email) {
                    const emailCheckSql = 'SELECT user_id FROM users WHERE email = ? AND user_id != ?'
                    pool.query(emailCheckSql, [email, user_id], (err, emailRows) => {
                        if (err) {
                            return res.json(result.createResult('Database error'))
                        }
                        if (emailRows && emailRows.length > 0) {
                            return res.json(result.createResult('Email is already in use'))
                        }

                        performUpdate()
                    })
                } else {
                    performUpdate()
                }

                function performUpdate() {
                    let updateSql = 'UPDATE users SET '
                    const params = []
                    const updates = []

                    if (full_name) {
                        updates.push('full_name = ?')
                        params.push(full_name)
                    }
                    if (email) {
                        updates.push('email = ?')
                        params.push(email)
                    }
                    if (phone !== undefined) {
                        updates.push('phone = ?')
                        params.push(phone)
                    }

                    if (updates.length === 0) {
                        return res.json(result.createResult('No fields to update'))
                    }

                    updateSql += updates.join(', ') + ' WHERE user_id = ?'
                    params.push(user_id)

                    pool.query(updateSql, params, (err, data) => {
                        if (err) {
                            console.error(err)
                            res.json(result.createResult('Error updating user'))
                        } else {
                            res.json(result.createResult(null, 'User information updated successfully'))
                        }
                    })
                }
            })
        })
    }
)

// ===== DELETE USER =====
// Delete user by user_id (for admin purposes only)
router.delete('/delete/:user_id',
    param('user_id').isInt().withMessage('User ID must be a valid integer'),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.params.user_id
        const requestedBy = req.headers.user_id

        // Check if user is admin
        checkAdmin(requestedBy, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Error checking admin status'))
            }
            if (!isAdmin) {
                return res.json(result.createResult('Unauthorized: Admin access required'))
            }

            // Check user exists
            const checkSql = 'SELECT user_id FROM users WHERE user_id = ?'
            pool.query(checkSql, [user_id], (err, rows) => {
                if (err) {
                    return res.json(result.createResult('Database error'))
                }
                if (!rows || rows.length === 0) {
                    return res.json(result.createResult('User not found'))
                }

                const sql = `DELETE FROM users WHERE user_id = ?`
                pool.query(sql, [user_id], (err, data) => {
                    if (err) {
                        console.error(err)
                        res.json(result.createResult('Error deleting user'))
                    } else {
                        res.json(result.createResult(null, 'User deleted successfully'))
                    }
                })
            })
        })
    }
)

// ===== GET USER BOOKINGS =====
// Get all bookings made by a user
router.get('/bookings/:user_id',
    param('user_id').isInt().withMessage('User ID must be a valid integer'),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.params.user_id
        const requestedBy = req.headers.user_id

        // Check authorization
        checkAdmin(requestedBy, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Error checking admin status'))
            }
            if (!isAdmin && requestedBy != user_id) {
                return res.json(result.createResult('Unauthorized: Cannot view other users bookings'))
            }

            const sql = `SELECT b.booking_id, b.user_id, b.package_date_id, b.booked_on, b.persons,
                            b.total_price, b.status, b.contact_phone, b.notes, b.updated_at,
                            p.title as package_title, p.duration_days,
                            d.name as destination_name,
                            pd.start_date, pd.end_date
                            FROM bookings b
                            LEFT JOIN package_dates pd ON b.package_date_id = pd.package_date_id
                            LEFT JOIN packages p ON pd.package_id = p.package_id
                            LEFT JOIN destinations d ON p.dest_id = d.dest_id
                            WHERE b.user_id = ?
                            ORDER BY b.booked_on DESC`
            pool.query(sql, [user_id], (err, data) => {
                if (err) {
                    console.error(err)
                    res.json(result.createResult(err))
                } else {
                    res.json(result.createResult(null, data || []))
                }
            })
        })
    }
)

module.exports = router
