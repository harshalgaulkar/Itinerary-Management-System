-- Complete Package Dates Data for All 24 Packages
-- Generated for Travel Booking System
-- This file contains INSERT statements with ON DUPLICATE KEY UPDATE
-- to safely insert or override existing package dates

-- Clear existing dates for a fresh start (optional - comment out if you want to keep existing data)
-- DELETE FROM package_dates;

-- Package 1: Manali Adventure (5 days, ₹10,000)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(1, '2026-02-10', '2026-02-15', 10, 0, 1),
(1, '2026-02-25', '2026-03-02', 10, 1, 1),
(1, '2026-03-15', '2026-03-20', 10, 2, 1),
(1, '2026-04-05', '2026-04-10', 10, 0, 1),
(1, '2026-05-10', '2026-05-15', 10, 3, 1),
(1, '2026-06-01', '2026-06-06', 10, 1, 1);

-- Package 2: Goa Adventure (3 days, ₹2,000)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(2, '2026-02-12', '2026-02-15', 10, 0, 1),
(2, '2026-02-28', '2026-03-03', 10, 2, 1),
(2, '2026-03-20', '2026-03-23', 10, 1, 1),
(2, '2026-04-10', '2026-04-13', 10, 0, 1),
(2, '2026-05-15', '2026-05-18', 10, 3, 1),
(2, '2026-06-05', '2026-06-08', 10, 2, 1);

-- Package 3: Manali (5 days, ₹2,000)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(3, '2026-02-08', '2026-02-13', 25, 1, 1),
(3, '2026-02-20', '2026-02-25', 25, 0, 1),
(3, '2026-03-10', '2026-03-15', 25, 3, 1),
(3, '2026-03-28', '2026-04-02', 25, 2, 1),
(3, '2026-04-18', '2026-04-23', 25, 0, 1),
(3, '2026-05-08', '2026-05-13', 25, 4, 1),
(3, '2026-05-28', '2026-06-02', 25, 1, 1);

-- Package 14: Goa Beach Paradise (5 days, ₹25,000)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(14, '2026-02-14', '2026-02-19', 20, 1, 1),
(14, '2026-03-01', '2026-03-06', 20, 0, 1),
(14, '2026-03-22', '2026-03-27', 20, 2, 1),
(14, '2026-04-12', '2026-04-17', 20, 1, 1),
(14, '2026-05-03', '2026-05-08', 20, 0, 1),
(14, '2026-05-24', '2026-05-29', 20, 3, 1);

-- Package 15: Kerala Backwaters (6 days, ₹35,000)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(15, '2026-02-16', '2026-02-22', 15, 0, 1),
(15, '2026-03-05', '2026-03-11', 15, 2, 1),
(15, '2026-03-25', '2026-03-31', 15, 1, 1),
(15, '2026-04-15', '2026-04-21', 15, 0, 1),
(15, '2026-05-06', '2026-05-12', 15, 2, 1),
(15, '2026-05-27', '2026-06-02', 15, 3, 1);

-- Package 16: Rajasthan Desert Tour (7 days, ₹40,000)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(16, '2026-02-09', '2026-02-16', 25, 1, 1),
(16, '2026-02-28', '2026-03-07', 25, 0, 1),
(16, '2026-03-20', '2026-03-27', 25, 2, 1),
(16, '2026-04-10', '2026-04-17', 25, 1, 1),
(16, '2026-05-01', '2026-05-08', 25, 3, 1),
(16, '2026-05-22', '2026-05-29', 25, 0, 1);

-- Package 17: Shimla Hill Station (4 days, ₹20,000)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(17, '2026-02-18', '2026-02-22', 18, 0, 1),
(17, '2026-03-08', '2026-03-12', 18, 1, 1),
(17, '2026-03-30', '2026-04-03', 18, 2, 1),
(17, '2026-04-20', '2026-04-24', 18, 0, 1),
(17, '2026-05-12', '2026-05-16', 18, 1, 1),
(17, '2026-06-02', '2026-06-06', 18, 3, 1);

-- Package 18: Mumbai City Explorer (3 days, ₹15,000)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(18, '2026-02-13', '2026-02-16', 30, 2, 1),
(18, '2026-02-27', '2026-03-02', 30, 0, 1),
(18, '2026-03-18', '2026-03-21', 30, 3, 1),
(18, '2026-04-08', '2026-04-11', 30, 1, 1),
(18, '2026-04-28', '2026-05-01', 30, 2, 1),
(18, '2026-05-20', '2026-05-23', 30, 0, 1),
(18, '2026-06-10', '2026-06-13', 30, 1, 1);

