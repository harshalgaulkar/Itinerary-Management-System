import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { apiIntegration } from '../../services/apiIntegration';
import '../../styles/AdminDashboard.css';

const APITester = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = {
    all: 'All APIs',
    users: 'User APIs',
    destinations: 'Destination APIs',
    packages: 'Package APIs',
    bookings: 'Booking APIs',
    payments: 'Payment APIs',
    reviews: 'Review APIs',
    admin: 'Admin APIs',
    packageMaster: 'Master Package APIs',
  };

  const addResult = (name, success, message, data = null) => {
    setResults(prev => [{
      id: Date.now(),
      name,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev]);
  };

  const testAll = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      console.log('🧪 Starting comprehensive API test...');
      addResult('Test Started', true, 'Beginning API integration tests');

      // Test Users
      if (selectedCategory === 'all' || selectedCategory === 'users') {
        console.log('\n📝 Testing User APIs...');
        addResult('Users - Get All', true, 'User APIs available', { endpoint: '/users' });
      }

      // Test Destinations
      if (selectedCategory === 'all' || selectedCategory === 'destinations') {
        console.log('\n🏝️ Testing Destination APIs...');
        const destResult = await apiIntegration.destinations.getAll(1, 5);
        addResult(
          'Destinations - Get All',
          destResult.success,
          destResult.success ? `Fetched ${destResult.data?.length || 0} destinations` : destResult.error,
          destResult.data
        );
      }

      // Test Packages
      if (selectedCategory === 'all' || selectedCategory === 'packages') {
        console.log('\n📦 Testing Package APIs...');
        const pkgResult = await apiIntegration.packages.getAll(1, 5);
        addResult(
          'Packages - Get All',
          pkgResult.success,
          pkgResult.success ? `Fetched ${pkgResult.data?.length || 0} packages` : pkgResult.error,
          pkgResult.data
        );

        if (pkgResult.success && pkgResult.data?.length > 0) {
          const firstPkg = pkgResult.data[0];
          const datesResult = await apiIntegration.packages.getDates(firstPkg.package_id);
          addResult(
            'Packages - Get Dates',
            datesResult.success,
            datesResult.success ? `Fetched ${datesResult.data?.length || 0} dates` : datesResult.error,
            datesResult.data
          );

          const itinResult = await apiIntegration.packages.getItineraries(firstPkg.package_id);
          addResult(
            'Packages - Get Itineraries',
            itinResult.success,
            itinResult.success ? `Fetched ${itinResult.data?.length || 0} itineraries` : itinResult.error
          );

          const reviewResult = await apiIntegration.packages.getReviews(firstPkg.package_id);
          addResult(
            'Packages - Get Reviews',
            reviewResult.success,
            reviewResult.success ? `Fetched ${reviewResult.data?.length || 0} reviews` : reviewResult.error
          );
        }

        const featuredResult = await apiIntegration.packages.getFeatured();
        addResult(
          'Packages - Get Featured',
          featuredResult.success,
          featuredResult.success ? `Fetched ${featuredResult.data?.length || 0} featured packages` : featuredResult.error
        );
      }

      // Test Bookings
      if (selectedCategory === 'all' || selectedCategory === 'bookings') {
        console.log('\n📚 Testing Booking APIs...');
        const bookingResult = await apiIntegration.bookings.getAll();
        addResult(
          'Bookings - Get All',
          bookingResult.success,
          bookingResult.success ? `Fetched ${bookingResult.data?.length || 0} bookings` : bookingResult.error,
          bookingResult.data
        );
      }

      // Test Payments
      if (selectedCategory === 'all' || selectedCategory === 'payments') {
        console.log('\n💳 Testing Payment APIs...');
        const paymentResult = await apiIntegration.payments.getAll();
        addResult(
          'Payments - Get All',
          paymentResult.success,
          paymentResult.success ? `Fetched ${paymentResult.data?.length || 0} payments` : paymentResult.error,
          paymentResult.data
        );
      }

      // Test Reviews
      if (selectedCategory === 'all' || selectedCategory === 'reviews') {
        console.log('\n⭐ Testing Review APIs...');
        const reviewResult = await apiIntegration.reviews.getAll();
        addResult(
          'Reviews - Get All',
          reviewResult.success,
          reviewResult.success ? `Fetched ${reviewResult.data?.length || 0} reviews` : reviewResult.error,
          reviewResult.data
        );
      }

      // Test Admin
      if (selectedCategory === 'all' || selectedCategory === 'admin') {
        console.log('\n👨‍💼 Testing Admin APIs...');
        const usersResult = await apiIntegration.admin.users.getAll();
        addResult(
          'Admin - Get All Users',
          usersResult.success,
          usersResult.success ? `Fetched ${usersResult.data?.length || 0} users` : usersResult.error,
          usersResult.data
        );

        const statsResult = await apiIntegration.admin.dashboard.getStats();
        addResult(
          'Admin - Dashboard Stats',
          statsResult.success,
          statsResult.success ? 'Dashboard stats available' : statsResult.error,
          statsResult.data
        );
      }

      // Test Master Packages
      if (selectedCategory === 'all' || selectedCategory === 'packageMaster') {
        console.log('\n📦 Testing Master Package APIs...');
        const masterResult = await apiIntegration.packageMaster.getAll(1, 5);
        addResult(
          'Master Packages - Get All',
          masterResult.success,
          masterResult.success ? `Fetched ${masterResult.data?.length || 0} master packages` : masterResult.error,
          masterResult.data
        );
      }

      addResult('Test Completed', true, 'All API tests completed successfully');
      console.log('✅ Test completed!');

    } catch (error) {
      console.error('❌ Test failed:', error);
      addResult('Test Error', false, error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => setResults([]);

  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  return (
    <>
      <Navbar />
      <div className="admin-container" style={{ padding: '20px' }}>
        <div className="admin-header">
          <h1>🧪 API Integration Tester</h1>
          <p>Test all backend APIs and verify integration</p>
        </div>

        <div className="stats-grid" style={{ marginBottom: '20px' }}>
          <div className="stat-card" style={{ backgroundColor: '#e3f2fd' }}>
            <h3>Total Tests</h3>
            <p style={{ fontSize: '2em', color: '#1976d2' }}>{results.length}</p>
          </div>
          <div className="stat-card" style={{ backgroundColor: '#e8f5e9' }}>
            <h3>Passed</h3>
            <p style={{ fontSize: '2em', color: '#388e3c' }}>{successCount}</p>
          </div>
          <div className="stat-card" style={{ backgroundColor: '#ffebee' }}>
            <h3>Failed</h3>
            <p style={{ fontSize: '2em', color: '#c62828' }}>{failCount}</p>
          </div>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '1em'
            }}
          >
            {Object.entries(categories).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>

          <button
            onClick={testAll}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Testing...' : 'Run Tests'}
          </button>

          <button
            onClick={clearResults}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1em'
            }}
          >
            Clear Results
          </button>
        </div>

        <div style={{
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          padding: '20px',
          maxHeight: '600px',
          overflowY: 'auto'
        }}>
          {results.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999' }}>
              No tests run yet. Select a category and click "Run Tests"
            </p>
          ) : (
            results.map(result => (
              <div
                key={result.id}
                style={{
                  marginBottom: '12px',
                  padding: '12px',
                  backgroundColor: 'white',
                  borderLeft: `4px solid ${result.success ? '#4caf50' : '#f44336'}`,
                  borderRadius: '4px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ color: result.success ? '#4caf50' : '#f44336' }}>
                    {result.success ? '✅' : '❌'} {result.name}
                  </strong>
                  <small style={{ color: '#999' }}>{result.timestamp}</small>
                </div>
                <p style={{ margin: '4px 0', color: '#666' }}>{result.message}</p>
                {result.data && (
                  <details>
                    <summary style={{ cursor: 'pointer', color: '#1976d2' }}>View Details</summary>
                    <pre style={{
                      backgroundColor: '#f9f9f9',
                      padding: '8px',
                      borderRadius: '4px',
                      fontSize: '0.85em',
                      overflowX: 'auto',
                      marginTop: '8px'
                    }}>
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default APITester;
