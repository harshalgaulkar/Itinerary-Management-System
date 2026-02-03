# Sample Data for Testing - Database Insert Statements

## Overview
This guide provides sample data to insert into your database for testing the Payment/Transaction functionality.

---

## Sample Bookings Data

Use this SQL to insert test bookings with amounts:

```sql
-- Sample Bookings with amounts
INSERT INTO bookings (user_id, package_id, booking_date, package_date, status, total_amount, created_at, updated_at) VALUES
(1, 1, '2026-01-20', '2026-02-15', 'confirmed', 50000, '2026-01-20 10:00:00', '2026-01-20 10:00:00'),
(2, 2, '2026-01-21', '2026-02-20', 'confirmed', 75000, '2026-01-21 11:00:00', '2026-01-21 11:00:00'),
(3, 1, '2026-01-22', '2026-03-10', 'confirmed', 60000, '2026-01-22 09:00:00', '2026-01-22 09:00:00'),
(1, 3, '2026-01-23', '2026-01-25', 'completed', 45000, '2026-01-23 14:00:00', '2026-01-23 14:00:00'),
(4, 2, '2026-01-24', '2026-03-15', 'pending', 80000, '2026-01-24 15:30:00', '2026-01-24 15:30:00');
```

---

## Sample Payments Data

Insert this if you have a separate payments table:

```sql
-- Sample Payments
INSERT INTO payments (booking_id, user_id, amount, status, payment_method, payment_date, created_at, updated_at) VALUES
(1, 1, 50000, 'completed', 'Credit Card', '2026-01-20 10:30:00', '2026-01-20 10:30:00', '2026-01-20 10:30:00'),
(2, 2, 75000, 'completed', 'Debit Card', '2026-01-21 11:15:00', '2026-01-21 11:15:00', '2026-01-21 11:15:00'),
(3, 3, 60000, 'completed', 'Online Banking', '2026-01-22 09:45:00', '2026-01-22 09:45:00', '2026-01-22 09:45:00'),
(4, 1, 45000, 'completed', 'Credit Card', '2026-01-23 14:20:00', '2026-01-23 14:20:00', '2026-01-23 14:20:00'),
(5, 4, 80000, 'pending', 'Credit Card', '2026-01-24 15:45:00', '2026-01-24 15:45:00', '2026-01-24 15:45:00');
```

---

## Sample Users Data (if needed)

```sql
-- Sample Users
INSERT INTO users (name, email, password, phone, status, created_at, updated_at) VALUES
('Raj Kumar', 'raj@example.com', 'password_hash_1', '9876543210', 'active', '2026-01-01 10:00:00', '2026-01-01 10:00:00'),
('Priya Singh', 'priya@example.com', 'password_hash_2', '9876543211', 'active', '2026-01-02 11:00:00', '2026-01-02 11:00:00'),
('Amit Patel', 'amit@example.com', 'password_hash_3', '9876543212', 'active', '2026-01-03 12:00:00', '2026-01-03 12:00:00'),
('Neha Gupta', 'neha@example.com', 'password_hash_4', '9876543213', 'active', '2026-01-04 13:00:00', '2026-01-04 13:00:00'),
('Vikram Reddy', 'vikram@example.com', 'password_hash_5', '9876543214', 'active', '2026-01-05 14:00:00', '2026-01-05 14:00:00');
```

---

## Sample Packages Data (if needed)

```sql
-- Sample Packages
INSERT INTO packages (name, description, destination, duration, price, status, created_at, updated_at) VALUES
('Bali Paradise', 'Beautiful 5-day trip to Bali with beach activities', 'Bali, Indonesia', 5, 45000, 'active', '2026-01-01 10:00:00', '2026-01-01 10:00:00'),
('Kerala Backwaters', '4-day Kerala tour with houseboat experience', 'Kerala, India', 4, 40000, 'active', '2026-01-01 11:00:00', '2026-01-01 11:00:00'),
('Himachal Adventure', 'Exciting 6-day Himachal Pradesh trekking tour', 'Himachal Pradesh, India', 6, 55000, 'active', '2026-01-01 12:00:00', '2026-01-01 12:00:00');
```

