-- Dummy data for package_itineraries table in fin database
-- This adds itinerary details for various packages

INSERT INTO package_itineraries (package_id, day_number, title, details) VALUES

-- Package 1: Manali Adventure (5 days)
(1, 1, 'Arrival in Manali', 'Arrive at Manali, check-in to hotel, explore local markets, dinner at a local restaurant'),
(1, 2, 'Manali Local Sightseeing', 'Visit Hadimba Temple, Manu Temple, Vashistha Hot Springs, and local cafes'),
(1, 3, 'Adventure Activities', 'Paragliding, rock climbing, or rafting on Beas River'),
(1, 4, 'Rohtang Pass & Adventure', 'Early morning drive to Rohtang Pass, snow activities, return to Manali'),
(1, 5, 'Departure Day', 'Free morning, lunch, and departure from Manali'),

-- Package 2: Goa Adventure (4 days)
(2, 1, 'Arrival in Goa', 'Reach Goa, check-in, relax on beach, sunset beach walk'),
(2, 2, 'Beach & Water Sports', 'Jet skiing, parasailing, banana boat rides at Baga Beach'),
(2, 3, 'Heritage & Culture', 'Visit Basilica of Bom Jesus, Se Cathedral, Old Goa, spice plantations'),
(2, 4, 'Departure', 'Morning at leisure, checkout and departure'),

-- Package 14: Goa Beach Paradise (6 days)
(14, 1, 'Welcome to Goa', 'Arrival, check-in, beach orientation, evening relaxation'),
(14, 2, 'Beach Day 1', 'Swimming, sunbathing, water sports at Calangute Beach'),
(14, 3, 'Spice Tour & Culture', 'Spice plantation tour, cooking class, cultural show'),
(14, 4, 'Island Hopping', 'Boat ride to Divar Island, dolphin spotting, backwater cruise'),
(14, 5, 'Adventure Activities', 'Scuba diving, snorkeling, or banana boat rides'),
(14, 6, 'Departure Day', 'Final beach time and departure'),

-- Package 15: Kerala Backwaters (5 days)
(15, 1, 'Arrival in Kochi', 'Reach Kochi, check-in, explore Fort Kochi heritage area'),
(15, 2, 'Backwater Cruise', 'Full day houseboat cruise through backwaters, lunch on boat'),
(15, 3, 'Village Life Experience', 'Visit spice markets, rubber plantations, local villages'),
(15, 4, 'Beach & Water Activities', 'Beach relaxation, fishing villages, coconut farms'),
(15, 5, 'Departure', 'Morning at leisure, departure'),

-- Package 16: Rajasthan Desert Tour (7 days)
(16, 1, 'Arrive Jaipur', 'Reach Jaipur, hotel check-in, rest'),
(16, 2, 'City Palace & Markets', 'Visit City Palace, Jantar Mantar, explore bazaars'),
(16, 3, 'Amber Fort & Surroundings', 'Elephant ride at Amber Fort, Jaipur city tour'),
(16, 4, 'Jaipur to Jodhpur', 'Travel to Jodhpur, check-in, explore blue city'),
(16, 5, 'Mehrangarh Fort', 'Visit Mehrangarh Fort, desert safari, camel ride'),
(16, 6, 'Jodhpur to Jaisalmer', 'Travel to golden city, explore havelis, desert preparations'),
(16, 7, 'Departure', 'Last-minute shopping and departure'),

-- Package 17: Shimla Hill Station (4 days)
(17, 1, 'Arrival in Shimla', 'Reach Shimla, settle in, Mall Road exploration'),
(17, 2, 'Shimla Sightseeing', 'Christ Church, Viceroy Lodge, local attractions'),
(17, 3, 'Nature & Adventure', 'Hiking, photography, local markets'),
(17, 4, 'Departure', 'Checkout and leave for home'),

-- Package 18: Mumbai City Explorer (3 days)
(18, 1, 'Arrive Mumbai', 'Reach Mumbai, check-in, Marine Drive evening walk'),
(18, 2, 'City Tour', 'Gateway of India, Taj Mahal Palace, street food tour, Bollywood studios'),
(18, 3, 'Markets & Departure', 'Shopping at Linking Road, departure'),

-- Package 19: Manali Hills (5 days)
(19, 1, 'Manali Arrival', 'Arrive Manali, check-in, rest and explore'),
(19, 2, 'Solang Valley', 'Visit Solang Valley, adventure sports, paragliding'),
(19, 3, 'Hirundales Trek', 'Moderate trek through hills, village interaction'),
(19, 4, 'Local Cuisine & Culture', 'Cooking class, traditional meals, cultural evening'),
(19, 5, 'Departure', 'Final sightseeing and departure'),

-- Package 20: Goa (4 days)
(20, 1, 'Welcome to Goa', 'Arrival, resort check-in, beach orientation'),
(20, 2, 'North Goa Beach Day', 'Baga Beach, water sports, flea market, nightlife'),
(20, 3, 'South Goa & Temples', 'Visit temples, Dudhsagar Falls, Portuguese heritage'),
(20, 4, 'Checkout', 'Final beach time, departure');

-- Total: 44 itinerary entries added
-- These cover 9 packages with varying number of days (3-7 days)
