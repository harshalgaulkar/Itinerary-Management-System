# Backend Setup Guide - Complete Implementation

## Quick Status Check

### Test if Backend is Running

```bash
curl -X GET http://10.64.205.48:4000/destinations
```

**Expected Response (if working):**
```json
{
  "success": true,
  "data": [
    {
      "dest_id": 1,
      "name": "Paris",
      "country": "France",
      "description": "City of Light"
    }
  ]
}
```

**If you get HTML error:** Backend routes not configured yet.

---

## Backend Endpoints Required

### 1. DESTINATIONS

```
GET    /destinations              - Get all destinations
POST   /destinations/create       - Create destination
PUT    /destinations/:id          - Update destination
DELETE /destinations/:id          - Delete destination
```

#### POST /destinations/create
**Request Body:**
```json
{
  "name": "Tokyo",
  "country": "Japan",
  "description": "Capital of Japan"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "dest_id": 1,
    "name": "Tokyo",
    "country": "Japan",
    "description": "Capital of Japan"
  }
}
```

---

### 2. PACKAGES (Package Master)

```
GET    /packageMaster             - Get all packages
POST   /packageMaster/create      - Create package
PUT    /packageMaster/:id         - Update package
DELETE /packageMaster/:id         - Delete package
POST   /packageMaster/:id/dates   - Add dates to package
PUT    /packageMaster/:id/dates/:dateId - Update date
DELETE /packageMaster/:id/dates/:dateId - Delete date
```

#### POST /packageMaster/create
**Request Body:**
```json
{
  "title": "Manali Adventure",
  "description": "Mountain adventure in Himalayas",
  "duration_days": 5,
  "base_price": 10000
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "package_id": 1,
    "title": "Manali Adventure",
    "description": "Mountain adventure in Himalayas",
    "duration_days": 5,
    "base_price": 10000
  }
}
```

#### POST /packageMaster/:id/dates
**URL:** `/packageMaster/1/dates`

**Request Body:**
```json
{
  "start_date": "2026-03-01",
  "end_date": "2026-03-05",
  "seats_available": 20,
  "price_per_person": 12000
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "package_id": 1,
    "start_date": "2026-03-01",
    "end_date": "2026-03-05",
    "seats_available": 20,
    "price_per_person": 12000
  }
}
```

---

## Backend Implementation Examples

### Node.js/Express

