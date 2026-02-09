const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'manager',
  database: 'Fin'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Connection Error:', err.message);
    process.exit(1);
  }

  console.log('\n✅ Connected to database\n');
  console.log('🔄 Generating dummy package dates...\n');

  // Helper function to add days to a date
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Helper function to format date
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Today's date (Feb 1, 2026)
  const today = new Date('2026-02-01');

  // Dummy data: Array of packages with their date ranges
  const dummyDates = [
    {
      package_id: 79,
      package_name: 'Goa Beach Paradise',
      dates: [
        { start_offset: 10, duration: 4, seats: 20 },
        { start_offset: 25, duration: 4, seats: 20 },
        { start_offset: 45, duration: 4, seats: 20 },
      ]
    },
    {
      package_id: 80,
      package_name: 'Kerala Backwaters Tour',
      dates: [
        { start_offset: 15, duration: 5, seats: 15 },
        { start_offset: 35, duration: 5, seats: 15 },
        { start_offset: 60, duration: 5, seats: 15 },
      ]
    },
    {
      package_id: 81,
      package_name: 'Rajasthan Royal Heritage',
      dates: [
        { start_offset: 8, duration: 6, seats: 25 },
        { start_offset: 30, duration: 6, seats: 25 },
        { start_offset: 55, duration: 6, seats: 25 },
      ]
    },
    {
      package_id: 82,
      package_name: 'Himalayan Adventure Trek',
      dates: [
        { start_offset: 20, duration: 7, seats: 12 },
        { start_offset: 50, duration: 7, seats: 12 },
        { start_offset: 75, duration: 7, seats: 12 },
      ]
    },
    {
      package_id: 83,
      package_name: 'Wardha Heritage & Ashram Tour',
      dates: [
        { start_offset: 4, duration: 3, seats: 20 },   // Feb 5 - Feb 8
        { start_offset: 42, duration: 3, seats: 20 },  // Mar 15 - Mar 17
        { start_offset: 68, duration: 3, seats: 20 },  // Apr 10 - Apr 12
      ]
    },
    {
      package_id: 85,
      package_name: 'Andaman Island Paradise',
      dates: [
        { start_offset: 12, duration: 5, seats: 18 },
        { start_offset: 38, duration: 5, seats: 18 },
        { start_offset: 70, duration: 5, seats: 18 },
      ]
    },
    {
      package_id: 86,
      package_name: 'Varanasi Spiritual Journey',
      dates: [
        { start_offset: 9, duration: 3, seats: 20 },
        { start_offset: 32, duration: 3, seats: 20 },
        { start_offset: 65, duration: 3, seats: 20 },
      ]
    },
    {
      package_id: 87,
      package_name: 'Kashmir Valley Dream',
      dates: [
        { start_offset: 18, duration: 5, seats: 16 },
        { start_offset: 48, duration: 5, seats: 16 },
        { start_offset: 78, duration: 5, seats: 16 },
      ]
    }
  ];

  let insertedCount = 0;
  let totalToInsert = 0;

  // Calculate total inserts
  dummyDates.forEach(pkg => {
    totalToInsert += pkg.dates.length;
  });

  console.log(`📦 Total packages to process: ${dummyDates.length}`);
  console.log(`📅 Total dates to insert: ${totalToInsert}\n`);

  // Insert all dates
  dummyDates.forEach((pkg, pkgIndex) => {
    pkg.dates.forEach((dateRange, dateIndex) => {
      const startDate = addDays(today, dateRange.start_offset);
      const endDate = addDays(startDate, dateRange.duration);

      const query = `
        INSERT INTO package_dates 
        (package_id, start_date, end_date, seats_total, seats_booked, is_active)
        VALUES (?, ?, ?, ?, 0, 1)
      `;

      const values = [
        pkg.package_id,
        formatDate(startDate),
        formatDate(endDate),
        dateRange.seats
      ];

      connection.query(query, values, (err, result) => {
        if (err) {
          console.error(`❌ Error inserting date for package ${pkg.package_id}:`, err.message);
        } else {
          insertedCount++;
          console.log(`✅ [${insertedCount}/${totalToInsert}] Package #${pkg.package_id} (${pkg.package_name})`);
          console.log(`   📅 ${formatDate(startDate)} to ${formatDate(endDate)} | ${dateRange.seats} seats`);
          console.log(`   Date ID: ${result.insertId}\n`);
        }

        // Close connection after all inserts are done
        if (insertedCount === totalToInsert) {
          setTimeout(() => {
            connection.end();
            console.log('\n' + '='.repeat(60));
            console.log('🎉 All dummy dates inserted successfully!');
            console.log('='.repeat(60));
            console.log(`\n📊 Summary:`);
            console.log(`   ✅ Packages: ${dummyDates.length}`);
            console.log(`   ✅ Total Dates Inserted: ${totalToInsert}`);
            console.log(`\n🔍 Packages with dates available for booking:\n`);
            
            dummyDates.forEach(pkg => {
              console.log(`   📦 Package #${pkg.package_id}: ${pkg.package_name}`);
              console.log(`      Available Dates: ${pkg.dates.length}`);
            });
            
            console.log(`\n💡 Next Steps:`);
            console.log(`   1. Reload the app`);
            console.log(`   2. Go to Packages tab`);
            console.log(`   3. All packages now show available dates`);
            console.log(`   4. Click any package to see and book available dates\n`);
            process.exit(0);
          }, 500);
        }
      });
    });
  });
});
