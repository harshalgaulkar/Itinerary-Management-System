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
    query('country').optional().trim().isLength({ min: 1, max: 100 }),
    query('name').optional().trim().isLength({ min: 1, max: 150 })
]

const destinationBodyValidators = [
    body('name').trim().notEmpty().isLength({ min: 1, max: 150 }).withMessage('Name is required and must be 1-150 chars'),
    body('country').trim().notEmpty().isLength({ min: 1, max: 100 }).withMessage('Country is required and must be 1-100 chars'),
    body('description').optional().trim().isLength({ max: 5000 }).withMessage('Description must be max 5000 chars'),
    body('image').optional().trim().isLength({ max: 255 }).withMessage('Image must be max 255 chars')
]

// ===== GET ALL DESTINATIONS =====
router.get('/', ...paginationValidators, handleValidationErrors, (req, res) => {
    const { country, name } = req.query
    const page = Math.max(req.query.page || 1, 1)
    const limit = Math.min(req.query.limit || 10, 100)
    const offset = (page - 1) * limit
    
    let sql = 'SELECT dest_id, name, country, description, image, created_at FROM destinations WHERE 1=1'
    const params = []
    
    if (country) {
        sql += ' AND country = ?'
        params.push(country)
    }
    if (name) {
        sql += ' AND name LIKE ?'
        params.push('%' + name + '%')
    }
    
    sql += ' ORDER BY name ASC LIMIT ? OFFSET ?'
    params.push(limit, offset)
    
    pool.query(sql, params, (err, rows) => {
        if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
        }
        res.json(result.createResult(null, { page, limit, data: rows }))
    })
})

// ===== GET DESTINATION BY ID =====
router.get('/:id', (req, res) => {
    const dest_id = req.params.id
    
    if (!Number.isInteger(parseInt(dest_id))) {
        return res.json(result.createResult('Invalid destination ID'))
    }
    
    const sql = 'SELECT dest_id, name, country, description, image, created_at FROM destinations WHERE dest_id = ?'
    pool.query(sql, [dest_id], (err, rows) => {
        if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
        }
        if (!rows || rows.length === 0) {
            return res.json(result.createResult('Destination not found'))
        }
        res.json(result.createResult(null, rows[0]))
    })
})

// ===== GET PACKAGES BY DESTINATION ID =====
router.get('/:id/packages', (req, res) => {
    const dest_id = req.params.id
    
    if (!Number.isInteger(parseInt(dest_id))) {
        return res.json(result.createResult('Invalid destination ID'))
    }
    
    const sql = `SELECT p.package_id, p.title, p.duration_days, p.base_price, p.max_people, p.description, p.created_by, p.created_at
                FROM packages p
                WHERE p.dest_id = ?`
    pool.query(sql, [dest_id], (err, rows) => {
        if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
        }
        res.json(result.createResult(null, rows || []))
    })
})

// ===== CREATE DESTINATION (ADMIN) =====
router.post('/', ...destinationBodyValidators, handleValidationErrors, (req, res) => {
    const userId = req.headers.user_id || req.headers.uid || (req.user && req.user.user_id)
    
    checkAdmin(userId, (err, isAdmin) => {
        if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
        }
        if (!isAdmin) {
            return res.json(result.createResult('Unauthorized: Admin access required'))
        }
        
        const { name, country, description, image } = req.body
        
        // Check if destination already exists
        const checkSql = 'SELECT dest_id FROM destinations WHERE name = ? AND country = ? LIMIT 1'
        pool.query(checkSql, [name, country], (err, rows) => {
            if (err) {
                console.error(err)
                return res.json(result.createResult('Database error'))
            }
            if (rows && rows.length > 0) {
                return res.json(result.createResult('Destination already exists'))
            }
            
            const insertSql = 'INSERT INTO destinations (name, country, description, image) VALUES (?, ?, ?, ?)'
            pool.query(insertSql, [name, country, description || null, image || null], (err, result_data) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Database error'))
                }
                res.json(result.createResult(null, { dest_id: result_data.insertId, message: 'Destination created' }))
            })
        })
    })
})

