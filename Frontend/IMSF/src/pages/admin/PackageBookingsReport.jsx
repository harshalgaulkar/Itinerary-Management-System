import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { packageAPI, bookingAPI } from '../../services/endpoints';
import { extractArrayData } from '../../services/dataExtractor';
import '../../styles/AdminManage.css';

const PackageBookingsReport = () => {
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('📦 Fetching packages and bookings...');

      // Fetch packages
      let packagesData = [];
      try {
        const pkgRes = await packageAPI.getAll();
        packagesData = extractArrayData(pkgRes.data);
        console.log(`✓ Fetched ${packagesData.length} packages`);
      } catch (err) {
        console.warn('⚠ packageAPI.getAll failed, trying direct fetch...');
        try {
          const pkgRes = await fetch('http://localhost:4000/packages').then(r => r.json());
          packagesData = Array.isArray(pkgRes.data) ? pkgRes.data : Array.isArray(pkgRes) ? pkgRes : [];
        } catch (err2) {
          console.error('✗ Both package endpoints failed');
        }
      }

      // Fetch bookings
      let bookingsData = [];
      try {
        const bookRes = await bookingAPI.getAll();
        bookingsData = extractArrayData(bookRes.data);
        console.log(`✓ Fetched ${bookingsData.length} bookings`);
      } catch (err) {
        console.warn('⚠ bookingAPI.getAll failed, trying direct fetch...');
        try {
          const bookRes = await fetch('http://localhost:4000/bookings').then(r => r.json());
          bookingsData = Array.isArray(bookRes.data) ? bookRes.data : Array.isArray(bookRes) ? bookRes : [];
        } catch (err2) {
          console.error('✗ Both bookings endpoints failed');
        }
      }

      setPackages(packagesData);
      setBookings(bookingsData);
    } catch (err) {
      const errorMsg = err.message || 'Failed to load data';
      setError(errorMsg);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get bookings for a specific package
  const getPackageBookings = (packageId) => {
    return bookings.filter(b => b.package_id === packageId || b.package_id == packageId);
  };

  // Helper function to calculate total seats for a package
  const getTotalSeats = (packageId) => {
    return getPackageBookings(packageId).reduce((sum, b) => sum + (parseInt(b.number_of_seats) || 1), 0);
  };

  // Helper function to get booking status summary
  const getBookingStatusSummary = (packageId) => {
    const pkgBookings = getPackageBookings(packageId);
    const confirmed = pkgBookings.filter(b => b.booking_status === 'confirmed' || b.status === 'confirmed').length;
    const pending = pkgBookings.filter(b => b.booking_status === 'pending' || b.status === 'pending').length;
    const cancelled = pkgBookings.filter(b => b.booking_status === 'cancelled' || b.status === 'cancelled').length;

    return { total: pkgBookings.length, confirmed, pending, cancelled };
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
          <div className="loading">Loading package booking report...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ color: '#333', fontSize: '28px', marginBottom: '20px' }}>Package Bookings Report</h1>
          
          {error && <div style={{ color: 'red', padding: '10px', backgroundColor: '#ffe0e0', marginBottom: '20px' }}>{error}</div>}
          
          <button onClick={fetchData} disabled={loading} style={{ padding: '10px 20px', marginBottom: '20px' }}>
            {loading ? 'Loading...' : 'Refresh Report'}
          </button>

          <Link to="/admin" style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none' }}>
            Back to Admin
          </Link>

          <div style={{ marginTop: '30px' }}>
            <h2 style={{ marginBottom: '20px' }}>Summary</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Total Packages</h4>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff', margin: 0 }}>{packages.length}</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Total Bookings</h4>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745', margin: 0 }}>{bookings.length}</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Total Seats Booked</h4>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107', margin: 0 }}>
                  {bookings.reduce((sum, b) => sum + (parseInt(b.number_of_seats) || 1), 0)}
                </p>
              </div>
              <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Total Revenue</h4>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#17a2b8', margin: 0 }}>
                  ₹{bookings.reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>

            <h2 style={{ marginBottom: '20px' }}>Packages Breakdown</h2>
            {packages.length > 0 ? (
              <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#2d2323', color: 'white' }}>
                      <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Package</th>
                      <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Price</th>
                      <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Total Bookings</th>
                      <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Total Seats</th>
                      <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Confirmed</th>
                      <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Pending</th>
                      <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Cancelled</th>
                      <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((pkg) => {
                      const pkgBookings = getPackageBookings(pkg.package_id);
                      const totalSeats = getTotalSeats(pkg.package_id);
                      const statusSummary = getBookingStatusSummary(pkg.package_id);
                      const revenue = pkgBookings.reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0);

                      return (
                        <tr key={pkg.package_id} style={{ borderBottom: '1px solid #ddd' }}>
                          <td style={{ padding: '12px', color: '#333' }}>
                            <strong>{pkg.title}</strong>
                            <br />
                            <small style={{ color: '#666' }}>Duration: {pkg.duration_days || pkg.duration} days</small>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', color: '#333' }}>₹{pkg.base_price || pkg.price}</td>
                          <td style={{ padding: '12px', textAlign: 'center', color: '#333', fontWeight: 'bold' }}>
                            {statusSummary.total}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', color: '#333', fontWeight: 'bold' }}>
                            {totalSeats}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', color: '#28a745', fontWeight: 'bold' }}>
                            {statusSummary.confirmed}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', color: '#ffc107', fontWeight: 'bold' }}>
                            {statusSummary.pending}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', color: '#dc3545', fontWeight: 'bold' }}>
                            {statusSummary.cancelled}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', color: '#017a2b8', fontWeight: 'bold' }}>
                            ₹{revenue.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#666' }}>No packages found</p>
            )}

            <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>Recent Bookings</h2>
            {bookings.length > 0 ? (
              <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#2d2323', color: 'white' }}>
                      <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Booking ID</th>
                      <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Package</th>
                      <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Seats</th>
                      <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Amount</th>
                      <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Status</th>
                      <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 20).map((booking) => {
                      const pkg = packages.find(p => p.package_id === booking.package_id);
                      const status = booking.booking_status || booking.status || 'unknown';
                      const statusColor = status === 'confirmed' ? '#28a745' : status === 'pending' ? '#ffc107' : '#dc3545';

                      return (
                        <tr key={booking.booking_id} style={{ borderBottom: '1px solid #ddd' }}>
                          <td style={{ padding: '12px', color: '#333', fontWeight: 'bold' }}>#{booking.booking_id}</td>
                          <td style={{ padding: '12px', color: '#333' }}>{pkg?.title || `Package ${booking.package_id}`}</td>
                          <td style={{ padding: '12px', textAlign: 'center', color: '#333' }}>
                            {booking.number_of_seats || 1}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', color: '#333' }}>
                            ₹{(booking.total_amount || 0).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', color: statusColor, fontWeight: 'bold' }}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </td>
                          <td style={{ padding: '12px', color: '#666' }}>
                            {new Date(booking.booking_date).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#666' }}>No bookings found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageBookingsReport;
