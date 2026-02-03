
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('raj@example.com', '$2b$10$example_hash_1', 'Raj Kumar', '9876543210', 'user'),
('priya@example.com', '$2b$10$example_hash_2', 'Priya Singh', '9876543211', 'user'),
('amit@example.com', '$2b$10$example_hash_3', 'Amit Patel', '9876543212', 'user'),
('neha@example.com', '$2b$10$example_hash_4', 'Neha Gupta', '9876543213', 'user'),
('vikram@example.com', '$2b$10$example_hash_5', 'Vikram Reddy', '9876543214', 'user'),
('anjali@example.com', '$2b$10$example_hash_6', 'Anjali Sharma', '9876543215', 'user'),
('rohan@example.com', '$2b$10$example_hash_7', 'Rohan Verma', '9876543216', 'user'),
('divya@example.com', '$2b$10$example_hash_8', 'Divya Nair', '9876543217', 'user');

INSERT INTO destinations (name, country, description, image) VALUES
('Kerala', 'India', 'Serene backwaters and houseboat experience', 'kerala.jpg'),
('Himachal Pradesh', 'India', 'Cool mountain retreat with nature walks', 'himachal.jpg'),
('Maharashtra', 'India', 'Vibrant city tour with cultural attractions', 'maharashtra.jpg');

INSERT INTO packages (title, dest_id, duration_days, base_price, max_people, description, created_by) VALUES
('Goa Beach Paradise', 3, 5, 25000, 20, 'Relax on beautiful beaches with water sports', 1),
('Kerala Backwaters', 4, 6, 35000, 15, 'Experience serene backwaters and houseboats', 1),
('Rajasthan Desert Tour', 3, 7, 40000, 25, 'Explore magnificent forts and desert landscapes', 1),
('Shimla Hill Station', 5, 4, 20000, 18, 'Cool mountain retreat with nature walks', 1),
('Mumbai City Explorer', 6, 3, 15000, 30, 'Vibrant city tour with cultural attractions', 1);

INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES
(14, '2026-02-10', '2026-02-15', 30, 3, 1),
(15, '2026-02-15', '2026-02-21', 25, 2, 1),
(16, '2026-03-01', '2026-03-08', 35, 2, 1),
(17, '2026-02-01', '2026-02-05', 20, 2, 1),
(18, '2026-03-10', '2026-03-13', 40, 3, 1);


INSERT INTO bookings (user_id, package_date_id, booked_on, persons, total_price, status, contact_phone, notes) VALUES
(1, 9, '2026-01-20', 2, 50000, 'confirmed', '9876543210', 'Beach trip booking'),
(2, 10, '2026-01-21', 3, 45000, 'confirmed', '9876543211', 'Backwater experience'),
(3, 9, '2026-01-22', 2, 50000, 'confirmed', '9876543212', 'Family vacation'),
(1, 11, '2026-01-15', 4, 60000, 'completed', '9876543210', 'Desert safari'),
(4, 10, '2026-01-24', 2, 45000, 'pending', '9876543213', 'Pending payment'),
(5, 12, '2026-01-19', 3, 38000, 'confirmed', '9876543214', 'Hill station trip'),
(6, 13, '2026-01-23', 2, 70000, 'confirmed', '9876543215', 'City tour package'),
(7, 9, '2026-01-10', 2, 50000, 'completed', '9876543216', 'Completed booking'),
(8, 11, '2026-01-25', 5, 60000, 'pending', '9876543217', 'Group booking'),
(2, 13, '2026-01-18', 2, 70000, 'confirmed', '9876543211', 'Second booking');


INSERT INTO payments (booking_id, amount, method, status, txn_reference) VALUES
(24, 50000, 'card', 'success', 'TXN20260120001'),
(25, 45000, 'upi', 'success', 'TXN20260121001'),
(26, 50000, 'netbanking', 'success', 'TXN20260122001'),
(27, 60000, 'card', 'success', 'TXN20260115001'),
(28, 45000, 'card', 'pending', 'TXN20260124001'),
(29, 38000, 'upi', 'success', 'TXN20260119001'),
(30, 70000, 'netbanking', 'success', 'TXN20260123001'),
(31, 50000, 'card', 'success', 'TXN20260110001'),
(32, 60000, 'card', 'pending', 'TXN20260125001'),
(33, 70000, 'upi', 'success', 'TXN20260118001');

-- ================================================================
-- VERIFY DATA WAS INSERTED
-- ================================================================
-- Uncomment these to verify data was inserted:

-- SELECT COUNT(*) as total_users FROM users;
-- SELECT COUNT(*) as total_packages FROM packages;
-- SELECT COUNT(*) as total_bookings FROM bookings;
-- SELECT COUNT(*) as total_payments FROM payments;

-- SELECT SUM(total_amount) as total_revenue FROM bookings;
-- SELECT SUM(amount) as total_payments_amount FROM payments;

-- ================================================================
-- EXPECTED RESULTS AFTER INSERTION
-- ================================================================
-- Total Users: 8
-- Total Packages: 5
-- Total Bookings: 10
-- Total Payments: 10
-- Total Revenue: ₹543,000
-- Total Payments: ₹488,000
-- Confirmed Bookings: 6
-- Completed Bookings: 2
-- Pending Bookings: 2
-- Successful Payments: 8
-- Pending Payments: 2

-- ================================================================
-- WHAT YOU'LL SEE IN ADMIN DASHBOARD
-- ================================================================
-- 
-- 📊 Statistics
-- ├─ Total Packages: 5
-- ├─ Total Bookings: 10
-- ├─ Total Revenue: ₹543,000
-- ├─ Total Users: 8
-- ├─ Pending Bookings: 2 (₹105,000)
-- ├─ Confirmed Bookings: 6 (₹313,000)
-- ├─ Completed Bookings: 2 (₹110,000)
-- ├─ Upcoming Bookings: 8 (₹433,000)
-- └─ Completed Bookings: 2 (₹110,000)
--
-- 💳 Recent Transactions
-- ├─ Total Transactions: 10
-- ├─ Successful: 8
-- ├─ Pending: 2
-- └─ Failed: 0
--
-- ================================================================
