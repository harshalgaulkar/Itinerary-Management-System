# API Response Format Reference

Your backend uses this response format. The frontend is now configured to handle it.

---

## Standard Response Format

### Success Response (200 OK / 201 Created)

```json
{
  "status": "success",
  "data": {
    "dest_id": 1,
    "name": "Paris",
    "country": "France",
    "description": "City of Light",
    "created_at": "2026-01-29T10:00:00.000Z"
  }
}
```

**Frontend receives:**
```javascript
{
  success: true,
  data: {
    dest_id: 1,
    name: "Paris",
    country: "France",
    description: "City of Light",
    created_at: "2026-01-29T10:00:00.000Z"
  },
  message: "Success",
  statusCode: 200
}
```

---

### Error Response (400/401/404/500)

```json
{
  "status": "error",
  "error": "Destination not found",
  "statusCode": 404
}
```

**Frontend receives:**
```javascript
{
  success: false,
  message: "Destination not found",
  statusCode: 404,
  error: {
    status: "error",
    error: "Destination not found",
    statusCode: 404
  }
}
```

---

## Authentication Error Response

```json
{
  "status": "error",
  "error": "Token is Missing"
}
```

**Frontend receives:**
```javascript
{
  success: false,
  message: "Token is Missing",
  statusCode: 401,
  error: {
    status: "error",
    error: "Token is Missing"
  }
}
```

---

## Pagination Response

```json
{
  "status": "success",
  "data": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "data": [
      {
        "dest_id": 1,
        "name": "Paris",
        "country": "France",
        "description": "City of Light"
      },
      {
        "dest_id": 2,
        "name": "London",
        "country": "England",
        "description": "Capital of England"
      },
      ...
    ]
  }
}
```

---

## How Frontend Handles This

### In `src/utils/result.js`:

```javascript
// Backend response: {"status":"success","data":{...}}
// Frontend transforms to: {success:true, data:{...}}

handleResponse: async (response) => {
  const data = await response.json();
  
  // Check for error status
  if (data.status === 'error' || !response.ok) {
    return result.error(data.message, response.status, data);
  }
  
  // Extract data from backend response
  return result.success(data.data || data, data.message || 'Success', response.status);
}
```

---

## API Endpoints

### DESTINATIONS

#### Get All
```
GET /destinations
Response:
{
  "status": "success",
  "data": {
    "page": 1,
    "limit": 10,
    "data": [...]
  }
}
```

#### Create (Requires Auth)
```
POST /destinations/create
Headers: Authorization: Bearer <token>
Body: {
  "name": "Paris",
  "country": "France",
  "description": "City of Light"
}
Response:
{
  "status": "success",
  "data": {
    "dest_id": 1,
    "name": "Paris",
    "country": "France",
    "description": "City of Light"
  }
}
```

#### Update (Requires Auth)
```
PUT /destinations/:id
Headers: Authorization: Bearer <token>
Body: {
  "name": "Paris Updated",
  "country": "France",
  "description": "Updated description"
}
Response:
{
  "status": "success",
  "data": {
    "dest_id": 1,
    "name": "Paris Updated",
    "country": "France",
    "description": "Updated description"
  }
}
```

#### Delete (Requires Auth)
```
DELETE /destinations/:id
Headers: Authorization: Bearer <token>
Response:
{
  "status": "success",
  "data": { "dest_id": 1 }
}
```

---

### PACKAGES (Package Master)

#### Get All (Requires Auth)
```
GET /packageMaster
Headers: Authorization: Bearer <token>
Response:
{
  "status": "success",
  "data": [...]
}
```

#### Create (Requires Auth)
```
POST /packageMaster/create
Headers: Authorization: Bearer <token>
Body: {
  "title": "Manali Adventure",
  "description": "Mountain adventure in Himalayas",
  "duration_days": 5,
  "base_price": 10000
}
Response:
{
  "status": "success",
  "data": {
    "package_id": 1,
    "title": "Manali Adventure",
    "description": "Mountain adventure in Himalayas",
    "duration_days": 5,
    "base_price": 10000
  }
}
```

