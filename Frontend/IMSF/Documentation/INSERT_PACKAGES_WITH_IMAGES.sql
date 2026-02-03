-- ================================================================
-- PACKAGE DATA WITH IMAGES
-- Real Image URLs for Travel Packages
-- ================================================================

-- OPTION 1: Update existing packages with images
UPDATE packages SET image_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop' WHERE title = 'Goa Beach Paradise';
UPDATE packages SET image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' WHERE title = 'Kerala Backwaters';
UPDATE packages SET image_url = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop' WHERE title = 'Rajasthan Desert Tour';
UPDATE packages SET image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' WHERE title = 'Shimla Hill Station';
UPDATE packages SET image_url = 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=300&fit=crop' WHERE title = 'Mumbai City Explorer';

-- ================================================================
-- OPTION 2: INSERT NEW PACKAGES WITH IMAGES (if you want fresh data)
-- ================================================================

INSERT INTO packages (title, dest_id, duration_days, base_price, max_people, description, image_url, created_by) VALUES
('Goa Beach Paradise', 3, 5, 25000, 20, 'Relax on beautiful beaches with water sports', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', 1),
('Kerala Backwaters', 4, 6, 35000, 15, 'Experience serene backwaters and houseboats', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', 1),
('Rajasthan Desert Tour', 3, 7, 40000, 25, 'Explore magnificent forts and desert landscapes', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop', 1),
('Shimla Hill Station', 5, 4, 20000, 18, 'Cool mountain retreat with nature walks', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', 1),
('Mumbai City Explorer', 6, 3, 15000, 30, 'Vibrant city tour with cultural attractions', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=300&fit=crop', 1),
('Maldives Paradise', 7, 7, 85000, 12, 'Luxury resort stay in crystal clear waters', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', 1),
('Darjeeling Tea Gardens', 8, 4, 18000, 16, 'Visit the famous tea estates and mountains', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop', 1),
('Taj Mahal Tour', 9, 3, 22000, 30, 'Witness the wonder with guided tours', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', 1),
('Andaman Islands', 10, 6, 60000, 20, 'Beach exploration and water adventures', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop', 1),
('Coorg Coffee Plantations', 11, 3, 16000, 18, 'Coffee estate tours and nature walks', 'https://images.unsplash.com/photo-1455422695857-09b8171c4f4f?w=400&h=300&fit=crop', 1);

-- ================================================================
-- IMAGE URLS EXPLANATION
-- ================================================================
-- All images are from Unsplash (free, high-quality)
-- Format: https://images.unsplash.com/photo-[ID]?w=400&h=300&fit=crop
-- 
-- Image URLs used:
-- 1. Goa Beach - Ocean/Beach sunset
-- 2. Kerala Backwaters - Lake/Water landscape
-- 3. Rajasthan Desert - Desert landscape
-- 4. Shimla Hills - Mountain landscape
-- 5. Mumbai City - Urban cityscape
-- 6. Maldives - Tropical resort beach
-- 7. Darjeeling - Mountain tea fields
-- 8. Taj Mahal - Heritage site
-- 9. Andaman - Tropical waters
-- 10. Coorg - Green coffee plantation
-- ================================================================

-- ================================================================
-- ALTERNATIVE: HIGH QUALITY PAID IMAGES (optional)
-- ================================================================
-- You can also use these premium image sources:
-- 
-- Pexels: https://www.pexels.com (free high quality)
-- Pixabay: https://pixabay.com (free stock images)
-- Unsplash: https://unsplash.com (free professional photos)
-- 
-- Just replace the URLs in the queries above
-- ================================================================

-- ================================================================
-- VERIFY DATA
-- ================================================================
-- Run this to check if images loaded correctly:

SELECT package_id, title, base_price, image_url FROM packages WHERE image_url IS NOT NULL;

-- You should see all packages with their image URLs
-- ================================================================
