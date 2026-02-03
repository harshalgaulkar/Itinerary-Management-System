import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { bookingAPI } from '../services/endpoints';
import { extractArrayData } from '../services/dataExtractor';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedTrips: 0,
    upcomingTrips: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.user_id) {
      fetchBookingStats();
    }
  }, [user?.user_id]);

  const fetchBookingStats = async () => {
    try {
      setLoading(true);
      console.log('📋 Fetching bookings for user:', user?.user_id);
      
      const response = await bookingAPI.getAll();
      console.log('📋 Bookings response:', response);
      
      let bookingsData = extractArrayData(response.data);
      console.log('✓ Extracted bookings:', bookingsData);
      
      // Filter by current user
      const userBookings = bookingsData.filter(b => b.user_id === user?.user_id || b.user_id === parseInt(user?.user_id));
      console.log('✓ User bookings:', userBookings);
      
      let completedCount = 0;
      let upcomingCount = 0;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      userBookings.forEach(booking => {
        const status = (booking.status || booking.booking_status || '').toLowerCase();
        
        // Completed trips - status is 'completed' OR 'success'
        if (status === 'completed' || status === 'success') {
          completedCount++;
        } else if (status === 'confirmed' || status === 'pending') {
          // Upcoming trips - check if end date is in future
          if (booking.end_date) {
            const endDate = new Date(booking.end_date);
            if (endDate >= today) {
              upcomingCount++;
            }
          } else {
            // If no end_date, consider it upcoming
            upcomingCount++;
          }
        }
      });
      
      setStats({
        totalBookings: userBookings.length,
        completedTrips: completedCount,
        upcomingTrips: upcomingCount
      });
      
      console.log('📊 Stats calculated:', {
        totalBookings: userBookings.length,
        completedTrips: completedCount,
        upcomingTrips: upcomingCount
      });
    } catch (err) {
      console.error('❌ Error fetching bookings:', err);
      setStats({
        totalBookings: 0,
        completedTrips: 0,
        upcomingTrips: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        {/* Hero Banner */}
        <div className="dashboard-hero">
          <div className="hero-content">
            <h1>Welcome back, {user?.full_name || user?.email}! 👋</h1>
            <p>Your travel journey awaits. Manage bookings and explore new destinations.</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card upcoming">
            <div className="stat-icon">🚀</div>
            <div className="stat-info">
              <h4>Upcoming Trips</h4>
              <p className="stat-value">{stats.upcomingTrips}</p>
            </div>
          </div>
          <div className="stat-card completed">
            <div className="stat-icon">🏁</div>
            <div className="stat-info">
              <h4>Completed Trips</h4>
              <p className="stat-value">{stats.completedTrips}</p>
            </div>
          </div>
          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h4>Total Bookings</h4>
              <p className="stat-value">{stats.totalBookings}</p>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-icon">📋</div>
              <h3>My Bookings</h3>
              <p>View and manage your travel bookings</p>
              <Link to="/my-bookings" className="btn btn-primary">
                View All
              </Link>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">🌍</div>
              <h3>Browse Packages</h3>
              <p>Explore amazing travel packages worldwide</p>
              <Link to="/packages" className="btn btn-primary">
                Explore
              </Link>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">👤</div>
              <h3>My Profile</h3>
              <p>Update your personal information</p>
              <Link to="/profile" className="btn btn-primary">
                Edit Profile
              </Link>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">💳</div>
              <h3>Payment History</h3>
              <p>Track all your payments and transactions</p>
              <Link to="/my-bookings" className="btn btn-primary">
                View Payments
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
