// Package Master routes for IMSBackend
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
    query('dest_id').optional().isInt(),
    query('title').optional().trim().isLength({ min: 1, max: 200 })
]

const packageBodyValidators = [
    body('title').trim().notEmpty().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be 1-200 chars'),
    body('dest_id').notEmpty().isInt().withMessage('Destination ID is required and must be a valid integer'),
    body('duration_days').notEmpty().isInt({ min: 1 }).withMessage('Duration days is required and must be at least 1'),
    body('base_price').notEmpty().isDecimal({ decimal_digits: '1,2' }).withMessage('Base price is required and must be a valid decimal'),
    body('max_people').optional().isInt({ min: 0 }).withMessage('Max people must be 0 or greater'),
    body('description').optional().trim().isLength({ max: 5000 }).withMessage('Description must be max 5000 chars')
]

// ===== GET ALL PACKAGES =====
router.get('/', ...paginationValidators, handleValidationErrors, (req, res) => {
    const { dest_id, title } = req.query
    const page = Math.max(req.query.page || 1, 1)
    const limit = Math.min(req.query.limit || 10, 100)
    const offset = (page - 1) * limit

    let sql = `SELECT p.package_id, p.title, p.dest_id, d.name as destination_name, p.duration_days, 
               p.base_price, p.max_people, p.description, p.created_by, p.created_at
               FROM packages p 
               LEFT JOIN destinations d ON p.dest_id = d.dest_id 
               WHERE 1=1`
    const params = []

    if (dest_id) {
        sql += ' AND p.dest_id = ?'
        params.push(dest_id)
    }
    if (title) {
        sql += ' AND p.title LIKE ?'
        params.push('%' + title + '%')
    }

    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    pool.query(sql, params, (err, rows) => {
        if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
        }
        res.json(result.createResult(null, { page, limit, data: rows }))
    })
})

// ===== GET PACKAGE BY ID =====
router.get('/:id', (req, res) => {
    const package_id = req.params.id
    
    if (!Number.isInteger(parseInt(package_id))) {
        return res.json(result.createResult('Invalid package ID'))
    }
    
    const sql = `SELECT p.package_id, p.title, p.dest_id, d.name as destination_name, 
                 p.duration_days, p.base_price, p.max_people, p.description, p.created_by, p.created_at
                 FROM packages p 
                 LEFT JOIN destinations d ON p.dest_id = d.dest_id 
                 WHERE p.package_id = ?`
    
    pool.query(sql, [package_id], (err, rows) => {
        if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
        }
        if (!rows || rows.length === 0) {
            return res.json(result.createResult('Package not found'))
        }
        res.json(result.createResult(null, rows[0]))
    })
})

// ===== GET PACKAGE ITINERARIES =====
router.get('/:id/itineraries', (req, res) => {
    const package_id = req.params.id
    
    if (!Number.isInteger(parseInt(package_id))) {
        return res.json(result.createResult('Invalid package ID'))
    }
    
    const sql = `SELECT itinerary_id, package_id, day_number, title, details
                FROM package_itineraries
                WHERE package_id = ?
                ORDER BY day_number ASC`
    
    pool.query(sql, [package_id], (err, rows) => {
        if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
        }
        res.json(result.createResult(null, rows || []))
    })
})

// ===== GET PACKAGE DATES =====
router.get('/:id/dates', (req, res) => {
    const package_id = req.params.id
    
    if (!Number.isInteger(parseInt(package_id))) {
        return res.json(result.createResult('Invalid package ID'))
    }
    
    const sql = `SELECT package_date_id, package_id, start_date, end_date, seats_total,
                    seats_booked, price_override, is_active
                    FROM package_dates
                    WHERE package_id = ? AND is_active = 1
                    ORDER BY start_date ASC`
    
    pool.query(sql, [package_id], (err, rows) => {
        if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
        }
        res.json(result.createResult(null, rows || []))
    })
})

// ===== CREATE PACKAGE (ADMIN) =====
router.post('/', ...packageBodyValidators, handleValidationErrors, (req, res) => {
    const user_id = req.headers.user_id || req.headers.uid || (req.user && req.user.user_id)
    const { title, dest_id, duration_days, base_price, max_people, description } = req.body
    
    checkAdmin(user_id, (err, isAdmin) => {
        if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
        }
        if (!isAdmin) {
            return res.json(result.createResult('Unauthorized: Admin access required'))
        }
        
        // Verify destination exists
        const checkDestSql = 'SELECT dest_id FROM destinations WHERE dest_id = ?'
        pool.query(checkDestSql, [dest_id], (err, rows) => {
            if (err) {
                console.error(err)
                return res.json(result.createResult('Database error'))
            }
            if (!rows || rows.length === 0) {
                return res.json(result.createResult('Destination not found'))
            }
            
            const sql = `INSERT INTO packages (title, dest_id, duration_days, base_price, max_people, description, created_by, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`
            const params = [title, dest_id, duration_days, base_price, max_people || 0, description || null, user_id]
            pool.query(sql, params, (err, data) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Error creating package'))
                }
                res.json(result.createResult(null, {
                    package_id: data.insertId,
                    message: 'Package created successfully'
                }))
            })
        })
    })
})

