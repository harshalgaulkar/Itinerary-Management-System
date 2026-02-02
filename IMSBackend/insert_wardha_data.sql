USE fin;

-- Insert Wardha Packages
INSERT INTO packages (title, dest_id, duration_days, base_price, max_people, description, image_url, created_by) VALUES
('Wardha Heritage & Ashram Tour', 19, 4, 5000.00, 20, 'Explore the spiritual and historical heritage of Wardha with visits to Sevagram Ashram', '/images/wardha-ashram.jpg', 1),
('Wardha Spiritual Retreat', 19, 5, 6500.00, 15, 'Deep spiritual experience with meditation, yoga, and ashram activities in peaceful Wardha', '/images/wardha-spiritual.jpg', 1),
('Wardha Cultural Experience', 19, 3, 3500.00, 25, 'Discover local culture, traditional crafts, and authentic village life in Wardha', '/images/wardha-culture.jpg', 1);

-- Insert Wardha Package Dates
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES
(83, '2026-02-05', '2026-02-09', 20, 0, 1),
(83, '2026-03-15', '2026-03-19', 20, 2, 1),
(83, '2026-04-10', '2026-04-14', 20, 1, 1),
(84, '2026-02-10', '2026-02-15', 15, 0, 1),
(84, '2026-03-20', '2026-03-25', 15, 2, 1),
(84, '2026-04-15', '2026-04-20', 15, 1, 1),
(85, '2026-02-15', '2026-02-18', 25, 0, 1),
(85, '2026-03-25', '2026-03-28', 25, 3, 1),
(85, '2026-04-20', '2026-04-23', 25, 2, 1);

-- Insert Wardha Itineraries for Package 83 (Heritage & Ashram Tour - 4 days)
INSERT INTO package_itineraries (package_id, day_number, title, details) VALUES
(83, 1, 'Arrival in Wardha', 'Arrive in Wardha, check into heritage hotel, orientation walk through local market'),
(83, 2, 'Sevagram Ashram Tour', 'Visit Sevagram Ashram, learn about Gandhian philosophy and principles of Satyagraha'),
(83, 3, 'Heritage Sites', 'Explore Adhartal Fort, ancient temples, and traditional artisan workshops'),
(83, 4, 'Local Culture & Departure', 'Participate in local handicraft demonstrations, final shopping, and departure');

-- Insert Wardha Itineraries for Package 84 (Spiritual Retreat - 5 days)
INSERT INTO package_itineraries (package_id, day_number, title, details) VALUES
(84, 1, 'Ashram Arrival', 'Welcome to ashram, room assignment, meditation and yoga orientation session'),
(84, 2, 'Spiritual Practice Day 1', 'Morning yoga and meditation, learning about ashram lifestyle and philosophy'),
(84, 3, 'Spiritual Practice Day 2', 'Advanced meditation techniques, afternoon ashram service activities, evening satsang'),
(84, 4, 'Cultural Immersion', 'Attend traditional prayer ceremonies, interact with ashram residents, vegetarian cooking class'),
(84, 5, 'Renewal and Departure', 'Final meditation session, yoga session, farewell ceremony, and departure');

-- Insert Wardha Itineraries for Package 85 (Cultural Experience - 3 days)
INSERT INTO package_itineraries (package_id, day_number, title, details) VALUES
(85, 1, 'Cultural Welcome', 'Arrive in Wardha, visit local villages, interact with artisans and farmers'),
(85, 2, 'Artisan Workshops', 'Experience traditional weaving, pottery, and khadi-making techniques with local craftspeople'),
(85, 3, 'Village Experience & Departure', 'Participate in village activities, taste authentic local cuisine, cultural evening program, departure');

-- Insert Wardha Bookings
INSERT INTO bookings (user_id, package_date_id, persons, total_price, status, contact_phone, notes) VALUES
(1, 112, 2, 10000.00, 'confirmed', '9876543210', 'Interested in Gandhian history'),
(2, 113, 3, 15000.00, 'confirmed', '9876543211', 'Spiritual retreat seekers'),
(3, 114, 2, 10000.00, 'pending', '9876543212', 'Family visit'),
(4, 115, 4, 26000.00, 'confirmed', '9876543213', 'Group meditation'),
(5, 116, 2, 13000.00, 'pending', '9876543214', 'Couple retreat'),
(1, 117, 3, 10500.00, 'confirmed', '9876543210', 'Cultural tourism'),
(2, 118, 5, 17500.00, 'confirmed', '9876543211', 'Village stay'),
(3, 119, 2, 7000.00, 'pending', '9876543212', 'Craft learning');

-- Insert Wardha Reviews
INSERT INTO reviews (package_id, booking_id, user_id, rating, title, comment) VALUES
(83, 108, 1, 5, 'Enlightening Experience', 'Perfect blend of history and spirituality. Guides were knowledgeable and kind.'),
(83, 109, 2, 4, 'Great Heritage Tour', 'Loved learning about Gandhi and ashram life. Well organized.'),
(84, 110, 3, 5, 'Transformative Retreat', 'Amazing spiritual experience. Very peaceful and rejuvenating.'),
(84, 111, 4, 5, 'Highly Spiritual', 'Best meditation retreat I have attended. Highly recommended.'),
(85, 112, 5, 4, 'Cultural Discovery', 'Excellent cultural immersion. Learned traditional crafts from artisans.'),
(85, 113, 1, 4, 'Authentic Experience', 'Really enjoyed village life and meeting local craftspeople.');

-- Insert Wardha Payments
INSERT INTO payments (booking_id, amount, method, status, txn_reference) VALUES
(108, 10000.00, 'card', 'success', 'TXN20260205001'),
(109, 15000.00, 'card', 'success', 'TXN20260205002'),
(110, 10000.00, 'upi', 'pending', 'TXN20260205003'),
(111, 26000.00, 'card', 'success', 'TXN20260205004'),
(112, 13000.00, 'card', 'success', 'TXN20260205005'),
(113, 10500.00, 'card', 'success', 'TXN20260205006'),
(114, 17500.00, 'netbanking', 'success', 'TXN20260205007'),
(115, 7000.00, 'upi', 'pending', 'TXN20260205008');
