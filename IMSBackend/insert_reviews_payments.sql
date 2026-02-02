USE fin;

-- Insert Reviews using actual booking IDs
INSERT INTO reviews (package_id, booking_id, user_id, rating, title, comment) VALUES
(1, 95, 1, 5, 'Amazing Adventure!', 'Best experience ever! Great guides and accommodations.'),
(1, 96, 2, 4, 'Wonderful Trip', 'Great package, good accommodation and food'),
(2, 98, 4, 5, 'Beautiful Beaches', 'Beaches were beautiful, staff was very helpful'),
(3, 99, 5, 4, 'Great Value', 'Good value for money, would definitely recommend'),
(14, 101, 2, 5, 'Exceptional Service', 'Exceptional service and beautiful destinations'),
(15, 102, 3, 4, 'Relaxing Experience', 'Loved the backwaters, very relaxing experience'),
(16, 103, 4, 5, 'Highly Recommended', 'Worth every penny, highly recommend to friends!'),
(73, 105, 1, 5, 'Fantastic Water Sports', 'Fantastic water sports, professional guides'),
(82, 106, 2, 5, 'Perfect Goa Holiday', 'Goa was perfect, created great memories');

-- Insert Payments using actual booking IDs
INSERT INTO payments (booking_id, amount, method, status, txn_reference) VALUES
(95, 20000.00, 'card', 'success', 'TXN20260125001'),
(96, 30000.00, 'card', 'success', 'TXN20260124002'),
(97, 10000.00, 'upi', 'pending', 'TXN20260128003'),
(98, 4000.00, 'card', 'success', 'TXN20260127004'),
(99, 8000.00, 'card', 'success', 'TXN20260126005'),
(100, 4000.00, 'upi', 'pending', 'TXN20260128006'),
(101, 7500.00, 'card', 'success', 'TXN20260122007'),
(102, 7000.00, 'card', 'success', 'TXN20260123008'),
(103, 14000.00, 'card', 'success', 'TXN20260124009'),
(104, 5000.00, 'upi', 'pending', 'TXN20260128010'),
(105, 10000.00, 'card', 'success', 'TXN20260120011'),
(106, 15000.00, 'card', 'success', 'TXN20260119012'),
(107, 10000.00, 'netbanking', 'pending', 'TXN20260128013');
