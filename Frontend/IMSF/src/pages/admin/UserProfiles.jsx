import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { userAPI, bookingAPI } from '../../services/endpoints';
import { extractArrayData } from '../../services/dataExtractor';
import '../../styles/AdminDashboard.css';

const UserProfiles = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('👥 Fetching all users...');
      
      const response = await userAPI.getAllUsers();
      console.log('👥 Users response:', response.data);
      
      const usersData = extractArrayData(response.data);
      console.log(`✓ Fetched ${usersData.length} users`);
      
      setUsers(usersData);
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch users';
      setError(errorMsg);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = users;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u =>
        u.user_id?.toString().includes(term) ||
        (u.first_name || '').toLowerCase().includes(term) ||
        (u.last_name || '').toLowerCase().includes(term) ||
        (u.email || '').toLowerCase().includes(term) ||
        (u.phone || '').includes(term)
      );
    }

    setFilteredUsers(filtered);
  };

  const fetchUserBookings = async (userId) => {
    try {
      setLoadingBookings(true);
      console.log(`📋 Fetching bookings for user #${userId}...`);
      
      const response = await bookingAPI.getByUser(userId);
      console.log('📋 User bookings response:', response.data);
      
      const bookingsData = extractArrayData(response.data);
      console.log(`✓ Fetched ${bookingsData.length} bookings for user #${userId}`);
      
      setUserBookings(bookingsData);
    } catch (err) {
      console.warn('⚠️ Failed to fetch user bookings:', err.message);
      setUserBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchUserBookings(user.user_id);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="admin-dashboard" style={{ padding: '20px' }}>
          <div className="loading">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="admin-dashboard" style={{ padding: '20px' }}>
        <div className="admin-header">
          <h1>👥 User Profiles</h1>
          <p>Total Users: {users.length}</p>
        </div>

        {error && (
          <div style={{
            padding: '15px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Search Bar */}
        <div style={{
          marginBottom: '20px',
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '4px'
        }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Search Users:
          </label>
          <input
            type="text"
            placeholder="Search by ID, name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Users Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div
                key={user.user_id}
                onClick={() => handleSelectUser(user)}
                style={{
                  padding: '15px',
                  border: `2px solid ${selectedUser?.user_id === user.user_id ? '#007bff' : '#ddd'}`,
                  borderRadius: '4px',
                  backgroundColor: selectedUser?.user_id === user.user_id ? '#e7f3ff' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ fontSize: '16px' }}>
                    {user.first_name} {user.last_name}
                  </strong>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    ID: #{user.user_id}
                  </div>
                </div>

                <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                  <div>📧 {user.email}</div>
                  <div>📱 {user.phone || 'N/A'}</div>
                  <div>👤 {user.role || 'user'}</div>
                </div>

                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  borderTop: '1px solid #eee',
                  paddingTop: '8px',
                  marginTop: '8px'
                }}>
                  Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </div>
              </div>
            ))
          ) : (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: '#999',
              gridColumn: '1 / -1'
            }}>
              No users found
            </div>
          )}
        </div>

        {/* Selected User Details & Bookings */}
        {selectedUser && (
          <div style={{
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '2px solid #007bff',
            marginTop: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3>📌 User Profile: {selectedUser.first_name} {selectedUser.last_name}</h3>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setUserBookings([]);
                }}
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ✕ Close
              </button>
            </div>

            {/* User Details */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '15px',
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '4px'
            }}>
              <div>
                <strong>User ID:</strong>
                <p>{selectedUser.user_id}</p>
              </div>
              <div>
                <strong>Email:</strong>
                <p style={{ wordBreak: 'break-all' }}>{selectedUser.email}</p>
              </div>
              <div>
                <strong>Phone:</strong>
                <p>{selectedUser.phone || 'N/A'}</p>
              </div>
              <div>
                <strong>Role:</strong>
                <p>{selectedUser.role || 'user'}</p>
              </div>
              <div>
                <strong>Joined:</strong>
                <p>{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'Unknown'}</p>
              </div>
              <div>
                <strong>Status:</strong>
                <p style={{
                  color: (selectedUser.status || 'active').toLowerCase() === 'active' ? '#28a745' : '#dc3545',
                  fontWeight: 'bold'
                }}>
                  {(selectedUser.status || 'active').toUpperCase()}
                </p>
              </div>
            </div>

            {/* User Bookings */}
            <div>
              <h4>📋 User Bookings ({userBookings.length})</h4>
              
              {loadingBookings ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading bookings...</div>
              ) : userBookings.length > 0 ? (
                <div style={{
                  overflowX: 'auto',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  marginTop: '10px'
                }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '13px'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Booking ID</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Package</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                        <th style={{ padding: '10px', textAlign: 'center' }}>Seats</th>
                        <th style={{ padding: '10px', textAlign: 'right' }}>Amount</th>
                        <th style={{ padding: '10px', textAlign: 'center' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userBookings.map(booking => (
                        <tr key={booking.booking_id} style={{ borderBottom: '1px solid #dee2e6' }}>
                          <td style={{ padding: '10px' }}>#{booking.booking_id}</td>
                          <td style={{ padding: '10px' }}>
                            {booking.package_title || booking.title || 'N/A'}
                          </td>
                          <td style={{ padding: '10px' }}>
                            {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'N/A'}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'center' }}>
                            {booking.persons || booking.number_of_seats || 'N/A'}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
                            ₹{(booking.total_price || booking.total_amount || 0).toLocaleString()}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'center' }}>
                            <span style={{
                              backgroundColor:
                                (booking.status || booking.booking_status || 'pending').toLowerCase() === 'confirmed' ? '#28a745' :
                                (booking.status || booking.booking_status || 'pending').toLowerCase() === 'completed' ? '#17a2b8' :
                                (booking.status || booking.booking_status || 'pending').toLowerCase() === 'pending' ? '#ffc107' :
                                '#dc3545',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 'bold'
                            }}>
                              {(booking.status || booking.booking_status || 'pending').toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: '#999',
                  backgroundColor: 'white',
                  borderRadius: '4px'
                }}>
                  No bookings for this user
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfiles;
