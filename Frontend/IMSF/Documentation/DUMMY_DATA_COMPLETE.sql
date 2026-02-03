-- ================================================================
-- COMPREHENSIVE DUMMY DATA FOR IMS TRAVEL PROJECT
-- Destinations, Packages, Package Dates, Bookings, Payments & Reviews
-- ================================================================

-- Clear existing data (optional - comment out if you want to keep existing)
-- TRUNCATE TABLE package_dates;
-- TRUNCATE TABLE packages;
-- TRUNCATE TABLE destinations;

-- ================================================================
-- 1. INSERT DESTINATIONS
-- ================================================================

INSERT INTO destinations (name, country, description, best_season) VALUES
('Goa', 'India', 'Tropical beach paradise with Portuguese culture', 'November-February'),
('Kerala', 'India', 'Land of backwaters, spices and natural beauty', 'September-May'),
('Rajasthan', 'India', 'Desert kingdom with magnificent forts and palaces', 'October-March'),
('Himachal Pradesh', 'India', 'Mountain paradise with scenic hill stations', 'March-October'),
('Maharashtra', 'India', 'Gateway of India with vibrant city life', 'October-February'),
('Maldives', 'Maldives', 'Luxury island resort destination', 'November-April'),
('West Bengal', 'India', 'Tea gardens and misty mountain valleys', 'September-November'),
('Uttar Pradesh', 'India', 'Home to world famous monuments', 'October-March'),
('Andaman & Nicobar', 'India', 'Tropical islands with pristine beaches', 'November-May'),
('Karnataka', 'India', 'Coffee plantations and scenic landscapes', 'September-May'),
('Tamil Nadu', 'India', 'Temple culture and backwater beauty', 'November-February'),
('Uttarakhand', 'India', 'Adventure hub and spiritual retreats', 'April-June & September-November');

-- ================================================================
-- 2. INSERT PACKAGES (with images)
-- ================================================================

INSERT INTO packages (title, dest_id, duration_days, base_price, max_people, description, image_url, created_by) VALUES

