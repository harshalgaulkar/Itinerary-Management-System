Backend debug patch - instructions

What this package provides
- middleware/debugLogger.js  -> Express middleware that logs request headers and body
- routes/debug.js            -> /debug/echo endpoint that echoes headers and body
- app_patch_snippet.txt      -> exact code snippet to add to your main server file (app.js / index.js)
- apply_patch.ps1            -> PowerShell installer to copy files into D:\IMS\IMSBackend

How to apply (PowerShell, run as Administrator)
1) Copy this folder to your backend machine OR run the installer script below from this folder.

From the machine where your backend lives (example steps):

# 1. Copy files into backend (run from this repo folder or adapt paths)
# Open PowerShell as Administrator and run:
# Adjust the destination if your backend is in a different path
$src = "${PWD}\backend-debug-patch"
$dst = "D:\IMS\IMSBackend"

# Create directories and copy files (this is what apply_patch.ps1 does automatically)
New-Item -ItemType Directory -Force -Path (Join-Path $dst 'middleware') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $dst 'routes') | Out-Null
Copy-Item -Force -Path (Join-Path $src 'middleware\debugLogger.js') -Destination (Join-Path $dst 'middleware\debugLogger.js')
Copy-Item -Force -Path (Join-Path $src 'routes\debug.js') -Destination (Join-Path $dst 'routes\debug.js')

# 2. Edit your main server file (app.js / index.js)
# Add (near the top), after express.json() or body-parser middleware:
#    const debugLogger = require('./middleware/debugLogger');
#    app.use(debugLogger);
#    const debugRoutes = require('./routes/debug');
#    app.use('/debug', debugRoutes);
# Save and restart the server (npm run dev or node index.js)

# 3. Test the debug endpoint from the backend machine:
#    Invoke-RestMethod -Uri http://localhost:4000/debug/echo -Method POST -Body (@{ hello='world' } | ConvertTo-Json) -ContentType 'application/json' -Verbose

# 4. Reproduce the frontend booking (use the UI test button). The backend console should show the request details logged by debugLogger.

# 5. Paste the backend console log blocks that show the '--- DEBUG REQUEST START ---' sections into your support request here.

If you want, run the included apply_patch.ps1 which automates steps 1-2 (it will NOT modify your main server file; you'll still need to add the snippet manually).

Security note: debugLogger prints request bodies and headers to console. Use only in a local/dev environment. Remove after debugging.
