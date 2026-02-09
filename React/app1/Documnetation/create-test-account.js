#!/usr/bin/env node

/**
 * Create Test Account
 * This will create a new account you can use to test the app
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:4000';

async function createTestAccount() {
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'Test@123',
    phone: '9876543210'
  };

  try {
    console.log('\n=== Creating Test Account ===\n');
    console.log('Registering user...');
    console.log(`Email: ${testUser.email}`);
    console.log(`Password: ${testUser.password}`);
    console.log(`Name: ${testUser.firstName} ${testUser.lastName}\n`);

    const response = await axios.post(`${API_BASE_URL}/users/signup`, testUser, { 
      timeout: 5000,
      validateStatus: () => true // Accept any status
    });

    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    if (response.data?.status === 'success') {
      console.log('\n✓ Account created successfully!');
      console.log('\nNow you can login with:');
      console.log(`  Email: ${testUser.email}`);
      console.log(`  Password: ${testUser.password}`);
      console.log('\nTest it with:');
      console.log('  node test-login.js');
      return true;
    } else {
      console.log('\n✗ Account creation failed');
      if (response.data?.error === 'Email already exists') {
        console.log('\nEmail already exists. Try login with:');
        console.log(`  node test-login-custom.js`);
        console.log('\nThen edit test-login-custom.js with your email/password');
      }
      return false;
    }
  } catch (err) {
    console.log('✗ Error:', err.message);
    return false;
  }
}

createTestAccount();
