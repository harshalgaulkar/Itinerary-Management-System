-- ================================================================
-- COMPREHENSIVE DUMMY DATA - CORRECTED FOR ACTUAL SCHEMA
-- Destinations, Packages, Package Dates, Bookings, Payments & Reviews
-- ================================================================

-- ================================================================
-- 1. INSERT DESTINATIONS (matching actual schema)
-- ================================================================

INSERT INTO destinations (name, country, description, image) VALUES
('Goa', 'India', 'Tropical beach paradise with Portuguese culture', 'goa.jpg'),
('Kerala', 'India', 'Land of backwaters, spices and natural beauty', 'kerala.jpg'),
('Rajasthan', 'India', 'Desert kingdom with magnificent forts and palaces', 'rajasthan.jpg'),
('Himachal Pradesh', 'India', 'Mountain paradise with scenic hill stations', 'himachal.jpg'),
('Maharashtra', 'India', 'Gateway of India with vibrant city life', 'maharashtra.jpg'),
('Maldives', 'Maldives', 'Luxury island resort destination', 'maldives.jpg'),
('West Bengal', 'India', 'Tea gardens and misty mountain valleys', 'westbengal.jpg'),
('Uttar Pradesh', 'India', 'Home to world famous monuments', 'uttarpradesh.jpg'),
('Andaman & Nicobar', 'India', 'Tropical islands with pristine beaches', 'andaman.jpg'),
('Karnataka', 'India', 'Coffee plantations and scenic landscapes', 'karnataka.jpg'),
('Tamil Nadu', 'India', 'Temple culture and backwater beauty', 'tamilnadu.jpg'),
('Uttarakhand', 'India', 'Adventure hub and spiritual retreats', 'uttarakhand.jpg');

-- ================================================================
-- 2. INSERT PACKAGES (matching actual schema - no image_url column)
-- ================================================================

INSERT INTO packages (title, dest_id, duration_days, base_price, max_people, description, created_by) VALUES

-- Goa Packages (dest_id = 1)
('Goa Beach Paradise', 1, 5, 25000, 20, 'Relax on beautiful beaches with water sports and nightlife', 1),
('Goa Adventure Extreme', 1, 7, 35000, 15, 'Water sports, paragliding, and island hopping', 1),
('Goa Luxury Retreat', 1, 6, 55000, 10, 'Five-star resorts with spa and fine dining', 1),

-- Kerala Packages (dest_id = 2)
('Kerala Backwaters Cruise', 2, 6, 35000, 15, 'Experience serene backwaters with houseboat stay', 1),
('Kerala Spice Garden Tour', 2, 5, 28000, 18, 'Visit aromatic spice plantations and ayurveda centers', 1),
('Kerala Royal Experience', 2, 7, 48000, 12, 'Luxury palace stays and cultural immersion', 1),

-- Rajasthan Packages (dest_id = 3)
('Rajasthan Desert Tour', 3, 7, 40000, 25, 'Explore magnificent forts and desert landscapes', 1),
('Rajasthan Golden Triangle', 3, 5, 32000, 30, 'Jaipur, Agra and Delhi with luxury hotels', 1),
('Rajasthan Off-Beat Explorer', 3, 8, 45000, 15, 'Remote villages and untouched desert regions', 1),

-- Himachal Pradesh Packages (dest_id = 4)
('Shimla Hill Station', 4, 4, 20000, 18, 'Cool mountain retreat with nature walks', 1),
('Manali Adventure', 4, 5, 28000, 20, 'Trekking, paragliding and mountain biking', 1),
('Himachal Nature Escape', 4, 6, 32000, 16, 'Apple orchards, lakes and scenic valleys', 1),

-- Maharashtra Packages (dest_id = 5)
('Mumbai City Explorer', 5, 3, 15000, 30, 'Vibrant city tour with cultural attractions', 1),
('Mumbai Heritage Walk', 5, 4, 18000, 25, 'Historical monuments and local markets', 1),

-- Maldives Package (dest_id = 6)
('Maldives Paradise', 6, 7, 85000, 12, 'Luxury resort stay in crystal clear waters', 1),
('Maldives Honeymoon Special', 6, 5, 95000, 2, 'Private villa with butler service and spa', 1),

