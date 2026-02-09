#!/usr/bin/env node

/**
 * Database Check Script - See what users exist
 * This helps you find valid credentials
 */

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Update if you have a password
  database: 'ims' // Change to your database name
});

connection.connect((err) => {
  if (err) {
    console.log('\n✗ Database connection error:');
    console.log('  ' + err.message);
    console.log('\nCheck:');
    console.log('  1. MySQL is running');
    console.log('  2. Database name is correct (currently looking for "ims")');
    console.log('  3. Username/password are correct');
    console.log('  4. Update this script with your credentials');
    process.exit(1);
  }

  console.log('\n=== Users in Database ===\n');

  connection.query('SELECT user_id, email, fname, lname FROM users LIMIT 20', (err, results) => {
    if (err) {
      console.log('✗ Query error:', err.message);
      console.log('\nMake sure your database has a "users" table with columns: user_id, email, fname, lname');
      process.exit(1);
    }

    if (results.length === 0) {
      console.log('No users found in database');
      console.log('\nTo register a user:');
      console.log('1. Open app in browser: http://localhost:8081');
      console.log('2. Click "Sign Up"');
      console.log('3. Fill in the form and register');
      console.log('4. Run this script again to see the new user');
    } else {
      console.log(`Found ${results.length} user(s):\n`);
      results.forEach((user, idx) => {
        console.log(`${idx + 1}. ${user.email}`);
        console.log(`   Name: ${user.fname} ${user.lname}`);
        console.log(`   ID: ${user.user_id}\n`);
      });
      console.log('Note: Passwords are hashed, so we can\'t see them.');
      console.log('To set a known password, register a new account in the app.');
    }

    connection.end();
  });
});
