#!/usr/bin/env node

/**
 * Login Test Script - Test your credentials
 * Run this to verify your login will work in the app
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:4000';

async function testLogin(email, password) {
  try {
    console.log(`\n→ Testing login with: ${email}`);
    const response = await axios.post(`${API_BASE_URL}/users/signin`, {
      email,
      password
    }, { timeout: 5000 });

    if (response.data?.status === 'success') {
      console.log('✓ LOGIN SUCCESS!');
      console.log('  Token:', response.data.data?.token?.substring(0, 20) + '...');
      console.log('  User:', response.data.data?.name || response.data.data?.email);
      return true;
    } else {
      console.log('✗ Login failed');
      console.log('  Error:', response.data?.error);
      return false;
    }
  } catch (err) {
    console.log('✗ Error:', err.response?.data?.error || err.message);
    return false;
  }
}

async function testCredentials() {
  console.log('\n=== Login Test Suite ===');
  
  // Test credentials
  const testAccounts = [
    { email: 'gajanan@gmail.com', password: 'password123' },
    { email: 'gajanan@gmail.com', password: 'gajanan' },
    { email: 'gajanan@gmail.com', password: '123456' },
    // Add your test credentials here
  ];

  let successCount = 0;
  for (const account of testAccounts) {
    const result = await testLogin(account.email, account.password);
    if (result) successCount++;
  }

  console.log(`\n=== Results ===`);
  console.log(`Successful logins: ${successCount}/${testAccounts.length}`);
  
  if (successCount === 0) {
    console.log('\n⚠️  No valid credentials found.');
    console.log('Options:');
    console.log('1. Update the email/password in this script and try again');
    console.log('2. Register a new account in the app');
    console.log('3. Reset the password in your database');
  } else {
    console.log('\n✓ You have valid credentials! App login should work now.');
  }
}

testCredentials().catch(console.error);
