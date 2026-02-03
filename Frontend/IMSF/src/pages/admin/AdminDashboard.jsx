import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, packageAPI, bookingAPI, paymentAPI } from '../../services/endpoints';
import { extractArrayData, extractCount } from '../../services/dataExtractor';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPackages: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    bookingsByDate: {},
    upcomingRevenue: 0,
    completedRevenue: 0,
    pendingRevenue: 0,
    confirmedRevenue: 0,
    cancelledRevenue: 0,
    averageRevenuePerBooking: 0,
  });
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [transactionStats, setTransactionStats] = useState({
    totalTransactions: 0,
    successfulTransactions: 0,
    failedTransactions: 0,
    pendingTransactions: 0,
    totalAmount: 0,
    successfulAmount: 0,
    pendingAmount: 0,
    failedAmount: 0,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    fetchStats();
    fetchTransactions();
  }, []);

  // Auto-refresh stats every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing dashboard stats...');
      fetchStats();
      fetchTransactions();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchStats(), fetchTransactions()]);
      setLastRefresh(new Date());
      console.log('✓ Dashboard refreshed manually');
    } catch (err) {
      console.error('Error during manual refresh:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const results = await Promise.allSettled([
        packageAPI.getAll(1, 100),
        bookingAPI.getAll(),
        adminAPI.getAllUsers(),
      ]);

      let totalPackages = 0;
      let totalBookings = 0;
      let totalRevenue = 0;
      let totalUsers = 0;
      let upcomingBookings = 0;
      let completedBookings = 0;
      let pendingBookings = 0;
      let confirmedBookings = 0;
      let cancelledBookings = 0;
      let upcomingRevenue = 0;
      let completedRevenue = 0;
      let pendingRevenue = 0;
      let confirmedRevenue = 0;
      let cancelledRevenue = 0;
      const bookingsByDate = {};
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get packages count
      if (results[0].status === 'fulfilled') {
        const pkgRes = results[0].value;
        const pkgData = extractArrayData(pkgRes.data);
        totalPackages = pkgData.length;
        console.log('✓ Packages:', totalPackages);
      } else {
        console.error('✗ Packages error:', results[0].reason?.message);
      }

      // Get bookings and calculate revenue, categorize by date and status
      if (results[1].status === 'fulfilled') {
        const bookRes = results[1].value;
        const bookData = extractArrayData(bookRes.data);
        totalBookings = bookData.length;
        
        // Log first booking structure to see available fields
        if (bookData.length > 0) {
          console.log('📊 Sample booking structure:', bookData[0]);
        }
        
        totalRevenue = bookData.reduce((sum, b) => {
          // Try multiple field names for amount
          const amount = b.total_amount || b.amount || b.price || b.total_price || b.package_price || 0;
          return sum + (parseFloat(amount) || 0);
        }, 0);
        
        // Categorize bookings by trip date, status
        bookData.forEach(booking => {
          const tripDate = booking.package_date || booking.trip_date || booking.start_date || booking.date;
          const status = booking.status?.toLowerCase() || 'pending';
          // Try multiple field names for amount
          const amount = booking.total_amount || booking.amount || booking.price || booking.total_price || booking.package_price || 0;
          const parsedAmount = parseFloat(amount) || 0;
          
          // Categorize by status and track revenue
          if (status === 'pending') {
            pendingBookings++;
            pendingRevenue += parsedAmount;
          } else if (status === 'confirmed') {
            confirmedBookings++;
            confirmedRevenue += parsedAmount;
          } else if (status === 'cancelled') {
            cancelledBookings++;
            cancelledRevenue += parsedAmount;
          }
          
          // Categorize by trip date
          if (tripDate) {
            const bookingDate = new Date(tripDate);
            bookingDate.setHours(0, 0, 0, 0);
            
            // Group by date
            const dateKey = bookingDate.toISOString().split('T')[0];
            bookingsByDate[dateKey] = (bookingsByDate[dateKey] || 0) + 1;
            
            // Upcoming vs completed - track revenue
            if (bookingDate >= today) {
              upcomingBookings++;
              upcomingRevenue += parsedAmount;
            } else {
              completedBookings++;
              completedRevenue += parsedAmount;
            }
          } else {
            upcomingBookings++;
            upcomingRevenue += parsedAmount;
          }
        });
        
        console.log('✓ Bookings:', totalBookings);
        console.log('  → Pending:', pendingBookings, '(₹' + pendingRevenue.toLocaleString() + ') | Confirmed:', confirmedBookings, '(₹' + confirmedRevenue.toLocaleString() + ') | Cancelled:', cancelledBookings, '(₹' + cancelledRevenue.toLocaleString() + ')');
        console.log('  → Upcoming:', upcomingBookings, '(₹' + upcomingRevenue.toLocaleString() + ') | Completed:', completedBookings, '(₹' + completedRevenue.toLocaleString() + ')');
        console.log('  → Total Revenue: ₹', totalRevenue.toLocaleString());
        console.log('  → Avg Revenue per Booking: ₹', (totalRevenue / totalBookings || 0).toLocaleString());
      } else {
        console.error('✗ Bookings error:', results[1].reason?.message);
      }

      // Get users count
      if (results[2].status === 'fulfilled') {
        const usersRes = results[2].value;
        const userData = extractArrayData(usersRes.data);
        totalUsers = userData.length;
        console.log('✓ Users:', totalUsers);
      } else {
        console.error('✗ Users error:', results[2].reason?.message);
      }

      setStats({
        totalPackages,
        totalBookings,
        totalRevenue,
        totalUsers,
        upcomingBookings,
        completedBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        bookingsByDate,
        upcomingRevenue,
        completedRevenue,
        pendingRevenue,
        confirmedRevenue,
        cancelledRevenue,
        averageRevenuePerBooking: totalBookings > 0 ? totalRevenue / totalBookings : 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      console.log('🔄 Fetching transactions...');
      let transactionData = [];
      
      try {
        const response = await paymentAPI.getAll();
        
        console.log('📥 API Response received:', response);
        
        // Handle different response structures
        if (response && response.data) {
          // If response has .data property
          transactionData = extractArrayData(response.data);
          console.log('✓ Extracted from response.data');
        } else if (Array.isArray(response)) {
          // If response is directly an array
          transactionData = response;
          console.log('✓ Response is array');
        } else if (response && response.payments) {
          // If response has .payments property
          transactionData = extractArrayData(response.payments);
          console.log('✓ Extracted from response.payments');
        } else {
          console.warn('⚠ Could not extract transaction data from response');
          transactionData = [];
        }
        
        console.log('📊 Total transactions fetched:', transactionData.length);
        if (transactionData.length > 0) {
          console.log('📋 Sample transaction:', transactionData[0]);
        }
      } catch (paymentErr) {
        console.warn('⚠ /payments endpoint not available (404), falling back to bookings...');
      }
      
      if (!transactionData || transactionData.length === 0) {
        console.warn('⚠ No transaction data found, trying bookings as fallback...');
        try {
          const bookingRes = await bookingAPI.getAll();
          const bookingsData = extractArrayData(bookingRes.data);
          
          // Convert bookings to transactions
          transactionData = bookingsData.map((booking, index) => ({
            payment_id: booking.booking_id || index,
            id: booking.booking_id || `booking-${index}`,
            booking_id: booking.booking_id || booking.id,
            amount: booking.total_amount || booking.amount || booking.price || 0,
            status: booking.status || 'pending',
            txn_reference: `BK-${booking.booking_id || index}`,
            created_at: booking.created_at || booking.date || new Date().toISOString(),
            paid_on: booking.created_at || booking.date || new Date().toISOString(),
          }));
          
          console.log(`✓ Using ${transactionData.length} bookings as transactions`);
        } catch (err) {
          console.error('Failed to fetch bookings fallback:', err);
          transactionData = [];
        }
      }
      
      if (!transactionData || transactionData.length === 0) {
        console.warn('⚠ No transaction or booking data found');
        setTransactions([]);
        setTransactionStats({
          totalTransactions: 0,
          successfulTransactions: 0,
          failedTransactions: 0,
          pendingTransactions: 0,
        });
        return;
      }
      
      // Sort by date (most recent first)
      const sortedTransactions = transactionData.sort((a, b) => {
        const dateA = new Date(a.created_at || a.transaction_date || a.date || a.payment_date || 0);
        const dateB = new Date(b.created_at || b.transaction_date || b.date || b.payment_date || 0);
        return dateB - dateA;
      });

      // Get last 10 transactions for display
      const recentTransactions = sortedTransactions.slice(0, 10);

      // Calculate transaction statistics
      const totalTransactions = transactionData.length;
      const successfulTransactions = transactionData.filter(
        t => {
          const status = t.status?.toLowerCase() || '';
          return status === 'success' || status === 'completed' || status === 'confirmed';
        }
      ).length;
      const failedTransactions = transactionData.filter(
        t => {
          const status = t.status?.toLowerCase() || '';
          return status === 'failed' || status === 'rejected' || status === 'declined';
        }
      ).length;
      const pendingTransactions = transactionData.filter(
        t => {
          const status = t.status?.toLowerCase() || '';
          return status === 'pending' || status === 'processing';
        }
      ).length;

      // Calculate total amounts by status
      const totalAmount = transactionData.reduce((sum, t) => {
        const amount = parseFloat(t.amount || t.total_amount || t.price || 0) || 0;
        return sum + amount;
      }, 0);

      const successfulAmount = transactionData.filter(t => {
        const status = t.status?.toLowerCase() || '';
        return status === 'success' || status === 'completed' || status === 'confirmed';
      }).reduce((sum, t) => {
        const amount = parseFloat(t.amount || t.total_amount || t.price || 0) || 0;
        return sum + amount;
      }, 0);

      const pendingAmount = transactionData.filter(t => {
        const status = t.status?.toLowerCase() || '';
        return status === 'pending' || status === 'processing';
      }).reduce((sum, t) => {
        const amount = parseFloat(t.amount || t.total_amount || t.price || 0) || 0;
        return sum + amount;
      }, 0);

      const failedAmount = transactionData.filter(t => {
        const status = t.status?.toLowerCase() || '';
        return status === 'failed' || status === 'rejected' || status === 'declined';
      }).reduce((sum, t) => {
        const amount = parseFloat(t.amount || t.total_amount || t.price || 0) || 0;
        return sum + amount;
      }, 0);

      setTransactions(recentTransactions);
      setTransactionStats({
        totalTransactions,
        successfulTransactions,
        failedTransactions,
        pendingTransactions,
        totalAmount,
        successfulAmount,
        pendingAmount,
        failedAmount,
      });

      console.log('✓ Transactions loaded successfully!');
      console.log('  → Total Amount: ₹' + totalAmount.toLocaleString());
      console.log('  → Successful Amount: ₹' + successfulAmount.toLocaleString());
      console.log('  → Pending Amount: ₹' + pendingAmount.toLocaleString());
      console.log('  → Failed Amount: ₹' + failedAmount.toLocaleString());
      console.log('  → Total:', totalTransactions);
      console.log('  → Successful:', successfulTransactions, '| Pending:', pendingTransactions, '| Failed:', failedTransactions);
    } catch (err) {
      console.error('❌ Error fetching transactions:', err);
      console.error('Error message:', err.message);
      console.error('Error response:', err.response?.data);
      
      // Set empty state on error
      setTransactions([]);
      setTransactionStats({
        totalTransactions: 0,
        successfulTransactions: 0,
        failedTransactions: 0,
        pendingTransactions: 0,
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="admin-dashboard">
        {/* Hero Banner */}
        <div className="admin-hero">
          <div className="hero-content">
            <h1>Admin Dashboard</h1>
            <p>Manage your travel business</p>
          </div>
          <div className="hero-actions">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`btn btn-refresh ${isRefreshing ? 'loading' : ''}`}
              title="Refresh dashboard stats"
            >
              {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
            </button>
            <span className="last-refresh">
              Updated: {lastRefresh.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <h4>Total Packages</h4>
            <p className="stat-value">{stats.totalPackages}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <h4>Total Bookings</h4>
            <p className="stat-value">{stats.totalBookings}</p>
          </div>
          
          {/* Booking Status Indicators */}
          <div className="stat-card status-pending">
            <div className="stat-icon">⏳</div>
            <h4>Pending</h4>
            <p className="stat-value pending-count">{stats.pendingBookings}</p>
            <p className="stat-revenue">₹{stats.pendingRevenue.toLocaleString()}</p>
            <div className="status-badge pending-badge">In Review</div>
          </div>
          
          <div className="stat-card status-confirmed">
            <div className="stat-icon">✅</div>
            <h4>Confirmed</h4>
            <p className="stat-value confirmed-count">{stats.confirmedBookings}</p>
            <p className="stat-revenue">₹{stats.confirmedRevenue.toLocaleString()}</p>
            <div className="status-badge confirmed-badge">Active</div>
          </div>
          
          <div className="stat-card status-cancelled">
            <div className="stat-icon">❌</div>
            <h4>Cancelled</h4>
            <p className="stat-value cancelled-count">{stats.cancelledBookings}</p>
            <p className="stat-revenue">₹{stats.cancelledRevenue.toLocaleString()}</p>
            <div className="status-badge cancelled-badge">Cancelled</div>
          </div>
          
          {/* Date-based Indicators */}
          <div className="stat-card date-upcoming">
            <div className="stat-icon">🚀</div>
            <h4>Upcoming Bookings</h4>
            <p className="stat-value">{stats.upcomingBookings}</p>
            <p className="stat-revenue">₹{stats.upcomingRevenue.toLocaleString()}</p>
            <div className="status-badge upcoming-badge">Future Trips</div>
          </div>
          
          <div className="stat-card date-completed">
            <div className="stat-icon">🏁</div>
            <h4>Completed Bookings</h4>
            <p className="stat-value">{stats.completedBookings}</p>
            <p className="stat-revenue">₹{stats.completedRevenue.toLocaleString()}</p>
            <div className="status-badge completed-badge">Done</div>
          </div>
          
          <div className="stat-card revenue-card">
            <div className="stat-icon">💰</div>
            <h4>Total Revenue</h4>
            <p className="stat-value">₹{stats.totalRevenue.toLocaleString()}</p>
            <div className="stat-subtitle">{stats.totalBookings} bookings</div>
          </div>

          <div className="stat-card avg-revenue-card">
            <div className="stat-icon">📊</div>
            <h4>Avg per Booking</h4>
            <p className="stat-value">₹{stats.averageRevenuePerBooking.toLocaleString()}</p>
            <div className="stat-subtitle">Revenue breakdown</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <h4>Total Users</h4>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="admin-grid">
          {/* Packages Management */}
          <div className="admin-card">
            <div className="card-icon">📦</div>
            <h3>Manage Packages</h3>
            <p>Create, edit, and delete travel packages</p>
            <div className="card-actions">
              <Link to="/admin/packages" className="btn btn-primary">View All</Link>
              <Link to="/admin/packages/create" className="btn btn-secondary">Create New</Link>
            </div>
          </div>

          {/* Package Dates Management */}
          <div className="admin-card">
            <div className="card-icon">📅</div>
            <h3>Manage Package Dates</h3>
            <p>Add and manage travel dates for packages</p>
            <div className="card-actions">
              <Link to="/admin/package-dates" className="btn btn-primary">Manage Dates</Link>
            </div>
          </div>

          {/* Destinations Management */}
          <div className="admin-card">
            <div className="card-icon">🌍</div>
            <h3>Manage Destinations</h3>
            <p>Add and manage travel destinations</p>
            <div className="card-actions">
              <Link to="/admin/destinations" className="btn btn-primary">View All</Link>
              <Link to="/admin/destinations/create" className="btn btn-secondary">Create New</Link>
            </div>
          </div>

          {/* Users Management */}
          <div className="admin-card">
            <div className="card-icon">👥</div>
            <h3>Manage Users</h3>
            <p>Create users and manage roles</p>
            <div className="card-actions">
              <Link to="/admin/users" className="btn btn-primary">View All</Link>
              <Link to="/admin/users/create" className="btn btn-secondary">Create User</Link>
            </div>
          </div>

          {/* Bookings */}
          <div className="admin-card">
            <div className="card-icon">📋</div>
            <h3>Manage Bookings</h3>
            <p>View and manage customer bookings</p>
            <div className="card-actions">
              <Link to="/admin/bookings" className="btn btn-primary">Manage All</Link>
              <Link to="/admin/bookings-report" className="btn btn-secondary">Report</Link>
            </div>
          </div>

          {/* User Profiles */}
          <div className="admin-card">
            <div className="card-icon">👤</div>
            <h3>User Profiles</h3>
            <p>View and manage user accounts and bookings</p>
            <div className="card-actions">
              <Link to="/admin/user-profiles" className="btn btn-primary">View Profiles</Link>
            </div>
          </div>

          {/* Payments */}
          <div className="admin-card">
            <div className="card-icon">💳</div>
            <h3>Payment History</h3>
            <p>Track and manage payment transactions</p>
            <div className="card-actions">
              <Link to="/admin/payments" className="btn btn-primary">View Payments</Link>
            </div>
          </div>

          {/* Reviews */}
          <div className="admin-card">
            <div className="card-icon">⭐</div>
            <h3>Manage Reviews</h3>
            <p>Monitor customer reviews and ratings</p>
            <div className="card-actions">
              <Link to="/dashboard" className="btn btn-primary">View Reviews</Link>
            </div>
          </div>

          {/* API Tester */}
          <div className="admin-card">
            <div className="card-icon">🧪</div>
            <h3>API Tester</h3>
            <p>Test all backend APIs and verify integration</p>
            <div className="card-actions">
              <Link to="/admin/api-tester" className="btn btn-primary">Test APIs</Link>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="transactions-section">
          <h2>💳 Recent Transactions</h2>

          {/* Transaction Stats */}
          <div className="transaction-stats">
            <div className="transaction-stat-card total">
              <h4>Total Amount</h4>
              <p className="transaction-amount-total">₹{transactionStats.totalAmount.toLocaleString()}</p>
              <small className="transaction-count">{transactionStats.totalTransactions} transactions</small>
            </div>
            <div className="transaction-stat-card success">
              <h4>Successful Amount</h4>
              <p className="transaction-amount-total">₹{transactionStats.successfulAmount.toLocaleString()}</p>
              <small className="transaction-count success-count">{transactionStats.successfulTransactions} successful</small>
            </div>
            <div className="transaction-stat-card pending">
              <h4>Pending Amount</h4>
              <p className="transaction-amount-total">₹{transactionStats.pendingAmount.toLocaleString()}</p>
              <small className="transaction-count pending-count">{transactionStats.pendingTransactions} pending</small>
            </div>
            <div className="transaction-stat-card failed">
              <h4>Failed Amount</h4>
              <p className="transaction-amount-total">₹{transactionStats.failedAmount.toLocaleString()}</p>
              <small className="transaction-count failed-count">{transactionStats.failedTransactions} failed</small>
            </div>
          </div>

          {/* Recent Transactions Table */}
          <div className="transactions-table-container">
            {transactions.length > 0 ? (
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Status</th>
                    <th>Booking ID</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.payment_id || transaction.id || transaction.transaction_id}>
                      <td className="transaction-id">
                        {transaction.txn_reference || transaction.transaction_id || transaction.id || '#N/A'}
                      </td>
                      <td>
                        <span className={`transaction-status ${(transaction.status || 'pending')?.toLowerCase()}`}>
                          {transaction.status || 'Pending'}
                        </span>
                      </td>
                      <td>{transaction.booking_id || transaction.booking || transaction.order_id || '-'}</td>
                      <td className="transaction-date">
                        {new Date(transaction.paid_on || transaction.created_at || transaction.transaction_date || transaction.date || transaction.payment_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-transactions">
                <p>📭 No transactions found</p>
                <small>Check browser console for API errors (F12 → Console tab)</small>
              </div>
            )}
          </div>

          <Link to="/admin/payments" className="btn btn-primary" style={{ marginTop: '20px' }}>
            View All Transactions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
