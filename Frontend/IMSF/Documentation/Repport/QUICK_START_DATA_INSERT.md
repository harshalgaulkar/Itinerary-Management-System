# Quick Start Guide - Insert Sample Data

## 🎯 What You Need To Do

Insert the sample data from `sample_data.sql` into your database to test the admin dashboard and payments.

---

## 📋 Step-by-Step Instructions

### **Step 1: Open Your Database Management Tool**

Choose ONE of these:

**Option A: phpMyAdmin (Easiest)**
- URL: `http://localhost/phpmyadmin`
- Login with your credentials

**Option B: MySQL Workbench**
- Open MySQL Workbench
- Connect to your database

**Option C: MySQL Command Line**
```bash
mysql -u root -p
```

---

### **Step 2: Select Your Database**

**In phpMyAdmin:**
1. Click on your database name in the left sidebar

**In MySQL Workbench:**
1. Double-click your connection
2. It will show all databases

**In Command Line:**
```sql
USE your_database_name;
```

---

### **Step 3: Copy the SQL Code**

📄 **File Location**: `sample_data.sql` in the root folder

**Content Summary:**
- 8 Users
- 5 Travel Packages
- 10 Bookings
- 10 Payments

---

### **Step 4: Paste & Execute**

**In phpMyAdmin:**
1. Click "SQL" tab at the top
2. Copy and paste the entire content of `sample_data.sql`
3. Click the blue "Go" button

**In MySQL Workbench:**
1. File → Open SQL Script
2. Select `sample_data.sql`
3. Press Ctrl+Enter to execute

**In Command Line:**
```bash
mysql -u root -p your_database_name < sample_data.sql
```

---

### **Step 5: Verify Data Was Inserted**

Run these queries to verify:

```sql
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_packages FROM packages;
SELECT COUNT(*) as total_bookings FROM bookings;
SELECT COUNT(*) as total_payments FROM payments;
```

**Expected Results:**
```
total_users: 8
total_packages: 5
total_bookings: 10
total_payments: 10
```

---

### **Step 6: Check Revenue**

```sql
SELECT SUM(total_amount) as total_revenue FROM bookings;
SELECT SUM(amount) as total_payments_amount FROM payments;
SELECT COUNT(*) as completed_count FROM payments WHERE status = 'completed';
```

**Expected Results:**
```
total_revenue: 543000
total_payments_amount: 488000
completed_count: 8
```

---

## 🔄 Refresh & Test

### **In Browser:**
1. Open Admin Dashboard: `http://localhost:3000/admin`
2. Press **F5** or **Ctrl+R** to refresh
3. You should now see:

```
✓ Packages: 5
✓ Bookings: 10
  → Pending: 2 (₹105,000)
  → Confirmed: 6 (₹313,000)
  → Completed: 2 (₹110,000)
✓ Transactions: 10
  → Successful: 8
  → Pending: 2
```

### **In Console (F12 → Console Tab):**
Look for:
```
✓ Packages: 5
✓ Bookings: 10
📊 Sample booking structure: {...}
✓ Using 10 bookings as transactions
✓ Transactions loaded successfully!
```

---

## 📊 What You'll See

### **Admin Dashboard Stats:**
```
Total Packages: 5
Total Bookings: 10
Total Revenue: ₹543,000
Total Users: 8

Pending: 2 (₹105,000)
Confirmed: 6 (₹313,000)
Completed: 2 (₹110,000)

Upcoming Bookings: 8 (₹433,000)
Completed Bookings: 2 (₹110,000)
```

### **Recent Transactions:**
```
Total Transactions: 10
Successful: 8
Pending: 2
Failed: 0

Recent Transactions Table:
(Shows 10 most recent bookings as transactions)
```

### **Payment History Page:**
```
Total Payments: 10
Total Amount: ₹488,000
Completed: 8
Completed Amount: ₹398,000

All Payments Table:
(Shows all 10 bookings as payments)
```

---

## ❌ If You Get an Error

### **Error: "Duplicate entry for key"**
- Someone already inserted the data
- Run this to clear:
```sql
DELETE FROM payments;
DELETE FROM bookings;
DELETE FROM packages;
DELETE FROM users;
```
Then paste the SQL again.

### **Error: "Foreign key constraint failed"**
- The order of insertion is wrong
- The SQL file should handle this automatically
- If not, make sure tables exist in this order:
  1. users
  2. packages
  3. bookings
  4. payments

### **Error: "Table doesn't exist"**
- Your table names might be different
- Check what tables you have:
```sql
SHOW TABLES;
```
Let me know and I'll update the SQL.

### **Error: "Column doesn't exist"**
- Your columns might be named differently
- Check your table structure:
```sql
DESCRIBE users;
DESCRIBE bookings;
DESCRIBE packages;
DESCRIBE payments;
```
Tell me the actual column names and I'll create custom SQL.

---

## 🎯 Quick Checklist

- [ ] Opened database management tool
- [ ] Selected correct database
- [ ] Copied `sample_data.sql` content
- [ ] Pasted into SQL editor
- [ ] Executed (clicked Go/Run)
- [ ] Verified with SELECT COUNT queries
- [ ] Refreshed admin dashboard in browser
- [ ] See data in dashboard stats
- [ ] See transactions in Recent Transactions section
- [ ] See payments in Payment History page

---

## 📞 Need Help?

If you get stuck:
1. Run `SHOW TABLES;` to see all tables
2. Run `DESCRIBE table_name;` to see columns
3. Check console errors (F12 → Console)
4. Share the error message with me

I can create custom SQL based on your actual table structure! ✅

---

## 🚀 Next Steps After Data Insertion

1. **Test Admin Dashboard**: Check all stats appear
2. **Test Payment History**: Should show all bookings
3. **Test Filters**: Try filtering by status
4. **Check Console**: Should show all data fetched successfully
5. **Test Search**: Search for booking IDs

Everything should work now! 🎉
