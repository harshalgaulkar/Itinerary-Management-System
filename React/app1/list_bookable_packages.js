const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'manager',
  database: 'Fin'
});

connection.connect((err) => {
  if (err) {
    console.error('DB Error:', err.message);
    process.exit(1);
  }

  // Query 1: Summary of packages with available dates
  const query1 = `
    SELECT 
      p.package_id,
      p.name,
      p.price,
      p.duration_days,
      COUNT(pd.package_date_id) as available_dates
    FROM packages p
    LEFT JOIN package_dates pd ON p.package_id = pd.package_id
    GROUP BY p.package_id
    HAVING available_dates > 0
    ORDER BY p.package_id
  `;

  connection.query(query1, (err, results) => {
    if (err) {
      console.error('Error:', err.message);
      connection.end();
      process.exit(1);
    }

    console.log('\n📦 PACKAGES WITH AVAILABLE BOOKING DATES:\n');
    console.log('ID  | Name                           | Price   | Duration | Dates');
    console.log('----+--------------------------------+---------+----------+-------');

    results.forEach(pkg => {
      const name = pkg.name.substring(0, 30).padEnd(30);
      console.log(`${String(pkg.package_id).padEnd(3)} | ${name} | ₹${String(pkg.price).padEnd(7)} | ${pkg.duration_days}d       | ${pkg.available_dates}`);
    });

    console.log('\n');
    console.log(`Total Packages with Available Dates: ${results.length}\n`);

    // Query 2: Detailed date information
    const query2 = `
      SELECT 
        p.package_id,
        p.name,
        pd.package_date_id,
        DATE_FORMAT(pd.start_date, '%Y-%m-%d') as start_date,
        DATE_FORMAT(pd.end_date, '%Y-%m-%d') as end_date,
        pd.seats_total,
        pd.seats_booked,
        (pd.seats_total - pd.seats_booked) as available_seats
      FROM packages p
      LEFT JOIN package_dates pd ON p.package_id = pd.package_id
      WHERE pd.package_date_id IS NOT NULL
      ORDER BY p.package_id, pd.start_date
    `;

    connection.query(query2, (err, dates) => {
      connection.end();

      if (err) {
        console.error('Error:', err.message);
        process.exit(1);
      }

      console.log('📅 DETAILED BOOKING DATES:\n');
      
      let currentPackage = null;
      dates.forEach(date => {
        if (date.package_id !== currentPackage) {
          currentPackage = date.package_id;
          console.log(`\n📌 Package #${date.package_id}: ${date.name}`);
          console.log('   Date ID | Start Date  | End Date    | Total Seats | Booked | Available');
          console.log('   --------|-------------|-------------|-------------|--------|----------');
        }
        console.log(`   ${String(date.package_date_id).padEnd(7)} | ${date.start_date} | ${date.end_date} | ${String(date.seats_total).padEnd(11)} | ${String(date.seats_booked).padEnd(6)} | ${date.available_seats}`);
      });

      console.log('\n✅ Query Complete!\n');
      process.exit(0);
    });
  });
});
