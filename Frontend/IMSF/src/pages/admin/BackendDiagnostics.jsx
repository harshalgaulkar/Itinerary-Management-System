import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import apiClient from '../../services/api';
import '../../styles/AdminManage.css';

const BackendDiagnostics = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const endpoints = [
    { name: 'Create User', method: 'POST', url: '/admin/signup/user', data: { email: 'test@test.com' } },
    { name: 'Get All Users - v1', method: 'GET', url: '/admin/users' },
    { name: 'Get All Users - v2', method: 'GET', url: '/admin/signup/users' },
    { name: 'Get All Users - v3', method: 'GET', url: '/users' },
    { name: 'Get All Users - v4', method: 'GET', url: '/admin/all-users' },
    { name: 'Get All Users - v5', method: 'GET', url: '/api/admin/users' },
  ];

  const testEndpoints = async () => {
    setLoading(true);
    setResults([]);

    for (const endpoint of endpoints) {
      try {
        let response;
        if (endpoint.method === 'GET') {
          response = await apiClient.get(endpoint.url);
        } else {
          response = await apiClient.post(endpoint.url, endpoint.data);
        }

        setResults(prev => [...prev, {
          endpoint: endpoint.name,
          url: endpoint.url,
          status: response.status,
          statusText: response.statusText,
          dataKeys: Object.keys(response.data || {}),
          dataLength: response.data ? Object.keys(response.data).length : 0,
          isArray: Array.isArray(response.data),
          result: '✓ SUCCESS',
          color: 'green',
        }]);
      } catch (err) {
        setResults(prev => [...prev, {
          endpoint: endpoint.name,
          url: endpoint.url,
          status: err.response?.status || 'No Response',
          statusText: err.response?.statusText || err.message,
          error: err.message,
          result: '✗ FAILED',
          color: 'red',
        }]);
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <div className="admin-manage">
        <div className="manage-header">
          <h1>Backend Endpoint Diagnostics</h1>
          <button 
            className="btn btn-primary"
            onClick={testEndpoints}
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test All Endpoints'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="table-container">
            <table className="manage-table" style={{ marginTop: '20px' }}>
              <thead>
                <tr>
                  <th>Endpoint</th>
                  <th>URL</th>
                  <th>Status</th>
                  <th>Result</th>
                  <th>Data Keys</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, idx) => (
                  <tr key={idx} style={{ backgroundColor: result.color === 'green' ? '#d4edda' : '#f8d7da' }}>
                    <td><strong>{result.endpoint}</strong></td>
                    <td><code>{result.url}</code></td>
                    <td>{result.status} {result.statusText}</td>
                    <td><strong style={{ color: result.color }}>{result.result}</strong></td>
                    <td>
                      {result.dataKeys ? (
                        <div>
                          <div>Keys: {result.dataKeys.join(', ') || 'none'}</div>
                          {result.isArray && <div style={{ color: 'blue' }}>✓ Returns Array</div>}
                        </div>
                      ) : (
                        result.error
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
              <h3>Results Summary:</h3>
              <ul>
                {results.filter(r => r.result === '✓ SUCCESS').map((r, idx) => (
                  <li key={idx} style={{ color: 'green' }}>
                    ✓ <strong>{r.endpoint}</strong> works: {r.url}
                    {r.isArray && ' (Returns Array)'}
                  </li>
                ))}
              </ul>

              <h4 style={{ marginTop: '15px' }}>Failed Endpoints:</h4>
              <ul>
                {results.filter(r => r.result === '✗ FAILED').map((r, idx) => (
                  <li key={idx} style={{ color: 'red' }}>
                    ✗ {r.endpoint}: {r.status}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {!loading && results.length === 0 && (
          <div style={{ padding: '30px', textAlign: 'center' }}>
            <p>Click "Test All Endpoints" to check which endpoints are available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackendDiagnostics;