// ===== UPDATE PACKAGE (ADMIN) =====
router.put('/:id',
    body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be 1-200 chars'),
    body('dest_id').optional().isInt().withMessage('Destination ID must be a valid integer'),
    body('duration_days').optional().isInt({ min: 1 }).withMessage('Duration days must be at least 1'),
    body('base_price').optional().isDecimal({ decimal_digits: '1,2' }).withMessage('Base price must be a valid decimal'),
    body('max_people').optional().isInt({ min: 0 }).withMessage('Max people must be 0 or greater'),
    body('description').optional().trim().isLength({ max: 5000 }).withMessage('Description must be max 5000 chars'),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.headers.user_id || req.headers.uid || (req.user && req.user.user_id)
        const package_id = req.params.id
        
        if (!Number.isInteger(parseInt(package_id))) {
            return res.json(result.createResult('Invalid package ID'))
        }
        
        checkAdmin(user_id, (err, isAdmin) => {
            if (err) {
                console.error(err)
                return res.json(result.createResult('Database error'))
            }
            if (!isAdmin) {
                return res.json(result.createResult('Unauthorized: Admin access required'))
            }
            
            // Check if package exists
            const checkSql = 'SELECT package_id FROM packages WHERE package_id = ?'
            pool.query(checkSql, [package_id], (err, rows) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Database error'))
                }
                if (!rows || rows.length === 0) {
                    return res.json(result.createResult('Package not found'))
                }
                
                const { title, dest_id, duration_days, base_price, max_people, description } = req.body
                let sql = 'UPDATE packages SET '
                const params = []
                const updates = []
                
                if (title) {
                    updates.push('title = ?')
                    params.push(title)
                }
                if (dest_id) {
                    updates.push('dest_id = ?')
                    params.push(dest_id)
                }
                if (duration_days) {
                    updates.push('duration_days = ?')
                    params.push(duration_days)
                }
                if (base_price) {
                    updates.push('base_price = ?')
                    params.push(base_price)
                }
                if (max_people !== undefined) {
                    updates.push('max_people = ?')
                    params.push(max_people)
                }
                if (description !== undefined) {
                    updates.push('description = ?')
                    params.push(description)
                }
                
                if (updates.length === 0) {
                    return res.json(result.createResult('No fields to update'))
                }
                
                sql += updates.join(', ') + ' WHERE package_id = ?'
                params.push(package_id)
                pool.query(sql, params, (err, data) => {
                    if (err) {
                        console.error(err)
                        return res.json(result.createResult('Error updating package'))
                    }
                    res.json(result.createResult(null, 'Package updated successfully'))
                })
            })
        })
    }
)

// ===== CREATE PACKAGE ITINERARY (ADMIN) =====
router.post('/:id/itineraries',
    body('day_number').notEmpty().isInt({ min: 1 }).withMessage('Day number is required and must be at least 1'),
    body('title').notEmpty().trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be 1-200 chars'),
    body('details').optional().trim().isLength({ max: 5000 }).withMessage('Details must be max 5000 chars'),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.headers.user_id || req.headers.uid || (req.user && req.user.user_id)
        const package_id = req.params.id
        
        if (!Number.isInteger(parseInt(package_id))) {
            return res.json(result.createResult('Invalid package ID'))
        }
        
        checkAdmin(user_id, (err, isAdmin) => {
            if (err) {
                console.error(err)
                return res.json(result.createResult('Database error'))
            }
            if (!isAdmin) {
                return res.json(result.createResult('Unauthorized: Admin access required'))
            }
            
            // Check if package exists
            const checkSql = 'SELECT package_id FROM packages WHERE package_id = ?'
            pool.query(checkSql, [package_id], (err, rows) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Database error'))
                }
                if (!rows || rows.length === 0) {
                    return res.json(result.createResult('Package not found'))
                }
                
                const { day_number, title, details } = req.body
                const sql = `INSERT INTO package_itineraries (package_id, day_number, title, details)
                            VALUES (?, ?, ?, ?)`
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
                        message: 'Itinerary added successfully'
                    }))
                })
            })
        })
    }
)

