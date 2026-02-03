import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const ResponseStructureDebugger = () => {
  const { user } = useAuth();
  const [results, setResults] = useState('');
  const [loading, setLoading] = useState(false);

  const testBookingResponse = async () => {
    try {
      setLoading(true);
      let output = 'BOOKING RESPONSE STRUCTURE DEBUGGER\n';
      output += '='.repeat(70) + '\n\n';

      if (!user?.user_id) {
        output += '❌ Please login first!\n';
        setResults(output);
        return;
      }

      output += `User ID: ${user.user_id}\n`;
      output += `Auth Token: ${localStorage.getItem('authToken') ? '✓' : '❌'}\n\n`;

      // Create a test booking
      output += 'Creating test booking...\n\n';

      const bookingData = {
        package_id: 1,
        user_id: user.user_id,
        number_of_seats: 1,
        travel_date: '2026-02-20',
        special_requests: 'Debug test',
        booking_date: new Date().toISOString().split('T')[0],
        booking_status: 'pending',
      };

      const response = await fetch('http://localhost:4000/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(bookingData),
      });

      output += `HTTP Status: ${response.status}\n`;
      output += `Status Text: ${response.statusText}\n\n`;

      const data = await response.json();

      output += 'FULL RESPONSE OBJECT:\n';
      output += JSON.stringify(data, null, 2) + '\n\n';

      // Analyze structure
      output += 'STRUCTURE ANALYSIS:\n';
      output += '='.repeat(70) + '\n';

      // Check top level
      if (data?.status) output += `✓ data.status = "${data.status}"\n`;
      if (data?.error) output += `✓ data.error = "${data.error}"\n`;
      if (data?.message) output += `✓ data.message = "${data.message}"\n`;
      if (data?.data) {
        output += `✓ data.data exists (type: ${typeof data.data})\n`;

        if (typeof data.data === 'object') {
          output += `  Keys in data.data: ${Object.keys(data.data).join(', ')}\n`;

          // Check for booking_id at various levels
          if (data.data.booking_id) output += `  ✓ data.data.booking_id = ${data.data.booking_id}\n`;
          if (data.data.id) output += `  ✓ data.data.id = ${data.data.id}\n`;
          
          // Check if data.data itself contains more nested data
          if (data.data.data) {
            output += `  ✓ data.data.data exists\n`;
            output += `    Keys in data.data.data: ${Object.keys(data.data.data).join(', ')}\n`;
            if (data.data.data.booking_id) output += `    ✓ data.data.data.booking_id = ${data.data.data.booking_id}\n`;
          }
        }
      }

      output += '\n' + '='.repeat(70) + '\n';
      output += 'EXPECTED FRONTEND PATH:\n';

      // Suggest where to find the ID
      let foundPath = null;
      if (data?.data?.booking_id) {
        foundPath = 'response.data.booking_id';
      } else if (data?.data?.id) {
        foundPath = 'response.data.id';
      } else if (data?.data?.data?.booking_id) {
        foundPath = 'response.data.data.booking_id';
      } else if (data?.data?.data?.id) {
        foundPath = 'response.data.data.id';
      }

      if (foundPath) {
        output += `Use this path: ${foundPath}\n`;
        output += `Code: bookingResponse?.${foundPath.replace('response.', '')}\n`;
      } else {
        output += '❌ Could not find booking_id or id in response!\n';
        output += 'Check console for full response object\n';
      }

      setResults(output);
    } catch (err) {
      setResults(`Error: ${err.message}\n\nMake sure:\n1. Backend is running\n2. You are logged in\n3. Token is valid`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>🔍 Response Structure Debugger</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          This tool shows exactly how the backend formats booking responses.
          Use this to find where the booking_id is located in the response.
        </p>

        <button
          onClick={testBookingResponse}
          disabled={loading || !user?.user_id}
          style={{
            padding: '12px 24px',
            backgroundColor: user?.user_id ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : (user?.user_id ? 'pointer' : 'not-allowed'),
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '20px',
          }}
        >
          {loading ? 'Testing...' : '▶️ Test Booking Response'}
        </button>

        {!user?.user_id && (
          <div style={{
            padding: '15px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            ⚠️ Please <a href="/login" style={{ color: '#007bff' }}>login first</a>
          </div>
        )}

        {results && (
          <div style={{
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '15px',
            fontFamily: 'monospace',
            fontSize: '13px',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            maxHeight: '800px',
            overflowY: 'auto',
            color: '#333',
            lineHeight: '1.6',
          }}>
            {results}
          </div>
        )}

        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
          <h3>What This Does:</h3>
          <ol>
            <li>Creates a real booking on the backend</li>
            <li>Captures the exact response structure</li>
            <li>Analyzes where booking_id is located</li>
            <li>Suggests the correct path for frontend code</li>
          </ol>

          <h3 style={{ marginTop: '20px' }}>How to Fix:</h3>
          <p>Once you see where booking_id is located, update the frontend code path accordingly.</p>
          <p>For example, if it shows: <code>data.data.booking_id</code></p>
          <p>Then use: <code>bookingResponse?.data?.data?.booking_id</code></p>
        </div>
      </div>
    </div>
  );
};

export default ResponseStructureDebugger;
