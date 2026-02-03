import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { bookingAPI, packageAPI } from '../services/endpoints';
import { useAuth } from '../context/AuthContext';
import '../styles/Bookings.css';

const Bookings = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [packagesMap, setPackagesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user?.user_id) {
      // Always fetch on mount or when user changes
      fetchBookingsAndPackages();
    }
  }, [user?.user_id]);

  // Separate effect for handling post-payment refresh
  useEffect(() => {
    if (location.state?.refreshBookings && user?.user_id) {
      setSuccessMessage(location.state?.message || '✅ Payment successful! Your booking has been confirmed.');
      // Add a small delay to ensure backend has processed
      setTimeout(() => {
        fetchBookingsAndPackages();
      }, 500);
    }
  }, [location.state?.refreshBookings, user?.user_id]);

  // Also refresh if we just came back from payment (check URL)
  useEffect(() => {
    // Refresh on return from payment
  }, [location]);

  const fetchBookingsAndPackages = async () => {
    try {
      setLoading(true);

      // Fetch bookings
      const bookingResponse = await bookingAPI.getByUser(user.user_id);
      
      let bookingsData = [];
      if (Array.isArray(bookingResponse.data?.data?.data)) {
        bookingsData = bookingResponse.data.data.data;
      } else if (Array.isArray(bookingResponse.data?.data)) {
        bookingsData = bookingResponse.data.data;
      } else if (Array.isArray(bookingResponse.data)) {
        bookingsData = bookingResponse.data;
      }
      
      setBookings(bookingsData);

      // Fetch all packages to map IDs to titles
      if (bookingsData.length > 0) {
        try {
          const pkgResponse = await packageAPI.getAll();
          let packagesArray = [];
          
          if (pkgResponse.data?.data?.data) {
            packagesArray = pkgResponse.data.data.data;
          } else if (pkgResponse.data?.data) {
            packagesArray = pkgResponse.data.data;
          }
          
          // Create a map of package ID to package data
          const map = {};
          packagesArray.forEach(pkg => {
            map[pkg.package_id] = pkg;
          });
          setPackagesMap(map);
        } catch (err) {
          // Ignore package fetch errors
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load bookings';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || 'unknown';
    if (statusLower === 'confirmed') return '#28a745';
    if (statusLower === 'pending') return '#ffc107';
    if (statusLower === 'cancelled') return '#dc3545';
    return '#6c757d';
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="bookings-container">
          <div className="loading">Loading bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="bookings-container">
        <h1>My Bookings</h1>

        {successMessage && (
          <div style={{
            padding: '15px',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {successMessage}
          </div>
        )}

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {bookings.length > 0 ? (
          <div className="bookings-list">
            {bookings.map(booking => {
              // Backend returns package_title directly in the booking object
              // Status can be in various fields, normalize it
              const rawStatus = booking.status || booking.booking_status || booking.order_status || 'pending';
              const status = (rawStatus || 'pending').toString().toLowerCase().trim();
              
              const seats = booking.persons || booking.number_of_seats || booking.seats || 1;
              const totalAmount = booking.total_price || booking.total_amount || booking.total_cost || 0;
              const packageTitle = booking.package_title || booking.title || `Booking #${booking.booking_id}`;
              const duration = booking.duration_days || booking.duration || 'N/A';
              const basePrice = booking.base_price || booking.price || 0;
              
              return (
                <div key={booking.booking_id} className="booking-card" style={{ borderLeft: `4px solid ${getStatusColor(status)}` }}>
                  <div className="booking-header">
                    <div>
                      <h3>{packageTitle}</h3>
                    </div>
                    <span className="status" style={{ backgroundColor: getStatusColor(status), color: 'white', padding: '5px 10px', borderRadius: '4px' }}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="label">Booking ID:</span>
                      <span className="value">#{booking.booking_id}</span>
                    </div>
                    
                    {duration && duration !== 'N/A' && (
                      <div className="detail-row">
                        <span className="label">Duration:</span>
                        <span className="value">{duration} days</span>
                      </div>
                    )}
                    
                    <div className="detail-row">
                      <span className="label">Travel Date:</span>
                      <span className="value">
                        {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'Check package details'}
                      </span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Booked On:</span>
                      <span className="value">
                        {(() => {
                          // Try multiple field names in order
                          const bookedDate = 
                            booking.booked_on || 
                            booking.booking_date || 
                            booking.created_at || 
                            booking.booked_date ||
                            booking.booking_on ||
                            booking.date_booked;
                          
                          if (bookedDate) {
                            try {
                              return new Date(bookedDate).toLocaleDateString();
                            } catch (e) {
                              return bookedDate; // Return raw value if parsing fails
                            }
                          }
                          return 'Unknown';
                        })()}
                      </span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Number of Seats:</span>
                      <span className="value">{seats}</span>
                    </div>
                    
                    {basePrice > 0 && (
                      <div className="detail-row">
                        <span className="label">Price per Seat:</span>
                        <span className="value">₹{basePrice}</span>
                      </div>
                    )}
                    
                    <div className="detail-row">
                      <span className="label">Contact Phone:</span>
                      <span className="value">{booking.contact_phone || booking.phone || 'Not provided'}</span>
                    </div>
                    
                    <div className="detail-row" style={{ fontWeight: 'bold', borderTop: '1px solid #ddd', paddingTop: '10px', marginTop: '10px' }}>
                      <span className="label">Total Amount:</span>
                      <span className="value" style={{ color: '#007bff' }}>₹{totalAmount.toLocaleString()}</span>
                    </div>
                    
                    {status.toLowerCase() === 'pending' && (
                      <Link
                        to={`/payment/${booking.booking_id}`}
                        state={{ booking }}
                        style={{
                          display: 'block',
                          padding: '10px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          marginTop: '15px',
                          textAlign: 'center',
                          textDecoration: 'none'
                        }}
                      >
                        💳 Pay Now
                      </Link>
                    )}
                    
                    {booking.special_requests && (
                      <div className="detail-row">
                        <span className="label">Special Requests:</span>
                        <span className="value">{booking.special_requests}</span>
                      </div>
                    )}
                    
                    <div className="detail-row">
                      <span className="label">Booked on:</span>
                      <span className="value">
                        {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-bookings" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '16px', color: '#666' }}>
              No bookings yet.
            </p>
            <a href="/packages" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
              Browse and book a package now!
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
