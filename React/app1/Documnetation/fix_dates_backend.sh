#!/bin/bash
# Quick fix script for package dates issue
# Run this from d:\IMS\IMSBackend directory

echo "🔧 Package Dates Fetch Issue - Quick Fix Script"
echo "================================================"
echo ""

# Step 1: Copy the route file
echo "Step 1: Copying route file..."
if [ -f "routes/packageDates.js" ]; then
    echo "  ⚠️  packageDates.js already exists. Backing up..."
    mv routes/packageDates.js routes/packageDates.js.backup
fi

# Create the route file with proper content
cat > routes/packageDates.js << 'EOF'
const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// GET /packageDates - Get all dates for a package
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

// GET /packageDates/available/:packageId - Get available dates
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

// GET /packageDates/byPackage/:packageId - Alternative endpoint
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

// GET /packageDates/stats - Get statistics
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
EOF

echo "  ✅ Route file created: routes/packageDates.js"
echo ""

# Step 2: Check if Server.js already has the route mounted
echo "Step 2: Checking Server.js for existing route mount..."
if grep -q "packageDates" Server.js; then
    echo "  ✅ Route already mounted in Server.js"
else
    echo "  ⚠️  Route not found in Server.js"
    echo "  📝 Please add this line to Server.js (after other app.use() statements):"
    echo ""
    echo "    app.use('/packageDates', require('./routes/packageDates'));"
    echo ""
fi

echo "Step 3: Testing database connection..."
# This would require MySQL CLI
echo "  To verify database has data, run:"
echo "    mysql -u root -pmanager Fin -e \"SELECT COUNT(*) FROM package_dates;\""
echo ""

echo "✅ Backend route setup complete!"
echo ""
echo "Next steps:"
echo "  1. Add the route mount to Server.js if not already present"
echo "  2. Restart backend: node Server.js"
echo "  3. Test endpoint: curl http://localhost:4000/packageDates?package_id=1"
echo "  4. Restart React Native app: npx expo start -c"
