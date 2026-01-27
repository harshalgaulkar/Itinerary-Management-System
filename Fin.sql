-- Travel Management System: 7 tables (MySQL)


create database fin;

use  fin;

-- 1) users (customers + admins)
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150),
  phone VARCHAR(30),
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2) destinations (with image column)
CREATE TABLE IF NOT EXISTS destinations (
  dest_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  country VARCHAR(100),
  description TEXT,
  image VARCHAR(255),            -- filename or relative path, e.g. "manali_163423.jpg"
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY ux_name_country (name, country)
);

-- 3) packages (package master)
CREATE TABLE IF NOT EXISTS packages (
  package_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  dest_id INT NOT NULL,          -- fk -> destinations
  duration_days INT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  max_people INT DEFAULT 0,      -- 0 = unlimited
  description TEXT,
  created_by INT,                -- fk -> users (admin)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dest_id) REFERENCES destinations(dest_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_dest (dest_id)
);

-- 4) package_dates (specific runs / starts)
CREATE TABLE IF NOT EXISTS package_dates (
  package_date_id INT AUTO_INCREMENT PRIMARY KEY,
  package_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  seats_total INT DEFAULT 0,     -- 0 = unlimited
  seats_booked INT DEFAULT 0,
  price_override DECIMAL(10,2) DEFAULT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (package_id) REFERENCES packages(package_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CHECK (end_date >= start_date),
  INDEX idx_package_start (package_id, start_date)
);

-- 5) package_itineraries (day-by-day)
CREATE TABLE IF NOT EXISTS package_itineraries (
  itinerary_id INT AUTO_INCREMENT PRIMARY KEY,
  package_id INT NOT NULL,
  day_number INT NOT NULL,
  title VARCHAR(200),
  details TEXT,
  UNIQUE KEY ux_package_day (package_id, day_number),
  FOREIGN KEY (package_id) REFERENCES packages(package_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6) bookings (user reservations for a package_date)
CREATE TABLE IF NOT EXISTS bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  package_date_id INT NOT NULL,
  booked_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  persons INT NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  status ENUM('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
  contact_phone VARCHAR(30),
  notes TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (package_date_id) REFERENCES package_dates(package_date_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_package_date (package_date_id)
);

-- 7) payments (audit of payments)
CREATE TABLE IF NOT EXISTS payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  paid_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  amount DECIMAL(10,2) NOT NULL,
  method ENUM('card','upi','netbanking','cash','other') DEFAULT 'card',
  status ENUM('success','failed','pending') DEFAULT 'pending',
  txn_reference VARCHAR(255),
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_booking (booking_id)
);

-- 8) reviews (user reviews and ratings for packages)
CREATE TABLE IF NOT EXISTS reviews (
  review_id INT AUTO_INCREMENT PRIMARY KEY,
  package_id INT NOT NULL,
  booking_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (package_id) REFERENCES packages(package_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY ux_booking_review (booking_id),
  INDEX idx_package (package_id),
  INDEX idx_user (user_id),
  INDEX idx_rating (rating)
);






