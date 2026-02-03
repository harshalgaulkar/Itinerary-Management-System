# Database Sample Data - Complete Reference

## 📁 Files Available

### **Main SQL File:**
📄 **`sample_data.sql`** - Ready to copy & paste into database

### **Reference Guides:**
📋 **`QUICK_START_DATA_INSERT.md`** - Step-by-step instructions
📋 **`SAMPLE_DATA_TO_INSERT.md`** - Detailed SQL explanations

---

## ⚡ Quick Copy-Paste SQL

If you want to insert data right now, copy this entire block:

```sql
-- 1. INSERT SAMPLE USERS (8 users)
INSERT INTO users (name, email, password, phone, status, created_at, updated_at) VALUES
('Raj Kumar', 'raj@example.com', '$2b$10$hash1', '9876543210', 'active', NOW(), NOW()),
('Priya Singh', 'priya@example.com', '$2b$10$hash2', '9876543211', 'active', NOW(), NOW()),
('Amit Patel', 'amit@example.com', '$2b$10$hash3', '9876543212', 'active', NOW(), NOW()),
('Neha Gupta', 'neha@example.com', '$2b$10$hash4', '9876543213', 'active', NOW(), NOW()),
('Vikram Reddy', 'vikram@example.com', '$2b$10$hash5', '9876543214', 'active', NOW(), NOW()),
('Anjali Sharma', 'anjali@example.com', '$2b$10$hash6', '9876543215', 'active', NOW(), NOW()),
('Rohan Verma', 'rohan@example.com', '$2b$10$hash7', '9876543216', 'active', NOW(), NOW()),
('Divya Nair', 'divya@example.com', '$2b$10$hash8', '9876543217', 'active', NOW(), NOW());

-- 2. INSERT SAMPLE PACKAGES (5 packages)
INSERT INTO packages (name, description, destination, duration, price, status, created_at, updated_at) VALUES
('Bali Paradise', 'Beautiful 5-day trip to Bali', 'Bali, Indonesia', 5, 45000, 'active', NOW(), NOW()),
('Kerala Backwaters', '4-day Kerala tour with houseboat', 'Kerala, India', 4, 40000, 'active', NOW(), NOW()),
('Himachal Adventure', '6-day Himachal trekking tour', 'Himachal Pradesh, India', 6, 55000, 'active', NOW(), NOW()),
('Goa Beach Escape', '3-day beach vacation', 'Goa, India', 3, 35000, 'active', NOW(), NOW()),
('Nepal Mountain Trek', '7-day Everest Base Camp trek', 'Nepal', 7, 65000, 'active', NOW(), NOW());

-- 3. INSERT SAMPLE BOOKINGS (10 bookings)
INSERT INTO bookings (user_id, package_id, booking_date, package_date, status, total_amount, created_at, updated_at) VALUES
(1, 1, '2026-01-20', '2026-02-15', 'confirmed', 50000, '2026-01-20 10:00:00', '2026-01-20 10:00:00'),
(2, 2, '2026-01-21', '2026-02-20', 'confirmed', 45000, '2026-01-21 11:00:00', '2026-01-21 11:00:00'),
(3, 1, '2026-01-22', '2026-03-10', 'confirmed', 50000, '2026-01-22 09:00:00', '2026-01-22 09:00:00'),
(1, 3, '2026-01-15', '2026-01-25', 'completed', 60000, '2026-01-15 14:00:00', '2026-01-15 14:00:00'),
(4, 2, '2026-01-24', '2026-03-15', 'pending', 45000, '2026-01-24 15:30:00', '2026-01-24 15:30:00'),
(5, 4, '2026-01-19', '2026-02-10', 'confirmed', 38000, '2026-01-19 08:00:00', '2026-01-19 08:00:00'),
(6, 5, '2026-01-23', '2026-03-01', 'confirmed', 70000, '2026-01-23 13:00:00', '2026-01-23 13:00:00'),
(7, 1, '2026-01-10', '2026-01-20', 'completed', 50000, '2026-01-10 10:00:00', '2026-01-10 10:00:00'),
(8, 3, '2026-01-25', '2026-04-05', 'pending', 60000, '2026-01-25 16:00:00', '2026-01-25 16:00:00'),
(2, 5, '2026-01-18', '2026-02-28', 'confirmed', 70000, '2026-01-18 09:00:00', '2026-01-18 09:00:00');

-- 4. INSERT SAMPLE PAYMENTS (10 payments)
INSERT INTO payments (booking_id, user_id, amount, status, payment_method, payment_date, transaction_id, created_at, updated_at) VALUES
(1, 1, 50000, 'completed', 'credit_card', '2026-01-20 10:30:00', 'TXN20260120001', '2026-01-20 10:30:00', '2026-01-20 10:30:00'),
(2, 2, 45000, 'completed', 'debit_card', '2026-01-21 11:15:00', 'TXN20260121001', '2026-01-21 11:15:00', '2026-01-21 11:15:00'),
(3, 3, 50000, 'completed', 'online_banking', '2026-01-22 09:45:00', 'TXN20260122001', '2026-01-22 09:45:00', '2026-01-22 09:45:00'),
(4, 1, 60000, 'completed', 'credit_card', '2026-01-15 14:20:00', 'TXN20260115001', '2026-01-15 14:20:00', '2026-01-15 14:20:00'),
(5, 4, 45000, 'pending', 'credit_card', '2026-01-24 15:45:00', 'TXN20260124001', '2026-01-24 15:45:00', '2026-01-24 15:45:00'),
(6, 5, 38000, 'completed', 'debit_card', '2026-01-19 08:30:00', 'TXN20260119001', '2026-01-19 08:30:00', '2026-01-19 08:30:00'),
(7, 6, 70000, 'completed', 'online_banking', '2026-01-23 13:30:00', 'TXN20260123001', '2026-01-23 13:30:00', '2026-01-23 13:30:00'),
(8, 7, 50000, 'completed', 'credit_card', '2026-01-10 10:45:00', 'TXN20260110001', '2026-01-10 10:45:00', '2026-01-10 10:45:00'),
(9, 8, 60000, 'pending', 'credit_card', '2026-01-25 16:30:00', 'TXN20260125001', '2026-01-25 16:30:00', '2026-01-25 16:30:00'),
(10, 2, 70000, 'completed', 'debit_card', '2026-01-18 09:30:00', 'TXN20260118001', '2026-01-18 09:30:00', '2026-01-18 09:30:00');
```