---

## How to Insert Data

### **Option 1: Using phpMyAdmin**
1. Go to phpMyAdmin (usually `localhost/phpmyadmin`)
2. Select your database
3. Click "SQL" tab
4. Copy and paste the SQL above
5. Click "Go"

### **Option 2: Using MySQL CLI**
```bash
mysql -u root -p your_database_name < sample_data.sql
```

### **Option 3: Using MySQL Workbench**
1. Open MySQL Workbench
2. Select your connection
3. Go to File → Open SQL Script
4. Paste the SQL commands
5. Execute (Ctrl+Enter)

---

## Step-by-Step Instructions

### 1. First, Add Users
```sql
INSERT INTO users (name, email, password, phone, status, created_at, updated_at) VALUES
(1, 'Raj Kumar', 'raj@example.com', 'hash123', '9876543210', 'active', NOW(), NOW()),
(2, 'Priya Singh', 'priya@example.com', 'hash123', '9876543211', 'active', NOW(), NOW()),
(3, 'Amit Patel', 'amit@example.com', 'hash123', '9876543212', 'active', NOW(), NOW()),
(4, 'Neha Gupta', 'neha@example.com', 'hash123', '9876543213', 'active', NOW(), NOW());
```

### 2. Then, Add Packages
```sql
INSERT INTO packages (name, destination, price, duration, status, created_at, updated_at) VALUES
(1, 'Bali Trip', 'Bali', 45000, 5, 'active', NOW(), NOW()),
(2, 'Kerala Tour', 'Kerala', 40000, 4, 'active', NOW(), NOW()),
(3, 'Himachal Trek', 'Himachal', 55000, 6, 'active', NOW(), NOW());
```

### 3. Add Bookings
```sql
INSERT INTO bookings (user_id, package_id, status, total_amount, package_date, created_at, updated_at) VALUES
(1, 1, 'confirmed', 45000, '2026-02-15', NOW(), NOW()),
(2, 2, 'confirmed', 40000, '2026-02-20', NOW(), NOW()),
(3, 1, 'confirmed', 45000, '2026-02-25', NOW(), NOW()),
(1, 3, 'completed', 55000, '2026-01-25', NOW(), NOW()),
(4, 2, 'pending', 40000, '2026-03-15', NOW(), NOW());
```

### 4. Add Payments (Optional)
```sql
INSERT INTO payments (booking_id, amount, status, payment_method, created_at, updated_at) VALUES
(1, 45000, 'completed', 'credit_card', NOW(), NOW()),
(2, 40000, 'completed', 'debit_card', NOW(), NOW()),
(3, 45000, 'completed', 'online', NOW(), NOW()),
(4, 55000, 'completed', 'credit_card', NOW(), NOW()),
(5, 40000, 'pending', 'credit_card', NOW(), NOW());
```

---

## What This Data Will Show

After inserting this data, you'll see:

### **Admin Dashboard:**
```
📊 Statistics
├─ Total Packages: 3
├─ Total Bookings: 5
├─ Total Revenue: ₹225,000
├─ Total Users: 4
├─ Pending: 1 (₹40,000)
├─ Confirmed: 3 (₹130,000)
├─ Completed: 1 (₹55,000)
├─ Upcoming: 4 (₹170,000)
└─ Completed: 1 (₹55,000)

💳 Recent Transactions
├─ Total: 5
├─ Successful: 4
├─ Pending: 1
└─ Recent bookings listed...
```

