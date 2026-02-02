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

    let sql = `SELECT pi.itinerary_id, pi.package_id, pi.day_number, pi.title, pi.details, pi.created_at, pi.updated_at,
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
                console.error(err)
                return res.json(result.createResult('Database error'))
            }
            res.json(result.createResult(null, { page, limit, data: rows }))
        })
    }
)

// GET /itineraries/package/:package_id - Get all itineraries for a specific package
router.get('/package/:package_id', (req, res) => {
    const package_id = req.params.package_id
    if (!Number.isInteger(parseInt(package_id))) {
        return res.json(result.createResult('Invalid package ID'))
    }

    const sql = `SELECT itinerary_id, package_id, day_number, title, details, created_at, updated_at
                    FROM package_itineraries
                    WHERE package_id = ?
                    ORDER BY day_number ASC`

    pool.query(sql, [package_id], (err, rows) => {
        if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
        }

        // Verify package exists
        const checkSql = 'SELECT package_id, duration_days FROM packages WHERE package_id = ?'
        pool.query(checkSql, [package_id], (err, packageRows) => {
            if (err) {
                return res.json(result.createResult('Database error'))
            }
            if (!packageRows || packageRows.length === 0) {
                return res.json(result.createResult('Package not found'))
            }

            res.json(result.createResult(null, {
                package_id: package_id,
                duration_days: packageRows[0].duration_days,
                itineraries: rows || []
            }))
        })
    })
})

// GET /itineraries/:id - Get single itinerary by ID
router.get('/:id', (req, res) => {
    const itinerary_id = req.params.id
    
    if (!Number.isInteger(parseInt(itinerary_id))) {
        return res.json(result.createResult('Invalid itinerary ID'))
    }
    
    const sql = `SELECT pi.itinerary_id, pi.package_id, pi.day_number, pi.title, pi.details, pi.created_at, pi.updated_at,
                    p.title as package_title, p.duration_days
                    FROM package_itineraries pi
                    LEFT JOIN packages p ON pi.package_id = p.package_id
                    WHERE pi.itinerary_id = ?`

    pool.query(sql, [itinerary_id], (err, rows) => {
        if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
        }
        if (!rows || rows.length === 0) {
            return res.json(result.createResult('Itinerary not found'))
        }
        res.json(result.createResult(null, rows[0]))
    })
})

// POST /packageItenerary - Create new itinerary (admin only)
router.post('/',
    body('package_id').notEmpty().isInt().withMessage('Package ID is required and must be a valid integer'),
    body('day_number').notEmpty().isInt({ min: 1 }).withMessage('Day number is required and must be at least 1'),
    body('title').notEmpty().trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be 1-200 chars'),
    body('details').optional().trim().isLength({ max: 5000 }).withMessage('Details must be max 5000 chars'),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.headers.user_id || req.headers.uid || (req.user && req.user.user_id)
        const { package_id, day_number, title, details } = req.body
        
        checkAdmin(user_id, (err, isAdmin) => {
            if (err) {
                console.error(err)
                return res.json(result.createResult('Database error'))
            }
            if (!isAdmin) {
                return res.json(result.createResult('Unauthorized: Admin access required'))
            }
            
            // Verify package exists and check duration
            const checkSql = 'SELECT package_id, duration_days FROM packages WHERE package_id = ?'
            pool.query(checkSql, [package_id], (err, rows) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Database error'))
                }
                if (!rows || rows.length === 0) {
                    return res.json(result.createResult('Package not found'))
                }
                
                // Verify day_number doesn't exceed duration_days
                if (day_number > rows[0].duration_days) {
                    return res.json(result.createResult(`Day number cannot exceed package duration of ${rows[0].duration_days} days`))
                }
                
                const sql = `INSERT INTO package_itineraries (package_id, day_number, title, details, created_at, updated_at)
                            VALUES (?, ?, ?, ?, NOW(), NOW())`
                pool.query(sql, [package_id, day_number, title, details || null], (err, data) => {
                    if (err) {
                        console.error(err)
                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.json(result.createResult('Itinerary for this day already exists'))
                        }
                        return res.json(result.createResult('Error creating itinerary'))
                    }
                    res.json(result.createResult(null, {
                        itinerary_id: data.insertId,
                        message: 'Itinerary created successfully'
                    }))
                })
            })
        })
    }
)

// PUT /itineraries/:id - Update itinerary (admin only)
router.put('/:id',
    body('day_number').optional().isInt({ min: 1 }).withMessage('Day number must be at least 1'),
    body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be 1-200 chars'),
    body('details').optional().trim(),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.headers.user_id
        const itinerary_id = req.params.id
        // Check if user is admin
        checkAdmin(user_id, (err, isAdmin) => {
            if (err) {
                return res.json(result.createResult('Error checking admin status'))
            }
            if (!isAdmin) {
                return res.json(result.createResult('Unauthorized: Admin access required'))
            }
            // Check if itinerary exists
            const checkSql = `SELECT package_id FROM package_itineraries WHERE itinerary_id = ?`
            pool.query(checkSql, [itinerary_id], (err, rows) => {
                if (err) {
                    return res.json(result.createResult('Database error'))
                }
                if (!rows || rows.length === 0) {
                    return res.json(result.createResult('Itinerary not found'))
                }
                const package_id = rows[0].package_id
                const { day_number, title, details } = req.body
                let sql = 'UPDATE package_itineraries SET '
                const params = []
                const updates = []
                // If day_number is being updated, validate it
                if (day_number) {
                    const packageCheckSql = 'SELECT duration_days FROM packages WHERE package_id = ?'
                    pool.query(packageCheckSql, [package_id], (err, packageRows) => {
                        if (err) {
                            return res.json(result.createResult('Database error'))
                        }
                        if (!packageRows || packageRows.length === 0) {
                            return res.json(result.createResult('Package not found'))
                        }
                        if (day_number > packageRows[0].duration_days) {
                            return res.json(result.createResult(`Day number cannot exceed package duration of ${packageRows[0].duration_days} days`))
                        }
                        executeUpdate()
                    })
                } else {
                    executeUpdate()
                }
                function executeUpdate() {
                    if (day_number) {
                        updates.push('day_number = ?')
                        params.push(day_number)
                    }
                    if (title !== undefined) {
                        updates.push('title = ?')
                        params.push(title)
                    }
                    if (details !== undefined) {
                        updates.push('details = ?')
                        params.push(details)
                    }
                    
                    updates.push('updated_at = NOW()')
                    
                    if (updates.length === 1) {
                        return res.json(result.createResult('No fields to update'))
                    }
                    sql += updates.join(', ') + ' WHERE itinerary_id = ?'
                    params.push(itinerary_id)
                    pool.query(sql, params, (err, data) => {
                        if (err) {
                            console.error(err)
                            if (err.code === 'ER_DUP_ENTRY') {
                                return res.json(result.createResult('Itinerary for this day already exists'))
                            }
                            return res.json(result.createResult('Error updating itinerary'))
                        }
                        res.json(result.createResult(null, 'Itinerary updated successfully'))
                    })
                }
            })
        })
    }
)

// DELETE /itineraries/package/:package_id - Delete all itineraries for a package (admin only)
router.delete('/package/:package_id', (req, res) => {
    const user_id = req.headers.user_id
    const package_id = req.params.package_id
    
    if (!Number.isInteger(parseInt(package_id))) {
        return res.json(result.createResult('Invalid package ID'))
    }
    
    checkAdmin(user_id, (err, isAdmin) => {
        if (err) {
            return res.json(result.createResult('Error checking admin status'))
        }
        if (!isAdmin) {
            return res.json(result.createResult('Unauthorized: Admin access required'))
        }
        
        // Check if package exists
        const checkSql = 'SELECT package_id FROM packages WHERE package_id = ?'
        pool.query(checkSql, [package_id], (err, rows) => {
            if (err) {
                return res.json(result.createResult('Database error'))
            }
            if (!rows || rows.length === 0) {
                return res.json(result.createResult('Package not found'))
            }
            
            const sql = 'DELETE FROM package_itineraries WHERE package_id = ?'
            pool.query(sql, [package_id], (err, data) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Error deleting itineraries'))
                }
                res.json(result.createResult(null, `${data.affectedRows} itinerary(ies) deleted successfully`))
            })
        })
    })
})

// DELETE /itineraries/:id - Delete itinerary (admin only)
router.delete('/:id', (req, res) => {
    const user_id = req.headers.user_id
    const itinerary_id = req.params.id
    
    if (!Number.isInteger(parseInt(itinerary_id))) {
        return res.json(result.createResult('Invalid itinerary ID'))
    }
    
    checkAdmin(user_id, (err, isAdmin) => {
        if (err) {
            return res.json(result.createResult('Error checking admin status'))
        }
        if (!isAdmin) {
            return res.json(result.createResult('Unauthorized: Admin access required'))
        }
        
        // Check if itinerary exists
        const checkSql = 'SELECT itinerary_id FROM package_itineraries WHERE itinerary_id = ?'
        pool.query(checkSql, [itinerary_id], (err, rows) => {
            if (err) {
                return res.json(result.createResult('Database error'))
            }
            if (!rows || rows.length === 0) {
                return res.json(result.createResult('Itinerary not found'))
            }
            
            const sql = 'DELETE FROM package_itineraries WHERE itinerary_id = ?'
            pool.query(sql, [itinerary_id], (err, data) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Error deleting itinerary'))
                }
                res.json(result.createResult(null, 'Itinerary deleted successfully'))
            })
        })
    })
})

// DELETE /itineraries/package/:package_id - Delete all itineraries for a package (admin only)
router.delete('/package/:package_id', (req, res) => {
    const user_id = req.headers.user_id
    const package_id = req.params.package_id
    // Check if user is admin
    checkAdmin(user_id, (err, isAdmin) => {
        if (err) {
            return res.json(result.createResult('Error checking admin status'))
        }
        if (!isAdmin) {
            return res.json(result.createResult('Unauthorized: Admin access required'))
        }
        // Check if package exists
        const checkSql = 'SELECT package_id FROM packages WHERE package_id = ?'
        pool.query(checkSql, [package_id], (err, rows) => {
            if (err) {
                return res.json(result.createResult('Database error'))
            }
            if (!rows || rows.length === 0) {
                return res.json(result.createResult('Package not found'))
            }
            const sql = 'DELETE FROM package_itineraries WHERE package_id = ?'
            pool.query(sql, [package_id], (err, data) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Error deleting itineraries'))
                }
                res.json(result.createResult(null, `${data.affectedRows} itinerary(ies) deleted successfully`))
            })
        })
    })
})

module.exports = router
