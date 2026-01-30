#!/usr/bin/env node

/**
 * Backend Connection Test Script
 * Test all critical endpoints to verify backend is properly configured
 */

const BASE_URL = 'http://10.64.205.48:4000';

// Mock token for testing (in real app, this comes from login)
const TEST_TOKEN = 'your_test_jwt_token_here';

const endpoints = [
  {
    name: 'Get Destinations',
    method: 'GET',
    url: '/destinations',
    requiresAuth: false,
  },
  {
    name: 'Get Package Master',
    method: 'GET',
    url: '/packageMaster',
    requiresAuth: true,
  },
  {
    name: 'Create Destination (requires auth)',
    method: 'POST',
    url: '/destinations/create',
    body: {
      name: 'Test Destination',
      country: 'India',
      description: 'Test Description',
    },
    requiresAuth: true,
  },
  {
    name: 'Create Package Master (requires auth)',
    method: 'POST',
    url: '/packageMaster/create',
    body: {
      title: 'Test Package',
      description: 'Test Package Description',
      duration_days: 5,
      base_price: 10000,
    },
    requiresAuth: true,
  },
];

async function testEndpoint(endpoint) {
  const url = `${BASE_URL}${endpoint.url}`;
  console.log(`\n📝 Testing: ${endpoint.name}`);
  console.log(`   ${endpoint.method} ${endpoint.url}`);

  try {
    const options = {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (endpoint.requiresAuth) {
      options.headers['Authorization'] = `Bearer ${TEST_TOKEN}`;
      console.log('   ⚠️  Requires authentication (using test token)');
    }

    if (endpoint.body) {
      options.body = JSON.stringify(endpoint.body);
    }

    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Content-Type: ${contentType || 'none'}`);

    if (isJson) {
      const data = await response.json();
      console.log(`   ✅ Response is JSON`);
      console.log(`   Status Field: ${data.status || 'not found'}`);
      console.log(`   Sample: ${JSON.stringify(data).substring(0, 100)}...`);

      if (response.ok && (data.status === 'success' || data.data)) {
        console.log('   ✅ PASS');
        return true;
      } else if (!response.ok && data.error) {
        if (endpoint.requiresAuth) {
          console.log('   ⚠️  EXPECTED (auth error - no valid token)');
          return true;
        }
        console.log(`   ❌ FAIL: ${data.error}`);
        return false;
      }
    } else {
      const text = await response.text();
      console.log(`   ❌ FAIL: Non-JSON response`);
      console.log(`   First 100 chars: ${text.substring(0, 100)}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ FAIL: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log('\n🌐 Backend Connection Test Suite');
  console.log(`📍 Target: ${BASE_URL}`);
  console.log('================================\n');

  let passed = 0;
  let failed = 0;

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    if (result) passed++;
    else failed++;
  }

  console.log('\n================================');
  console.log(`📊 Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('✅ All tests passed!');
  } else {
    console.log('❌ Some tests failed. Check endpoint configuration.');
  }
}

// Run tests
runAllTests().catch(console.error);
