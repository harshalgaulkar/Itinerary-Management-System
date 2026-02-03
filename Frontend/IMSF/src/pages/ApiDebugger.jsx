import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const ApiDebugger = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (url) => {
    try {
      setLoading(true);
      setResponse('Testing: ' + url + '\n\nLoading...');
      
      const res = await fetch(url);
      const data = await res.json();
      
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>API Debugger</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <button onClick={() => testEndpoint('http://localhost:4000/packages')} style={{ marginRight: '10px' }}>
            Test /packages
          </button>
          <button onClick={() => testEndpoint('http://localhost:4000/api/packages')} style={{ marginRight: '10px' }}>
            Test /api/packages
          </button>
          <button onClick={() => testEndpoint('http://localhost:4000/bookings')} style={{ marginRight: '10px' }}>
            Test /bookings
          </button>
          <button onClick={() => testEndpoint('http://localhost:4000/users')} style={{ marginRight: '10px' }}>
            Test /users
          </button>
        </div>

        <textarea
          value={response}
          readOnly
          style={{
            width: '100%',
            height: '600px',
            fontFamily: 'monospace',
            fontSize: '12px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#f5f5f5'
          }}
        />
      </div>
    </div>
  );
};

export default ApiDebugger;
