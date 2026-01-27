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

// GET /packages
// Optional filters: dest_id, title (partial), duration_days, page, limit
router.get(
  '/',
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('dest_id').optional().isInt().toInt(),
  query('title').optional().trim().isLength({ min: 1, max: 200 }),
  query('duration_days').optional().isInt({ min: 1 }).toInt(),
  handleValidationErrors,
  (req, res) => {
    const { dest_id, title, duration_days } = req.query
    const page = Math.max(req.query.page || 1, 1)
    const limit = Math.min(req.query.limit || 10, 100)
    const offset = (page - 1) * limit

    let sql = 'SELECT package_id, title, dest_id, duration_days, base_price, max_people, description, created_by, created_at FROM packages WHERE 1=1'
    const params = []
    if (dest_id) {
      sql += ' AND dest_id = ?'
      params.push(dest_id)
    }
    if (title) {
      sql += ' AND title LIKE ?'
      params.push('%' + title + '%')
    }
    if (duration_days) {
      sql += ' AND duration_days = ?'
      params.push(duration_days)
    }
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
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

// GET /packages/:id
router.get('/:id', (req, res) => {
  const package_id = req.params.id
  if (!Number.isInteger(parseInt(package_id))) return res.json(result.createResult('Invalid package ID'))

  const sql = 'SELECT package_id, title, dest_id, duration_days, base_price, max_people, description, created_by, created_at FROM packages WHERE package_id = ?'
  pool.query(sql, [package_id], (err, rows) => {
    if (err) {
      console.error(err)
      return res.json(result.createResult('Database error'))
    }
    if (!rows || rows.length === 0) return res.json(result.createResult('Package not found'))
    res.json(result.createResult(null, rows[0]))
  })
})

// GET /packages/:id/dates
router.get('/:id/dates', (req, res) => {
  const package_id = req.params.id
  if (!Number.isInteger(parseInt(package_id))) return res.json(result.createResult('Invalid package ID'))

  const sql = `SELECT package_date_id, package_id, start_date, end_date, seats_total, seats_booked, price_override, is_active FROM package_dates WHERE package_id = ? ORDER BY start_date ASC`
  pool.query(sql, [package_id], (err, rows) => {
    if (err) {
      console.error(err)
      return res.json(result.createResult('Database error'))
    }
    res.json(result.createResult(null, rows || []))
  })
})

// GET /packages/:id/itineraries
router.get('/:id/itineraries', (req, res) => {
  const package_id = req.params.id
  if (!Number.isInteger(parseInt(package_id))) return res.json(result.createResult('Invalid package ID'))

  const sql = `SELECT itinerary_id, package_id, day_number, title, details FROM package_itineraries WHERE package_id = ? ORDER BY day_number ASC`
  pool.query(sql, [package_id], (err, rows) => {
    if (err) {
      console.error(err)
      return res.json(result.createResult('Database error'))
    }
    res.json(result.createResult(null, rows || []))
  })
})

// POST /packages  (admin)
router.post(
  '/',
  body('title').trim().notEmpty().isLength({ min: 1, max: 200 }).withMessage('Title required (1-200 chars)'),
  body('dest_id').isInt({ min: 1 }).withMessage('dest_id is required and must be an integer'),
  body('duration_days').isInt({ min: 1 }).withMessage('duration_days is required and must be integer'),
  body('base_price').isFloat({ min: 0 }).toFloat().withMessage('base_price is required and must be a number'),
  body('max_people').isInt({ min: 1 }).toInt().withMessage('max_people is required and must be integer'),
  body('description').optional().trim().isLength({ max: 5000 }),
  handleValidationErrors,
  (req, res) => {
    const userId = req.headers.user_id || req.headers.uid || (req.user && req.user.user_id)
    checkAdmin(userId, (err, isAdmin) => {
      if (err) {
        console.error(err)
        return res.json(result.createResult('Database error'))
      }
      if (!isAdmin) return res.json(result.createResult('Unauthorized: Admin access required'))

      const { title, dest_id, duration_days, base_price, max_people, description } = req.body

      // Ensure destination exists
      const checkDestSql = 'SELECT dest_id FROM destinations WHERE dest_id = ? LIMIT 1'
      pool.query(checkDestSql, [dest_id], (err, destRows) => {
        if (err) {
          console.error(err)
          return res.json(result.createResult('Database error'))
        }
        if (!destRows || destRows.length === 0) return res.json(result.createResult('Destination not found'))

        const insertSql = `INSERT INTO packages (title, dest_id, duration_days, base_price, max_people, description, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)`
        const created_by = userId
        pool.query(insertSql, [title, dest_id, duration_days, base_price, max_people, description || null, created_by], (err, insertRes) => {
          if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
          }
          res.json(result.createResult(null, { package_id: insertRes.insertId, message: 'Package created' }))
        })
      })
    })
  }
)

// PUT /packages/:id  (admin)
router.put(
  '/:id',
  body('title').trim().notEmpty().isLength({ min: 1, max: 200 }).withMessage('Title required (1-200 chars)'),
  body('dest_id').isInt({ min: 1 }).withMessage('dest_id is required and must be an integer'),
  body('duration_days').isInt({ min: 1 }).withMessage('duration_days is required and must be integer'),
  body('base_price').isFloat({ min: 0 }).toFloat().withMessage('base_price is required and must be a number'),
  body('max_people').isInt({ min: 1 }).toInt().withMessage('max_people is required and must be integer'),
  body('description').optional().trim().isLength({ max: 5000 }),
  handleValidationErrors,
  (req, res) => {
    const userId = req.headers.user_id || req.headers.uid || (req.user && req.user.user_id)
    const package_id = req.params.id
    if (!Number.isInteger(parseInt(package_id))) return res.json(result.createResult('Invalid package ID'))

    checkAdmin(userId, (err, isAdmin) => {
      if (err) {
        console.error(err)
        return res.json(result.createResult('Database error'))
      }
      if (!isAdmin) return res.json(result.createResult('Unauthorized: Admin access required'))

      const { title, dest_id, duration_days, base_price, max_people, description } = req.body

      // Check package exists
      const checkSql = 'SELECT package_id FROM packages WHERE package_id = ? LIMIT 1'
      pool.query(checkSql, [package_id], (err, rows) => {
        if (err) {
          console.error(err)
          return res.json(result.createResult('Database error'))
        }
        if (!rows || rows.length === 0) return res.json(result.createResult('Package not found'))

        const updateSql = 'UPDATE packages SET title = ?, dest_id = ?, duration_days = ?, base_price = ?, max_people = ?, description = ? WHERE package_id = ?'
        pool.query(updateSql, [title, dest_id, duration_days, base_price, max_people, description || null, package_id], (err, updateRes) => {
          if (err) {
            console.error(err)
            return res.json(result.createResult('Database error'))
          }
          res.json(result.createResult(null, { message: 'Package updated successfully' }))
        })
      })
    })
  }
)

// DELETE /packages/:id  (admin)
router.delete('/:id', (req, res) => {
  const userId = req.headers.user_id || req.headers.uid || (req.user && req.user.user_id)
  const package_id = req.params.id
  if (!Number.isInteger(parseInt(package_id))) return res.json(result.createResult('Invalid package ID'))

  checkAdmin(userId, (err, isAdmin) => {
    if (err) {
      console.error(err)
      return res.json(result.createResult('Database error'))
    }
    if (!isAdmin) return res.json(result.createResult('Unauthorized: Admin access required'))

    const checkSql = 'SELECT package_id FROM packages WHERE package_id = ? LIMIT 1'
    pool.query(checkSql, [package_id], (err, rows) => {
      if (err) {
        console.error(err)
        return res.json(result.createResult('Database error'))
      }
      if (!rows || rows.length === 0) return res.json(result.createResult('Package not found'))

      const delSql = 'DELETE FROM packages WHERE package_id = ?'
      pool.query(delSql, [package_id], (err, delRes) => {
        if (err) {
          console.error(err)
          return res.json(result.createResult('Database error'))
        }
        res.json(result.createResult(null, { message: 'Package deleted successfully' }))
      })
    })
  })
})

module.exports = router
