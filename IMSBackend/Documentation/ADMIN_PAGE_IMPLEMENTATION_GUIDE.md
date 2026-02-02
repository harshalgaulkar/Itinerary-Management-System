# 🔧 Admin Page Implementation Guide

## Backend Status: ✅ FIXED & ENHANCED

### Issues Resolved

1. ✅ **Auth Route Placement** - Moved `/admin` routes to public routes (before `authorizeUser` middleware)
   - First admin signup now works without token
   - Subsequent operations require admin token

2. ✅ **Pagination Added to Users List** - GET `/admin/users` now supports:
   - `page` - Page number (default: 1)
   - `limit` - Items per page (default: 10, max: 100)
   - `role` - Filter by role (admin/manager/user)
   - Response includes pagination metadata

3. ✅ **Delete Protection** - Users with dependent records cannot be deleted:
   - Checks for existing bookings
   - Checks for existing reviews
   - Checks for existing payments
   - Returns count of blocked records

4. ✅ **Improved Validation** - Better error messages:
   - user_id validation for non-first admin creation
   - Role validation with lowercase normalization
   - Comprehensive dependency checks before deletion

---

## Admin Backend API Endpoints

### 1. Create User (POST /admin/signup/user)

**First Admin (No Authentication Required):**
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

**Additional Users (Admin Authentication Required):**
```bash
curl -X POST http://localhost:4000/admin/signup/user \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "full_name": "New User",
    "phone": "1234567890",
    "role": "manager"
  }'
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "minLength6",
  "full_name": "Full Name",
  "phone": "optional",
  "role": "admin|manager|user (default: user)"
}
```

**Response (Success):**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "message": "User created successfully",
    "user_id": 1,
    "email": "admin@example.com",
    "full_name": "Admin User",
    "role": "admin"
  }
}
```

---

### 2. List All Users (GET /admin/users)

**Request:**
```bash
curl -X GET "http://localhost:4000/admin/users?page=1&limit=10&role=admin" \
  -H "user_id: 1"
```

**Query Parameters:**
- `page` - Page number (optional, default: 1)
- `limit` - Items per page (optional, default: 10, max: 100)
- `role` - Filter by role: admin/manager/user (optional)

**Response (Success):**
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

### 3. Update User Role (PUT /admin/user/:user_id/role)

**Request:**
```bash
curl -X PUT http://localhost:4000/admin/user/2/role \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "role": "manager"
  }'
```

**Request Body:**
```json
{
  "role": "admin|manager|user"
}
```

**Response (Success):**
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

### 4. Delete User (DELETE /admin/user/:user_id)

**Request:**
```bash
curl -X DELETE http://localhost:4000/admin/user/2 \
  -H "user_id: 1"
```

**Response (Success):**
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

**Response (Has Dependencies - Error):**
```json
{
  "code": 1,
  "message": "Cannot delete user with existing records. Bookings: 2, Reviews: 1, Payments: 3",
  "data": null
}
```

---

## Frontend Implementation Guide

### React Native Admin Dashboard Structure

```
AdminDashboard/
├── AdminHome.js (Main dashboard screen)
├── screens/
│   ├── UserManagement/
│   │   ├── UserListScreen.js
│   │   ├── CreateUserScreen.js
│   │   ├── EditUserScreen.js
│   │   └── UserDetailScreen.js
│   ├── RoleManagement/
│   │   └── AssignRoleScreen.js
│   └── AdminSettings/
│       └── SettingsScreen.js
├── components/
│   ├── UserCard.js
│   ├── UserForm.js
│   ├── PaginationControls.js
│   └── RoleSelector.js
├── services/
│   ├── adminService.js
│   └── userService.js
└── styles/
    └── adminStyles.js