// ===== UPDATE DESTINATION (ADMIN) =====
router.put('/:id', ...destinationBodyValidators, handleValidationErrors, (req, res) => {
    const userId = req.headers.user_id || req.headers.uid || (req.user && req.user.user_id)
    const dest_id = req.params.id
    
    if (!Number.isInteger(parseInt(dest_id))) {
        return res.json(result.createResult('Invalid destination ID'))
    }
    
    checkAdmin(userId, (err, isAdmin) => {
        if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
        }
        if (!isAdmin) {
            return res.json(result.createResult('Unauthorized: Admin access required'))
        }
        
        const { name, country, description, image } = req.body
        
        // Check if destination exists
        const checkSql = 'SELECT dest_id FROM destinations WHERE dest_id = ? LIMIT 1'
        pool.query(checkSql, [dest_id], (err, rows) => {
            if (err) {
                console.error(err)
                return res.json(result.createResult('Database error'))
            }
            if (!rows || rows.length === 0) {
                return res.json(result.createResult('Destination not found'))
            }
            
            const updateSql = 'UPDATE destinations SET name = ?, country = ?, description = ?, image = ? WHERE dest_id = ?'
            pool.query(updateSql, [name, country, description || null, image || null, dest_id], (err, result_data) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Database error'))
                }
                res.json(result.createResult(null, { message: 'Destination updated successfully' }))
            })
        })
    })
})

// ===== DELETE DESTINATION (ADMIN) =====
router.delete('/:id', (req, res) => {
    const userId = req.headers.user_id || req.headers.uid || (req.user && req.user.user_id)
    const dest_id = req.params.id
    
    if (!Number.isInteger(parseInt(dest_id))) {
        return res.json(result.createResult('Invalid destination ID'))
    }
    
    checkAdmin(userId, (err, isAdmin) => {
        if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
        }
        if (!isAdmin) {
            return res.json(result.createResult('Unauthorized: Admin access required'))
        }
        
        // Check if destination exists
        const checkSql = 'SELECT dest_id FROM destinations WHERE dest_id = ? LIMIT 1'
        pool.query(checkSql, [dest_id], (err, rows) => {
            if (err) {
                console.error(err)
                return res.json(result.createResult('Database error'))
            }
            if (!rows || rows.length === 0) {
                return res.json(result.createResult('Destination not found'))
            }
            
            const delSql = 'DELETE FROM destinations WHERE dest_id = ?'
            pool.query(delSql, [dest_id], (err, result_data) => {
                if (err) {
                    console.error(err)
                    return res.json(result.createResult('Database error'))
                }
                res.json(result.createResult(null, { message: 'Destination deleted successfully' }))
            })
        })
    })
})

// ===== SEARCH DESTINATIONS & PACKAGES WITH FILTERS =====
router.post('/searchcombinations',
    body('country').optional().trim().isLength({ max: 100 }),
    body('name').optional().trim().isLength({ max: 150 }),
    body('min_price').optional().isFloat({ min: 0 }).toFloat(),
    body('max_price').optional().isFloat({ min: 0 }).toFloat(),
    body('duration_days').optional().isInt({ min: 1 }).toInt(),
    body('start_date').optional().isISO8601().toDate(),
    body('end_date').optional().isISO8601().toDate(),
    body('seats_required').optional().isInt({ min: 1 }).toInt(),
    handleValidationErrors, (req, res) => {
    const { country, name, min_price, max_price, duration_days, start_date, end_date, seats_required } = req.body
    
    let sql = `SELECT p.package_id, p.title, p.duration_days, COALESCE(pd.price_override, p.base_price) AS price,
                pd.package_date_id, pd.start_date, pd.end_date, pd.seats_total, pd.seats_booked,
                d.dest_id, d.name AS dest_name, d.country, d.description AS dest_description, d.image
                FROM packages p
                JOIN destinations d ON p.dest_id = d.dest_id
                LEFT JOIN package_dates pd ON p.package_id = pd.package_id
                WHERE 1=1`
    const params = []
    
    if (country) {
        sql += ' AND d.country = ?'
        params.push(country)
    }
    if (name) {
        sql += ' AND d.name LIKE ?'
        params.push('%' + name + '%')
    }
    if (duration_days) {
        sql += ' AND p.duration_days = ?'
        params.push(duration_days)
    }
    if (min_price) {
        sql += ' AND COALESCE(pd.price_override, p.base_price) >= ?'
        params.push(min_price)
    }
    if (max_price) {
        sql += ' AND COALESCE(pd.price_override, p.base_price) <= ?'
        params.push(max_price)
    }
    if (start_date) {
        sql += ' AND pd.start_date >= ?'
        params.push(start_date.toISOString().split('T')[0])
    }
    if (end_date) {
        sql += ' AND pd.end_date <= ?'
        params.push(end_date.toISOString().split('T')[0])
    }
    if (seats_required) {
        sql += ' AND (pd.seats_total = 0 OR (pd.seats_total - pd.seats_booked) >= ?)'
        params.push(seats_required)
    }
    
    sql += ' ORDER BY pd.start_date IS NULL, pd.start_date ASC, price ASC'
    
    pool.query(sql, params, (err, rows) => {
        if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
        }
        res.json(result.createResult(null, rows || []))
    })
})


module.exports = router
