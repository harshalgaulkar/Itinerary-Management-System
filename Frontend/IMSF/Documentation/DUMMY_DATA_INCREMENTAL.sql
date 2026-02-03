-- ================================================================
-- DUMMY DATA - USING EXISTING DESTINATIONS
-- Add new packages and bookings to existing data
-- ================================================================

-- First, let's check what destinations exist:
-- SELECT * FROM destinations;

-- ================================================================
-- ADD NEW PACKAGES (using existing destination IDs from your database)
-- Adjust dest_id values based on your existing destinations
-- ================================================================

INSERT INTO packages (title, dest_id, duration_days, base_price, max_people, description, created_by) VALUES

-- Add more Goa packages
('Goa Water Sports Extreme', 3, 7, 35000, 15, 'Water sports, paragliding, and island hopping', 1),
('Goa Luxury Spa Retreat', 3, 6, 55000, 10, 'Five-star resorts with spa and fine dining', 1),

-- Add more Kerala packages
('Kerala Spice Garden Tour', 4, 5, 28000, 18, 'Visit aromatic spice plantations and ayurveda centers', 1),
('Kerala Royal Experience', 4, 7, 48000, 12, 'Luxury palace stays and cultural immersion', 1),

-- Add more Rajasthan packages
('Rajasthan Golden Triangle', 3, 5, 32000, 30, 'Jaipur, Agra and Delhi with luxury hotels', 1),
('Rajasthan Off-Beat Explorer', 3, 8, 45000, 15, 'Remote villages and untouched desert regions', 1),

-- Add more Shimla packages
('Manali Adventure Camp', 5, 5, 28000, 20, 'Trekking, paragliding and mountain biking', 1),
('Himachal Nature Escape', 5, 6, 32000, 16, 'Apple orchards, lakes and scenic valleys', 1),

-- Add more Mumbai packages
('Mumbai Heritage Tour', 6, 4, 18000, 25, 'Historical monuments and local markets', 1);

-- ================================================================
-- ADD NEW PACKAGE DATES FOR NEW PACKAGES
-- ================================================================

-- Goa Water Sports dates
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES
(11, '2026-02-10', '2026-02-17', 15, 3, 1),
(11, '2026-03-10', '2026-03-17', 14, 2, 1),
(11, '2026-04-01', '2026-04-08', 15, 0, 1),

-- Goa Luxury Spa dates
(12, '2026-02-05', '2026-02-11', 10, 4, 1),
(12, '2026-02-20', '2026-02-26', 8, 2, 1),

-- Kerala Spice dates
(13, '2026-02-12', '2026-02-17', 18, 3, 1),
(13, '2026-03-12', '2026-03-17', 16, 1, 1),

-- Kerala Royal dates
(14, '2026-02-03', '2026-02-10', 12, 2, 1),
(14, '2026-03-03', '2026-03-10', 10, 1, 1),

-- Rajasthan Golden Triangle dates
(15, '2026-02-09', '2026-02-14', 30, 5, 1),
(15, '2026-03-09', '2026-03-14', 28, 0, 1),

-- Rajasthan Off-Beat dates
(16, '2026-02-18', '2026-02-26', 15, 3, 1),
(16, '2026-03-18', '2026-03-26', 14, 1, 1),

-- Manali Adventure dates
(17, '2026-03-10', '2026-03-15', 20, 2, 1),
(17, '2026-04-10', '2026-04-15', 19, 1, 1),
(17, '2026-05-05', '2026-05-10', 20, 0, 1),

-- Himachal Nature dates
(18, '2026-03-15', '2026-03-21', 16, 0, 1),
(18, '2026-04-15', '2026-04-21', 15, 1, 1),

-- Mumbai Heritage dates
(19, '2026-02-07', '2026-02-11', 25, 4, 1),
(19, '2026-02-21', '2026-02-25', 24, 2, 1);

-- ================================================================
-- ADD NEW BOOKINGS
-- ================================================================

