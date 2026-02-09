#!/bin/bash
# ============================================================================
# COPY-PASTE COMMANDS - Package Dates Fix
# ============================================================================
# Use these commands directly in PowerShell or Command Prompt
# Just copy and paste!
# ============================================================================

echo "📋 COMMANDS TO RUN FOR PACKAGE DATES FIX"
echo "============================================"
echo ""

# ============================================================================
# COMMAND 1: Copy Backend Route File
# ============================================================================
echo "❶ Copy Backend Route File (Windows PowerShell)"
echo "────────────────────────────────────────────────"
echo ""
echo "Copy this entire line and paste in PowerShell:"
echo ""
echo 'Copy-Item "d:\IMS\app1\BACKEND_ROUTE_packageDates.js" "d:\IMS\IMSBackend\routes\packageDates.js"'
echo ""
echo "Or Windows CMD:"
echo ""
echo 'copy "d:\IMS\app1\BACKEND_ROUTE_packageDates.js" "d:\IMS\IMSBackend\routes\packageDates.js"'
echo ""
echo ""

# ============================================================================
# COMMAND 2: Edit Server.js
# ============================================================================
echo "❷ Edit Server.js (MANUAL EDIT REQUIRED)"
echo "─────────────────────────────────────────"
echo ""
echo "File: d:\IMS\IMSBackend\Server.js"
echo ""
echo "Find the section with other route mounts (looks like):"
echo "  app.use('/packages', require('./routes/packages'));"
echo "  app.use('/bookings', require('./routes/bookings'));"
echo ""
echo "Add this new line in that section:"
echo "  app.use('/packageDates', require('./routes/packageDates'));"
echo ""
echo "Save the file."
echo ""
echo ""

# ============================================================================
# COMMAND 3: Restart Backend
# ============================================================================
echo "❸ Restart Backend (Windows PowerShell or CMD)"
echo "──────────────────────────────────────────────"
echo ""
echo "Copy these commands one at a time:"
echo ""
echo "# First, navigate to backend folder:"
echo "cd d:\IMS\IMSBackend"
echo ""
echo "# Then start the server:"
echo "npm start"
echo ""
echo "Expected output:"
echo "  Server is running on port 4000"
echo "  Database connected"
echo ""
echo "If backend is already running, press Ctrl+C first, then run npm start"
echo ""
echo ""

# ============================================================================
# COMMAND 4: Test Backend Endpoint (In NEW Terminal)
# ============================================================================
echo "❹ Test Backend Endpoint (In NEW Terminal/PowerShell)"
echo "─────────────────────────────────────────────────────"
echo ""
echo "Keep backend running, open a new terminal and run:"
echo ""
echo "curl http://localhost:4000/packageDates?package_id=1"
echo ""
echo "Expected response:"
echo "  {"
echo '    "status":"success",'
echo '    "data":[{'
echo '      "package_date_id":1,'
echo '      "package_id":1,'
echo '      "start_date":"2026-02-01",'
echo '      "end_date":"2026-02-05",'
echo '      "seats_total":20,'
echo '      "seats_booked":0'
echo '    }]'
echo "  }"
echo ""
echo "Or use this test that's easier:"
echo ""
echo "curl http://localhost:4000/packageDates/stats"
echo ""
echo "Expected response:"
echo '  {"status":"success","data":{"total_dates":290,"packages_with_dates":24}}'
echo ""
echo ""

# ============================================================================
# COMMAND 5: Restart React Native App (In THIRD Terminal)
# ============================================================================
echo "❺ Restart React Native App (In THIRD Terminal)"
echo "────────────────────────────────────────────────"
echo ""
echo "Copy these commands:"
echo ""
echo "cd d:\IMS\app1"
echo "npx expo start -c"
echo ""
echo "Then press 'a' for Android emulator or 'i' for iOS simulator"
echo ""
echo "Expected result:"
echo "  App opens"
echo "  Go to Packages tab"
echo "  Select a package"
echo "  Booking page shows 8-16 green date buttons"
echo "  Dates are real (start with Feb 2026)"
echo ""
echo ""

# ============================================================================
# VERIFY IMPLEMENTATION
# ============================================================================
echo "✅ VERIFICATION CHECKLIST"
echo "─────────────────────────"
echo ""
echo "After running all commands, verify:"
echo ""
echo "☐ Backend route file exists: d:\IMS\IMSBackend\routes\packageDates.js"
echo "☐ Server.js has new app.use() line for packageDates"
echo "☐ Backend starts without errors"
echo "☐ curl test returns data (not error)"
echo "☐ curl /stats shows 290 total_dates"
echo "☐ Mobile app shows real dates (not 'using fallback')"
echo "☐ Console shows ✅ success message"
echo ""
echo ""

# ============================================================================
# SHORTCUTS
# ============================================================================
echo "⚡ QUICK COPY COMMANDS"
echo "─────────────────────"
echo ""
echo "PowerShell (Copy & Paste):"
echo "  Copy-Item \"d:\IMS\app1\BACKEND_ROUTE_packageDates.js\" \"d:\IMS\IMSBackend\routes\packageDates.js\"; echo 'File copied!'"
echo ""
echo "CMD (Copy & Paste):"
echo "  copy \"d:\IMS\app1\BACKEND_ROUTE_packageDates.js\" \"d:\IMS\IMSBackend\routes\packageDates.js\" && echo File copied!"
echo ""
echo ""

# ============================================================================
# TROUBLESHOOTING
# ============================================================================
echo "🐛 IF SOMETHING GOES WRONG"
echo "──────────────────────────"
echo ""
echo "Error: 404 /packageDates not found"
echo "  → Make sure route is mounted in Server.js"
echo "  → Restart backend"
echo "  → Verify line: app.use('/packageDates', require('./routes/packageDates'));"
echo ""
echo "Error: Database connection error"
echo "  → Check MySQL is running"
echo "  → Verify credentials in db.js"
echo ""
echo "Error: Empty array from API"
echo "  → Check database has data: SELECT COUNT(*) FROM package_dates;"
echo "  → Should return 290"
echo ""
echo "Issue: Still showing fallback data"
echo "  → Clear app cache: npx expo start -c"
echo "  → Verify curl test returns real data first"
echo ""
echo ""

# ============================================================================
# FINAL STATUS
# ============================================================================
echo "═══════════════════════════════════════════════════════════════"
echo "SUMMARY"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Total Commands: 5"
echo "  1. Copy backend file (30 seconds)"
echo "  2. Edit Server.js (1 minute)"
echo "  3. Restart backend (1 minute)"
echo "  4. Test endpoint (30 seconds)"
echo "  5. Restart app (1 minute)"
echo ""
echo "Total Time: ~5-10 minutes"
echo ""
echo "Result: Package dates will display in mobile app UI ✅"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Ready to proceed? Start with Command 1!"
echo ""
