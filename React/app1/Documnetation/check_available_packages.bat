@echo off
REM Query to check packages with available dates

echo.
echo ============== PACKAGES WITH AVAILABLE DATES ==============
echo.

mysql -u root -pmanager -h 127.0.0.1 Fin -e "SELECT p.package_id, p.name, p.price, p.duration_days, COUNT(pd.package_date_id) as date_count FROM packages p LEFT JOIN package_dates pd ON p.package_id = pd.package_id GROUP BY p.package_id, p.name, p.price, p.duration_days HAVING date_count > 0 ORDER BY p.package_id;"

echo.
echo ============== DETAILED DATE INFO ==============
echo.

mysql -u root -pmanager -h 127.0.0.1 Fin -e "SELECT p.package_id, p.name, pd.package_date_id, pd.start_date, pd.end_date FROM packages p LEFT JOIN package_dates pd ON p.package_id = pd.package_id WHERE pd.package_date_id IS NOT NULL ORDER BY p.package_id, pd.start_date;"

echo.
echo Done!