### **Payment History Page:**
```
Payment Statistics
├─ Total Payments: 5
├─ Total Amount: ₹225,000
├─ Completed: 4
└─ Completed Amount: ₹185,000

All Payments Table
├─ Booking 1 | ₹45,000 | Confirmed | Online | 2026-01-20
├─ Booking 2 | ₹40,000 | Confirmed | Online | 2026-01-21
├─ Booking 3 | ₹45,000 | Confirmed | Online | 2026-01-22
├─ Booking 4 | ₹55,000 | Completed | Online | 2026-01-23
└─ Booking 5 | ₹40,000 | Pending | Online | 2026-01-24
```

---

## MySQL Table Structures (if you need to create tables)

### Bookings Table
```sql
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    package_id INT NOT NULL,
    booking_date DATE,
    package_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (package_id) REFERENCES packages(id)
);
```

### Payments Table
```sql
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    user_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(100),
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Packages Table
```sql
CREATE TABLE packages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    destination VARCHAR(255),
    duration INT,
    price DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## Quick Copy-Paste SQL (Complete)

```sql
-- Add Users
INSERT INTO users (id, name, email, password, phone, status, created_at, updated_at) VALUES
(1, 'Raj Kumar', 'raj@example.com', 'pass123', '9876543210', 'active', NOW(), NOW()),
(2, 'Priya Singh', 'priya@example.com', 'pass123', '9876543211', 'active', NOW(), NOW()),
(3, 'Amit Patel', 'amit@example.com', 'pass123', '9876543212', 'active', NOW(), NOW()),
(4, 'Neha Gupta', 'neha@example.com', 'pass123', '9876543213', 'active', NOW(), NOW());

-- Add Packages
INSERT INTO packages (id, name, destination, duration, price, status, created_at, updated_at) VALUES
(1, 'Bali Paradise', 'Bali', 5, 45000, 'active', NOW(), NOW()),
(2, 'Kerala Backwaters', 'Kerala', 4, 40000, 'active', NOW(), NOW()),
(3, 'Himachal Adventure', 'Himachal', 6, 55000, 'active', NOW(), NOW());

-- Add Bookings
INSERT INTO bookings (id, user_id, package_id, status, total_amount, package_date, created_at, updated_at) VALUES
(1, 1, 1, 'confirmed', 45000, '2026-02-15', NOW(), NOW()),
(2, 2, 2, 'confirmed', 40000, '2026-02-20', NOW(), NOW()),
(3, 3, 1, 'confirmed', 45000, '2026-02-25', NOW(), NOW()),
(4, 1, 3, 'completed', 55000, '2026-01-25', NOW(), NOW()),
(5, 4, 2, 'pending', 40000, '2026-03-15', NOW(), NOW());

-- Add Payments (Optional)
INSERT INTO payments (id, booking_id, user_id, amount, status, payment_method, created_at, updated_at) VALUES
(1, 1, 1, 45000, 'completed', 'credit_card', NOW(), NOW()),
(2, 2, 2, 40000, 'completed', 'debit_card', NOW(), NOW()),
(3, 3, 3, 45000, 'completed', 'online', NOW(), NOW()),
(4, 4, 1, 55000, 'completed', 'credit_card', NOW(), NOW()),
(5, 5, 4, 40000, 'pending', 'credit_card', NOW(), NOW());
```

---

## After Inserting Data

1. **Refresh your admin dashboard** - Should see stats populated
2. **Check PaymentHistory page** - Should see all bookings as payments
3. **Check Recent Transactions** - Should see 5 recent bookings
4. **Check console logs** - Should show successful data fetching

---

## If You Get Errors

### Error: "Duplicate entry for key"
- The IDs might already exist
- Remove the `id` column from INSERT:
```sql
INSERT INTO users (name, email, password) VALUES (...)
```

### Error: "Foreign key constraint failed"
- Insert users and packages first, then bookings
- Make sure user_id and package_id exist

### Error: "Column doesn't exist"
- Your table structure might be different
- Check your actual column names in the database
- Adjust the INSERT statements accordingly

---

## Need Different Structure?

Tell me:
1. Your actual table names
2. Your actual column names
3. Any additional fields you have

And I'll create the exact SQL for your database! ✅