```

---

### 1. User List Screen (with Pagination)

```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminUserListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState(null);
  const [roleFilter, setRoleFilter] = useState(null);

  const API_BASE = 'http://your-server-ip:4000';

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('user_id');
      
      let url = `${API_BASE}/admin/users?page=${page}&limit=${limit}`;
      if (roleFilter) {
        url += `&role=${roleFilter}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'user_id': userId
        }
      });

      const result = await response.json();
      
      if (result.code === 0) {
        setUsers(result.data.users);
        setPagination(result.data.pagination);
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Failed to fetch users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderUserCard = ({ item }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => navigation.navigate('UserDetail', { userId: item.user_id })}
    >
      <View>
        <Text style={styles.userName}>{item.full_name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={styles.roleContainer}>
          <Text style={[styles.roleText, styles[`role_${item.role}`]]}>
            {item.role.toUpperCase()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterBtn, !roleFilter && styles.filterBtnActive]}
          onPress={() => { setRoleFilter(null); setPage(1); }}
        >
          <Text>All Users</Text>
        </TouchableOpacity>
        {['admin', 'manager', 'user'].map(role => (
          <TouchableOpacity
            key={role}
            style={[styles.filterBtn, roleFilter === role && styles.filterBtnActive]}
            onPress={() => { setRoleFilter(role); setPage(1); }}
          >
            <Text style={styles.filterBtnText}>{role}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <>
          <FlatList
            data={users}
            renderItem={renderUserCard}
            keyExtractor={item => item.user_id.toString()}
            onEndReached={() => {
              if (pagination && page < pagination.pages) {
                setPage(page + 1);
              }
            }}
          />

          {pagination && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                disabled={page === 1}
                style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
                onPress={() => setPage(page - 1)}
              >
                <Text>Previous</Text>
              </TouchableOpacity>
              <Text style={styles.pageInfo}>
                Page {pagination.page} of {pagination.pages} (Total: {pagination.total})
              </Text>
              <TouchableOpacity
                disabled={page >= pagination.pages}
                style={[styles.pageBtn, page >= pagination.pages && styles.pageBtnDisabled]}
                onPress={() => setPage(page + 1)}
              >
                <Text>Next</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => navigation.navigate('CreateUser')}
      >
        <Text style={styles.createBtnText}>+ Create User</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  userCard: { backgroundColor: 'white', padding: 15, marginVertical: 8, borderRadius: 8 },
  userName: { fontSize: 16, fontWeight: 'bold' },
  userEmail: { fontSize: 12, color: '#666', marginVertical: 4 },
  roleContainer: { marginTop: 8 },
  roleText: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 10 },
  role_admin: { backgroundColor: '#FF6B6B', color: 'white' },
  role_manager: { backgroundColor: '#4ECDC4', color: 'white' },
  role_user: { backgroundColor: '#95E1D3', color: '#333' },
  filterContainer: { flexDirection: 'row', marginVertical: 10, gap: 5 },
  filterBtn: { paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#e0e0e0', borderRadius: 6 },
  filterBtnActive: { backgroundColor: '#007AFF' },
  filterBtnText: { color: 'white' },
  paginationContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 10 },
  pageBtn: { padding: 10, backgroundColor: '#007AFF', borderRadius: 6 },
  pageBtnDisabled: { backgroundColor: '#ccc' },
  pageInfo: { alignSelf: 'center', fontSize: 12 },
  createBtn: { padding: 15, backgroundColor: '#28a745', borderRadius: 8, marginTop: 20 },
  createBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }
});

export default AdminUserListScreen;
```

---

### 2. Create User Screen

```javascript
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Picker,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateUserScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const API_BASE = 'http://your-server-ip:4000';

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email required';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.full_name || formData.full_name.length < 2) {
      newErrors.full_name = 'Full name required (min 2 chars)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUser = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('user_id');

      const response = await fetch(`${API_BASE}/admin/signup/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user_id': userId || ''
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          full_name: formData.full_name.trim(),
          phone: formData.phone.trim() || null,
          role: formData.role
        })
      });

      const result = await response.json();

      if (result.code === 0) {
        alert('User created successfully!');
        navigation.goBack();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Failed to create user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New User</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="user@example.com"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          editable={!loading}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Password *</Text>
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Min 6 characters"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          editable={!loading}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={[styles.input, errors.full_name && styles.inputError]}
          placeholder="John Doe"
          value={formData.full_name}
          onChangeText={(text) => setFormData({ ...formData, full_name: text })}
          editable={!loading}
        />
        {errors.full_name && <Text style={styles.errorText}>{errors.full_name}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="1234567890"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          editable={!loading}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Role *</Text>
        <Picker
          style={styles.picker}
          selectedValue={formData.role}
          onValueChange={(value) => setFormData({ ...formData, role: value })}
          enabled={!loading}
        >
          <Picker.Item label="User" value="user" />
          <Picker.Item label="Manager" value="manager" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
        onPress={handleCreateUser}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitBtnText}>Create User</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <Text style={styles.cancelBtnText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 6, backgroundColor: 'white' },
  inputError: { borderColor: '#FF6B6B' },
  errorText: { color: '#FF6B6B', fontSize: 12, marginTop: 4 },
  picker: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, backgroundColor: 'white' },
  submitBtn: { padding: 15, backgroundColor: '#007AFF', borderRadius: 8, marginTop: 10 },
  submitBtnDisabled: { backgroundColor: '#ccc' },
  submitBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  cancelBtn: { padding: 15, backgroundColor: '#6c757d', borderRadius: 8, marginTop: 10, marginBottom: 30 },
  cancelBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }
});