-- West Bengal Packages (dest_id = 7)
('Darjeeling Tea Gardens', 7, 4, 18000, 16, 'Visit the famous tea estates and mountains', 1),
('Darjeeling Sikkim Explorer', 7, 6, 28000, 14, 'Tea gardens and mountain views', 1),

-- Uttar Pradesh Packages (dest_id = 8)
('Taj Mahal Tour', 8, 3, 22000, 30, 'Witness the wonder with guided tours', 1),
('Taj Mahal & Agra Explorer', 8, 4, 28000, 25, 'Extended Agra tour with local experiences', 1),

-- Andaman Packages (dest_id = 9)
('Andaman Islands', 9, 6, 60000, 20, 'Beach exploration and water adventures', 1),
('Andaman Diving Experience', 9, 7, 75000, 15, 'Scuba diving and snorkeling expeditions', 1),

-- Karnataka Packages (dest_id = 10)
('Coorg Coffee Plantations', 10, 3, 16000, 18, 'Coffee estate tours and nature walks', 1),
('Coorg Nature Retreat', 10, 4, 22000, 16, 'Waterfalls, valleys and adventure activities', 1),

-- Tamil Nadu Packages (dest_id = 11)
('Tamil Nadu Temple Trail', 11, 5, 26000, 20, 'Ancient temples and spiritual experiences', 1),

-- Uttarakhand Packages (dest_id = 12)
('Uttarakhand Adventure Camp', 12, 5, 24000, 20, 'Trekking, camping and river rafting', 1);

-- ================================================================
-- 3. INSERT PACKAGE DATES (matching actual schema)
-- ================================================================

-- Goa Beach Paradise dates
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES
(1, '2026-02-01', '2026-02-06', 20, 4, 1),
(1, '2026-02-15', '2026-02-20', 20, 5, 1),
(1, '2026-03-01', '2026-03-06', 18, 3, 1),
(1, '2026-03-15', '2026-03-20', 15, 0, 1),

-- Goa Adventure Extreme dates
(2, '2026-02-10', '2026-02-17', 15, 3, 1),
(2, '2026-03-10', '2026-03-17', 14, 2, 1),
(2, '2026-04-01', '2026-04-08', 15, 0, 1),

-- Goa Luxury Retreat dates
(3, '2026-02-05', '2026-02-11', 10, 4, 1),
(3, '2026-02-20', '2026-02-26', 8, 2, 1),

-- Kerala Backwaters Cruise dates
(4, '2026-02-08', '2026-02-14', 15, 3, 1),
(4, '2026-03-08', '2026-03-14', 14, 2, 1),
(4, '2026-04-05', '2026-04-11', 15, 1, 1),

-- Kerala Spice Garden Tour dates
(5, '2026-02-12', '2026-02-17', 18, 3, 1),
(5, '2026-03-12', '2026-03-17', 16, 1, 1),

-- Kerala Royal Experience dates
(6, '2026-02-03', '2026-02-10', 12, 2, 1),
(6, '2026-03-03', '2026-03-10', 10, 1, 1),

-- Rajasthan Desert Tour dates
(7, '2026-02-14', '2026-02-21', 25, 6, 1),
(7, '2026-03-14', '2026-03-21', 20, 2, 1),
(7, '2026-04-01', '2026-04-08', 25, 0, 1),

-- Rajasthan Golden Triangle dates
(8, '2026-02-09', '2026-02-14', 30, 5, 1),
(8, '2026-03-09', '2026-03-14', 28, 0, 1),

-- Rajasthan Off-Beat Explorer dates
(9, '2026-02-18', '2026-02-26', 15, 3, 1),
(9, '2026-03-18', '2026-03-26', 14, 1, 1),

-- Shimla Hill Station dates
(10, '2026-03-05', '2026-03-09', 18, 3, 1),
(10, '2026-04-05', '2026-04-09', 18, 0, 1),
(10, '2026-05-01', '2026-05-05', 16, 2, 1),

-- Manali Adventure dates
(11, '2026-03-10', '2026-03-15', 20, 2, 1),
(11, '2026-04-10', '2026-04-15', 19, 1, 1),
(11, '2026-05-05', '2026-05-10', 20, 0, 1),