// ===== UPDATE PACKAGE ITINERARY (ADMIN) =====
router.put('/:id/itineraries/:itinerary_id',
    body('day_number').optional().isInt({ min: 1 }).withMessage('Day number must be at least 1'),
    body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be 1-200 chars'),
    body('details').optional().trim().isLength({ max: 5000 }).withMessage('Details must be max 5000 chars'),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.headers.user_id || req.headers.uid || (req.user && req.user.user_id)
        const package_id = req.params.id
        const itinerary_id = req.params.itinerary_id
        
        if (!Number.isInteger(parseInt(package_id)) || !Number.isInteger(parseInt(itinerary_id))) {
            return res.json(result.createResult('Invalid package or itinerary ID'))
        }
        
        checkAdmin(user_id, (err, isAdmin) => {
            if (err) {
                console.error(err)
                return res.json(result.createResult('Database error'))
            }
            if (!isAdmin) {
                return res.json(result.createResult('Unauthorized: Admin access required'))
            }
            
            // Check if itinerary exists
            const checkSql = `SELECT itinerary_id FROM package_itineraries 
                            WHERE itinerary_id = ? AND package_id = ?`
            pool.query(checkSql, [itinerary_id, package_id], (err, rows) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Database error'))
                }
                if (!rows || rows.length === 0) {
                    return res.json(result.createResult('Itinerary not found'))
                }
                const { day_number, title, details } = req.body
                let sql = 'UPDATE package_itineraries SET '
                const params = []
                const updates = []

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
            })
        })
    }
)

// ===== CREATE PACKAGE DATE (ADMIN) =====
router.post('/:id/dates',
    body('start_date').notEmpty().isISO8601().toDate().withMessage('Start date is required and must be valid ISO date'),
    body('end_date').notEmpty().isISO8601().toDate().withMessage('End date is required and must be valid ISO date'),
    body('seats_total').notEmpty().isInt({ min: 1 }).withMessage('Seats total is required and must be at least 1'),
    body('price_override').optional().isDecimal({ decimal_digits: '1,2' }).withMessage('Price override must be valid decimal'),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.headers.user_id || req.headers.uid || (req.user && req.user.user_id)
        const package_id = req.params.id
        
        if (!Number.isInteger(parseInt(package_id))) {
            return res.json(result.createResult('Invalid package ID'))
        }
        
        checkAdmin(user_id, (err, isAdmin) => {
            if (err) {
                console.error(err)
                return res.json(result.createResult('Database error'))
            }
            if (!isAdmin) {
                return res.json(result.createResult('Unauthorized: Admin access required'))
            }
            
            // Check if package exists
            const checkSql = 'SELECT package_id FROM packages WHERE package_id = ?'
            pool.query(checkSql, [package_id], (err, rows) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Database error'))
                }
                if (!rows || rows.length === 0) {
                    return res.json(result.createResult('Package not found'))
                }
                
                const { start_date, end_date, seats_total, price_override } = req.body
                
                // Validate dates
                if (new Date(end_date) < new Date(start_date)) {
                    return res.json(result.createResult('End date must be after or equal to start date'))
                }
                
                const sql = `INSERT INTO package_dates (package_id, start_date, end_date, seats_total, price_override, is_active)
                            VALUES (?, ?, ?, ?, ?, 1)`
                pool.query(sql, [package_id, start_date, end_date, seats_total, price_override || null], (err, data) => {
                    if (err) {
                        console.error(err)
                        return res.json(result.createResult('Error creating package date'))
                    }
                    res.json(result.createResult(null, {
                        package_date_id: data.insertId,
                        message: 'Package date created successfully'
                    }))
                })
            })
        })
    }
)

// ===== UPDATE PACKAGE DATE (ADMIN) =====
router.put('/:id/dates/:date_id',
    body('start_date').optional().isISO8601().toDate().withMessage('Start date must be valid ISO date'),
    body('end_date').optional().isISO8601().toDate().withMessage('End date must be valid ISO date'),
    body('seats_total').optional().isInt({ min: 1 }).withMessage('Seats total must be at least 1'),
    body('price_override').optional().isDecimal({ decimal_digits: '1,2' }).withMessage('Price override must be valid decimal'),
    body('is_active').optional().isInt({ min: 0, max: 1 }).withMessage('is_active must be 0 or 1'),
    handleValidationErrors,
    (req, res) => {
        const user_id = req.headers.user_id || req.headers.uid || (req.user && req.user.user_id)
        const package_id = req.params.id
        const date_id = req.params.date_id
        
        if (!Number.isInteger(parseInt(package_id)) || !Number.isInteger(parseInt(date_id))) {
            return res.json(result.createResult('Invalid package or date ID'))
        }
        
        checkAdmin(user_id, (err, isAdmin) => {
            if (err) {
                console.error(err)
                return res.json(result.createResult('Database error'))
            }
            if (!isAdmin) {
                return res.json(result.createResult('Unauthorized: Admin access required'))
            }
            
            // Check if package date exists
            const checkSql = `SELECT package_date_id FROM package_dates
                            WHERE package_date_id = ? AND package_id = ?`
            pool.query(checkSql, [date_id, package_id], (err, rows) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Database error'))
                }
                if (!rows || rows.length === 0) {
                    return res.json(result.createResult('Package date not found'))
                }
                
                const { start_date, end_date, seats_total, price_override, is_active } = req.body
                let sql = 'UPDATE package_dates SET '
                const params = []
                const updates = []
                
                if (start_date) {
                    updates.push('start_date = ?')
                    params.push(start_date)
                }
                if (end_date) {
                    updates.push('end_date = ?')
                    params.push(end_date)
                }
                if (seats_total !== undefined) {
                    updates.push('seats_total = ?')
                    params.push(seats_total)
                }
                if (price_override !== undefined) {
                    updates.push('price_override = ?')
                    params.push(price_override)
                }
                if (is_active !== undefined) {
                    updates.push('is_active = ?')
                    params.push(is_active)
                }
                
                if (updates.length === 0) {
                    return res.json(result.createResult('No fields to update'))
                }
                
                sql += updates.join(', ') + ' WHERE package_date_id = ?'
                params.push(date_id)
                pool.query(sql, params, (err, data) => {
                    if (err) {
                        console.error(err)
                        return res.json(result.createResult('Error updating package date'))
                    }
                    res.json(result.createResult(null, 'Package date updated successfully'))
                })
            })
        })
    }
)