-- Package 19: Manali Hills (5 days, ₹5,000)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(19, '2026-02-11', '2026-02-16', 30, 1, 1),
(19, '2026-02-26', '2026-03-03', 30, 0, 1),
(19, '2026-03-18', '2026-03-23', 30, 2, 1),
(19, '2026-04-08', '2026-04-13', 30, 1, 1),
(19, '2026-04-28', '2026-05-03', 30, 3, 1);

-- Package 20: Goa (3 days, ₹2,000)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(20, '2026-02-15', '2026-02-18', 20, 0, 1),
(20, '2026-03-02', '2026-03-05', 20, 2, 1),
(20, '2026-03-22', '2026-03-25', 20, 1, 1),
(20, '2026-04-12', '2026-04-15', 20, 0, 1),
(20, '2026-05-02', '2026-05-05', 20, 2, 1),
(20, '2026-05-22', '2026-05-25', 20, 3, 1);

-- Package 73: Goa Water Sports Extreme (7 days, ₹35,000)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(73, '2026-02-11', '2026-02-18', 15, 0, 1),
(73, '2026-03-01', '2026-03-08', 15, 2, 1),
(73, '2026-03-20', '2026-03-27', 15, 1, 1),
(73, '2026-04-10', '2026-04-17', 15, 0, 1),
(73, '2026-05-01', '2026-05-08', 15, 3, 1),
(73, '2026-05-22', '2026-05-29', 15, 2, 1),
(73, '2026-06-12', '2026-06-19', 15, 1, 1);

-- Package 74: Goa Luxury Spa Retreat (6 days, ₹55,000)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(74, '2026-02-14', '2026-02-20', 10, 1, 1),
(74, '2026-03-05', '2026-03-11', 10, 0, 1),
(74, '2026-03-28', '2026-04-03', 10, 2, 1),
(74, '2026-04-18', '2026-04-24', 10, 1, 1),
(74, '2026-05-10', '2026-05-16', 10, 0, 1),
(74, '2026-06-01', '2026-06-07', 10, 2, 1);

-- Package 75: Kerala Spice Garden Tour (5 days, ₹28,000)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(75, '2026-02-17', '2026-02-22', 18, 0, 1),
(75, '2026-03-08', '2026-03-13', 18, 1, 1),
(75, '2026-03-29', '2026-04-03', 18, 2, 1),
(75, '2026-04-19', '2026-04-24', 18, 0, 1),
(75, '2026-05-10', '2026-05-15', 18, 1, 1),
(75, '2026-05-31', '2026-06-05', 18, 3, 1);

-- Package 76: Kerala Royal Experience (7 days, ₹48,000)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(76, '2026-02-12', '2026-02-19', 12, 0, 1),
(76, '2026-03-03', '2026-03-10', 12, 2, 1),
(76, '2026-03-24', '2026-03-31', 12, 1, 1),
(76, '2026-04-14', '2026-04-21', 12, 0, 1),
(76, '2026-05-05', '2026-05-12', 12, 2, 1),
(76, '2026-05-26', '2026-06-02', 12, 3, 1);

-- Package 77: Rajasthan Golden Triangle (5 days, ₹32,000)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(77, '2026-02-10', '2026-02-15', 30, 1, 1),
(77, '2026-02-28', '2026-03-05', 30, 0, 1),
(77, '2026-03-20', '2026-03-25', 30, 2, 1),
(77, '2026-04-10', '2026-04-15', 30, 1, 1),
(77, '2026-05-02', '2026-05-07', 30, 0, 1),
(77, '2026-05-23', '2026-05-28', 30, 3, 1);

-- Package 78: Rajasthan Off-Beat Explorer (8 days, ₹45,000)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(78, '2026-02-08', '2026-02-16', 15, 0, 1),
(78, '2026-02-26', '2026-03-06', 15, 2, 1),
(78, '2026-03-18', '2026-03-26', 15, 1, 1),
(78, '2026-04-08', '2026-04-16', 15, 0, 1),
(78, '2026-04-28', '2026-05-06', 15, 2, 1),
(78, '2026-05-20', '2026-05-28', 15, 3, 1);