---

## 📊 Data Summary

### What Gets Inserted:

| Type | Count | Total |
|------|-------|-------|
| Users | 8 | 8 total |
| Packages | 5 | 5 total |
| Bookings | 10 | ₹543,000 |
| Payments | 10 | ₹488,000 |

### Booking Status Breakdown:
- ✅ Confirmed: 6 bookings (₹313,000)
- ⏳ Pending: 2 bookings (₹105,000)
- 🏁 Completed: 2 bookings (₹110,000)

### Payment Status Breakdown:
- ✅ Completed: 8 payments (₹398,000)
- ⏳ Pending: 2 payments (₹105,000)

### Booking Date Breakdown:
- 📅 Upcoming: 8 trips (₹433,000)
- 📅 Completed: 2 trips (₹110,000)

---

## 🎯 What You'll See After Insert

### **Admin Dashboard:**
```
📊 Statistics
Total Packages: 5
Total Bookings: 10
Total Revenue: ₹543,000
Total Users: 8
Pending: 2 (₹105,000)
Confirmed: 6 (₹313,000)
Completed: 2 (₹110,000)
Upcoming: 8 (₹433,000)
Past Trips: 2 (₹110,000)

💳 Recent Transactions
Total: 10
Successful: 8
Pending: 2
Failed: 0
```

### **Payment History Page:**
```
Payment Statistics
Total Payments: 10
Total Amount: ₹488,000
Completed: 8
Completed Amount: ₹398,000

Recent Payments Table:
(Shows all 10 bookings as payments)
```

---

## 🔧 How to Insert

### **Method 1: phpMyAdmin (Easiest)**
1. Go to `http://localhost/phpmyadmin`
2. Click "SQL" tab
3. Copy-paste the SQL above
4. Click "Go"

### **Method 2: MySQL Command Line**
```bash
mysql -u root -p your_database < sample_data.sql
```

### **Method 3: MySQL Workbench**
1. Open MySQL Workbench
2. File → Open SQL Script
3. Select `sample_data.sql`
4. Press Ctrl+Enter

---

## ✅ Verify Insertion

```sql
-- Check counts
SELECT COUNT(*) as users FROM users;
SELECT COUNT(*) as packages FROM packages;
SELECT COUNT(*) as bookings FROM bookings;
SELECT COUNT(*) as payments FROM payments;

-- Check totals
SELECT SUM(total_amount) FROM bookings;
SELECT SUM(amount) FROM payments;

-- Check status breakdown
SELECT status, COUNT(*) FROM bookings GROUP BY status;
SELECT status, COUNT(*) FROM payments GROUP BY status;
```

**Expected Output:**
```
users: 8
packages: 5
bookings: 10
payments: 10

SUM(total_amount): 543000
SUM(amount): 488000
```

---

## 🚀 After Insertion

1. **Refresh Admin Dashboard** (F5)
2. **Check browser console** (F12 → Console)
3. **Should see**:
   - ✓ Packages: 5
   - ✓ Bookings: 10
   - ✓ Users: 8
   - ✓ Transactions: 10 (from bookings)

4. **Check PaymentHistory page** - Should show 10 bookings as payments

---

## 🆘 Troubleshooting

| Error | Solution |
|-------|----------|
| Duplicate entry | Data already exists, delete and reinsert |
| Foreign key error | Insert users/packages first, then bookings |
| Table doesn't exist | Check table names, may be different |
| Column doesn't exist | Table structure may be different |

---

## 📝 Notes

- All timestamps use `NOW()` - will be current time
- Passwords are hashed (use any password to login)
- Email addresses are fake (for testing only)
- Phone numbers are sequential
- Transaction IDs are formatted as: TXN20260120001 (YYYYMMDDNNN)

---

## 💡 Quick Links

- **SQL File**: `sample_data.sql`
- **Step-by-Step**: `QUICK_START_DATA_INSERT.md`
- **Detailed Info**: `SAMPLE_DATA_TO_INSERT.md`
- **Admin Dashboard**: `http://localhost:3000/admin`
- **Payment History**: `http://localhost:3000/admin/payments`

Ready to insert? 🚀 Just copy the SQL above and paste it in your database! ✅