// ===== DELETE PACKAGE (ADMIN) =====
router.delete('/:id', (req, res) => {
    const user_id = req.headers.user_id || req.headers.uid || (req.user && req.user.user_id)
    const package_id = req.params.id
    
    if (!Number.isInteger(parseInt(package_id))) {
        return res.json(result.createResult('Invalid package ID'))
    }
    
    checkAdmin(user_id, (err, isAdmin) => {
        if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
        }
        if (!isAdmin) {
            return res.json(result.createResult('Unauthorized: Admin access required'))
        }
        
        // Check if package exists
        const checkSql = 'SELECT package_id FROM packages WHERE package_id = ?'
        pool.query(checkSql, [package_id], (err, rows) => {
            if (err) {
                console.error(err)
                return res.json(result.createResult('Database error'))
            }
            if (!rows || rows.length === 0) {
                return res.json(result.createResult('Package not found'))
            }
            
            const sql = 'DELETE FROM packages WHERE package_id = ?'
            pool.query(sql, [package_id], (err, data) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Error deleting package'))
                }
                res.json(result.createResult(null, 'Package deleted successfully'))
            })
        })
    })
})

// ===== DELETE PACKAGE ITINERARY (ADMIN) =====
router.delete('/:id/itineraries/:itinerary_id', (req, res) => {
    const user_id = req.headers.user_id || req.headers.uid || (req.user && req.user.user_id)
    const itinerary_id = req.params.itinerary_id
    const package_id = req.params.id
    
    if (!Number.isInteger(parseInt(package_id)) || !Number.isInteger(parseInt(itinerary_id))) {
        return res.json(result.createResult('Invalid package or itinerary ID'))
    }
    
    checkAdmin(user_id, (err, isAdmin) => {
        if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
        }
        if (!isAdmin) {
            return res.json(result.createResult('Unauthorized: Admin access required'))
        }
        
        // Check if itinerary exists
        const checkSql = `SELECT itinerary_id FROM package_itineraries 
                        WHERE itinerary_id = ? AND package_id = ?`
        pool.query(checkSql, [itinerary_id, package_id], (err, rows) => {
            if (err) {
                console.error(err)
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

// ===== DELETE PACKAGE DATE (ADMIN) =====
router.delete('/:id/dates/:date_id', (req, res) => {
    const user_id = req.headers.user_id || req.headers.uid || (req.user && req.user.user_id)
    const date_id = req.params.date_id
    const package_id = req.params.id
    
    if (!Number.isInteger(parseInt(package_id)) || !Number.isInteger(parseInt(date_id))) {
        return res.json(result.createResult('Invalid package or date ID'))
    }
    
    checkAdmin(user_id, (err, isAdmin) => {
        if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
        }
        if (!isAdmin) {
            return res.json(result.createResult('Unauthorized: Admin access required'))
        }
        
        // Check if package date exists
        const checkSql = `SELECT package_date_id FROM package_dates
                        WHERE package_date_id = ? AND package_id = ?`
        pool.query(checkSql, [date_id, package_id], (err, rows) => {
            if (err) {
                console.error(err)
                return res.json(result.createResult('Database error'))
            }
            if (!rows || rows.length === 0) {
                return res.json(result.createResult('Package date not found'))
            }
            
            const sql = 'DELETE FROM package_dates WHERE package_date_id = ?'
            pool.query(sql, [date_id], (err, data) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Error deleting package date'))
                }
                res.json(result.createResult(null, 'Package date deleted successfully'))
            })
        })
    })
})

module.exports = router