```javascript
const express = require('express');
const router = express.Router();

// Middleware for authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token' });
  // Verify token here
  next();
};

// ========== DESTINATIONS ==========

router.get('/destinations', async (req, res) => {
  try {
    // Get from database
    const destinations = await db.query('SELECT * FROM destinations');
    res.json({ success: true, data: destinations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/destinations/create', authenticate, async (req, res) => {
  try {
    const { name, country, description } = req.body;
    const result = await db.query(
      'INSERT INTO destinations (name, country, description) VALUES (?, ?, ?)',
      [name, country, description]
    );
    res.status(201).json({
      success: true,
      data: {
        dest_id: result.insertId,
        name,
        country,
        description
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/destinations/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, country, description } = req.body;
    await db.query(
      'UPDATE destinations SET name=?, country=?, description=? WHERE dest_id=?',
      [name, country, description, id]
    );
    res.json({
      success: true,
      data: { dest_id: id, name, country, description }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/destinations/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM destinations WHERE dest_id=?', [id]);
    res.json({ success: true, data: { dest_id: id } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== PACKAGES (Package Master) ==========

router.get('/packageMaster', async (req, res) => {
  try {
    const packages = await db.query('SELECT * FROM package_master');
    res.json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/packageMaster/create', authenticate, async (req, res) => {
  try {
    const { title, description, duration_days, base_price } = req.body;
    const result = await db.query(
      'INSERT INTO package_master (title, description, duration_days, base_price) VALUES (?, ?, ?, ?)',
      [title, description, duration_days, base_price]
    );
    res.status(201).json({
      success: true,
      data: {
        package_id: result.insertId,
        title,
        description,
        duration_days,
        base_price
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/packageMaster/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration_days, base_price } = req.body;
    await db.query(
      'UPDATE package_master SET title=?, description=?, duration_days=?, base_price=? WHERE package_id=?',
      [title, description, duration_days, base_price, id]
    );
    res.json({
      success: true,
      data: { package_id: id, title, description, duration_days, base_price }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/packageMaster/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM package_master WHERE package_id=?', [id]);
    res.json({ success: true, data: { package_id: id } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== PACKAGE DATES ==========

router.post('/packageMaster/:id/dates', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { start_date, end_date, seats_available, price_per_person } = req.body;
    const result = await db.query(
      'INSERT INTO package_dates (package_id, start_date, end_date, seats_available, price_per_person) VALUES (?, ?, ?, ?, ?)',
      [id, start_date, end_date, seats_available, price_per_person]
    );
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        package_id: id,
        start_date,
        end_date,
        seats_available,
        price_per_person
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/packageMaster/:id/dates/:dateId', authenticate, async (req, res) => {
  try {
    const { id, dateId } = req.params;
    const { start_date, end_date, seats_available, price_per_person } = req.body;
    await db.query(
      'UPDATE package_dates SET start_date=?, end_date=?, seats_available=?, price_per_person=? WHERE id=? AND package_id=?',
      [start_date, end_date, seats_available, price_per_person, dateId, id]
    );
    res.json({
      success: true,
      data: { id: dateId, package_id: id, start_date, end_date, seats_available, price_per_person }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/packageMaster/:id/dates/:dateId', authenticate, async (req, res) => {
  try {
    const { id, dateId } = req.params;
    await db.query('DELETE FROM package_dates WHERE id=? AND package_id=?', [dateId, id]);
    res.json({ success: true, data: { id: dateId } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

---

## Database Schema

### destinations table
```sql
CREATE TABLE destinations (
  dest_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### package_master table
```sql
CREATE TABLE package_master (
  package_id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  duration_days INT NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### package_dates table
```sql
CREATE TABLE package_dates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  package_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  seats_available INT NOT NULL,
  price_per_person DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (package_id) REFERENCES package_master(package_id)
);
```

---

## Testing API Endpoints

### Using curl

#### 1. Create Destination
```bash
curl -X POST http://10.64.205.48:4000/destinations/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paris",
    "country": "France",
    "description": "City of Light"
  }'
```

#### 2. Get All Destinations
```bash
curl -X GET http://10.64.205.48:4000/destinations \
  -H "Content-Type: application/json"
```

#### 3. Update Destination
```bash
curl -X PUT http://10.64.205.48:4000/destinations/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paris Updated",
    "country": "France",
    "description": "Updated description"
  }'
```

#### 4. Delete Destination
```bash
curl -X DELETE http://10.64.205.48:4000/destinations/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. **Create Collection:** IMS-API
2. **Set Base URL:** `http://10.64.205.48:4000`
3. **Add Requests:**
   - GET /destinations
   - POST /destinations/create
   - PUT /destinations/:id
   - DELETE /destinations/:id
   - POST /packageMaster/create
   - etc.

4. **Add Authorization:**
   - Go to Authorization tab
   - Type: Bearer Token
   - Token: (Your JWT token)

---

## Troubleshooting

### Issue: 404 Not Found
- ✓ Verify route is registered
- ✓ Check HTTP method (GET/POST/PUT/DELETE)
- ✓ Check URL path spelling

### Issue: 401 Unauthorized
- ✓ Token not provided in Authorization header
- ✓ Token expired or invalid
- ✓ Fix: `curl -H "Authorization: Bearer <TOKEN>"`

### Issue: 500 Internal Server Error
- ✓ Database connection issue
- ✓ SQL syntax error
- ✓ Check backend logs
- ✓ Verify database schema exists

### Issue: CORS Error
Add to backend:
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});
```

---

## Frontend Configuration (Already Set)

All services are configured to:
1. Try real backend first
2. Handle errors gracefully
3. Detect HTML 404 responses
4. Fall back to demo mode if needed

Once backend is ready, just restart the app and it will automatically connect!

---

## Deployment Checklist

- [ ] All routes registered
- [ ] Database tables created
- [ ] Authentication middleware added
- [ ] Error handling implemented
- [ ] CORS configured
- [ ] Environment variables set
- [ ] Backend running on port 4000
- [ ] Tested all endpoints with curl
- [ ] Frontend app restarted