#### Update (Requires Auth)
```
PUT /packageMaster/:id
Headers: Authorization: Bearer <token>
Body: { same fields as create }
Response:
{
  "status": "success",
  "data": { ...updated package }
}
```

#### Delete (Requires Auth)
```
DELETE /packageMaster/:id
Headers: Authorization: Bearer <token>
Response:
{
  "status": "success",
  "data": { "package_id": 1 }
}
```

---

### PACKAGE DATES

#### Add Date (Requires Auth)
```
POST /packageMaster/:id/dates
Headers: Authorization: Bearer <token>
Body: {
  "start_date": "2026-03-01",
  "end_date": "2026-03-05",
  "seats_available": 20,
  "price_per_person": 12000
}
Response:
{
  "status": "success",
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

#### Update Date (Requires Auth)
```
PUT /packageMaster/:id/dates/:dateId
Headers: Authorization: Bearer <token>
Body: { same fields as add }
Response:
{
  "status": "success",
  "data": { ...updated date }
}
```

#### Delete Date (Requires Auth)
```
DELETE /packageMaster/:id/dates/:dateId
Headers: Authorization: Bearer <token>
Response:
{
  "status": "success",
  "data": { "id": 1 }
}
```

---

## Testing with curl

### Get Destinations (no auth needed)
```bash
curl -X GET http://10.64.205.48:4000/destinations \
  -H "Content-Type: application/json"
```

### Create Destination (with auth)
```bash
curl -X POST http://10.64.205.48:4000/destinations/create \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paris",
    "country": "France",
    "description": "City of Light"
  }'
```

### Update Destination
```bash
curl -X PUT http://10.64.205.48:4000/destinations/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paris Updated",
    "country": "France",
    "description": "Updated description"
  }'
```

### Delete Destination
```bash
curl -X DELETE http://10.64.205.48:4000/destinations/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Frontend Service Usage

### In your components:

```javascript
import destinationService from '../services/destinationService';

// Get all destinations
const fetchDestinations = async () => {
  const result = await destinationService.getAll();
  if (result.success) {
    console.log('Destinations:', result.data);
  } else {
    console.error('Error:', result.message);
  }
};

// Create destination
const createDest = async () => {
  const result = await destinationService.create({
    name: 'Paris',
    country: 'France',
    description: 'City of Light'
  });
  if (result.success) {
    console.log('Created:', result.data);
  } else {
    console.error('Error:', result.message);
  }
};

// Update destination
const updateDest = async () => {
  const result = await destinationService.update(1, {
    name: 'Paris Updated',
    country: 'France',
    description: 'Updated'
  });
  if (result.success) {
    console.log('Updated:', result.data);
  }
};

// Delete destination
const deleteDest = async () => {
  const result = await destinationService.delete(1);
  if (result.success) {
    console.log('Deleted destination');
  }
};
```

---

## Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK - Request successful | GET succeeded |
| 201 | Created - Resource created | POST succeeded |
| 400 | Bad Request - Invalid input | Missing required field |
| 401 | Unauthorized - No/invalid token | Token missing |
| 403 | Forbidden - User doesn't have permission | Non-admin trying admin action |
| 404 | Not Found - Resource doesn't exist | Destination doesn't exist |
| 500 | Server Error - Backend crashed | Database error |

---

## Common Frontend Issues

### Issue: "Token is Missing"
**Response Code:** 401
**Reason:** No Authorization header
**Fix:** Login first to get token

### Issue: "Unauthorized access"
**Response Code:** 403
**Reason:** Non-admin trying admin endpoint
**Fix:** Use admin account

### Issue: "Non-JSON response received"
**Response Code:** Usually 404
**Reason:** Backend returned HTML (endpoint doesn't exist)
**Fix:** Check if route is registered on backend

### Issue: Server Error
**Response Code:** 500
**Reason:** Backend crashed or database error
**Fix:** Check backend logs

---

## Next Steps

1. ✅ Understand this response format
2. ✅ Test endpoints using curl
3. ✅ Test in app by logging in and creating data
4. ✅ Monitor console for request/response logs
5. ✅ Debug any issues using this reference

