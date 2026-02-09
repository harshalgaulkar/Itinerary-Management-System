#!/bin/bash

echo "Checking packages with available dates..."
echo ""

mysql -u root -pmanager -h localhost << 'SQL'
USE Fin;
SELECT 
  p.package_id,
  p.name,
  p.price,
  COUNT(pd.package_date_id) as available_dates
FROM packages p
LEFT JOIN package_dates pd ON p.package_id = pd.package_id
WHERE pd.package_date_id IS NOT NULL
GROUP BY p.package_id, p.name, p.price
ORDER BY p.package_id;
SQL

echo ""
echo "Done!"