INSERT INTO bookings (user_id, package_date_id, booked_on, persons, total_price, status, contact_phone, notes) VALUES
(1, 20, '2026-01-20', 4, 100000, 'confirmed', '9876543210', 'Goa water sports'),
(2, 24, '2026-01-15', 2, 70000, 'confirmed', '9876543211', 'Kerala spice tour'),
(3, 27, '2026-01-18', 6, 192000, 'pending', '9876543212', 'Rajasthan golden'),
(4, 32, '2026-01-25', 3, 96000, 'confirmed', '9876543213', 'Manali adventure'),
(5, 35, '2026-01-22', 2, 36000, 'confirmed', '9876543214', 'Himachal nature'),
(2, 36, '2026-01-10', 4, 72000, 'confirmed', '9876543215', 'Mumbai heritage'),
(1, 21, '2026-01-12', 3, 105000, 'confirmed', '9876543210', 'Goa luxury spa'),
(6, 26, '2026-01-08', 2, 56000, 'confirmed', '9876543216', 'Rajasthan offbeat'),
(3, 31, '2026-01-19', 2, 56000, 'pending', '9876543212', 'Manali camp'),
(4, 25, '2026-01-17', 3, 84000, 'confirmed', '9876543213', 'Kerala royal'),
(2, 19, '2026-01-24', 2, 60000, 'confirmed', '9876543211', 'Goa water sports extra'),
(1, 28, '2026-01-16', 4, 128000, 'confirmed', '9876543210', 'Rajasthan offbeat group'),
(5, 33, '2026-01-14', 2, 38000, 'pending', '9876543214', 'Manali camp booking'),
(6, 37, '2026-01-09', 3, 54000, 'confirmed', '9876543216', 'Mumbai heritage group'),
(3, 23, '2026-01-11', 2, 36000, 'confirmed', '9876543212', 'Kerala spice tour 2');

-- ================================================================
-- ADD NEW PAYMENTS
-- ================================================================

INSERT INTO payments (booking_id, amount, method, status, txn_reference) VALUES
(34, 100000, 'card', 'success', 'TXN20260120010'),
(35, 70000, 'upi', 'success', 'TXN20260115010'),
(36, 192000, 'netbanking', 'pending', 'TXN20260118010'),
(37, 96000, 'card', 'success', 'TXN20260125010'),
(38, 36000, 'upi', 'success', 'TXN20260122010'),
(39, 72000, 'card', 'success', 'TXN20260110010'),
(40, 105000, 'netbanking', 'success', 'TXN20260112010'),
(41, 56000, 'upi', 'success', 'TXN20260108010'),
(42, 56000, 'card', 'pending', 'TXN20260119010'),
(43, 84000, 'netbanking', 'success', 'TXN20260117010'),
(44, 60000, 'upi', 'success', 'TXN20260124010'),
(45, 128000, 'card', 'success', 'TXN20260116010'),
(46, 38000, 'netbanking', 'pending', 'TXN20260114010'),
(47, 54000, 'upi', 'success', 'TXN20260109010'),
(48, 36000, 'card', 'success', 'TXN20260111010');

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

SELECT 'New Packages Count' as label, COUNT(*) as count FROM packages WHERE package_id > 10;

SELECT 'New Package Dates Count' as label, COUNT(*) as count FROM package_dates WHERE package_date_id > 18;

SELECT 'New Bookings Count' as label, COUNT(*) as count FROM bookings WHERE booking_id > 33;

SELECT 'New Payments Count' as label, COUNT(*) as count FROM payments WHERE payment_id > 10;

SELECT 'Total Revenue' as label, SUM(total_price) as amount FROM bookings WHERE booking_id > 33;

SELECT p.title, COUNT(pd.package_date_id) as total_dates, SUM(pd.seats_booked) as total_booked
FROM packages p 
LEFT JOIN package_dates pd ON p.package_id = pd.package_id 
WHERE p.package_id > 10
GROUP BY p.package_id, p.title
ORDER BY p.title;

-- ================================================================
-- END OF INCREMENTAL DUMMY DATA
-- ================================================================
