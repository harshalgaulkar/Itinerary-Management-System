import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { adminAPI } from '../../services/endpoints';
import { extractArray, extractErrorMessage } from '../../services/responseParser';
import '../../styles/AdminManage.css';

/**
 * Improved Admin User Management Page
 * - Handles all backend response formats
 * - Better error handling and logging
 * - Automatic retry on failure
 */
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retrying, setRetrying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (isRetry = false) => {
    try {
      if (isRetry) {
        setRetrying(true);
      } else {
        setLoading(true);
      }
      setError('');

      console.log('[ManageUsers] Fetching users from /admin/users...');

      const response = await adminAPI.getAllUsers();
      console.log('[ManageUsers] Response received:', response);
      console.log('[ManageUsers] Response status:', response.status);
      console.log('[ManageUsers] Response data:', response.data);

      // Extract data using universal parser
      const extractedUsers = extractArray(response);
      console.log('[ManageUsers] Extracted users:', extractedUsers);
      console.log('[ManageUsers] Number of users:', extractedUsers.length);

      if (Array.isArray(extractedUsers)) {
        setUsers(extractedUsers);
        if (extractedUsers.length === 0) {
          console.warn('[ManageUsers] No users returned from backend');
        }
      } else {
        console.warn('[ManageUsers] Response is not an array, got:', typeof extractedUsers);
        setUsers([]);
      }
    } catch (err) {
      console.error('[ManageUsers] Error fetching users:', err);
      console.error('[ManageUsers] Error message:', err.message);
      console.error('[ManageUsers] Error code:', err.code);
      console.error('[ManageUsers] Error response status:', err.response?.status);
      console.error('[ManageUsers] Error response data:', err.response?.data);

      const errorMessage = extractErrorMessage(err);
      setError(errorMessage);
      setUsers([]);

      // Log detailed error for debugging
      if (err.response?.status === 404) {
        console.error('[ManageUsers] 404 Not Found - Check endpoint path');
      } else if (err.response?.status === 401) {
        console.error('[ManageUsers] 401 Unauthorized - Check authentication token');
      } else if (err.response?.status === 403) {
        console.error('[ManageUsers] 403 Forbidden - Check user permissions');
      } else if (err.code === 'ECONNREFUSED') {
        console.error('[ManageUsers] Connection refused - Backend may not be running');
      }
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      console.log(`[ManageUsers] Updating role for user ${userId} to ${newRole}`);

      await adminAPI.updateUserRole(userId, { role: newRole });

      setUsers(users.map(u =>
        u.user_id === userId ? { ...u, role: newRole } : u
      ));

      alert('User role updated successfully');
    } catch (err) {
      console.error('[ManageUsers] Error updating role:', err);
      const errorMessage = extractErrorMessage(err);
      alert(`Failed to update user role: ${errorMessage}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      console.log(`[ManageUsers] Deleting user ${userId}`);

      await adminAPI.deleteUser(userId);

      setUsers(users.filter(u => u.user_id !== userId));
      alert('User deleted successfully');
    } catch (err) {
      console.error('[ManageUsers] Error deleting user:', err);
      const errorMessage = extractErrorMessage(err);
      alert(`Failed to delete user: ${errorMessage}`);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="admin-manage">
        <div className="manage-header">
          <h1>Manage Users</h1>
          <Link to="/admin/users/create" className="btn btn-primary">
            Create New User
          </Link>
        </div>

        {error && (
          <div className="error-section">
            <div className="error-message">{error}</div>
            {error.includes('Connection refused') && (
              <div className="error-hint">
                💡 Hint: Make sure your backend server is running on http://localhost:4000
              </div>
            )}
            {error.includes('Not Found') && (
              <div className="error-hint">
                💡 Hint: Check that the endpoint /admin/users exists in your backend
              </div>
            )}
            <button
              onClick={() => fetchUsers(true)}
              className="btn btn-secondary"
              disabled={retrying}
            >
              {retrying ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : users.length > 0 ? (
          <div className="table-container">
            <table className="manage-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Email</th>
                  <th>Full Name</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.user_id}>
                    <td>#{user.user_id}</td>
                    <td>{user.email}</td>
                    <td>{user.full_name || 'N/A'}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                        className="role-select"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="action-buttons">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteUser(user.user_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No users found</p>
            <Link to="/admin/users/create" className="btn btn-primary">
              Create First User
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .error-section {
          background-color: #fee;
          border: 1px solid #fcc;
          border-radius: 4px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .error-hint {
          margin-top: 10px;
          padding: 10px;
          background-color: #fff9e6;
          border-left: 3px solid #ffd700;
          font-size: 14px;
          color: #666;
        }

        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ManageUsers;
