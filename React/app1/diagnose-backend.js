#!/usr/bin/env node

/**
 * Backend Connection Diagnostic Tool
 * This script tests if your backend is accessible and what response it gives
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:4000';

async function testBackendConnection() {
  console.log('\n=== IMS Backend Connection Diagnostic ===\n');

  // Test 1: Basic connectivity
  console.log('Test 1: Checking backend connectivity...');
  try {
    const response = await axios.get(API_BASE_URL, { timeout: 5000 });
    console.log('✓ Backend is responding');
    console.log('  Response status:', response.status);
    console.log('  Response data:', response.data);
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.log('✗ BACKEND NOT RUNNING');
      console.log('  Error: Connection refused on port 4000');
      console.log('\n  Action: Start your backend server:');
      console.log('  $ cd d:\\IMS\\IMSBackend (or your backend directory)');
      console.log('  $ npm start');
      return;
    }
    console.log('✗ Backend error:', err.message);
  }

  // Test 2: Test signin endpoint
  console.log('\nTest 2: Testing /users/signin endpoint...');
  try {
    const response = await axios.post(`${API_BASE_URL}/users/signin`, {
      email: 'test@example.com',
      password: 'test123'
    }, { timeout: 5000 });
    console.log('✓ Endpoint is accessible');
    console.log('  Response status:', response.status);
    console.log('  Response format:', JSON.stringify(response.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.log('✓ Endpoint exists (received error response)');
      console.log('  Status:', err.response.status);
      console.log('  Response:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.log('✗ Could not reach endpoint');
      console.log('  Error:', err.message);
    }
  }

  // Test 3: Test with your credentials
  console.log('\nTest 3: Testing with credentials (gajanan@gmail.com)...');
  try {
    const response = await axios.post(`${API_BASE_URL}/users/signin`, {
      email: 'gajanan@gmail.com',
      password: 'your_password_here'
    }, { timeout: 5000 });
    console.log('✓ Login successful!');
    console.log('  Response:', JSON.stringify(response.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.log('✗ Login failed');
      console.log('  Status:', err.response.status);
      console.log('  Response:', JSON.stringify(err.response.data, null, 2));
      console.log('\n  Possible reasons:');
      console.log('  - User does not exist in database');
      console.log('  - Password is incorrect');
      console.log('  - Backend validation issue');
    } else {
      console.log('✗ Could not reach endpoint');
      console.log('  Error:', err.message);
    }
  }

  console.log('\n=== Diagnostic Complete ===\n');
}

testBackendConnection().catch(console.error);
