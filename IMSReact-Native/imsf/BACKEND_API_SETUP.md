# Backend API Configuration Guide

## Issue: 404 Error When Creating Destinations

The frontend is trying to call `POST http://10.64.205.48:4000/destinations/create` but the backend returns a 404 (Not Found) error.

---

## Root Cause

The backend API endpoints for destinations management are not properly configured or registered.

---

## Current Frontend Configuration

**File:** `src/utils/config.js`

Current endpoints being used:
```javascript
GET_DESTINATIONS: '/destinations',           // ✓ Works
CREATE_DESTINATION: '/destinations/create',  // ✗ Returns 404
UPDATE_DESTINATION: '/destinations',         // ✗ Returns 404
DELETE_DESTINATION: '/destinations',         // ✗ Returns 404
```

---

## Solution: Backend Routes Configuration

### Option 1: Standard RESTful Routes (Recommended)

If your backend uses standard REST conventions, update `config.js`:

```javascript
// Destination endpoints (RESTful)
GET_DESTINATIONS: '/destinations',
GET_DESTINATION: '/destinations/:id',
CREATE_DESTINATION: '/destinations',        // POST
UPDATE_DESTINATION: '/destinations/:id',    // PUT
DELETE_DESTINATION: '/destinations/:id',    // DELETE
```

And ensure your backend has these routes:
```
GET    /destinations           - Get all destinations
GET    /destinations/:id       - Get single destination
POST   /destinations           - Create destination
PUT    /destinations/:id       - Update destination
DELETE /destinations/:id       - Delete destination
```

### Option 2: Custom Routes with `/create` suffix

If your backend uses this pattern, keep current config and ensure these routes exist:
```
POST /destinations/create
PUT  /destinations/update/:id
DELETE /destinations/:id
```

---

## Backend Setup Checklist

### For Node.js/Express Backend:

```javascript
// Example Express routes
router.get('/destinations', getAllDestinations);
router.get('/destinations/:id', getDestinationById);
router.post('/destinations', createDestination);        // OR /destinations/create
router.put('/destinations/:id', updateDestination);     // OR /destinations/update/:id
router.delete('/destinations/:id', deleteDestination);
```

### For Other Frameworks:

- **Spring Boot**: Create @RestController with @RequestMapping
- **Django**: Register routes in urls.py
- **Laravel**: Create routes in routes/api.php
- **ASP.NET**: Create controllers with Route attributes

---

## Verify Backend Routes

### Test with curl:

```bash
# Test GET all destinations
curl -X GET http://10.64.205.48:4000/destinations \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test POST create destination
curl -X POST http://10.64.205.48:4000/destinations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Paris","country":"France","description":"City of Light"}'
```

### Expected Response:

**Success (200/201):**
```json
{
  "success": true,
  "data": {
    "dest_id": 1,
    "name": "Paris",
    "country": "France",
    "description": "City of Light"
  }
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Route not found",
  "status": 404
}
```

---

## API Request Format

### Create Destination

**Request:**
```
POST http://10.64.205.48:4000/destinations/create
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "name": "Tokyo",
  "country": "Japan",
  "description": "Capital of Japan"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "dest_id": 2,
    "name": "Tokyo",
    "country": "Japan",
    "description": "Capital of Japan",
    "created_at": "2026-01-29T10:30:00Z"
  }
}
```

---

## All Endpoints That Need Backend Configuration

### Destinations
- ✗ POST `/destinations/create` - Create destination
- ✗ PUT `/destinations/:id` - Update destination
- ✗ DELETE `/destinations/:id` - Delete destination

### Packages
- ✗ POST `/packages/create` - Create package
- ✗ PUT `/packages/:id` - Update package
- ✗ DELETE `/packages/:id` - Delete package

### Package Master (Admin)
- ✗ POST `/packageMaster/create` - Create package master
- ✗ PUT `/packageMaster/:id` - Update package master
- ✗ DELETE `/packageMaster/:id` - Delete package master
- ✗ POST `/packageMaster/:id/dates` - Add package dates
- ✗ PUT `/packageMaster/:id/dates/:dateId` - Update dates
- ✗ DELETE `/packageMaster/:id/dates/:dateId` - Delete dates

### Itineraries
- ✗ POST `/packageItenerary/create` - Create itinerary
- ✗ PUT `/packageItenerary/:id` - Update itinerary
- ✗ DELETE `/packageItenerary/:id` - Delete itinerary

---

## Common Backend Issues & Solutions

### Issue: Database connection error
- Solution: Check database credentials in backend .env
- Verify database is running and accessible

### Issue: Missing authentication
- Solution: Ensure JWT token is properly validated
- Check Authorization header format: `Bearer <token>`

### Issue: Validation errors
- Solution: Ensure request body matches expected schema
- Check required fields: name, country, description for destinations

### Issue: CORS errors
- Solution: Add CORS headers to backend responses
- Allow requests from frontend origin

---

## Frontend Error Handling

If backend endpoints are temporarily unavailable, the frontend gracefully handles it by:
1. Showing an alert to the user
2. Logging detailed error messages to console
3. Optionally falling back to mock data for testing

---

## Next Steps

1. **Verify Backend is Running**
   ```bash
   curl http://10.64.205.48:4000/destinations
   ```

2. **Check Backend Logs** for routing errors

3. **Configure Missing Routes** in backend

4. **Test with Postman/Insomnia**
   - Import test requests
   - Verify response format

5. **Update Frontend Config** if endpoint paths differ

---

## Support

For backend setup issues, refer to your framework's documentation:
- Node.js/Express: https://expressjs.com
- Django: https://www.djangoproject.com
- Spring Boot: https://spring.io/projects/spring-boot
- Laravel: https://laravel.com

