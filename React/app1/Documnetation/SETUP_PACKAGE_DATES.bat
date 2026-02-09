@echo off
REM ============================================================================
REM QUICK SETUP COMMANDS - Package Dates Fix
REM ============================================================================
REM Copy these commands and run them in Windows Command Prompt
REM ============================================================================

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║       PACKAGE DATES FIX - SETUP COMMANDS                       ║
echo ║       Total Time: 5-10 minutes                                 ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo.
echo STEP 1: Copy Backend Route File
echo ────────────────────────────────────────────────────────────────
echo.
echo File Source: d:\IMS\app1\BACKEND_ROUTE_packageDates.js
echo File Target: d:\IMS\IMSBackend\routes\packageDates.js
echo.
echo Run this command:
echo.
echo copy "d:\IMS\app1\BACKEND_ROUTE_packageDates.js" "d:\IMS\IMSBackend\routes\packageDates.js"
echo.
pause

echo.
echo STEP 2: Edit Server.js
echo ────────────────────────────────────────────────────────────────
echo.
echo File: d:\IMS\IMSBackend\Server.js
echo.
echo Instructions:
echo  1. Open Server.js in your editor
echo  2. Find the app.use() route mounting section
echo  3. Add this line (with the other route mounts):
echo.
echo    app.use('/packageDates', require('./routes/packageDates'));
echo.
echo Example location:
echo  app.use('/packages', require('./routes/packages'));
echo  app.use('/packageDates', require('./routes/packageDates'));  ^<-- ADD THIS
echo  app.use('/bookings', require('./routes/bookings'));
echo.
echo  4. Save the file
echo.
pause

echo.
echo STEP 3: Restart Backend Server
echo ────────────────────────────────────────────────────────────────
echo.
echo Instructions:
echo  1. If backend is running, press Ctrl+C to stop it
echo  2. Navigate to backend folder:
echo.
echo     cd d:\IMS\IMSBackend
echo.
echo  3. Start the server:
echo.
echo     npm start
echo.
echo Expected output:
echo  Server is running on port 4000
echo  Database connected
echo.
echo Keep this window open with the backend running!
echo.
echo Press any key to continue...
pause

echo.
echo STEP 4: Test Backend Endpoint
echo ────────────────────────────────────────────────────────────────
echo.
echo Open a NEW Command Prompt window and run:
echo.
echo curl http://localhost:4000/packageDates?package_id=1
echo.
echo Expected response: JSON with package dates (not an error)
echo.
echo Or test the stats endpoint:
echo.
echo curl http://localhost:4000/packageDates/stats
echo.
echo Expected response: ^{"status":"success","data":{"total_dates":290,"packages_with_dates":24}^}
echo.
pause

echo.
echo STEP 5: Restart React Native App
echo ────────────────────────────────────────────────────────────────
echo.
echo Open a THIRD Command Prompt window and run:
echo.
echo cd d:\IMS\app1
echo npx expo start -c
echo.
echo Then press 'a' for Android emulator or 'i' for iOS simulator
echo.
echo Expected result:
echo  - App opens
echo  - Go to Packages tab
echo  - Select any package
echo  - Booking page shows 8-16 green date buttons
echo  - Dates appear as real dates (start with Feb 2026)
echo.
pause

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                      IMPLEMENTATION COMPLETE                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Verification Checklist:
echo.
echo [_] Backend route file copied to IMSBackend\routes\packageDates.js
echo [_] Server.js has new app.use() line
echo [_] Backend server started successfully
echo [_] curl test returns data (not 404 error)
echo [_] curl /stats shows 290 total_dates
echo [_] Mobile app shows real dates in UI
echo [_] Console shows success message
echo.
echo If all items are checked, you're done! ✓
echo.
echo Common Issues:
echo.
echo Issue: 404 error on /packageDates
echo  → Check route is mounted in Server.js
echo  → Restart backend
echo.
echo Issue: Empty data array
echo  → Check MySQL is running
echo  → Verify database connection
echo.
echo Issue: Still showing fallback data
echo  → Run: npx expo start -c (clears cache)
echo  → Check curl test works first
echo.
pause

echo.
echo For more detailed instructions, read:
echo  - QUICK_FIX.md (3 minutes)
echo  - IMPLEMENTATION_STEPS.md (10 minutes)
echo  - README_PACKAGE_DATES_FIX.md (overview)
echo.

echo Done! Press any key to exit...
pause
