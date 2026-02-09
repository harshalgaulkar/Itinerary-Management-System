-- Package Dates Query Reference Guide
-- Use these queries to verify and test the inserted data

-- ============================================
-- 1. OVERVIEW QUERIES
-- ============================================

-- Count total package dates
SELECT COUNT(*) as total_dates FROM package_dates;

-- View all packages with date counts
SELECT p.package_id, p.title, COUNT(pd.package_date_id) as dates_count
FROM packages p 
LEFT JOIN package_dates pd ON p.package_id = pd.package_id 
GROUP BY p.package_id, p.title 
ORDER BY p.package_id;

-- Packages with most available dates
SELECT p.package_id, p.title, COUNT(pd.package_date_id) as dates_count
FROM packages p
LEFT JOIN package_dates pd ON p.package_id = pd.package_id
GROUP BY p.package_id, p.title
ORDER BY dates_count DESC LIMIT 10;

-- ============================================
-- 2. SPECIFIC PACKAGE QUERIES
-- ============================================

-- View all dates for Package 1 (Manali Adventure)
SELECT package_id, start_date, end_date, seats_total, seats_booked, 
       (seats_total - seats_booked) as available_seats, is_active
FROM package_dates
WHERE package_id = 1
ORDER BY start_date;

-- View all dates for Package 83 (Wardha Heritage)
SELECT package_id, start_date, end_date, seats_total, seats_booked,
       (seats_total - seats_booked) as available_seats, is_active
FROM package_dates
WHERE package_id = 83
ORDER BY start_date;

-- ============================================
-- 3. DATE RANGE QUERIES
-- ============================================

-- Available packages for February 2026
SELECT DISTINCT p.package_id, p.title, pd.start_date, pd.end_date
FROM packages p
JOIN package_dates pd ON p.package_id = pd.package_id
WHERE pd.start_date >= '2026-02-01' AND pd.start_date <= '2026-02-28'
ORDER BY pd.start_date, p.title;

-- Available packages for March 2026
SELECT DISTINCT p.package_id, p.title, COUNT(*) as march_dates
FROM packages p
JOIN package_dates pd ON p.package_id = pd.package_id
WHERE MONTH(pd.start_date) = 3 AND YEAR(pd.start_date) = 2026
GROUP BY p.package_id, p.title
ORDER BY march_dates DESC;

-- Upcoming dates in the next 30 days (from today: 2026-02-01)
SELECT p.package_id, p.title, pd.start_date, pd.end_date, pd.seats_total, pd.seats_booked
FROM packages p
JOIN package_dates pd ON p.package_id = pd.package_id
WHERE pd.start_date BETWEEN '2026-02-01' AND '2026-03-02'
ORDER BY pd.start_date;

-- ============================================
-- 4. AVAILABILITY QUERIES
-- ============================================

-- Dates with plenty of available seats (>15 seats free)
SELECT p.package_id, p.title, pd.package_date_id, pd.start_date, 
       pd.seats_total, pd.seats_booked,
       (pd.seats_total - pd.seats_booked) as available_seats
FROM packages p
JOIN package_dates pd ON p.package_id = pd.package_id
WHERE (pd.seats_total - pd.seats_booked) > 15
ORDER BY available_seats DESC LIMIT 20;

-- Dates with limited availability (<5 seats free)
SELECT p.package_id, p.title, pd.package_date_id, pd.start_date,
       pd.seats_total, pd.seats_booked,
       (pd.seats_total - pd.seats_booked) as available_seats
FROM packages p
JOIN package_dates pd ON p.package_id = pd.package_id
WHERE (pd.seats_total - pd.seats_booked) > 0 
  AND (pd.seats_total - pd.seats_booked) < 5
ORDER BY available_seats;

-- Sold out dates (no seats available)
SELECT p.package_id, p.title, pd.start_date, pd.end_date,
       pd.seats_total, pd.seats_booked
FROM packages p
JOIN package_dates pd ON p.package_id = pd.package_id
WHERE (pd.seats_total - pd.seats_booked) = 0;

-- ============================================
-- 5. BOOKING PREPARATION QUERIES
-- ============================================

-- Check if Package 1 has dates for booking 4 guests
SELECT pd.package_date_id, pd.start_date, pd.end_date,
       pd.seats_total, pd.seats_booked,
       (pd.seats_total - pd.seats_booked) as available_seats
