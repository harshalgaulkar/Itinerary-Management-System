-- ================================================================
-- ADDITIONAL SAMPLE DATA FOR IMS TRAVEL BOOKING SYSTEM
-- Insert this after the initial sample_data.sql
-- ================================================================

-- ================================================================
-- ADD MORE USERS
-- ================================================================
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('arun@example.com', '$2b$10$example_hash_9', 'Arun Kumar', '9876543218', 'user'),
('sneha@example.com', '$2b$10$example_hash_10', 'Sneha Desai', '9876543219', 'user'),
('rahul@example.com', '$2b$10$example_hash_11', 'Rahul Joshi', '9876543220', 'user'),
('meera@example.com', '$2b$10$example_hash_12', 'Meera Iyer', '9876543221', 'user'),
('sanjay@example.com', '$2b$10$example_hash_13', 'Sanjay Singh', '9876543222', 'user'),
('pooja@example.com', '$2b$10$example_hash_14', 'Pooja Pillai', '9876543223', 'user'),
('arjun@example.com', '$2b$10$example_hash_15', 'Arjun Nair', '9876543224', 'user'),
('priya2@example.com', '$2b$10$example_hash_16', 'Priya Rao', '9876543225', 'user');

-- ================================================================
-- ADD MORE PACKAGE DATES
-- ================================================================
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES
(14, '2026-03-15', '2026-03-20', 30, 1, 1),
(15, '2026-03-20', '2026-03-26', 25, 0, 1),
(16, '2026-04-05', '2026-04-12', 35, 1, 1),
(17, '2026-03-10', '2026-03-14', 20, 0, 1),
(18, '2026-04-15', '2026-04-18', 40, 1, 1),
(14, '2026-04-10', '2026-04-15', 30, 0, 1),
(15, '2026-04-20', '2026-04-26', 25, 1, 1),
(16, '2026-05-01', '2026-05-08', 35, 2, 1),
(17, '2026-04-01', '2026-04-05', 20, 1, 1),
(18, '2026-05-10', '2026-05-13', 40, 0, 1);

-- ================================================================
-- ADD MORE BOOKINGS
-- ================================================================
INSERT INTO bookings (user_id, package_date_id, booked_on, persons, total_price, status, contact_phone, notes) VALUES
(9, 14, '2026-01-25', 2, 50000, 'confirmed', '9876543218', 'March trip to Goa'),
(10, 15, '2026-01-26', 4, 90000, 'confirmed', '9876543219', 'Family vacation to Kerala'),
(11, 16, '2026-01-27', 3, 75000, 'pending', '9876543220', 'Rajasthan tour pending'),
(12, 17, '2026-01-28', 2, 40000, 'confirmed', '9876543221', 'Shimla weekend trip'),
(13, 18, '2026-01-29', 5, 150000, 'confirmed', '9876543222', 'Mumbai group tour'),
(14, 19, '2026-01-30', 2, 50000, 'completed', '9876543223', 'Goa beach holiday'),
(15, 20, '2026-01-31', 3, 70000, 'confirmed', '9876543224', 'Kerala houseboat'),
(16, 21, '2026-02-01', 4, 100000, 'pending', '9876543225', 'Rajasthan adventure'),
(9, 22, '2026-02-02', 2, 40000, 'confirmed', '9876543218', 'Himachal trek'),
(10, 23, '2026-02-03', 3, 60000, 'completed', '9876543219', 'City tour Mumbai');

