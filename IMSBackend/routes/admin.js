// Admin routes for IMSBackend
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { body, query, validationResult } = require('express-validator')

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

// ===== POST CREATE USER (ADMIN ONLY) =====
// Admin can create users with specific roles
// First admin can be created without authorization
//meta data : create user with meta data : {"email":"harry@gmail.com","password":"harry@1234","full_name":"harshal","phone":"9356452473","role":"admin"}
router.post('/signup/user',
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().isLength({ min: 6 }).withMessage('Password is required (min 6 chars)'),
    body('full_name').notEmpty().isLength({ min: 2 }).withMessage('Full name is required (min 2 chars)'),
    body('phone').optional().isLength({ min: 5, max: 30 }).withMessage('Phone must be 5-30 chars'),
    body('role').optional().trim().isIn(['admin', 'manager', 'user']).withMessage('Invalid role: must be admin, manager, or user'),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.headers.user_id
        const { email, password, full_name, phone = null } = req.body
        let role = req.body.role && req.body.role.trim() ? req.body.role.trim().toLowerCase() : 'user'

        // Check if any admin exists in the database
        const checkAdminSql = 'SELECT user_id FROM users WHERE role = "admin" LIMIT 1'
        pool.query(checkAdminSql, (err, adminRows) => {
            if (err) {
                console.error(err)
                return res.json(result.createResult('Error checking admin existence'))
            }

            const adminExists = adminRows && adminRows.length > 0
            const isFirstAdmin = !adminExists && role === 'admin'

            // If not the first admin, require admin authorization
            if (!isFirstAdmin) {
                // Validate that user_id is provided
                if (!user_id) {
                    return res.json(result.createResult('Unauthorized: user_id header required for non-first admin creation'))
                }
                
                // Check if requester is admin
                checkAdmin(user_id, (err, isAdmin) => {
                    if (err) {
                        return res.json(result.createResult('Error checking admin status'))
                    }
                    if (!isAdmin) {
                        return res.json(result.createResult('Unauthorized: Only admins can create users'))
                    }
                    createUserInDatabase()
                })
            } else {
                // Allow creating first admin without authorization
                createUserInDatabase()
            }

            function createUserInDatabase() {
                // Validate role value
                const validRoles = ['admin', 'manager', 'user']
                if (!validRoles.includes(role)) {
                    return res.json(result.createResult('Invalid role: must be admin, manager, or user'))
                }

                // Check if user already exists
                const checkSql = 'SELECT user_id FROM users WHERE email = ? LIMIT 1'
                pool.query(checkSql, [email], (err, rows) => {
                    if (err) {
                        console.error(err)
                        return res.json(result.createResult('Database error'))
                    }
                    if (rows && rows.length > 0) {
                        return res.json(result.createResult('User already exists'))
                    }

                    // Hash password and create user
                    bcrypt.hash(password, 10, (err, passwordHash) => {
                        if (err) {
                            console.error(err)
                            return res.json(result.createResult('Error hashing password'))
                        }

                        const insertSql = 'INSERT INTO users (email, password_hash, full_name, phone, role) VALUES (?, ?, ?, ?, ?)'
                        pool.query(insertSql, [email, passwordHash, full_name, phone, role], (err, result_data) => {
                            if (err) {
                                console.error(err)
                                return res.json(result.createResult('Error creating user'))
                            }
                            res.json(result.createResult(null, { 
                                message: 'User created successfully', 
                                user_id: result_data.insertId,
                                email,
                                full_name,
                                role
                            }))
                        })
                    })
                })
            }
        })
    }
)

