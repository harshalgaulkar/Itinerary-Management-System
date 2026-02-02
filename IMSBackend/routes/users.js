// Users routes for IMSBackend
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

// GET / - Get all users (Admin only)
router.get('/',
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    handleValidationErrors,
    (req, res) => {
        const userId = req.headers.user_id

        checkAdmin(userId, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Admin check failed', null))
            }
            if (!isAdmin) {
                return res.json(result.createResult('Unauthorized: Admin access required', null))
            }

            const page = Math.max(req.query.page || 1, 1)
            const limit = Math.min(req.query.limit || 10, 100)
            const offset = (page - 1) * limit

            const sql = `SELECT user_id, email, full_name, phone, role, created_at
                        FROM users
                        ORDER BY created_at DESC
                        LIMIT ? OFFSET ?`

            pool.query(sql, [limit, offset], (err, rows) => {
                if (err) {
                    console.error('Database error:', err)
                    return res.json(result.createResult('Failed to fetch users', null))
                }

                // Get total count
                const countSql = 'SELECT COUNT(*) as total FROM users'
                pool.query(countSql, (countErr, countRows) => {
                    if (countErr) {
                        console.error('Database error:', countErr)
                        return res.json(result.createResult('Failed to fetch user count', null))
                    }

                    const total = countRows[0].total
                    res.json(result.createResult(null, {
                        data: rows,
                        page,
                        limit,
                        total,
                        pages: Math.ceil(total / limit)
                    }))
                })
            })
        })
    }
)

// GET /:id - Get single user by ID (Admin or own profile)
router.get('/:id', (req, res) => {
    const userId = req.headers.user_id
    const id = req.params.id

    checkAdmin(userId, (err, isAdmin) => {
        if (err) {
            return res.json(result.createResult('Admin check failed', null))
        }

        // Allow viewing own profile or if admin
        if (userId !== id && !isAdmin) {
            return res.json(result.createResult('Unauthorized: Cannot view other users', null))
        }

        const sql = `SELECT user_id, email, full_name, phone, role, created_at
                    FROM users
                    WHERE user_id = ?`

        pool.query(sql, [id], (err, rows) => {
            if (err) {
                console.error('Database error:', err)
                return res.json(result.createResult('Failed to fetch user', null))
            }
            if (!rows || rows.length === 0) {
                return res.json(result.createResult('User not found', null))
            }
            res.json(result.createResult(null, rows[0]))
        })
    })
})

// DELETE /:id - Delete user (Admin only)
router.delete('/:id',
    (req, res) => {
        const userId = req.headers.user_id
        const id = req.params.id

        if (!userId) {
            return res.json(result.createResult('Unauthorized', null))
        }

        checkAdmin(userId, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Admin check failed', null))
            }
            if (!isAdmin) {
                return res.json(result.createResult('Unauthorized: Admin access required', null))
            }

            // Prevent deleting self
            if (userId === id) {
                return res.json(result.createResult('Cannot delete your own account', null))
            }

            const sql = 'DELETE FROM users WHERE user_id = ?'

            pool.query(sql, [id], (err) => {
                if (err) {
                    console.error('Database error:', err)
                    return res.json(result.createResult('Failed to delete user', null))
                }
                res.json(result.createResult(null, { success: true, message: 'User deleted successfully' }))
            })
        })
    }
)

// PUT /:id - Update user (Admin can update any, users can update own)
router.put('/:id',
    body('full_name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional().trim(),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    handleValidationErrors,
    (req, res) => {
        const userId = req.headers.user_id
        const id = req.params.id
        const { full_name, phone, email } = req.body

        if (!userId) {
            return res.json(result.createResult('Unauthorized', null))
        }

        checkAdmin(userId, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Admin check failed', null))
            }

            // Allow updating own profile or if admin
            if (userId !== id && !isAdmin) {
                return res.json(result.createResult('Unauthorized: Cannot update other users', null))
            }

            let updates = []
            let params = []

            if (full_name !== undefined) {
                updates.push('full_name = ?')
                params.push(full_name)
            }
            if (phone !== undefined) {
                updates.push('phone = ?')
                params.push(phone)
            }
            if (email !== undefined && isAdmin) {
                updates.push('email = ?')
                params.push(email)
            }

            if (updates.length === 0) {
                return res.json(result.createResult('No fields to update', null))
            }

            params.push(id)

            const sql = `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`

            pool.query(sql, params, (err) => {
                if (err) {
                    console.error('Database error:', err)
                    return res.json(result.createResult('Failed to update user', null))
                }

                // Fetch updated user
                const fetchSql = 'SELECT user_id, email, full_name, phone, role, created_at FROM users WHERE user_id = ?'
                pool.query(fetchSql, [id], (fetchErr, rows) => {
                    if (fetchErr) {
                        return res.json(result.createResult('User updated but failed to fetch', null))
                    }
                    res.json(result.createResult(null, rows[0]))
                })
            })
        })
    }
)

module.exports = router