-- Goa Packages (dest_id = 1)
('Goa Beach Paradise', 1, 5, 25000, 20, 'Relax on beautiful beaches with water sports and nightlife', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', 1),
('Goa Adventure Extreme', 1, 7, 35000, 15, 'Water sports, paragliding, and island hopping', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', 1),
('Goa Luxury Retreat', 1, 6, 55000, 10, 'Five-star resorts with spa and fine dining', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop', 1),

-- Kerala Packages (dest_id = 2)
('Kerala Backwaters Cruise', 2, 6, 35000, 15, 'Experience serene backwaters with houseboat stay', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', 1),
('Kerala Spice Garden Tour', 2, 5, 28000, 18, 'Visit aromatic spice plantations and ayurveda centers', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=300&fit=crop', 1),
('Kerala Royal Experience', 2, 7, 48000, 12, 'Luxury palace stays and cultural immersion', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', 1),

-- Rajasthan Packages (dest_id = 3)
('Rajasthan Desert Tour', 3, 7, 40000, 25, 'Explore magnificent forts and desert landscapes', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop', 1),
('Rajasthan Golden Triangle', 3, 5, 32000, 30, 'Jaipur, Agra and Delhi with luxury hotels', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', 1),
('Rajasthan Off-Beat Explorer', 3, 8, 45000, 15, 'Remote villages and untouched desert regions', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', 1),

-- Himachal Pradesh Packages (dest_id = 4)
('Shimla Hill Station', 4, 4, 20000, 18, 'Cool mountain retreat with nature walks', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', 1),
('Manali Adventure', 4, 5, 28000, 20, 'Trekking, paragliding and mountain biking', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=300&fit=crop', 1),
('Himachal Nature Escape', 4, 6, 32000, 16, 'Apple orchards, lakes and scenic valleys', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop', 1),

-- Maharashtra Packages (dest_id = 5)
('Mumbai City Explorer', 5, 3, 15000, 30, 'Vibrant city tour with cultural attractions', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=300&fit=crop', 1),
('Mumbai Heritage Walk', 5, 4, 18000, 25, 'Historical monuments and local markets', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', 1),

-- Maldives Package (dest_id = 6)
('Maldives Paradise', 6, 7, 85000, 12, 'Luxury resort stay in crystal clear waters', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', 1),
('Maldives Honeymoon Special', 6, 5, 95000, 2, 'Private villa with butler service and spa', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', 1),

-- West Bengal Packages (dest_id = 7)
('Darjeeling Tea Gardens', 7, 4, 18000, 16, 'Visit the famous tea estates and mountains', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop', 1),
('Darjeeling Sikkim Explorer', 7, 6, 28000, 14, 'Tea gardens, Kanyakumari and mountain views', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop', 1),

-- Uttar Pradesh Packages (dest_id = 8)
('Taj Mahal Tour', 8, 3, 22000, 30, 'Witness the wonder with guided tours', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', 1),
('Taj Mahal & Agra Explorer', 8, 4, 28000, 25, 'Extended Agra tour with local experiences', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', 1),

-- Andaman Packages (dest_id = 9)
('Andaman Islands', 9, 6, 60000, 20, 'Beach exploration and water adventures', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop', 1),
('Andaman Diving Experience', 9, 7, 75000, 15, 'Scuba diving and snorkeling expeditions', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=300&fit=crop', 1),

-- Karnataka Packages (dest_id = 10)
('Coorg Coffee Plantations', 10, 3, 16000, 18, 'Coffee estate tours and nature walks', 'https://images.unsplash.com/photo-1455422695857-09b8171c4f4f?w=400&h=300&fit=crop', 1),
('Coorg Nature Retreat', 10, 4, 22000, 16, 'Waterfalls, valleys and adventure activities', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop', 1),

-- Tamil Nadu Packages (dest_id = 11)
('Tamil Nadu Temple Trail', 11, 5, 26000, 20, 'Ancient temples and spiritual experiences', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', 1),

-- Uttarakhand Packages (dest_id = 12)
('Uttarakhand Adventure Camp', 12, 5, 24000, 20, 'Trekking, camping and river rafting', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=300&fit=crop', 1);

-- ================================================================
-- 3. INSERT PACKAGE DATES
-- ================================================================

-- Goa Beach Paradise dates
INSERT INTO package_dates (package_id, travel_date, available_seats, price_adjustment) VALUES
(1, '2026-02-01', 20, 0),
(1, '2026-02-15', 20, 5000),
(1, '2026-03-01', 18, 3000),
(1, '2026-03-15', 15, 0),

-- Goa Adventure Extreme dates
(2, '2026-02-10', 15, 2000),
(2, '2026-03-10', 14, 1000),
(2, '2026-04-01', 15, -2000),

-- Goa Luxury Retreat dates
(3, '2026-02-05', 10, 10000),
(3, '2026-02-20', 8, 8000),

-- Kerala Backwaters Cruise dates
(4, '2026-02-08', 15, 3000),
(4, '2026-03-08', 14, 2000),
(4, '2026-04-05', 15, -1000),

-- Kerala Spice Garden Tour dates
(5, '2026-02-12', 18, 2000),
(5, '2026-03-12', 16, 1000),

-- Kerala Royal Experience dates
(6, '2026-02-03', 12, 5000),
(6, '2026-03-03', 10, 3000),

-- Rajasthan Desert Tour dates
(7, '2026-02-14', 25, 2000),
(7, '2026-03-14', 20, 0),
(7, '2026-04-01', 25, -3000),

-- Rajasthan Golden Triangle dates
(8, '2026-02-09', 30, 1000),
(8, '2026-03-09', 28, 0),

-- Rajasthan Off-Beat Explorer dates
(9, '2026-02-18', 15, 3000),
(9, '2026-03-18', 14, 1000),

-- Shimla Hill Station dates
(10, '2026-03-05', 18, -2000),
(10, '2026-04-05', 18, 0),
(10, '2026-05-01', 16, 2000),

-- Manali Adventure dates
(11, '2026-03-10', 20, -1000),
(11, '2026-04-10', 19, 1000),
(11, '2026-05-05', 20, 2000),

-- Himachal Nature Escape dates
(12, '2026-03-15', 16, 0),
(12, '2026-04-15', 15, 1000),

-- Mumbai City Explorer dates
(13, '2026-02-01', 30, 0),
(13, '2026-02-15', 28, 0),
(13, '2026-03-01', 30, 0),

-- Mumbai Heritage Walk dates
(14, '2026-02-07', 25, 1000),
(14, '2026-02-21', 24, 500),

-- Maldives Paradise dates
(15, '2026-01-15', 12, 0),
(15, '2026-02-15', 10, 5000),
(15, '2026-03-15', 12, 0),

-- Maldives Honeymoon Special dates
(16, '2026-02-14', 2, 10000),
(16, '2026-03-14', 2, 8000),

-- Darjeeling Tea Gardens dates
(17, '2026-03-01', 16, -1000),
(17, '2026-04-01', 15, 0),

-- Darjeeling Sikkim Explorer dates
(18, '2026-03-10', 14, 0),
(18, '2026-04-10', 13, 1000),

-- Taj Mahal Tour dates
(19, '2026-02-02', 30, 0),
(19, '2026-02-16', 28, 1000),
(19, '2026-03-02', 30, 500),

-- Taj Mahal & Agra Explorer dates
(20, '2026-02-06', 25, 2000),
(20, '2026-03-06', 23, 1000),

-- Andaman Islands dates
(21, '2026-01-20', 20, 2000),
(21, '2026-02-20', 18, 3000),
(21, '2026-03-20', 20, 1000),

-- Andaman Diving Experience dates
(22, '2026-02-10', 15, 5000),
(22, '2026-03-10', 14, 3000),

-- Coorg Coffee Plantations dates
(23, '2026-02-03', 18, 0),
(23, '2026-03-03', 17, 1000),
(23, '2026-04-03', 18, -500),

-- Coorg Nature Retreat dates
(24, '2026-02-14', 16, 2000),
(24, '2026-03-14', 15, 1000),

-- Tamil Nadu Temple Trail dates
(25, '2026-02-20', 20, 1000),
(25, '2026-03-20', 19, 500),

-- Uttarakhand Adventure Camp dates
(26, '2026-04-01', 20, 0),
(26, '2026-05-01', 18, 2000),
(26, '2026-06-01', 20, 3000);

-- ================================================================
-- 4. INSERT BOOKINGS
-- ================================================================

INSERT INTO bookings (user_id, package_id, package_date_id, trip_date, number_of_people, total_amount, status, created_at) VALUES
(2, 1, 1, '2026-02-01', 4, 100000, 'confirmed', NOW()),
(3, 4, 6, '2026-02-08', 2, 70000, 'confirmed', NOW()),
(2, 7, 11, '2026-02-14', 6, 240000, 'pending', NOW()),
(4, 10, 18, '2026-03-05', 3, 60000, 'confirmed', NOW()),
(5, 13, 25, '2026-02-01', 2, 30000, 'confirmed', NOW()),
(3, 15, 31, '2026-01-15', 2, 170000, 'cancelled', NOW()),
(2, 19, 36, '2026-02-02', 4, 88000, 'confirmed', NOW()),
(6, 21, 41, '2026-01-20', 5, 300000, 'confirmed', NOW()),
(4, 5, 7, '2026-02-12', 3, 84000, 'pending', NOW()),
(5, 11, 20, '2026-03-10', 2, 56000, 'confirmed', NOW()),
(3, 2, 3, '2026-02-10', 3, 105000, 'confirmed', NOW()),
(2, 8, 14, '2026-02-09', 5, 160000, 'confirmed', NOW()),
(4, 23, 47, '2026-02-03', 2, 32000, 'pending', NOW()),
(6, 26, 53, '2026-04-01', 4, 96000, 'confirmed', NOW()),
(5, 17, 33, '2026-03-01', 2, 36000, 'confirmed', NOW()),
(3, 25, 49, '2026-02-20', 3, 78000, 'pending', NOW()),
(2, 12, 22, '2026-03-15', 2, 64000, 'confirmed', NOW()),
(4, 14, 29, '2026-02-07', 4, 72000, 'confirmed', NOW()),
(6, 24, 51, '2026-02-14', 2, 44000, 'confirmed', NOW()),
(5, 20, 39, '2026-02-06', 3, 84000, 'pending', NOW());

-- ================================================================
-- 5. INSERT PAYMENTS
-- ================================================================

INSERT INTO payments (booking_id, amount, payment_method, status, transaction_id, paid_on) VALUES
(1, 100000, 'credit_card', 'success', 'TXN001', NOW()),
(2, 70000, 'debit_card', 'success', 'TXN002', NOW()),
(3, 240000, 'netbanking', 'pending', 'TXN003', DATE_ADD(NOW(), INTERVAL 2 DAY)),
(4, 60000, 'upi', 'success', 'TXN004', NOW()),
(5, 30000, 'credit_card', 'success', 'TXN005', NOW()),
(6, 170000, 'credit_card', 'failed', 'TXN006', NOW()),
(7, 88000, 'debit_card', 'success', 'TXN007', NOW()),
(8, 300000, 'netbanking', 'success', 'TXN008', NOW()),
(9, 84000, 'upi', 'pending', 'TXN009', DATE_ADD(NOW(), INTERVAL 1 DAY)),
(10, 56000, 'credit_card', 'success', 'TXN010', NOW()),
(11, 105000, 'debit_card', 'success', 'TXN011', NOW()),
(12, 160000, 'netbanking', 'success', 'TXN012', NOW()),
(13, 32000, 'upi', 'pending', 'TXN013', DATE_ADD(NOW(), INTERVAL 3 DAY)),
(14, 96000, 'credit_card', 'success', 'TXN014', NOW()),
(15, 36000, 'credit_card', 'success', 'TXN015', NOW()),
(16, 78000, 'debit_card', 'pending', 'TXN016', DATE_ADD(NOW(), INTERVAL 2 DAY)),
(17, 64000, 'upi', 'success', 'TXN017', NOW()),
(18, 72000, 'netbanking', 'success', 'TXN018', NOW()),
(19, 44000, 'credit_card', 'success', 'TXN019', NOW()),
(20, 84000, 'upi', 'pending', 'TXN020', DATE_ADD(NOW(), INTERVAL 1 DAY));

-- ================================================================
-- 6. INSERT REVIEWS (tied to packages)
-- ================================================================

INSERT INTO reviews (booking_id, package_id, user_id, rating, title, review_text, created_at) VALUES

-- Goa Beach Paradise Reviews
(1, 1, 2, 5, 'Amazing Beach Paradise!', 'Had an incredible time at Goa. The beaches were pristine, water sports were thrilling, and the evening atmosphere was magical. Highly recommended!', NOW()),
(11, 1, 3, 4, 'Great Package Overall', 'Good value for money. The accommodations were comfortable and the guide was knowledgeable. Some activities could have been better organized.', NOW()),

-- Kerala Backwaters Cruise Reviews
(2, 4, 3, 5, 'Unforgettable Houseboat Experience', 'The backwater cruise was absolutely serene. Waking up to the sound of water and enjoying local cuisine was unforgettable. Worth every rupee!', NOW()),

-- Mumbai City Explorer Reviews
(5, 13, 5, 4, 'Good City Tour', 'Covered most of the major attractions. The guide was informative. Would have liked more time at each location.', NOW()),
(18, 14, 4, 5, 'Heritage Tour Masterpiece', 'Loved the heritage walk through Mumbai. Learned so much about the city\'s history and architecture. Highly recommended for history enthusiasts!', NOW()),

-- Rajasthan Desert Tour Reviews
(12, 7, 2, 5, 'Desert Magic Unfolds', 'The desert landscapes were breathtaking. Sunset in the desert was the highlight. The camel safari was exciting and the cultural shows were entertaining.', NOW()),

-- Andaman Islands Reviews
(8, 21, 6, 5, 'Tropical Paradise Found!', 'Clear waters, white sand beaches, and marine life. Snorkeling was fantastic. The islands are a hidden gem. Definitely coming back!', NOW()),

-- Manali Adventure Reviews
(10, 11, 5, 4, 'Adventure at its Best', 'Great trekking trails and adventure activities. The guides were experienced and safety conscious. Weather was a bit unpredictable.', NOW()),

-- Darjeeling Tea Gardens Reviews
(15, 17, 3, 5, 'Tea Garden Bliss', 'Beautiful tea gardens with stunning mountain views. The tea estate tour was educational and the local food was delicious!', NOW()),

-- Taj Mahal Tour Reviews
(7, 19, 2, 5, 'Taj Mahal Magic', 'Seeing the Taj Mahal was truly magical. The guide explained the history beautifully. The sunrise visit was the perfect time to experience this wonder.', NOW()),
(16, 25, 5, 4, 'Tamil Nadu Sacred Journey', 'Ancient temples with incredible architecture. Spiritual atmosphere was overwhelming. Some temples were crowded during peak hours.', NOW()),

-- Shimla Hill Station Reviews
(4, 10, 4, 4, 'Serene Mountain Escape', 'Perfect getaway from the city chaos. Cool weather, pleasant walks, and local shops. The view from the ridge was spectacular.', NOW()),

-- Coorg Coffee Plantations Reviews
(13, 23, 4, 5, 'Coffee Lover\'s Dream', 'Walked through lush green coffee plantations. Learned about the coffee-making process. Fresh brewed coffee was amazing. Hidden gem of Karnataka!', NOW()),

-- Goa Adventure Extreme Reviews
(3, 2, 2, 5, 'Adrenaline Rush Guaranteed', 'Paragliding experience was thrilling. Island hopping was fun with clear waters. Water sports were well-organized. An adventure lover\'s paradise!', NOW()),

-- Uttarakhand Adventure Camp Reviews
(14, 26, 6, 5, 'Adventure in the Mountains', 'Trekking through beautiful valleys, camping under stars, and river rafting. Everything was perfectly planned. A must-do for adventure seekers!', NOW()),

-- Coorg Nature Retreat Reviews
(19, 24, 6, 5, 'Nature\'s Sanctuary', 'Waterfalls, valleys, and misty mornings. Nature at its best. The adventure activities were well-balanced with relaxation time.', NOW()),

-- Maldives Paradise Reviews
(6, 15, 3, 3, 'Resort Experience', 'Beautiful resort and crystal clear waters. However, the service could have been better and prices were quite high.', NOW());

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Check destinations
SELECT COUNT(*) as total_destinations FROM destinations;

-- Check packages
SELECT COUNT(*) as total_packages FROM packages;

-- Check package dates
SELECT COUNT(*) as total_dates FROM package_dates;

-- Check bookings
SELECT COUNT(*) as total_bookings FROM bookings;
SELECT status, COUNT(*) FROM bookings GROUP BY status;

-- Check payments
SELECT COUNT(*) as total_payments FROM payments;
SELECT status, COUNT(*) FROM payments GROUP BY status;

-- Check reviews
SELECT COUNT(*) as total_reviews FROM reviews;
SELECT AVG(rating) as average_rating FROM reviews;

-- Sample data verification
SELECT p.title, COUNT(pd.package_date_id) as total_dates 
FROM packages p 
LEFT JOIN package_dates pd ON p.package_id = pd.package_id 
GROUP BY p.package_id, p.title;

-- Booking summary
SELECT 
  p.title,
  COUNT(b.booking_id) as total_bookings,
  SUM(b.total_amount) as total_revenue
FROM packages p
LEFT JOIN bookings b ON p.package_id = b.package_id
GROUP BY p.package_id, p.title
ORDER BY total_revenue DESC;

-- ================================================================
-- END OF DUMMY DATA
-- ================================================================
