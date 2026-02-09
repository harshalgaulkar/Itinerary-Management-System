const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'manager',
  database: 'Fin'
});

connection.connect((err) => {
  if (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }

  const query = `
    SELECT 
      p.package_id,
      p.name,
      p.price,
      COUNT(pd.package_date_id) as available_dates
    FROM packages p
    LEFT JOIN package_dates pd ON p.package_id = pd.package_id
    WHERE p.package_id IN (79, 80, 81, 82, 83, 85, 86, 87)
    GROUP BY p.package_id, p.name, p.price
    ORDER BY p.package_id
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error:', err.message);
      connection.end();
      process.exit(1);
    }

    console.log('\n✅ DUMMY DATA VERIFICATION\n');
    console.log('ID  | Package Name                   | Price   | Dates');
    console.log('----+--------------------------------+---------+-------');

    results.forEach(pkg => {
      const name = (pkg.name || 'N/A').substring(0, 30).padEnd(30);
      console.log(`${String(pkg.package_id).padEnd(3)} | ${name} | ₹${String(pkg.price).padEnd(7)} | ${pkg.available_dates}`);
    });

    // Get detailed dates
    const detailQuery = `
      SELECT 
        p.package_id,
        p.name,
        pd.package_date_id,
        pd.start_date,
        pd.end_date,
        pd.seats_total,
        pd.seats_booked
      FROM packages p
      LEFT JOIN package_dates pd ON p.package_id = pd.package_id
      WHERE p.package_id IN (79, 80, 81, 82, 83, 85, 86, 87)
        AND pd.package_date_id IS NOT NULL
      ORDER BY p.package_id, pd.start_date
    `;

    connection.query(detailQuery, (err, dates) => {
      connection.end();

      if (err) {
        console.error('Error:', err.message);
        process.exit(1);
      }

      console.log('\n\n📅 DETAILED BOOKING DATES:\n');
      let currentPkg = null;

      dates.forEach(date => {
        if (date.package_id !== currentPkg) {
          currentPkg = date.package_id;
          console.log(`\n📦 Package #${date.package_id}: ${date.name}`);
        }
        console.log(`   📌 ${date.start_date} → ${date.end_date} | ${date.seats_total} seats | Date ID: ${date.package_date_id}`);
      });

      console.log('\n✅ Total dates inserted: ' + dates.length);
      console.log('\n🎉 Ready to use in the app!\n');
      process.exit(0);
    });
  });
});
