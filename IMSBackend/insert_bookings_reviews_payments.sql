USE fin;

-- Insert Bookings
INSERT INTO bookings (user_id, package_date_id, persons, total_price, status, contact_phone, notes) VALUES
(1, 1, 2, 20000.00, 'confirmed', '9876543210', 'Early morning start preferred'),
(2, 1, 3, 30000.00, 'confirmed', '9876543211', 'Vegetarian meals required'),
(3, 1, 1, 10000.00, 'pending', '9876543212', 'Solo traveler'),
(4, 2, 2, 4000.00, 'confirmed', '9876543213', 'Couple package'),
(5, 3, 4, 8000.00, 'confirmed', '9876543214', 'Family of 4'),
(1, 3, 2, 4000.00, 'pending', '9876543210', 'Anniversary trip'),
(2, 9, 3, 7500.00, 'confirmed', '9876543211', 'Group booking'),
(3, 10, 2, 7000.00, 'confirmed', '9876543212', 'Honeymoon package'),
(4, 11, 4, 14000.00, 'confirmed', '9876543213', 'Family vacation'),
(5, 12, 2, 5000.00, 'pending', '9876543214', 'Short getaway'),
(1, 109, 2, 10000.00, 'confirmed', '9876543210', 'Water sports enthusiasts'),
(2, 110, 3, 15000.00, 'confirmed', '9876543211', 'Group adventure'),
(3, 111, 2, 10000.00, 'pending', '9876543212', 'Weekend trip');

-- Insert Reviews (need to get package_id from bookings first)
INSERT INTO reviews (package_id, booking_id, user_id, rating, title, comment) VALUES
(1, 1, 1, 5, 'Amazing Adventure!', 'Best experience ever! Great guides and accommodations.'),
(1, 2, 2, 4, 'Wonderful Trip', 'Great package, good accommodation and food'),
(2, 4, 4, 5, 'Beautiful Beaches', 'Beaches were beautiful, staff was very helpful'),
(3, 5, 5, 4, 'Great Value', 'Good value for money, would definitely recommend'),
(14, 7, 2, 5, 'Exceptional Service', 'Exceptional service and beautiful destinations'),
(15, 8, 3, 4, 'Relaxing Experience', 'Loved the backwaters, very relaxing experience'),
(16, 9, 4, 5, 'Highly Recommended', 'Worth every penny, highly recommend to friends!'),
(73, 11, 1, 5, 'Fantastic Water Sports', 'Fantastic water sports, professional guides'),
(82, 12, 2, 5, 'Perfect Goa Holiday', 'Goa was perfect, created great memories');

-- Insert Payments
INSERT INTO payments (booking_id, amount, method, status, txn_reference) VALUES
(1, 20000.00, 'card', 'success', 'TXN20260125001'),
(2, 30000.00, 'card', 'success', 'TXN20260124002'),
(3, 10000.00, 'upi', 'pending', 'TXN20260128003'),
(4, 4000.00, 'card', 'success', 'TXN20260127004'),
(5, 8000.00, 'card', 'success', 'TXN20260126005'),
(6, 4000.00, 'upi', 'pending', 'TXN20260128006'),
(7, 7500.00, 'card', 'success', 'TXN20260122007'),
(8, 7000.00, 'card', 'success', 'TXN20260123008'),
(9, 14000.00, 'card', 'success', 'TXN20260124009'),
(10, 5000.00, 'upi', 'pending', 'TXN20260128010'),
(11, 10000.00, 'card', 'success', 'TXN20260120011'),
(12, 15000.00, 'card', 'success', 'TXN20260119012'),
(13, 10000.00, 'netbanking', 'pending', 'TXN20260128013');
