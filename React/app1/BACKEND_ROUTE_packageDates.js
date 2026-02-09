/**
 * Backend Route for Package Dates
 * 
 * Add this file to d:\IMS\IMSBackend\routes\packageDates.js
 * Then mount it in Server.js: app.use('/packageDates', require('./routes/packageDates'));
 * 
 * This provides direct database queries for package dates
 */

const express = require('express');
const router = express.Router();
const db = require('../utils/db'); // Assuming db connection utility exists

/**
 * GET /packageDates
 * Get all dates for a specific package
 * Query params: package_id (required)
 */
router.get('/', async (req, res) => {
  try {
    const { package_id } = req.query;
    
    if (!package_id) {
      return res.status(400).json({
        status: 'error',
        error: 'package_id query parameter is required',
      });
    }

    const query = `
      SELECT 
        package_date_id,
        package_id,
        start_date,
        end_date,
        seats_total,
        seats_booked,
        (seats_total - seats_booked) as available_seats,
        is_active
      FROM package_dates
      WHERE package_id = ? AND is_active = 1
      ORDER BY start_date ASC
    `;

    db.query(query, [package_id], (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({
          status: 'error',
          error: 'Failed to fetch package dates',
        });
      }

      res.json({
        status: 'success',
        data: results,
        count: results.length,
      });
    });
  } catch (error) {
    console.error('Error in GET /packageDates:', error);
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
});

/**
 * GET /packageDates/available/:packageId
 * Get only available (not fully booked) dates for a package
 */
router.get('/available/:packageId', async (req, res) => {
  try {
    const { packageId } = req.params;

    const query = `
      SELECT 
        package_date_id,
        package_id,
        start_date,
        end_date,
        seats_total,
        seats_booked,
        (seats_total - seats_booked) as available_seats,
        is_active
      FROM package_dates
      WHERE package_id = ? 
        AND is_active = 1
        AND (seats_total - seats_booked) > 0
      ORDER BY start_date ASC
    `;

    db.query(query, [packageId], (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({
          status: 'error',
          error: 'Failed to fetch available dates',
        });
      }

      res.json({
        status: 'success',
        data: results,
        count: results.length,
      });
    });
  } catch (error) {
    console.error('Error in GET /packageDates/available/:packageId:', error);
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
});

/**
 * GET /packageDates/byPackage/:packageId
 * Alternative endpoint name for fetching package dates
 */
router.get('/byPackage/:packageId', async (req, res) => {
  try {
    const { packageId } = req.params;

    const query = `
      SELECT 
        package_date_id,
        package_id,
        start_date,
        end_date,
        seats_total,
        seats_booked,
        (seats_total - seats_booked) as available_seats,
        is_active
      FROM package_dates
      WHERE package_id = ? AND is_active = 1
      ORDER BY start_date ASC
    `;

    db.query(query, [packageId], (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({
          status: 'error',
          error: 'Failed to fetch package dates',
        });
      }

      res.json({
        status: 'success',
        data: results,
        count: results.length,
      });
    });
  } catch (error) {
    console.error('Error in GET /packageDates/byPackage/:packageId:', error);
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
});

/**
 * GET /packageDates/stats
 * Get statistics about package dates
 */
router.get('/stats', async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total_dates,
        SUM(seats_total) as total_seats,
        SUM(seats_booked) as total_booked,
        COUNT(DISTINCT package_id) as packages_with_dates
      FROM package_dates
      WHERE is_active = 1
    `;

    db.query(query, (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({
          status: 'error',
          error: 'Failed to fetch statistics',
        });
      }

      res.json({
        status: 'success',
        data: results[0],
      });
    });
  } catch (error) {
    console.error('Error in GET /packageDates/stats:', error);
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
});

module.exports = router;
