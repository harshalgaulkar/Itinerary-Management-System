-- ================================================================
-- STEP 1: ADD image_url COLUMN TO PACKAGES TABLE
-- Run this FIRST - based on your actual table structure
-- ================================================================

-- Add image_url column AFTER description column
ALTER TABLE packages ADD COLUMN image_url VARCHAR(500) NULL DEFAULT NULL AFTER description;

-- Verify the column was added
DESCRIBE packages;
-- You should now see 'image_url' column

-- ================================================================
-- STEP 2: UPDATE ALL PACKAGES WITH LOCAL IMAGE PATHS
-- Run this AFTER adding the column
-- Uses local paths from public/images folder
-- ================================================================

-- Update by package_id (if you know the IDs)
UPDATE packages SET image_url = '/images/goa-beach.jpg' WHERE package_id = 1;
UPDATE packages SET image_url = '/images/kerala-backwaters.jpg' WHERE package_id = 2;
UPDATE packages SET image_url = '/images/rajasthan-desert.jpg' WHERE package_id = 3;
UPDATE packages SET image_url = '/images/shimla-hills.jpg' WHERE package_id = 4;
UPDATE packages SET image_url = '/images/mumbai-city.jpg' WHERE package_id = 5;

-- OR update by title (more reliable - pick one method)
UPDATE packages SET image_url = '/images/goa-beach.jpg' WHERE title = 'Goa Beach Paradise';
UPDATE packages SET image_url = '/images/kerala-backwaters.jpg' WHERE title = 'Kerala Backwaters';
UPDATE packages SET image_url = '/images/rajasthan-desert.jpg' WHERE title = 'Rajasthan Desert Tour';
UPDATE packages SET image_url = '/images/shimla-hills.jpg' WHERE title = 'Shimla Hill Station';
UPDATE packages SET image_url = '/images/mumbai-city.jpg' WHERE title = 'Mumbai City Explorer';

-- ================================================================
-- STEP 3: VERIFY IMAGES LOADED
-- ================================================================

SELECT package_id, title, image_url FROM packages;
-- You should see all packages with their image_url paths

-- Check how many packages have images:
SELECT COUNT(*) as total_packages, 
       COUNT(image_url) as packages_with_images 
FROM packages;

-- ================================================================
-- IMAGE FILES NEEDED IN public/images/ folder:
-- ================================================================
-- goa-beach.jpg
-- kerala-backwaters.jpg
-- rajasthan-desert.jpg
-- shimla-hills.jpg
-- mumbai-city.jpg
-- ================================================================

