#!/usr/bin/env node
const axios = require('axios');
const fs = require('fs');

// Determine API base URL: prefer TEST_API_URL env, then .env.local VITE_API_URL, then default
function getApiBase() {
  if (process.env.TEST_API_URL) return process.env.TEST_API_URL.replace(/"/g, '');
  try {
    const envLocal = fs.readFileSync('.env.local', 'utf8');
    const match = envLocal.match(/^VITE_API_URL=(.*)$/m);
    if (match && match[1]) return match[1].trim();
  } catch (e) {
    // ignore
  }
  return 'http://localhost:4000';
}

const API_BASE = getApiBase();
const URL = API_BASE.replace(/\/$/, '') + '/bookings';

const sampleBooking = {
  package_date_id: 1,
  persons: 2,
  total_price: 1000.0,
  contact_phone: '9999999999',
  notes: 'Test booking from script'
};

(async () => {
  console.log('➡ Sending test booking to', URL);
  try {
    const resp = await axios.post(URL, sampleBooking, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Response status:', resp.status);
    console.log('✅ Response data:', JSON.stringify(resp.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.error('❌ Server responded with status', err.response.status);
      console.error('❌ Response body:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('❌ Request error:', err.message);
    }
    process.exit(1);
  }
})();
