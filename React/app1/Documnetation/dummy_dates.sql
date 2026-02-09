-- Dummy Package Dates for Testing
-- Insert dates for multiple packages for booking

-- Package 79: Goa Beach Paradise
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(79, '2026-02-11', '2026-02-15', 20, 0, 1),
(79, '2026-02-26', '2026-03-02', 20, 0, 1),
(79, '2026-03-18', '2026-03-22', 20, 0, 1);

-- Package 80: Kerala Backwaters Tour
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(80, '2026-02-16', '2026-02-21', 15, 0, 1),
(80, '2026-03-08', '2026-03-13', 15, 0, 1),
(80, '2026-04-02', '2026-04-07', 15, 0, 1);

-- Package 81: Rajasthan Royal Heritage
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(81, '2026-02-09', '2026-02-15', 25, 0, 1),
(81, '2026-03-03', '2026-03-09', 25, 0, 1),
(81, '2026-03-28', '2026-04-03', 25, 0, 1);

-- Package 82: Himalayan Adventure Trek
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(82, '2026-02-21', '2026-02-28', 12, 0, 1),
(82, '2026-03-23', '2026-03-30', 12, 0, 1),
(82, '2026-04-17', '2026-04-24', 12, 0, 1);

-- Package 83: Wardha Heritage & Ashram Tour (Already has dates, adding more)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(83, '2026-05-01', '2026-05-04', 20, 0, 1),
(83, '2026-06-10', '2026-06-13', 20, 0, 1);

-- Package 85: Andaman Island Paradise
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(85, '2026-02-13', '2026-02-18', 18, 0, 1),
(85, '2026-03-11', '2026-03-16', 18, 0, 1),
(85, '2026-04-12', '2026-04-17', 18, 0, 1);

-- Package 86: Varanasi Spiritual Journey
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(86, '2026-02-10', '2026-02-13', 20, 0, 1),
(86, '2026-03-05', '2026-03-08', 20, 0, 1),
(86, '2026-03-27', '2026-03-30', 20, 0, 1);

-- Package 87: Kashmir Valley Dream
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(87, '2026-02-19', '2026-02-24', 16, 0, 1),
(87, '2026-03-21', '2026-03-26', 16, 0, 1),
(87, '2026-04-20', '2026-04-25', 16, 0, 1);

-- Verification Query
-- Run this to verify the data was inserted:
SELECT 
  p.package_id,
  p.name,
  COUNT(pd.package_date_id) as available_dates
FROM packages p
LEFT JOIN package_dates pd ON p.package_id = pd.package_id
WHERE p.package_id IN (79, 80, 81, 82, 83, 85, 86, 87)
GROUP BY p.package_id
HAVING available_dates > 0
ORDER BY p.package_id;
