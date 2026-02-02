// Package Itinerary routes for IMSBackend
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

// GET /itineraries - Get all itineraries with optional filters
router.get('/',
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('package_id').optional().isInt(),
    handleValidationErrors,
    (req, res) => {
        const { package_id } = req.query
        const page = Math.max(req.query.page || 1, 1)
        const limit = Math.min(req.query.limit || 10, 100)
        const offset = (page - 1) * limit

        let sql = `SELECT pi.itinerary_id, pi.package_id, pi.day_number, pi.title, pi.details,
                    p.title as package_title
                    FROM package_itineraries pi
                    LEFT JOIN packages p ON pi.package_id = p.package_id
                    WHERE 1=1`

        const params = []

        if (package_id) {
            sql += ' AND pi.package_id = ?'
            params.push(package_id)
        }

        sql += ' ORDER BY pi.package_id ASC, pi.day_number ASC LIMIT ? OFFSET ?'
        params.push(limit, offset)

        pool.query(sql, params, (err, rows) => {
            if (err) {
                console.error('Database error:', err)
                return res.json(result.createResult('Failed to fetch itineraries', null))
            }
            res.json(result.createResult(null, { data: rows, page, limit }))
        })
    }
)

// GET /package/:package_id - Get itinerary for a specific package
router.get('/package/:package_id', (req, res) => {
    const package_id = req.params.package_id

    const sql = `SELECT itinerary_id, package_id, day_number, title, details
                    FROM package_itineraries
                    WHERE package_id = ?
                    ORDER BY day_number ASC`

    pool.query(sql, [package_id], (err, rows) => {
        if (err) {
            console.error('Database error:', err)
            return res.json(result.createResult('Failed to fetch itinerary', null))
        }
        res.json(result.createResult(null, rows))
    })
})

// GET /:id - Get single itinerary by ID
router.get('/:id', (req, res) => {
    const id = req.params.id

    const sql = `SELECT pi.itinerary_id, pi.package_id, pi.day_number, pi.title, pi.details,
                p.title as package_title
                FROM package_itineraries pi
                LEFT JOIN packages p ON pi.package_id = p.package_id
                WHERE pi.itinerary_id = ?`

    pool.query(sql, [id], (err, rows) => {
        if (err) {
            console.error('Database error:', err)
            return res.json(result.createResult('Failed to fetch itinerary', null))
        }
        if (!rows || rows.length === 0) {
            return res.json(result.createResult('Itinerary not found', null))
        }
        res.json(result.createResult(null, rows[0]))
    })
})

// POST /create - Create new itinerary
router.post('/create',
    body('package_id').isInt(),
    body('day_number').isInt({ min: 1 }),
    body('title').notEmpty().trim().escape(),
    body('details').optional().trim().escape(),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.headers.user_id
        const { package_id, day_number, title, details } = req.body

        checkAdmin(user_id, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Admin check failed', null))
            }
            if (!isAdmin) {
                return res.json(result.createResult('Unauthorized', null))
            }

            const sql = `INSERT INTO package_itineraries (package_id, day_number, title, details)
                        VALUES (?, ?, ?, ?)`

            pool.query(sql, [package_id, day_number, title, details], (err, result_data) => {
                if (err) {
                    console.error('Database error:', err)
                    return res.json(result.createResult('Failed to create itinerary', null))
                }
                res.json(result.createResult(null, { itinerary_id: result_data.insertId }))
            })
        })
    }
)

// PUT /:id - Update itinerary
router.put('/:id',
    body('day_number').optional().isInt({ min: 1 }),
    body('title').optional().trim().escape(),
    body('details').optional().trim().escape(),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.headers.user_id
        const id = req.params.id
        const { day_number, title, details } = req.body

        checkAdmin(user_id, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Admin check failed', null))
            }
            if (!isAdmin) {
                return res.json(result.createResult('Unauthorized', null))
            }

            let sql = 'UPDATE package_itineraries SET '
            const fields = []
            const values = []

            if (day_number !== undefined) {
                fields.push('day_number = ?')
                values.push(day_number)
            }
            if (title !== undefined) {
                fields.push('title = ?')
                values.push(title)
            }
            if (details !== undefined) {
                fields.push('details = ?')
                values.push(details)
            }

            if (fields.length === 0) {
                return res.json(result.error('No fields to update', 400))
            }

            sql += fields.join(', ') + ' WHERE itinerary_id = ?'
            values.push(id)

            pool.query(sql, values, (err) => {
                if (err) {
                    console.error('Database error:', err)
                    return res.json(result.createResult('Failed to update itinerary', null))
                }
                res.json(result.createResult(null, { success: true }))
            })
        })
    }
)

// DELETE /:id - Delete itinerary
router.delete('/:id', (req, res) => {
    const user_id = req.headers.user_id
    const id = req.params.id

    checkAdmin(user_id, (err, isAdmin) => {
        if (err) {
            return res.json(result.createResult('Admin check failed', null))
        }
        if (!isAdmin) {
            return res.json(result.createResult('Unauthorized', null))
        }

        const sql = 'DELETE FROM package_itineraries WHERE itinerary_id = ?'

        pool.query(sql, [id], (err) => {
            if (err) {
                console.error('Database error:', err)
                return res.json(result.createResult('Failed to delete itinerary', null))
            }
            res.json(result.createResult(null, { success: true }))
        })
    })
})

module.exports = router
