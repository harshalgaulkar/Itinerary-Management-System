import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const BookingTester = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState('');
  const [loading, setLoading] = useState(false);

  const testBookingAPI = async () => {
    try {
      setLoading(true);
      let output = '';

      output += '='.repeat(70) + '\n';
      output += 'BOOKING API TEST\n';
      output += '='.repeat(70) + '\n\n';

      // Check authentication
      output += '1️⃣ Checking Authentication\n';
      output += `User ID: ${user?.user_id}\n`;
      output += `Auth Token: ${localStorage.getItem('authToken') ? '✓ Present' : '❌ Missing'}\n\n`;

      if (!user?.user_id) {
        output += '❌ Not authenticated! Please login first.\n';
        setTestResults(output);
        return;
      }

      // Test 1: Create a booking
      output += '2️⃣ Testing Booking Creation\n';
      output += 'Endpoint: POST /bookings\n\n';

      const bookingData = {
        package_id: 1,
        user_id: user.user_id,
        number_of_seats: 2,
        travel_date: '2026-02-15',
        special_requests: 'Test booking from API tester',
        booking_date: new Date().toISOString().split('T')[0],
        booking_status: 'pending',
      };

      output += 'Request Payload:\n';
      output += JSON.stringify(bookingData, null, 2) + '\n\n';

      try {
        const response = await fetch('http://localhost:4000/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify(bookingData),
        });

        output += `Response Status: ${response.status}\n`;

        const data = await response.json();
        output += 'Response Body:\n';
        output += JSON.stringify(data, null, 2) + '\n\n';

        if (response.ok && data?.data?.booking_id) {
          output += `✓ ✓ BOOKING CREATED SUCCESSFULLY!\n`;
          output += `Booking ID: ${data.data.booking_id}\n\n`;

          // Test 2: Verify booking was saved
          output += '3️⃣ Verifying Booking (Fetching user bookings)\n';
          output += 'Endpoint: GET /bookings/user/:userId\n\n';

          try {
            const fetchResponse = await fetch(`http://localhost:4000/bookings/user/${user.user_id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
              },
            });

            output += `Response Status: ${fetchResponse.status}\n`;
            const fetchData = await fetchResponse.json();
            output += 'Response Body:\n';
            output += JSON.stringify(fetchData, null, 2) + '\n\n';

            if (fetchResponse.ok) {
              const bookings = fetchData?.data?.data || fetchData?.data || [];
              output += `✓ Found ${Array.isArray(bookings) ? bookings.length : 0} bookings for user\n`;
            }
          } catch (fetchErr) {
            output += `❌ Error verifying booking: ${fetchErr.message}\n`;
          }
        } else {
          output += `❌ BOOKING CREATION FAILED!\n`;
          output += `Error: ${data?.error || data?.message || 'Unknown error'}\n\n`;
        }
      } catch (bookingErr) {
        output += `❌ API Request Failed: ${bookingErr.message}\n`;
        output += 'This might indicate the backend is not running or the endpoint is unreachable.\n';
      }

      output += '\n' + '='.repeat(70) + '\n';
      output += '📝 Instructions:\n';
      output += '1. Open Browser Console (F12)\n';
      output += '2. Check for any error messages\n';
      output += '3. Verify the booking was created in your database\n';
      output += '4. Check if the response shows booking_id\n';
      output += '='.repeat(70) + '\n';

      setTestResults(output);
    } catch (err) {
      setTestResults(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.user_id) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '4px', border: '1px solid #ffc107' }}>
            <h3>⚠️ Please Login First</h3>
            <p>You need to be logged in to test the booking API.</p>
            <a href="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
              Go to Login →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>📝 Booking API Tester</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          This tool tests if bookings are properly created and saved in the backend database.
        </p>

        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={testBookingAPI}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            {loading ? 'Testing...' : '▶️ Run Booking Test'}
          </button>
        </div>

        {testResults && (
          <div style={{
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '15px',
            fontFamily: 'monospace',
            fontSize: '12px',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            maxHeight: '800px',
            overflowY: 'auto',
            color: '#333',
            lineHeight: '1.6',
          }}>
            {testResults}
          </div>
        )}

        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e7f3ff', borderRadius: '4px', border: '1px solid #b3d9ff' }}>
          <h3>🔍 What This Test Does:</h3>
          <ul>
            <li>Creates a test booking via the backend API</li>
            <li>Verifies the booking is saved in the database</li>
            <li>Shows the exact request and response</li>
            <li>Helps identify issues with the booking system</li>
          </ul>

          <h3 style={{ marginTop: '20px' }}>⚠️ Common Issues:</h3>
          <ul>
            <li><strong>Token is Missing:</strong> The backend requires authentication. Make sure you're logged in.</li>
            <li><strong>Connection refused:</strong> Backend server might not be running on port 4000</li>
            <li><strong>Field name errors:</strong> Check that the backend expects the field names being sent</li>
            <li><strong>No booking_id in response:</strong> Backend might not be returning the created booking ID</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingTester;