// ===== GET ALL USERS (ADMIN ONLY) =====
router.get('/users',
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('role').optional().isIn(['admin', 'manager', 'user']),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.headers.user_id
        const page = Math.max(req.query.page || 1, 1)
        const limit = Math.min(req.query.limit || 10, 100)
        const offset = (page - 1) * limit
        const { role } = req.query

        checkAdmin(user_id, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Error checking admin status'))
            }
            if (!isAdmin) {
                return res.json(result.createResult('Unauthorized: Only admins can view all users'))
            }

            // Build query with optional role filter
            let sql = 'SELECT user_id, email, full_name, phone, role, created_at FROM users WHERE 1=1'
            const params = []
            
            if (role) {
                sql += ' AND role = ?'
                params.push(role)
            }

            // Get total count for pagination
            const countSql = sql.replace('SELECT user_id, email, full_name, phone, role, created_at', 'SELECT COUNT(*) as total')
            pool.query(countSql, params, (err, countRows) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Database error'))
                }

                const total = countRows[0].total
                sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
                params.push(limit, offset)

                pool.query(sql, params, (err, rows) => {
                    if (err) {
                        console.error(err)
                        return res.json(result.createResult('Database error'))
                    }
                    res.json(result.createResult(null, {
                        users: rows,
                        pagination: {
                            page,
                            limit,
                            total,
                            pages: Math.ceil(total / limit)
                        }
                    }))
                })
            })
        })
    }
)

// ===== PUT UPDATE USER ROLE (ADMIN ONLY) =====
router.put('/user/:user_id/role',
    body('role').isIn(['admin', 'manager', 'user']).withMessage('Invalid role'),
    handleValidationErrors,
    (req, res) => {
        const admin_id = req.headers.user_id
        const { user_id } = req.params
        const { role } = req.body

        checkAdmin(admin_id, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Error checking admin status'))
            }
            if (!isAdmin) {
                return res.json(result.createResult('Unauthorized: Only admins can update user roles'))
            }

            const sql = 'UPDATE users SET role = ? WHERE user_id = ?'
            pool.query(sql, [role, user_id], (err, data) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Error updating user role'))
                }
                if (data.affectedRows === 0) {
                    return res.json(result.createResult('User not found'))
                }
                res.json(result.createResult(null, { message: 'User role updated successfully', user_id, role }))
            })
        })
    }
)

// ===== DELETE USER (ADMIN ONLY) =====
router.delete('/user/:user_id',
    (req, res) => {
        const admin_id = req.headers.user_id
        const { user_id } = req.params

        // Validate user_id is a number
        if (!Number.isInteger(parseInt(user_id))) {
            return res.json(result.createResult('Invalid user ID'))
        }

        checkAdmin(admin_id, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Error checking admin status'))
            }
            if (!isAdmin) {
                return res.json(result.createResult('Unauthorized: Only admins can delete users'))
            }

            // Check for dependent records
            const checkDependenciesSql = `
                SELECT 
                    (SELECT COUNT(*) FROM bookings WHERE user_id = ?) as booking_count,
                    (SELECT COUNT(*) FROM reviews WHERE user_id = ?) as review_count,
                    (SELECT COUNT(*) FROM payments p 
                     INNER JOIN bookings b ON p.booking_id = b.booking_id 
                     WHERE b.user_id = ?) as payment_count
            `
            pool.query(checkDependenciesSql, [user_id, user_id, user_id], (err, depData) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Error checking user dependencies'))
                }

                const deps = depData[0]
                if (deps.booking_count > 0 || deps.review_count > 0 || deps.payment_count > 0) {
                    return res.json(result.createResult(`Cannot delete user with existing records. Bookings: ${deps.booking_count}, Reviews: ${deps.review_count}, Payments: ${deps.payment_count}`))
                }

                // Proceed with deletion
                const sql = 'DELETE FROM users WHERE user_id = ?'
                pool.query(sql, [user_id], (err, data) => {
                    if (err) {
                        console.error(err)
                        return res.json(result.createResult('Error deleting user'))
                    }
                    if (data.affectedRows === 0) {
                        return res.json(result.createResult('User not found'))
                    }
                    res.json(result.createResult(null, { message: 'User deleted successfully', user_id }))
                })
            })
        })
    }
)

module.exports = router
// Example usage:
// POST /admin/signup/user
// Body: { "email": "user@example.com", "password": "password123", "full_name": "John Doe", "phone": "1234567890", "role": "admin" }
// Headers: { "Authorization": "Bearer <token>" }