-- ================================================================
-- DIAGNOSTIC: Check if image_url column and data exists
-- ================================================================

-- 1. Check if image_url column exists
DESCRIBE packages;
-- Look for 'image_url' in the column list

-- 2. Check what image URLs are in the database
SELECT package_id, title, image_url FROM packages;

-- 3. Count packages with and without images
SELECT 
    COUNT(*) as total_packages,
    COUNT(image_url) as packages_with_image_url,
    COUNT(CASE WHEN image_url IS NULL THEN 1 END) as packages_without_image_url
FROM packages;

-- ================================================================
-- If image_url column DOESN'T exist, run this:
-- ================================================================
-- ALTER TABLE packages ADD COLUMN image_url VARCHAR(500) NULL DEFAULT NULL AFTER description;

-- ================================================================
-- If image_url column exists but is NULL/empty, run this:
-- ================================================================
-- UPDATE packages SET image_url = '/images/goa-beach.jpg' WHERE title = 'Goa Beach Paradise';
-- UPDATE packages SET image_url = '/images/kerala-backwaters.jpg' WHERE title = 'Kerala Backwaters';
-- UPDATE packages SET image_url = '/images/rajasthan-desert.jpg' WHERE title = 'Rajasthan Desert Tour';
-- UPDATE packages SET image_url = '/images/shimla-hills.jpg' WHERE title = 'Shimla Hill Station';
-- UPDATE packages SET image_url = '/images/mumbai-city.jpg' WHERE title = 'Mumbai City Explorer';
