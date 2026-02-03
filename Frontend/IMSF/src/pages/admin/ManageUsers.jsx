import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { adminAPI, userAPI } from '../../services/endpoints';
import { extractArrayData } from '../../services/dataExtractor';
import '../../styles/AdminManage.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('📥 Fetching users...');
      setLoading(true);
      setError('');
      
      // Use userAPI.getAllUsers() which is the primary endpoint
      const response = await userAPI.getAllUsers();
      console.log('Response:', response);
      
      // Use the utility function to extract data
      const users = extractArrayData(response.data);
      console.log(`✓ Extracted ${users.length} users`);
      
      setUsers(users);
      
      if (users.length === 0) {
        console.warn('⚠ No users found or response format not recognized');
      }
    } catch (err) {
      console.error('✗ Error fetching users:', err.message);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to load users';
      setError(errorMsg);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh'}}>
        <h1 style={{color: '#333', fontSize: '24px', marginBottom: '20px'}}>Manage Users</h1>
        
        {error && <div style={{color: 'red', padding: '10px', backgroundColor: '#ffe0e0', marginBottom: '20px'}}>{error}</div>}
        
        <button onClick={fetchUsers} disabled={loading} style={{padding: '10px 20px', marginBottom: '20px'}}>
          {loading ? 'Loading...' : 'Refresh Users'}
        </button>
        
        <Link to="/admin/users/create" style={{marginLeft: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none'}}>
          Create User
        </Link>
        
        <div style={{marginTop: '20px'}}>
          <p>Total Users: {users.length}</p>
          
          {users.length > 0 ? (
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{backgroundColor: '#2d2323'}}>
                  <th style={{padding: '10px', border: '1px solid #060606'}}>ID</th>
                  <th style={{padding: '10px', border: '1px solid #100f0f'}}>Email</th>
                  <th style={{padding: '10px', border: '1px solid #080808'}}>Name</th>
                  <th style={{padding: '10px', border: '1px solid #050404'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.user_id} style={{borderBottom: '1px solid #2d2222'}}>
                    <td style={{padding: '10px', color: '#343030'}}>{user.user_id}</td>
                    <td style={{padding: '10px', color: '#343030'}}>{user.email}</td>
                    <td style={{padding: '10px', color: '#343030'}}>{user.full_name}</td>
                    <td style={{padding: '10px', color: '#343030'}}>
                      <button style={{marginRight: '5px', padding: '5px 10px'}}>Edit</button>
                      <button style={{padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer'}}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
