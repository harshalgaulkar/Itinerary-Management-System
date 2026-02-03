import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { bookingAPI, userAPI, packageAPI, adminAPI } from '../../services/endpoints';
import { extractArrayData } from '../../services/dataExtractor';
import '../../styles/AdminDashboard.css';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionType, setActionType] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [testResponse, setTestResponse] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, filterStatus, searchTerm]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log('📋 Fetching all bookings...');
      
      const response = await bookingAPI.getAll();
      console.log('📋 Bookings response:', response.data);
      
      const bookingsData = extractArrayData(response.data);
      console.log(`✓ Fetched ${bookingsData.length} bookings`);
      
      setBookings(bookingsData);
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch bookings';
      setError(errorMsg);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = bookings;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(b => 
        (b.status || b.booking_status || 'pending').toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.booking_id.toString().includes(term) ||
        b.user_id?.toString().includes(term) ||
        (b.package_title || b.title || '').toLowerCase().includes(term) ||
        (b.contact_phone || '').includes(term)
      );
    }

    setFilteredBookings(filtered);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setProcessing(true);
      console.log(`🔄 Updating booking #${bookingId} to ${newStatus}...`);
      if (newStatus === 'confirmed') {
        await bookingAPI.confirm(bookingId);
      } else if (newStatus === 'cancelled') {
        await bookingAPI.cancel(bookingId, actionReason);
      } else if (newStatus === 'completed') {
        await bookingAPI.complete(bookingId);
      } else {
        await adminAPI.updateBookingStatus(bookingId, newStatus);
      }
      
      console.log(`✓ Booking #${bookingId} updated to ${newStatus}`);
      setSelectedBooking(null);
      setActionType('');
      setActionReason('');
      
      // Refresh the list
      await fetchBookings();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update booking';
      setError(errorMsg);
      console.error('Error updating booking:', err);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    const statusLower = (status || 'pending').toLowerCase();
    if (statusLower === 'confirmed') return '#28a745';
    if (statusLower === 'completed') return '#17a2b8';
    if (statusLower === 'pending') return '#ffc107';
    if (statusLower === 'cancelled') return '#dc3545';
    return '#6c757d';
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="admin-dashboard" style={{ padding: '20px' }}>
          <div className="loading">Loading bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="admin-dashboard" style={{ padding: '20px' }}>
        <div className="admin-header">
          <h1>📋 Manage Bookings</h1>
          <p>Total Bookings: {bookings.length}</p>
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

        {/* Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '15px',
          marginBottom: '20px',
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '4px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Status Filter:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Search:
            </label>
            <input
              type="text"
              placeholder="Search by ID, phone, or package..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={fetchBookings}
              disabled={loading}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Test booking button for debugging */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <button
            onClick={async () => {
              setTestResponse(null);
              try {
                const sample = {
                  package_date_id: 1,
                  persons: 2,
                  total_price: 1000.0,
                  contact_phone: '9999999999',
                  notes: 'Test booking from admin page'
                };
                console.log('Sending test booking payload', sample);
                const resp = await bookingAPI.create(sample);
                console.log('Test booking response', resp);
                setTestResponse({ ok: true, status: resp.status, data: resp.data });
                // Refresh list after successful creation
                await fetchBookings();
              } catch (err) {
                console.error('Test booking error', err);
                setTestResponse({ ok: false, error: err.response?.data || err.message });
              }
            }}
            style={{
              padding: '8px 15px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🧪 Send Test Booking
          </button>
        </div>

        {testResponse && (
          <div className="test-result" style={{ marginBottom: '20px' }}>
            <strong>Test Result:</strong>
            <pre className="test-response" style={{ whiteSpace: 'pre-wrap', background: '#f1f1f1', padding: '10px', borderRadius: '6px' }}>
              {JSON.stringify(testResponse, null, 2)}
            </pre>
          </div>
        )}

        {/* Bookings Table */}
        <div style={{
          overflowX: 'auto',
          backgroundColor: 'white',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Booking ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Package</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>User ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Seats</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map(booking => {
                  const status = (booking.status || booking.booking_status || 'pending').toLowerCase();
                  const packageName = booking.package_title || booking.title || `Package #${booking.package_id}`;
                  const amount = booking.total_price || booking.total_amount || booking.amount || 0;
                  const seats = booking.persons || booking.number_of_seats || booking.seats || 1;
                  const date = booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'N/A';

                  return (
                    <tr
                      key={booking.booking_id}
                      style={{
                        borderBottom: '1px solid #dee2e6',
                        backgroundColor: selectedBooking?.booking_id === booking.booking_id ? '#e7f3ff' : 'white',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedBooking(selectedBooking?.booking_id === booking.booking_id ? null : booking)}
                    >
                      <td style={{ padding: '12px' }}>
                        <strong>#{booking.booking_id}</strong>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {packageName}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {booking.user_id}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {date}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        {seats}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                        ₹{amount.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{
                          backgroundColor: getStatusColor(status),
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(booking);
                            setActionType('');
                          }}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ⚙️ Manage
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Selected Booking Details & Actions */}
        {selectedBooking && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '2px solid #007bff'
          }}>
            <h3>📌 Booking #${selectedBooking.booking_id} Details</h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '15px',
              marginBottom: '20px',
              marginTop: '15px'
            }}>
              <div>
                <strong>Package:</strong>
                <p>{selectedBooking.package_title || selectedBooking.title || 'N/A'}</p>
              </div>
              <div>
                <strong>User ID:</strong>
                <p>{selectedBooking.user_id}</p>
              </div>
              <div>
                <strong>Contact Phone:</strong>
                <p>{selectedBooking.contact_phone || 'N/A'}</p>
              </div>
              <div>
                <strong>Travel Date:</strong>
                <p>{selectedBooking.start_date ? new Date(selectedBooking.start_date).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <strong>Seats:</strong>
                <p>{selectedBooking.persons || selectedBooking.number_of_seats || 'N/A'}</p>
              </div>
              <div>
                <strong>Total Amount:</strong>
                <p style={{ color: '#28a745', fontWeight: 'bold' }}>
                  ₹{(selectedBooking.total_price || selectedBooking.total_amount || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <strong>Current Status:</strong>
                <p>
                  <span style={{
                    backgroundColor: getStatusColor(selectedBooking.status || selectedBooking.booking_status),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {(selectedBooking.status || selectedBooking.booking_status || 'pending').toUpperCase()}
                  </span>
                </p>
              </div>
              <div>
                <strong>Booked On:</strong>
                <p>{selectedBooking.booked_on ? new Date(selectedBooking.booked_on).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <strong>Notes:</strong>
                <p>{selectedBooking.notes || 'No notes'}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              marginBottom: '15px'
            }}>
              {(selectedBooking.status || selectedBooking.booking_status || 'pending').toLowerCase() === 'pending' && (
                <button
                  onClick={() => setActionType('confirm')}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ✅ Confirm Booking
                </button>
              )}

              {(selectedBooking.status || selectedBooking.booking_status || 'pending').toLowerCase() !== 'cancelled' && (
                <button
                  onClick={() => setActionType('cancel')}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ❌ Cancel Booking
                </button>
              )}

              {(selectedBooking.status || selectedBooking.booking_status || 'pending').toLowerCase() === 'confirmed' && (
                <button
                  onClick={() => setActionType('complete')}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ✈️ Mark Complete
                </button>
              )}

              <button
                onClick={() => {
                  setSelectedBooking(null);
                  setActionType('');
                  setActionReason('');
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

            {/* Action Confirmation */}
            {actionType && (
              <div style={{
                padding: '15px',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '4px',
                marginTop: '15px'
              }}>
                <h4>
                  {actionType === 'confirm' && '✅ Confirm this booking?'}
                  {actionType === 'cancel' && '❌ Cancel this booking?'}
                  {actionType === 'complete' && '✈️ Mark this booking as complete?'}
                </h4>

                {(actionType === 'cancel') && (
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                      <strong>Reason for cancellation (optional):</strong>
                    </label>
                    <textarea
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      placeholder="Enter cancellation reason..."
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        minHeight: '60px'
                      }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleStatusChange(selectedBooking.booking_id, actionType)}
                    disabled={processing}
                    style={{
                      padding: '8px 15px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: processing ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      opacity: processing ? 0.6 : 1
                    }}
                  >
                    {processing ? '⏳ Processing...' : 'Confirm Action'}
                  </button>
                  <button
                    onClick={() => {
                      setActionType('');
                      setActionReason('');
                    }}
                    disabled={processing}
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
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
