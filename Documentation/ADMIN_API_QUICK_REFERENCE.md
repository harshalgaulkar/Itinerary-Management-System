# 📋 Admin API - Quick Reference

## Endpoints Summary

### 1. CREATE USER
```
POST /admin/signup/user
```

**Headers:**
- `Content-Type: application/json`
- `user_id: <id>` (required for non-first admin)

**Body:**
```json
{
  "email": "user@example.com",
  "password": "minLength6",
  "full_name": "Full Name",
  "phone": "1234567890",
  "role": "admin|manager|user"
}
```

**Success (200):**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "message": "User created successfully",
    "user_id": 1,
    "email": "user@example.com",
    "full_name": "Full Name",
    "role": "admin"
  }
}
```

---

### 2. LIST USERS (Paginated)
```
GET /admin/users?page=1&limit=10&role=admin
```

**Headers:**
- `user_id: <id>` (admin required)

**Query Parameters:**
- `page` - Page number (optional, default: 1)
- `limit` - Items per page (optional, default: 10, max: 100)
- `role` - Filter by role (optional: admin|manager|user)

**Success (200):**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "users": [
      {
        "user_id": 1,
        "email": "admin@example.com",
        "full_name": "Admin User",
        "phone": null,
        "role": "admin",
        "created_at": "2024-01-22T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

---

### 3. UPDATE USER ROLE
```
PUT /admin/user/:user_id/role
```

**Headers:**
- `Content-Type: application/json`
- `user_id: <id>` (admin required)

**Body:**
```json
{
  "role": "admin|manager|user"
}
```

**Success (200):**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "message": "User role updated successfully",
    "user_id": 2,
    "role": "manager"
  }
}
```

---

### 4. DELETE USER
```
DELETE /admin/user/:user_id
```

**Headers:**
- `user_id: <id>` (admin required)

**Success (200):**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "message": "User deleted successfully",
    "user_id": 2
  }
}
```

**Error - Has Dependencies:**
```json
{
  "code": 1,
  "message": "Cannot delete user with existing records. Bookings: 2, Reviews: 1, Payments: 3",
  "data": null
}
```

---

## cURL Examples

### Create First Admin
```bash
curl -X POST http://localhost:4000/admin/signup/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123456",
    "full_name": "Admin User",
    "role": "admin"
  }'
```

### Create User (As Admin)
```bash
curl -X POST http://localhost:4000/admin/signup/user \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "email": "manager@example.com",
    "password": "password123",
    "full_name": "Manager User",
    "role": "manager"
  }'
```

### List Users (Page 1, 10 per page)
```bash
curl -X GET "http://localhost:4000/admin/users?page=1&limit=10" \
  -H "user_id: 1"
```

### Filter Users by Role
```bash
curl -X GET "http://localhost:4000/admin/users?role=admin&limit=5" \
  -H "user_id: 1"
```

### Update User Role
```bash
curl -X PUT http://localhost:4000/admin/user/2/role \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{"role": "admin"}'
```

### Delete User
```bash
curl -X DELETE http://localhost:4000/admin/user/3 \
  -H "user_id: 1"
```

---

## Error Codes & Messages

| Scenario | Status | Message |
|----------|--------|---------|
| Missing required field | 400 | `Validation error: [field] is required` |
| Invalid email format | 400 | `Validation error: Valid email is required` |
| Password too short | 400 | `Validation error: Password is required (min 6 chars)` |
| User not admin | 401 | `Unauthorized: Only admins can create users` |
| User already exists | 400 | `User already exists` |
| Invalid role | 400 | `Invalid role: must be admin, manager, or user` |
| User not found | 404 | `User not found` |
| Has dependencies | 400 | `Cannot delete user with existing records...` |
| Database error | 500 | `Database error` |

---

## Flow Diagram

```
START
  ↓
[POST] /admin/signup/user (no auth required)
  ├─ Is first admin? 
  │  ├─ Yes → Create admin without token ✅
  │  └─ No → Check admin status
  │     ├─ User is admin → Create user ✅
  │     └─ User not admin → Error 401 ❌
  ↓
[GET] /admin/users (admin auth required)
  ├─ Check user is admin
  │  ├─ Yes → Return paginated users ✅
  │  └─ No → Error 401 ❌
  ↓
[PUT] /admin/user/:id/role (admin auth required)
  ├─ Check user is admin
  │  ├─ Yes → Update role ✅
  │  └─ No → Error 401 ❌
  ↓
[DELETE] /admin/user/:id (admin auth required)
  ├─ Check user is admin
  │  ├─ Yes → Check dependencies
  │  │        ├─ Has bookings/reviews/payments → Error 400 ❌
  │  │        └─ No dependencies → Delete ✅
  │  └─ No → Error 401 ❌
END
```

---

## Response Format

All responses follow this pattern:

```json
{
  "code": 0 || 1,
  "message": "success" || "error message",
  "data": {} || null
}
```

- `code: 0` = Success
- `code: 1` = Error
- `message`: Descriptive message (required)
- `data`: Response data or null

---

## Authorization

### Header Format
```
user_id: <integer>
```

### User Roles
- `admin` - Full access to admin endpoints
- `manager` - Standard user with additional privileges
- `user` - Regular user (default)

### First Admin
- Can be created **without** `user_id` header
- Subsequent admin creation **requires** admin status

---

## Pagination Details

### Request
```
GET /admin/users?page=1&limit=10&role=admin
```

### Response
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### Calculation
- `offset` = (page - 1) × limit
- `pages` = ceil(total / limit)
- Max limit: 100

---

## Validation Rules

| Field | Rule | Example |
|-------|------|---------|
| `email` | Valid email format | `user@example.com` |
| `password` | Min 6 characters | `password123` |
| `full_name` | Min 2 characters | `John Doe` |
| `phone` | Optional, 5-30 chars | `1234567890` |
| `role` | admin\|manager\|user | `admin` |
| `page` | Min 1 | `1` |
| `limit` | 1-100 | `10` |

---

## Performance Notes

- Pagination limit capped at 100 to prevent large queries
- Default pagination: 10 items per page
- Total count included for frontend pagination UI
- Indexes on user_id, role, and email for fast queries