-- Himachal Nature Escape dates
(12, '2026-03-15', '2026-03-21', 16, 0, 1),
(12, '2026-04-15', '2026-04-21', 15, 1, 1),

-- Mumbai City Explorer dates
(13, '2026-02-01', '2026-02-04', 30, 2, 1),
(13, '2026-02-15', '2026-02-18', 28, 0, 1),
(13, '2026-03-01', '2026-03-04', 30, 3, 1),

-- Mumbai Heritage Walk dates
(14, '2026-02-07', '2026-02-11', 25, 4, 1),
(14, '2026-02-21', '2026-02-25', 24, 2, 1),

-- Maldives Paradise dates
(15, '2026-01-15', '2026-01-22', 12, 2, 1),
(15, '2026-02-15', '2026-02-22', 10, 2, 1),
(15, '2026-03-15', '2026-03-22', 12, 0, 1),

-- Maldives Honeymoon Special dates
(16, '2026-02-14', '2026-02-19', 2, 2, 1),
(16, '2026-03-14', '2026-03-19', 2, 0, 1),

-- Darjeeling Tea Gardens dates
(17, '2026-03-01', '2026-03-05', 16, 2, 1),
(17, '2026-04-01', '2026-04-05', 15, 0, 1),

-- Darjeeling Sikkim Explorer dates
(18, '2026-03-10', '2026-03-16', 14, 1, 1),
(18, '2026-04-10', '2026-04-16', 13, 0, 1),

-- Taj Mahal Tour dates
(19, '2026-02-02', '2026-02-05', 30, 4, 1),
(19, '2026-02-16', '2026-02-19', 28, 2, 1),
(19, '2026-03-02', '2026-03-05', 30, 0, 1),

-- Taj Mahal & Agra Explorer dates
(20, '2026-02-06', '2026-02-10', 25, 3, 1),
(20, '2026-03-06', '2026-03-10', 23, 1, 1),

-- Andaman Islands dates
(21, '2026-01-20', '2026-01-26', 20, 5, 1),
(21, '2026-02-20', '2026-02-26', 18, 2, 1),
(21, '2026-03-20', '2026-03-26', 20, 0, 1),

-- Andaman Diving Experience dates
(22, '2026-02-10', '2026-02-17', 15, 3, 1),
(22, '2026-03-10', '2026-03-17', 14, 1, 1),

-- Coorg Coffee Plantations dates
(23, '2026-02-03', '2026-02-06', 18, 2, 1),
(23, '2026-03-03', '2026-03-06', 17, 0, 1),
(23, '2026-04-03', '2026-04-06', 18, 1, 1),

-- Coorg Nature Retreat dates
(24, '2026-02-14', '2026-02-18', 16, 2, 1),
(24, '2026-03-14', '2026-03-18', 15, 0, 1),

-- Tamil Nadu Temple Trail dates
(25, '2026-02-20', '2026-02-25', 20, 3, 1),
(25, '2026-03-20', '2026-03-25', 19, 1, 1),

-- Uttarakhand Adventure Camp dates
(26, '2026-04-01', '2026-04-06', 20, 4, 1),
(26, '2026-05-01', '2026-05-06', 18, 0, 1),
(26, '2026-06-01', '2026-06-06', 20, 2, 1);

-- ================================================================
-- 4. INSERT BOOKINGS (matching actual schema)
-- ================================================================

