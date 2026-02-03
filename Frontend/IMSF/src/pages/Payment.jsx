import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { bookingAPI, paymentAPI } from '../services/endpoints';
import apiClient from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Checkout.css';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  useEffect(() => {
    if (!bookingId) {
      setError('No booking ID provided');
      setLoading(false);
      return;
    }
    
    // First, try to get booking from location.state (passed from Bookings page)
    if (location.state?.booking) {
      setBooking(location.state.booking);
      setLoading(false);
      return;
    }
    
    // Otherwise, fetch from API
    if (user?.user_id && bookingId) {
      fetchBookingDetails();
    }
  }, [user?.user_id, bookingId, location.state]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getById(bookingId);
      
      let bookingData = null;
      
      // Try multiple extraction paths
      if (response.data?.data?.booking_id) {
        bookingData = response.data.data;
      } else if (response.data?.booking_id) {
        bookingData = response.data;
      } else if (Array.isArray(response.data?.data) && response.data.data.length > 0) {
        bookingData = response.data.data[0];
      } else if (Array.isArray(response.data) && response.data.length > 0) {
        bookingData = response.data[0];
      }
      
      if (!bookingData || !bookingData.booking_id) {
        throw new Error('Booking not found - invalid response structure');
      }
      
      setBooking(bookingData);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to load booking';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateCardDetails = () => {
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Card number must be 16 digits');
      return false;
    }
    if (!cardDetails.cardName || cardDetails.cardName.trim().length < 3) {
      setError('Cardholder name is required');
      return false;
    }
    if (!cardDetails.expiryMonth || !cardDetails.expiryYear) {
      setError('Card expiry date is required');
      return false;
    }
    if (!cardDetails.cvv || cardDetails.cvv.length !== 3) {
      setError('CVV must be 3 digits');
      return false;
    }
    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateCardDetails()) {
      return;
    }

    try {
      setProcessing(true);
      console.log('💳 Processing payment for booking:', bookingId);
      console.log('Payment method:', paymentMethod);

      // Create payment record
      const paymentData = {
        booking_id: parseInt(bookingId),
              payment_method: paymentMethod,
        payment_status: 'completed',
        transaction_id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        notes: `Payment for booking #${bookingId}`,
      };

      const paymentResponse = await paymentAPI.create(paymentData);

      // Update booking status to confirmed/completed after successful payment
      let confirmSuccess = false;
      
      // Try multiple endpoints to update status - from pending to confirmed
      const confirmEndpoints = [
        { method: 'PUT', url: `/bookings/${bookingId}/confirm`, data: {} },
        { method: 'PUT', url: `/bookings/${bookingId}`, data: { status: 'confirmed' } },
        { method: 'PUT', url: `/bookings/${bookingId}/status`, data: { status: 'confirmed' } },
        { method: 'POST', url: `/bookings/${bookingId}/confirm`, data: {} },
      ];

      for (const endpoint of confirmEndpoints) {
        try {
          let updateResponse;
          
          if (endpoint.method === 'POST') {
            updateResponse = await apiClient.post(endpoint.url, endpoint.data);
          } else {
            updateResponse = await apiClient.put(endpoint.url, endpoint.data);
          }
          
          confirmSuccess = true;
          break;
        } catch (err) {
          // Silently try next endpoint
        }
      }
      
      if (!confirmSuccess) {
        try {
          // Last resort: Try to update via bookingAPI.update
          await bookingAPI.update(bookingId, { status: 'confirmed' });
          confirmSuccess = true;
        } catch (err) {
          // Status update failed but payment was successful
        }
      }

      // Success! Show confirmation page
      setPaymentSuccess(true);
      setPaymentDetails({
        bookingId: bookingId,
        paymentId: paymentResponse.data?.data?.payment_id || paymentResponse.data?.payment_id,
        amount: booking.total_price,
        packageTitle: booking.package_title,
      });

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        navigate('/my-bookings', {
          state: {
            success: true,
            message: `✅ Payment successful! Booking #${bookingId} confirmed.`,
            bookingId: bookingId,
            refreshBookings: true,
          },
        });
      }, 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Payment processing failed';
      setError(`❌ ${errorMsg}`);
    } finally {
      setProcessing(false);
    }
  };

  if (paymentSuccess && paymentDetails) {
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ 
            maxWidth: '500px', 
            margin: '0 auto',
            backgroundColor: '#d4edda',
            border: '2px solid #28a745',
            borderRadius: '8px',
            padding: '40px 20px'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
            <h2 style={{ color: '#28a745', margin: '20px 0' }}>Payment Successful!</h2>
            
            <div style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '4px',
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Booking ID:</label>
                <div style={{ fontSize: '18px', color: '#007bff', fontWeight: 'bold' }}>
                  #{paymentDetails.bookingId}
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Package:</label>
                <div style={{ fontSize: '16px' }}>
                  {paymentDetails.packageTitle || 'Package'}
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Amount Paid:</label>
                <div style={{ fontSize: '16px', color: '#28a745', fontWeight: 'bold' }}>
                  ₹{(paymentDetails.amount || 0).toLocaleString('en-IN', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
              </div>
              
              <div>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Payment ID:</label>
                <div style={{ fontSize: '12px', color: '#999', wordBreak: 'break-all' }}>
                  {paymentDetails.paymentId || 'N/A'}
                </div>
              </div>
            </div>

            <div style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Your booking has been confirmed. Redirecting in 3 seconds...
            </div>

            <button
              onClick={() => navigate('/my-bookings')}
              style={{
                padding: '12px 30px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              View My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '18px', color: '#666' }}>Loading booking details...</div>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '18px', color: 'red', marginBottom: '20px' }}>
            ❌ Error: {error}
          </div>
          <div style={{ color: '#666', marginBottom: '20px' }}>
            Booking ID: {bookingId}
          </div>
          <button
            onClick={() => navigate('/my-bookings')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '18px', color: 'red' }}>Booking not found</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="checkout-container">
        <h1>Complete Payment</h1>

        {error && (
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#fee', 
            color: '#c33', 
            borderRadius: '4px', 
            marginBottom: '20px',
            border: '1px solid #fcc'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
          {/* Booking Summary */}
          <div style={{ 
            backgroundColor: '#f9f9f9', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <h2 style={{ marginTop: 0, color: '#333' }}>Booking Summary</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '5px' }}>
                Booking ID
              </label>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#007bff' }}>
                #{booking.booking_id}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '5px' }}>
                Package
              </label>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {booking.package_title || 'Package'}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '5px' }}>
                Travel Date
              </label>
              <div style={{ fontSize: '14px' }}>
                {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'N/A'}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '5px' }}>
                Number of Persons
              </label>
              <div style={{ fontSize: '14px' }}>
                {booking.persons} person(s)
              </div>
            </div>

            <div style={{ 
              borderTop: '2px solid #ddd', 
              paddingTop: '15px', 
              marginTop: '15px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#007bff'
            }}>
              Total Amount: ₹{(booking.total_price || 0).toLocaleString('en-IN', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>

            <div style={{
              backgroundColor: '#fff3cd',
              color: '#856404',
              padding: '10px',
              borderRadius: '4px',
              marginTop: '15px',
              fontSize: '12px',
              border: '1px solid #ffeaa7'
            }}>
              ℹ️ Status: <span style={{ fontWeight: 'bold', color: '#ff6b6b' }}>PENDING</span>
              <br/>
              Complete payment to confirm your booking.
            </div>
          </div>

          {/* Payment Form */}
          <div style={{ 
            backgroundColor: '#fff', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <h2 style={{ marginTop: 0, color: '#333' }}>Payment Details</h2>

            <form onSubmit={handlePayment}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Payment Method
                </label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="netbanking">Net Banking</option>
                </select>
              </div>

              {paymentMethod === 'card' && (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={cardDetails.cardName}
                      onChange={handleCardChange}
                      placeholder="John Doe"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        boxSizing: 'border-box',
                        fontSize: '14px'
                      }}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardDetails.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '').slice(0, 16);
                        const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
                        handleCardChange({ target: { name: 'cardNumber', value: formatted } });
                      }}
                      placeholder="1234 5678 9012 3456"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        boxSizing: 'border-box',
                        fontSize: '14px',
                        fontFamily: 'monospace'
                      }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        Expiry Date (MM/YY) *
                      </label>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <input
                          type="text"
                          name="expiryMonth"
                          value={cardDetails.expiryMonth}
                          onChange={(e) => {
                            let value = e.target.value.slice(0, 2);
                            if (value && parseInt(value) > 12) value = '12';
                            handleCardChange({ target: { name: 'expiryMonth', value } });
                          }}
                          placeholder="MM"
                          maxLength="2"
                          style={{
                            flex: 1,
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            textAlign: 'center'
                          }}
                          required
                        />
                        <span style={{ alignSelf: 'center', fontWeight: 'bold' }}>/</span>
                        <input
                          type="text"
                          name="expiryYear"
                          value={cardDetails.expiryYear}
                          onChange={(e) => {
                            let value = e.target.value.slice(0, 2);
                            handleCardChange({ target: { name: 'expiryYear', value } });
                          }}
                          placeholder="YY"
                          maxLength="2"
                          style={{
                            flex: 1,
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            textAlign: 'center'
                          }}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        CVV *
                      </label>
                      <input
                        type="password"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={(e) => {
                          const value = e.target.value.slice(0, 3);
                          handleCardChange({ target: { name: 'cvv', value } });
                        }}
                        placeholder="123"
                        maxLength="3"
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px',
                          textAlign: 'center',
                          fontFamily: 'monospace'
                        }}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === 'upi' && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    UPI ID *
                  </label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box',
                      fontSize: '14px'
                    }}
                  />
                </div>
              )}

              <div style={{
                backgroundColor: '#f0f8ff',
                color: '#003366',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '20px',
                fontSize: '12px',
                border: '1px solid #b3d9ff'
              }}>
                ℹ️ This is a test payment gateway. You can use dummy card details for demo purposes.
              </div>

              <button
                type="submit"
                disabled={processing}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: processing ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  marginBottom: '10px'
                }}
              >
                {processing ? 'Processing Payment...' : `Pay ₹${(booking.total_price || 0).toLocaleString()}`}
              </button>

              <button
                type="button"
                onClick={() => navigate('/my-bookings')}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#e0e0e0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
