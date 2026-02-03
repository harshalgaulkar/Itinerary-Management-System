/**
 * Backend Integration Tester
 * Test all endpoints and identify issues
 * 
 * Usage: 
 * 1. Import this file
 * 2. Call testAllEndpoints()
 * 3. Check console output
 */

import apiClient from './api';
import { extractArray, extractErrorMessage } from './responseParser';

const ENDPOINTS = {
  users: [
    { name: 'Get All Users', method: 'GET', path: '/admin/users' },
    { name: 'Get All Users (alt)', method: 'GET', path: '/users' },
  ],
  destinations: [
    { name: 'Get Destinations', method: 'GET', path: '/destinations' },
    { name: 'Get Destinations (admin)', method: 'GET', path: '/admin/destinations' },
  ],
  packages: [
    { name: 'Get Packages', method: 'GET', path: '/packages' },
    { name: 'Get Packages (admin)', method: 'GET', path: '/admin/packages' },
  ],
  bookings: [
    { name: 'Get Bookings', method: 'GET', path: '/bookings' },
    { name: 'Get Bookings (admin)', method: 'GET', path: '/admin/bookings' },
  ],
  payments: [
    { name: 'Get Payments', method: 'GET', path: '/payments' },
    { name: 'Get Payments (admin)', method: 'GET', path: '/admin/payments' },
  ],
};

class EndpointTester {
  constructor() {
    this.results = [];
    this.stats = {
      total: 0,
      success: 0,
      failed: 0,
    };
  }

  async testEndpoint(name, method, path, data = null) {
    this.stats.total++;

    try {
      console.log(`   📤 Testing: ${method} ${path}`);

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

      this.stats.success++;

      const result = {
        name,
        method,
        path,
        status: response.status,
        success: true,
        error: null,
        dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
        dataCount: Array.isArray(extractArray({ data: response.data })) ? 
          extractArray({ data: response.data }).length : null,
      };

      console.log(`   ✅ Success (${response.status})`);
      this.results.push(result);

      return result;
    } catch (err) {
      this.stats.failed++;

      const result = {
        name,
        method,
        path,
        status: err.response?.status,
        success: false,
        error: extractErrorMessage(err),
        errorCode: err.code,
      };

      console.log(`   ❌ Failed: ${result.error} (${result.status || result.errorCode})`);
      this.results.push(result);

      return result;
    }
  }

  async testAllEndpoints() {
    console.clear();
    console.log('🧪 BACKEND ENDPOINT TESTER\n');
    console.log('⏱️  Started at:', new Date().toLocaleTimeString());
    console.log('🌍 API Base URL:', process.env.VITE_API_URL || 'http://localhost:4000');
    console.log('\n' + '='.repeat(60) + '\n');

    for (const [category, endpoints] of Object.entries(ENDPOINTS)) {
      console.log(`\n📚 Testing ${category.toUpperCase()}`);
      console.log('-'.repeat(60));

      for (const endpoint of endpoints) {
        await this.testEndpoint(
          endpoint.name,
          endpoint.method,
          endpoint.path,
          endpoint.data
        );
      }
    }

    this.printSummary();
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 TEST SUMMARY\n');
    console.log(`Total Tests: ${this.stats.total}`);
    console.log(`✅ Success: ${this.stats.success}`);
    console.log(`❌ Failed: ${this.stats.failed}`);
    console.log(`Success Rate: ${Math.round((this.stats.success / this.stats.total) * 100)}%`);

    console.log('\n📋 DETAILED RESULTS\n');

    const successful = this.results.filter(r => r.success);
    const failed = this.results.filter(r => !r.success);

    if (successful.length > 0) {
      console.log('✅ WORKING ENDPOINTS:');
      successful.forEach(r => {
        console.log(`   ${r.method.padEnd(6)} ${r.path.padEnd(30)} [${r.status}]`);
      });
    }

    if (failed.length > 0) {
      console.log('\n❌ FAILED ENDPOINTS:');
      failed.forEach(r => {
        console.log(`   ${r.method.padEnd(6)} ${r.path.padEnd(30)} [${r.status || r.errorCode}]`);
        console.log(`        Error: ${r.error}`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('⏱️  Completed at:', new Date().toLocaleTimeString());
    console.log('\n');
  }

  testSpecificEndpoint(method, path) {
    return this.testEndpoint(`Test: ${path}`, method, path);
  }

  async testWithData(method, path, data) {
    return this.testEndpoint(`${method} ${path}`, method, path, data);
  }

  getResults() {
    return {
      results: this.results,
      stats: this.stats,
      successful: this.results.filter(r => r.success),
      failed: this.results.filter(r => !r.success),
    };
  }

  exportResults() {
    return JSON.stringify(this.getResults(), null, 2);
  }
}

/**
 * Quick test functions
 */

export const testAllEndpoints = async () => {
  const tester = new EndpointTester();
  await tester.testAllEndpoints();
  return tester.getResults();
};

export const testUserEndpoints = async () => {
  const tester = new EndpointTester();
  console.log('Testing User Endpoints...\n');
  
  for (const endpoint of ENDPOINTS.users) {
    await tester.testEndpoint(endpoint.name, endpoint.method, endpoint.path);
  }
  
  tester.printSummary();
  return tester.getResults();
};

export const testSpecificEndpoint = (method, path) => {
  const tester = new EndpointTester();
  return tester.testSpecificEndpoint(method, path);
};

/**
 * Usage Examples:
 * 
 * // Test all endpoints
 * import { testAllEndpoints } from '@/services/backendTester';
 * const results = await testAllEndpoints();
 * 
 * // Test specific endpoint
 * import { testSpecificEndpoint } from '@/services/backendTester';
 * await testSpecificEndpoint('GET', '/admin/users');
 * 
 * // Test user endpoints
 * import { testUserEndpoints } from '@/services/backendTester';
 * const results = await testUserEndpoints();
 */

export default EndpointTester;