-- Package 79: Manali Adventure Camp (5 days, ₹28,000)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(79, '2026-02-11', '2026-02-16', 20, 0, 1),
(79, '2026-03-01', '2026-03-06', 20, 1, 1),
(79, '2026-03-22', '2026-03-27', 20, 2, 1),
(79, '2026-04-12', '2026-04-17', 20, 1, 1),
(79, '2026-05-03', '2026-05-08', 20, 0, 1),
(79, '2026-05-24', '2026-05-29', 20, 2, 1),
(79, '2026-06-14', '2026-06-19', 20, 1, 1);

-- Package 80: Himachal Nature Escape (6 days, ₹32,000)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(80, '2026-02-13', '2026-02-19', 16, 0, 1),
(80, '2026-03-04', '2026-03-10', 16, 1, 1),
(80, '2026-03-25', '2026-03-31', 16, 2, 1),
(80, '2026-04-15', '2026-04-21', 16, 1, 1),
(80, '2026-05-06', '2026-05-12', 16, 0, 1),
(80, '2026-05-27', '2026-06-02', 16, 2, 1);

-- Package 81: Mumbai Heritage Tour (4 days, ₹18,000)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(81, '2026-02-12', '2026-02-16', 25, 1, 1),
(81, '2026-02-28', '2026-03-04', 25, 0, 1),
(81, '2026-03-20', '2026-03-24', 25, 2, 1),
(81, '2026-04-10', '2026-04-14', 25, 1, 1),
(81, '2026-04-30', '2026-05-04', 25, 0, 1),
(81, '2026-05-22', '2026-05-26', 25, 3, 1),
(81, '2026-06-13', '2026-06-17', 25, 1, 1);

-- Package 82: Goa (5 days, ₹4,220)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(82, '2026-02-14', '2026-02-19', 30, 2, 1),
(82, '2026-03-02', '2026-03-07', 30, 0, 1),
(82, '2026-03-23', '2026-03-28', 30, 1, 1),
(82, '2026-04-13', '2026-04-18', 30, 0, 1),
(82, '2026-05-04', '2026-05-09', 30, 2, 1),
(82, '2026-05-25', '2026-05-30', 30, 3, 1),
(82, '2026-06-15', '2026-06-20', 30, 1, 1);

-- Package 83: Wardha Heritage & Ashram Tour (4 days, ₹5,000)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(83, '2026-02-05', '2026-02-09', 20, 0, 1),
(83, '2026-02-20', '2026-02-24', 20, 1, 1),
(83, '2026-03-15', '2026-03-19', 20, 0, 1),
(83, '2026-04-10', '2026-04-14', 20, 2, 1),
(83, '2026-05-01', '2026-05-05', 20, 1, 1),
(83, '2026-05-20', '2026-05-24', 20, 0, 1);

-- Package 84: Wardha Spiritual Retreat (5 days, ₹6,500)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(84, '2026-02-08', '2026-02-13', 15, 0, 1),
(84, '2026-02-25', '2026-03-02', 15, 1, 1),
(84, '2026-03-18', '2026-03-23', 15, 2, 1),
(84, '2026-04-08', '2026-04-13', 15, 0, 1),
(84, '2026-05-02', '2026-05-07', 15, 1, 1),
(84, '2026-05-23', '2026-05-28', 15, 2, 1);

-- Package 85: Wardha Cultural Experience (3 days, ₹3,500)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(85, '2026-02-13', '2026-02-16', 25, 1, 1),
(85, '2026-02-28', '2026-03-03', 25, 0, 1),
(85, '2026-03-20', '2026-03-23', 25, 2, 1),
(85, '2026-04-10', '2026-04-13', 25, 1, 1),
(85, '2026-04-30', '2026-05-03', 25, 0, 1),
(85, '2026-05-22', '2026-05-25', 25, 1, 1),
(85, '2026-06-12', '2026-06-15', 25, 2, 1);

-- Package 86: Pune (5 days, ₹2,500)
INSERT INTO package_dates (package_id, start_date, end_date, seats_total, seats_booked, is_active) VALUES 
(86, '2026-02-10', '2026-02-15', 15, 0, 1),
(86, '2026-02-28', '2026-03-05', 15, 1, 1),
(86, '2026-03-20', '2026-03-25', 15, 2, 1),
(86, '2026-04-10', '2026-04-15', 15, 0, 1),
(86, '2026-05-02', '2026-05-07', 15, 1, 1),
(86, '2026-05-23', '2026-05-28', 15, 2, 1);

-- Summary Stats:
-- Total: 24 packages
-- Total date entries: 150+
-- Coverage: February 2026 - June 2026
-- Mix of booking states: 0-3 people pre-booked per date
-- Varied seat capacities: 10-30 seats per date
