const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'manager',
  database: 'Fin'
});

connection.connect((err) => {
  if (err) {
    console.error('Connection error:', err.message);
    process.exit(1);
  }
  
  console.log('\n========== PACKAGES WITH AVAILABLE DATES ==========\n');
  
  const query = `
    SELECT 
      p.package_id,
      p.name,
      p.price,
      p.duration_days,
      COUNT(pd.package_date_id) as date_count
    FROM packages p
    LEFT JOIN package_dates pd ON p.package_id = pd.package_id
    GROUP BY p.package_id
    HAVING date_count > 0
    ORDER BY p.package_id
  `;
  
  connection.query(query, (err, results) => {
    connection.end();
    
    if (err) {
      console.error('Query error:', err.message);
      process.exit(1);
    }
    
    if (results.length === 0) {
      console.log('No packages with available dates found.\n');
      process.exit(0);
    }
    
    results.forEach((pkg) => {
      console.log(`📦 Package #${pkg.package_id}: ${pkg.name}`);
      console.log(`   Price: ₹${pkg.price}`);
      console.log(`   Duration: ${pkg.duration_days} days`);
      console.log(`   Available Dates: ${pkg.date_count}`);
      console.log();
    });
    
    console.log(`\n✓ Total packages with available dates: ${results.length}\n`);
    process.exit(0);
  });
});