FROM package_dates pd
WHERE pd.package_id = 1
  AND (pd.seats_total - pd.seats_booked) >= 4
ORDER BY pd.start_date LIMIT 1;

-- Find first available date for any package with 6+ seats
SELECT p.package_id, p.title, pd.package_date_id, pd.start_date,
       (pd.seats_total - pd.seats_booked) as available_seats
FROM packages p
JOIN package_dates pd ON p.package_id = pd.package_id
WHERE (pd.seats_total - pd.seats_booked) >= 6
  AND pd.start_date >= '2026-02-01'
ORDER BY pd.start_date LIMIT 1;

-- ============================================
-- 6. STATISTICS QUERIES
-- ============================================

-- Total capacity and bookings by package
SELECT p.package_id, p.title, p.max_people,
       COUNT(pd.package_date_id) as num_dates,
       SUM(pd.seats_total) as total_seats,
       SUM(pd.seats_booked) as total_booked,
       SUM(pd.seats_total - pd.seats_booked) as total_available,
       ROUND(100.0 * SUM(pd.seats_booked) / SUM(pd.seats_total), 2) as booking_percentage
FROM packages p
LEFT JOIN package_dates pd ON p.package_id = pd.package_id
GROUP BY p.package_id, p.title, p.max_people
ORDER BY booking_percentage DESC;

-- Average booking rate per date
SELECT 
       ROUND(100.0 * SUM(seats_booked) / SUM(seats_total), 2) as avg_booking_rate,
       SUM(seats_total) as total_seats,
       SUM(seats_booked) as total_booked
FROM package_dates;

-- Months with most available packages
SELECT MONTH(pd.start_date) as month, YEAR(pd.start_date) as year,
       COUNT(DISTINCT p.package_id) as unique_packages,
       COUNT(pd.package_date_id) as total_dates
FROM packages p
JOIN package_dates pd ON p.package_id = pd.package_id
GROUP BY YEAR(pd.start_date), MONTH(pd.start_date)
ORDER BY year, month;

-- ============================================
-- 7. TESTING SCENARIOS
-- ============================================

-- Scenario 1: User wants to book Package 1 for 3 guests on the earliest available date
SELECT pd.package_date_id, p.package_id, p.title, p.base_price,
       pd.start_date, pd.end_date,
       (pd.seats_total - pd.seats_booked) as available_seats,
       (3 * p.base_price) as estimated_total
FROM packages p
JOIN package_dates pd ON p.package_id = pd.package_id
WHERE p.package_id = 1
  AND (pd.seats_total - pd.seats_booked) >= 3
ORDER BY pd.start_date LIMIT 1;

-- Scenario 2: Find most expensive package with availability in March
SELECT p.package_id, p.title, p.base_price, pd.start_date,
       (pd.seats_total - pd.seats_booked) as available_seats
FROM packages p
JOIN package_dates pd ON p.package_id = pd.package_id
WHERE MONTH(pd.start_date) = 3 AND YEAR(pd.start_date) = 2026
  AND (pd.seats_total - pd.seats_booked) > 0
ORDER BY p.base_price DESC LIMIT 1;

-- Scenario 3: Check if user can book Package 83 for 5 people on 2026-02-05
SELECT p.package_id, p.title, pd.package_date_id, pd.start_date, pd.end_date,
       pd.seats_total, pd.seats_booked,
       (pd.seats_total - pd.seats_booked) as available_seats,
       IF((pd.seats_total - pd.seats_booked) >= 5, 'YES', 'NO') as can_book_5
FROM packages p
JOIN package_dates pd ON p.package_id = pd.package_id
WHERE p.package_id = 83
  AND pd.start_date = '2026-02-05';

-- ============================================
-- 8. MAINTENANCE QUERIES
-- ============================================

-- List all dates for backup/export
SELECT package_id, start_date, end_date, seats_total, seats_booked, is_active
FROM package_dates
ORDER BY package_id, start_date
INTO OUTFILE '/tmp/package_dates_backup.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';

-- Delete specific package dates (be careful!)
-- Example: Delete dates for Package 1
-- DELETE FROM package_dates WHERE package_id = 1;

-- Update all dates to active
UPDATE package_dates SET is_active = 1 WHERE is_active = 0;

-- Mark dates in the past as inactive
UPDATE package_dates SET is_active = 0 WHERE end_date < '2026-02-01';
