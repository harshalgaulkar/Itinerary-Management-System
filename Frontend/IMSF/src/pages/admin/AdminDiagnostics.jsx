import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import apiClient from '../../services/api';

/**
 * Admin Diagnostic Page
 * Test all endpoints and show detailed debug information
 */
const AdminDiagnostics = () => {
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const testEndpoint = async (name, method, path, data = null) => {
    try {
      console.log(`[Test] ${method} ${path}`);
      let response;

      if (method === 'GET') {
        response = await apiClient.get(path);
      } else if (method === 'POST') {
        response = await apiClient.post(path, data);
      } else if (method === 'PUT') {
        response = await apiClient.put(path, data);
      } else if (method === 'DELETE') {
        response = await apiClient.delete(path);
      }

      return {
        name,
        method,
        path,
        status: response.status,
        success: true,
        data: response.data,
        error: null,
      };
    } catch (err) {
      return {
        name,
        method,
        path,
        status: err.response?.status,
        success: false,
        data: err.response?.data,
        error: err.message,
      };
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    const testResults = [];

    // User endpoints
    testResults.push(await testEndpoint('Get Users', 'GET', '/admin/users'));
    testResults.push(await testEndpoint('Get Users (alt)', 'GET', '/users'));

    // Destination endpoints
    testResults.push(await testEndpoint('Get Destinations', 'GET', '/destinations'));
    testResults.push(await testEndpoint('Get Destinations (admin)', 'GET', '/admin/destinations'));

    // Package endpoints
    testResults.push(await testEndpoint('Get Packages', 'GET', '/packages'));
    testResults.push(await testEndpoint('Get Packages (admin)', 'GET', '/admin/packages'));

    // Booking endpoints
    testResults.push(await testEndpoint('Get Bookings', 'GET', '/bookings'));
    testResults.push(await testEndpoint('Get Admin Bookings', 'GET', '/admin/bookings'));

    setResults(testResults);
    setTesting(false);
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Admin Diagnostics</h1>
        <p>Test all backend endpoints to identify issues</p>

        <button
          onClick={runAllTests}
          disabled={testing}
          style={{
            padding: '10px 20px',
            marginBottom: '20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: testing ? 'not-allowed' : 'pointer',
          }}
        >
          {testing ? 'Testing...' : 'Run All Tests'}
        </button>

        {results.length > 0 && (
          <div>
            <h2>Test Results</h2>
            {results.map((result, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '10px',
                  marginBottom: '10px',
                  backgroundColor: result.success ? '#f0f0f0' : '#ffcccc',
                }}
              >
                <h3>
                  {result.success ? '✅' : '❌'} {result.name}
                </h3>
                <p>
                  <strong>Endpoint:</strong> {result.method} {result.path}
                </p>
                <p>
                  <strong>Status:</strong> {result.status || 'No response'}
                </p>
                {result.error && (
                  <p>
                    <strong>Error:</strong> {result.error}
                  </p>
                )}
                {result.data && (
                  <details>
                    <summary>Response Data</summary>
                    <pre style={{ overflow: 'auto', maxHeight: '200px' }}>
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDiagnostics;
