const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'manager',
  database: 'Fin'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  
  console.log('Connected to database\n');
  
  // Query to get packages with available dates
  const query = `
    SELECT 
      p.package_id,
      p.name,
      p.price,
      p.duration_days,
      COUNT(pd.package_date_id) as available_dates,
      GROUP_CONCAT(CONCAT('ID:', pd.package_date_id, ' (', pd.start_date, ' to ', pd.end_date, ')') SEPARATOR ' | ') as dates
    FROM packages p
    LEFT JOIN package_dates pd ON p.package_id = pd.package_id
    GROUP BY p.package_id, p.name, p.price, p.duration_days
    HAVING available_dates > 0
    ORDER BY p.package_id
  `;
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      connection.end();
      return;
    }
    
    console.log('Packages with Available Dates for Booking:\n');
    console.log('=====================================\n');
    
    if (results.length === 0) {
      console.log('No packages with available dates found.');
    } else {
      results.forEach((pkg, index) => {
        console.log(`${index + 1}. Package ID: ${pkg.package_id}`);
        console.log(`   Name: ${pkg.name}`);
        console.log(`   Price: ₹${pkg.price}`);
        console.log(`   Duration: ${pkg.duration_days} days`);
        console.log(`   Available Dates: ${pkg.available_dates}`);
        console.log(`   Dates:\n     ${pkg.dates}\n`);
      });
    }
    
    connection.end();
  });
});
