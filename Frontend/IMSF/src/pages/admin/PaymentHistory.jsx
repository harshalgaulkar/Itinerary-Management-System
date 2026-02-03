import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { paymentAPI, bookingAPI } from '../../services/endpoints';
import { extractArrayData } from '../../services/dataExtractor';
import '../../styles/AdminDashboard.css';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalAmount: 0,
    completedCount: 0,
    completedAmount: 0
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    applyFilters();
    calculateStats();
  }, [payments, filterStatus, filterMethod, searchTerm]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      console.log('💳 Fetching all payments...');
      
      const response = await paymentAPI.getAll();
      console.log('💳 Payments response:', response);
      
      let paymentsData = [];
      
      // Try to extract payments from various response structures
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          paymentsData = response.data;
          console.log('✓ Extracted payments from response.data (array)');
        } else if (response.data.payments && Array.isArray(response.data.payments)) {
          paymentsData = response.data.payments;
          console.log('✓ Extracted payments from response.data.payments');
        } else {
          paymentsData = extractArrayData(response.data);
          console.log('✓ Extracted payments using extractArrayData');
        }
      } else if (Array.isArray(response)) {
        paymentsData = response;
        console.log('✓ Response is direct array');
      }
      
      console.log(`📊 Fetched ${paymentsData.length} payments from API`);
      if (paymentsData.length > 0) {
        console.log('📋 Sample payment record:', paymentsData[0]);
      }
      
      // If no payments from API, try fetching bookings as fallback
      if (paymentsData.length === 0) {
        console.log('⚠️ No payments found, trying bookings as fallback...');
        try {
          const bookingResponse = await bookingAPI.getAll();
          const bookingsData = extractArrayData(bookingResponse.data);
          
          // Convert bookings to payment records
          paymentsData = bookingsData.map((booking, index) => ({
            id: booking.id || `booking-${index}`,
            payment_id: booking.id || `booking-${index}`,
            booking_id: booking.id,
            amount: booking.total_amount || booking.amount || booking.price || 0,
            total_amount: booking.total_amount || booking.amount || booking.price || 0,
            status: booking.status || 'pending',
            payment_status: booking.status || 'pending',
            created_at: booking.created_at || booking.date || new Date().toISOString(),
            payment_date: booking.created_at || booking.date || new Date().toISOString(),
            payment_method: booking.payment_method || 'Online',
            user_id: booking.user_id,
            package_id: booking.package_id,
          }));
          
          console.log(`✓ Converted ${paymentsData.length} bookings to payment records`);
        } catch (bookingErr) {
          console.error('Failed to fetch bookings as fallback:', bookingErr);
        }
      }
      
      setPayments(paymentsData);
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch payments';
      setError(errorMsg);
      console.error('Error fetching payments:', err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    let totalPayments = payments.length;
    let totalAmount = 0;
    let completedCount = 0;
    let completedAmount = 0;

    payments.forEach(p => {
      const amount = parseFloat(p.total_amount || p.amount || 0) || 0;
      totalAmount += amount;
      
      const status = (p.payment_status || p.status || 'pending').toLowerCase();
      if (status === 'success' || status === 'completed') {
        completedCount++;
        completedAmount += amount;
      }
    });

    setStats({
      totalPayments,
      totalAmount,
      completedCount,
      completedAmount
    });
    
    console.log('📊 Stats calculated:', { totalPayments, totalAmount, completedCount, completedAmount });
  };

  const applyFilters = () => {
    let filtered = payments;

    // Filter by status
    if (filterStatus !== 'all') {
      const filterStatusLower = filterStatus.toLowerCase();
      filtered = filtered.filter(p => {
        const status = (p.payment_status || p.status || 'pending').toLowerCase();
        // Match 'completed', 'success', 'card' (database values)
        if (filterStatusLower.includes('completed') || filterStatusLower.includes('success')) {
          return status === 'completed' || status === 'success';
        }
        if (filterStatusLower.includes('pending')) {
          return status === 'pending' || status === 'processing';
        }
        if (filterStatusLower.includes('failed')) {
          return status === 'failed' || status === 'rejected' || status === 'declined';
        }
        return status.includes(filterStatusLower) || filterStatusLower.includes(status);
      });
    }

    // Filter by payment method
    if (filterMethod !== 'all') {
      const filterMethodLower = filterMethod.toLowerCase();
      filtered = filtered.filter(p => {
        const method = (p.method || p.payment_method || p.payment_type || 'unknown').toLowerCase();
        
        // Flexible matching - handles 'debit_card', 'credit_card', 'card' 
        if (filterMethodLower.includes('debit')) {
          return method.includes('debit') || method === 'card';
        }
        if (filterMethodLower.includes('credit')) {
          return method.includes('credit') || method === 'card';
        }
        if (filterMethodLower === 'card' || filterMethodLower === 'credit card' || filterMethodLower === 'debit card') {
          return method.includes('card') || method === 'card';
        }
        // 'bank' matches 'netbanking', 'online_banking', 'bank'
        if (filterMethodLower.includes('bank') || filterMethodLower === 'netbanking' || filterMethodLower === 'online_banking') {
          return method.includes('bank') || method === 'netbanking' || method === 'online_banking';
        }
        
        return method.includes(filterMethodLower) || filterMethodLower.includes(method);
      });
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.payment_id?.toString().includes(term) ||
        p.booking_id?.toString().includes(term) ||
        p.user_id?.toString().includes(term) ||
        (p.transaction_id || '').toLowerCase().includes(term)
      );
    }

    setFilteredPayments(filtered);
  };

  const getStatusColor = (status) => {
    const statusLower = (status || 'pending').toLowerCase();
    if (statusLower === 'completed' || statusLower === 'success') return '#00b894';
    if (statusLower === 'pending') return '#ff9500';
    if (statusLower === 'failed') return '#ff4757';
    if (statusLower === 'refunded') return '#17a2b8';
    return '#6c757d';
  };

  const getMethodDisplay = (method) => {
    if (!method) return 'Unknown';
    const methodLower = method.toLowerCase();
    
    // Convert database values to user-friendly display
    if (methodLower === 'credit_card') return 'Credit Card';
    if (methodLower === 'debit_card') return 'Debit Card';
    if (methodLower === 'card') return 'Card';
    if (methodLower === 'upi') return 'UPI';
    if (methodLower === 'netbanking') return 'Net Banking';
    if (methodLower === 'online_banking') return 'Online Banking';
    if (methodLower === 'cash') return 'Cash';
    if (methodLower === 'other') return 'Other';
    
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="admin-dashboard" style={{ padding: '20px' }}>
          <div className="loading">Loading payments...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="admin-dashboard" style={{ padding: '20px' }}>
        <div className="admin-header">
          <h1>💳 Payment History</h1>
          <p>Total Transactions: {payments.length}</p>
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

        {/* Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #dee2e6'
          }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Total Transactions</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff', marginTop: '5px' }}>
              {stats.totalPayments}
            </div>
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #dee2e6'
          }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Total Amount</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745', marginTop: '5px' }}>
              ₹{stats.totalAmount.toLocaleString()}
            </div>
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #dee2e6'
          }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Completed</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745', marginTop: '5px' }}>
              {stats.completedCount}
            </div>
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #dee2e6'
          }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Completed Amount</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#17a2b8', marginTop: '5px' }}>
              ₹{stats.completedAmount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '15px',
          marginBottom: '20px',
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '4px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Status:
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Method:
            </label>
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="all">All Methods</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="upi">UPI</option>
              <option value="net_banking">Net Banking</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Search:
            </label>
            <input
              type="text"
              placeholder="Search ID or transaction..."
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
              onClick={fetchPayments}
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

        {/* Payments Table */}
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
                <th style={{ padding: '12px', textAlign: 'left', color: '#000', fontWeight: '700' }}>Payment ID</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#000', fontWeight: '700' }}>Booking ID</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#000', fontWeight: '700' }}>User ID</th>
                <th style={{ padding: '12px', textAlign: 'right', color: '#000', fontWeight: '700' }}>Amount</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#000', fontWeight: '700' }}>Method</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#000', fontWeight: '700' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#000', fontWeight: '700' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#000', fontWeight: '700' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map(payment => {
                  const status = (payment.payment_status || payment.status || 'pending').toLowerCase();
                  const method = (payment.method || payment.payment_method || payment.payment_type || 'unknown').toLowerCase();
                  const amount = payment.total_amount || payment.amount || 0;
                  const date = payment.paid_on || payment.created_at ? new Date(payment.paid_on || payment.created_at).toLocaleDateString() : 'N/A';

                  return (
                    <tr
                      key={payment.payment_id}
                      style={{
                        borderBottom: '1px solid #dee2e6',
                        backgroundColor: selectedPayment?.payment_id === payment.payment_id ? '#e7f3ff' : 'white'
                      }}
                    >
                      <td style={{ padding: '12px', color: '#000', fontWeight: '600' }}>
                        <strong>#{payment.payment_id}</strong>
                      </td>
                      <td style={{ padding: '12px', color: '#000' }}>
                        #{payment.booking_id}
                      </td>
                      <td style={{ padding: '12px', color: '#000' }}>
                        {payment.user_id}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#28a745' }}>
                        ₹{amount.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', color: '#000' }}>
                        {getMethodDisplay(method)}
                      </td>
                      <td style={{ padding: '12px', color: '#000' }}>
                        {date}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{
                          backgroundColor: getStatusColor(status),
                          color: '#000',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => setSelectedPayment(selectedPayment?.payment_id === payment.payment_id ? null : payment)}
                          style={{
                            padding: '6px 10px',
                            backgroundColor: '#17a2b8',
                            color: '#000',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                        >
                          👁️ View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Selected Payment Details */}
        {selectedPayment && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '2px solid #17a2b8'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <h3 style={{ color: '#333', margin: 0 }}>💳 Payment #${selectedPayment.payment_id} Details</h3>
              <button
                onClick={() => setSelectedPayment(null)}
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

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: '15px',
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '4px'
            }}>
              <div>
                <strong style={{ color: '#333' }}>Payment ID:</strong>
                <p style={{ color: '#333', margin: '5px 0' }}>{selectedPayment.payment_id}</p>
              </div>
              <div>
                <strong style={{ color: '#333' }}>Booking ID:</strong>
                <p style={{ color: '#333', margin: '5px 0' }}>{selectedPayment.booking_id}</p>
              </div>
              <div>
                <strong style={{ color: '#333' }}>User ID:</strong>
                <p style={{ color: '#333', margin: '5px 0' }}>{selectedPayment.user_id}</p>
              </div>
              <div>
                <strong style={{ color: '#333' }}>Amount:</strong>
                <p style={{ fontWeight: 'bold', color: '#d9534f', fontSize: '18px', margin: '5px 0' }}>
                  ₹{(selectedPayment.total_amount || selectedPayment.amount || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <strong style={{ color: '#333' }}>Payment Method:</strong>
                <p style={{ color: '#333', margin: '5px 0' }}>
                  {getMethodDisplay(selectedPayment.method || selectedPayment.payment_method || selectedPayment.payment_type || 'Card')}
                </p>
              </div>
              <div>
                <strong style={{ color: '#333' }}>Status:</strong>
                <p style={{ margin: '5px 0' }}>
                  <span style={{
                    backgroundColor: getStatusColor(selectedPayment.payment_status || selectedPayment.status),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {(selectedPayment.payment_status || selectedPayment.status || 'pending').toUpperCase()}
                  </span>
                </p>
              </div>
              <div>
                <strong style={{ color: '#333' }}>Transaction ID:</strong>
                <p style={{ fontSize: '12px', wordBreak: 'break-all', color: '#d9534f', margin: '5px 0', fontWeight: 'bold' }}>
                  {selectedPayment.transaction_id || selectedPayment.id || `TXN-${selectedPayment.payment_id}-${Date.now()}`}
                </p>
              </div>
              <div>
                <strong style={{ color: '#333' }}>Date:</strong>
                <p style={{ color: '#333', margin: '5px 0', fontWeight: 'bold' }}>
                  {selectedPayment.created_at ? new Date(selectedPayment.created_at).toLocaleString() : selectedPayment.payment_date ? new Date(selectedPayment.payment_date).toLocaleString() : new Date().toLocaleString()}
                </p>
              </div>
            </div>

            {selectedPayment.notes && (
              <div style={{
                marginTop: '15px',
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '4px'
              }}>
                <strong>Notes:</strong>
                <p>{selectedPayment.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
