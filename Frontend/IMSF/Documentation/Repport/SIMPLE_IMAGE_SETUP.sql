-- ================================================================
-- COMPLETE IMAGE SETUP - USE THIS SQL
-- This will work with placeholder images
-- ================================================================

-- Step 1: Add column if it doesn't exist
ALTER TABLE packages ADD COLUMN image_url VARCHAR(500) NULL DEFAULT NULL AFTER description;

-- Step 2: Update packages with SVG placeholder paths
UPDATE packages SET image_url = '/images/goa-beach.svg' WHERE title = 'Goa Beach Paradise';
UPDATE packages SET image_url = '/images/kerala-backwaters.svg' WHERE title = 'Kerala Backwaters';
UPDATE packages SET image_url = '/images/rajasthan-desert.svg' WHERE title = 'Rajasthan Desert Tour';
UPDATE packages SET image_url = '/images/shimla-hills.svg' WHERE title = 'Shimla Hill Station';
UPDATE packages SET image_url = '/images/mumbai-city.svg' WHERE title = 'Mumbai City Explorer';

-- Step 3: Verify
SELECT package_id, title, image_url FROM packages;

-- ================================================================
-- NOTES:
-- SVG files have been created in public/images/ folder
-- These are simple placeholder images that will display immediately
-- No external downloads needed!
-- ================================================================