INSERT INTO bookings (user_id, package_date_id, booked_on, persons, total_price, status, contact_phone, notes) VALUES
(1, 1, '2026-01-20', 4, 100000, 'confirmed', '9876543210', 'Goa beach trip'),
(2, 9, '2026-01-15', 2, 70000, 'confirmed', '9876543211', 'Kerala backwaters'),
(3, 18, '2026-01-18', 6, 240000, 'pending', '9876543212', 'Rajasthan group'),
(4, 36, '2026-01-25', 3, 60000, 'confirmed', '9876543213', 'Shimla trip'),
(5, 44, '2026-01-22', 2, 30000, 'confirmed', '9876543214', 'Mumbai city'),
(2, 47, '2026-01-10', 2, 170000, 'cancelled', '9876543215', 'Maldives cancelled'),
(1, 52, '2026-01-12', 4, 88000, 'confirmed', '9876543210', 'Taj Mahal tour'),
(6, 59, '2026-01-08', 5, 300000, 'confirmed', '9876543216', 'Andaman trip'),
(3, 7, '2026-01-19', 3, 84000, 'pending', '9876543212', 'Goa luxury'),
(4, 33, '2026-01-17', 2, 56000, 'confirmed', '9876543213', 'Manali adventure'),
(2, 4, '2026-01-24', 3, 105000, 'confirmed', '9876543211', 'Goa extreme'),
(1, 21, '2026-01-16', 5, 160000, 'confirmed', '9876543210', 'Rajasthan golden'),
(5, 67, '2026-01-14', 2, 32000, 'pending', '9876543214', 'Coorg coffee'),
(6, 71, '2026-01-09', 4, 96000, 'confirmed', '9876543216', 'Uttarakhand'),
(4, 49, '2026-01-11', 2, 36000, 'confirmed', '9876543213', 'Darjeeling'),
(3, 51, '2026-01-20', 3, 78000, 'pending', '9876543212', 'Temple trail'),
(2, 32, '2026-01-13', 2, 64000, 'confirmed', '9876543211', 'Himachal'),
(1, 47, '2026-01-21', 4, 72000, 'completed', '9876543210', 'Mumbai heritage'),
(6, 69, '2026-01-19', 2, 44000, 'confirmed', '9876543216', 'Coorg retreat'),
(5, 53, '2026-01-23', 3, 84000, 'pending', '9876543214', 'Taj Mahal extended');

-- ================================================================
-- 5. INSERT PAYMENTS (matching actual schema)
-- ================================================================

INSERT INTO payments (booking_id, amount, method, status, txn_reference) VALUES
(1, 100000, 'card', 'success', 'TXN20260120001'),
(2, 70000, 'upi', 'success', 'TXN20260115001'),
(3, 240000, 'netbanking', 'pending', 'TXN20260118001'),
(4, 60000, 'card', 'success', 'TXN20260125001'),
(5, 30000, 'upi', 'success', 'TXN20260122001'),
(6, 170000, 'card', 'failed', 'TXN20260110001'),
(7, 88000, 'netbanking', 'success', 'TXN20260112001'),
(8, 300000, 'card', 'success', 'TXN20260108001'),
(9, 84000, 'upi', 'pending', 'TXN20260119001'),
(10, 56000, 'card', 'success', 'TXN20260117001'),
(11, 105000, 'netbanking', 'success', 'TXN20260124001'),
(12, 160000, 'upi', 'success', 'TXN20260116001'),
(13, 32000, 'card', 'pending', 'TXN20260114001'),
(14, 96000, 'netbanking', 'success', 'TXN20260109001'),
(15, 36000, 'upi', 'success', 'TXN20260111001'),
(16, 78000, 'card', 'pending', 'TXN20260120002'),
(17, 64000, 'netbanking', 'success', 'TXN20260113001'),
(18, 72000, 'upi', 'success', 'TXN20260121001'),
(19, 44000, 'card', 'success', 'TXN20260119002'),
(20, 84000, 'netbanking', 'pending', 'TXN20260123001');

-- ================================================================
-- 6. INSERT REVIEWS (if your table exists - adjust as needed)
-- ================================================================
-- Note: Adjust column names based on your actual reviews table

-- If your reviews table uses different columns, comment out and adjust:
-- INSERT INTO reviews (booking_id, rating, title, review_text, created_at) VALUES
-- ...

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

SELECT COUNT(*) as total_destinations FROM destinations;
SELECT COUNT(*) as total_packages FROM packages;
SELECT COUNT(*) as total_dates FROM package_dates;
SELECT COUNT(*) as total_bookings FROM bookings;
SELECT status, COUNT(*) as count FROM bookings GROUP BY status;
SELECT COUNT(*) as total_payments FROM payments;
SELECT status, COUNT(*) as count FROM payments GROUP BY status;

SELECT p.title, COUNT(pd.package_date_id) as total_dates 
FROM packages p 
LEFT JOIN package_dates pd ON p.package_id = pd.package_id 
GROUP BY p.package_id, p.title
ORDER BY p.title;

-- ================================================================
-- END OF CORRECTED DUMMY DATA
-- ================================================================