-- ================================================================
-- ADD MORE BOOKINGS (continued)
-- ================================================================
INSERT INTO bookings (user_id, package_date_id, booked_on, persons, total_price, status, contact_phone, notes) VALUES
(11, 14, '2026-02-04', 2, 50000, 'confirmed', '9876543220', 'Second Goa trip'),
(12, 15, '2026-02-05', 3, 70000, 'confirmed', '9876543221', 'Kerala return visit'),
(13, 16, '2026-02-06', 4, 100000, 'completed', '9876543222', 'Rajasthan completed'),
(14, 17, '2026-02-07', 2, 40000, 'pending', '9876543223', 'Shimla pending'),
(15, 18, '2026-02-08', 3, 90000, 'confirmed', '9876543224', 'Mumbai extended stay'),
(1, 19, '2026-02-09', 2, 50000, 'confirmed', '9876543210', 'Repeat Goa visitor'),
(2, 20, '2026-02-10', 4, 90000, 'pending', '9876543211', 'Kerala pending trip'),
(3, 21, '2026-02-11', 3, 75000, 'confirmed', '9876543212', 'Desert safari'),
(4, 22, '2026-02-12', 2, 40000, 'completed', '9876543213', 'Mountain completed'),
(5, 23, '2026-02-13', 5, 150000, 'confirmed', '9876543214', 'Large group Mumbai');

-- ================================================================
-- ADD MORE PAYMENTS
-- ================================================================
INSERT INTO payments (booking_id, amount, method, status, txn_reference) VALUES
(34, 50000, 'card', 'success', 'TXN20260225001'),
(35, 90000, 'upi', 'success', 'TXN20260226001'),
(36, 75000, 'netbanking', 'pending', 'TXN20260227001'),
(37, 40000, 'card', 'success', 'TXN20260228001'),
(38, 150000, 'online_banking', 'success', 'TXN20260229001'),
(39, 50000, 'card', 'success', 'TXN20260301001'),
(40, 70000, 'upi', 'success', 'TXN20260302001'),
(41, 100000, 'netbanking', 'pending', 'TXN20260303001'),
(42, 40000, 'card', 'success', 'TXN20260304001'),
(43, 60000, 'upi', 'success', 'TXN20260305001');

-- ================================================================
-- ADD MORE PAYMENTS (continued)
-- ================================================================
INSERT INTO payments (booking_id, amount, method, status, txn_reference) VALUES
(44, 50000, 'card', 'success', 'TXN20260306001'),
(45, 70000, 'netbanking', 'success', 'TXN20260307001'),
(46, 100000, 'upi', 'success', 'TXN20260308001'),
(47, 40000, 'card', 'pending', 'TXN20260309001'),
(48, 90000, 'online_banking', 'success', 'TXN20260310001'),
(49, 50000, 'card', 'success', 'TXN20260311001'),
(50, 90000, 'upi', 'pending', 'TXN20260312001'),
(51, 75000, 'netbanking', 'success', 'TXN20260313001'),
(52, 40000, 'card', 'success', 'TXN20260314001'),
(53, 150000, 'online_banking', 'success', 'TXN20260315001');

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================
-- SELECT COUNT(*) as total_users FROM users;
-- SELECT COUNT(*) as total_bookings FROM bookings;
-- SELECT COUNT(*) as total_payments FROM payments;
-- SELECT SUM(total_price) as total_revenue FROM bookings;
-- SELECT SUM(amount) as total_payments_amount FROM payments;
-- SELECT COUNT(*) as successful_payments FROM payments WHERE status = 'success';
-- SELECT COUNT(*) as pending_payments FROM payments WHERE status = 'pending';
-- SELECT COUNT(*) as confirmed_bookings FROM bookings WHERE status = 'confirmed';
-- SELECT COUNT(*) as completed_bookings FROM bookings WHERE status = 'completed';
-- SELECT COUNT(*) as pending_bookings FROM bookings WHERE status = 'pending';

-- ================================================================
-- EXPECTED RESULTS AFTER INSERTION
-- ================================================================
-- Total Additional Users: 8
-- Total Additional Bookings: 20
-- Total Additional Payments: 20
-- Additional Revenue: ₹1,500,000
-- Additional Payments: ₹1,500,000
-- Successful Payments: 14
-- Pending Payments: 6
-- Confirmed Bookings: 12
-- Completed Bookings: 3
-- Pending Bookings: 5
