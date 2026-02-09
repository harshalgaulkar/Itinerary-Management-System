-- Create payments table if it doesn't exist
CREATE TABLE IF NOT EXISTS payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  user_id INT NOT NULL,
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  method VARCHAR(50) NOT NULL DEFAULT 'card',
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_transaction_id (transaction_id),
  INDEX idx_booking_id (booking_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- Create payments history view
CREATE OR REPLACE VIEW payment_history AS
SELECT 
  p.payment_id,
  p.booking_id,
  p.user_id,
  p.transaction_id,
  p.amount,
  p.method,
  p.status,
  p.created_at,
  b.user_id as booking_user_id,
  pkg.title as package_name,
  b.persons,
  b.total_price,
  u.full_name,
  u.email
FROM payments p
LEFT JOIN bookings b ON p.booking_id = b.booking_id
LEFT JOIN package_dates pd ON b.package_date_id = pd.package_date_id
LEFT JOIN packages pkg ON pd.package_id = pkg.package_id
LEFT JOIN users u ON p.user_id = u.user_id;