export default CreateUserScreen;
```

---

### 3. Admin Service (API Helper)

```javascript
// services/adminService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http://your-server-ip:4000';

export const adminService = {
  // Get all users with pagination
  getUsers: async (page = 1, limit = 10, role = null) => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      
      let url = `${API_BASE}/admin/users?page=${page}&limit=${limit}`;
      if (role) url += `&role=${role}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'user_id': userId
        }
      });

      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch users: ' + error.message);
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const userId = await AsyncStorage.getItem('user_id');

      const response = await fetch(`${API_BASE}/admin/signup/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user_id': userId || ''
        },
        body: JSON.stringify(userData)
      });

      return await response.json();
    } catch (error) {
      throw new Error('Failed to create user: ' + error.message);
    }
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    try {
      const adminId = await AsyncStorage.getItem('user_id');

      const response = await fetch(`${API_BASE}/admin/user/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user_id': adminId
        },
        body: JSON.stringify({ role })
      });

      return await response.json();
    } catch (error) {
      throw new Error('Failed to update user role: ' + error.message);
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const adminId = await AsyncStorage.getItem('user_id');

      const response = await fetch(`${API_BASE}/admin/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'user_id': adminId
        }
      });

      return await response.json();
    } catch (error) {
      throw new Error('Failed to delete user: ' + error.message);
    }
  }
};
```

---

## Testing Checklist

### Backend Tests
- ✅ First admin can be created without token
- ✅ Subsequent users require admin token in `user_id` header
- ✅ GET /admin/users returns paginated results
- ✅ Filtering by role works correctly
- ✅ Updating user role works correctly
- ✅ Deleting users with dependencies returns error
- ✅ All validation errors show proper messages

### Frontend Tests (To Implement)
- [ ] User list loads with pagination
- [ ] Filtering by role updates list
- [ ] Creating new user works
- [ ] Form validation shows errors
- [ ] Updating user role works
- [ ] Deleting user shows dependency warning
- [ ] Navigation works between screens

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Unauthorized" on user creation | Ensure `user_id` header is included for non-first admin |
| Empty users list | Check that admin is logged in and token is valid |
| "Cannot delete user" error | User has bookings, reviews, or payments - cannot delete |
| "User already exists" | Use different email address |
| Pagination not working | Ensure `page` and `limit` params are sent |

---

## Next Steps

1. **Frontend Development**: Build admin screens using provided code
2. **Testing**: Test all CRUD operations on admin endpoints
3. **Error Handling**: Implement proper error messages for all scenarios
4. **Security**: Ensure only admins can access admin endpoints
5. **UI/UX**: Add loading states, confirmations, and success messages
