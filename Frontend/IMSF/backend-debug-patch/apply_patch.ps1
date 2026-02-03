# apply_patch.ps1 - run from this folder in PowerShell (Administrator)
# It copies debug files into D:\IMS\IMSBackend (adjust $dst if different)

$src = Join-Path $PSScriptRoot 'middleware' ; $src2 = Join-Path $PSScriptRoot 'routes'
$dstRoot = 'D:\IMS\IMSBackend'

if (-not (Test-Path $dstRoot)) {
  Write-Host "Destination $dstRoot does not exist. Please update the script or create the folder." -ForegroundColor Red
  exit 1
}

$dstMiddleware = Join-Path $dstRoot 'middleware'
$dstRoutes = Join-Path $dstRoot 'routes'

New-Item -ItemType Directory -Force -Path $dstMiddleware | Out-Null
New-Item -ItemType Directory -Force -Path $dstRoutes | Out-Null

Copy-Item -Force -Path (Join-Path $PSScriptRoot 'middleware\debugLogger.js') -Destination (Join-Path $dstMiddleware 'debugLogger.js')
Copy-Item -Force -Path (Join-Path $PSScriptRoot 'routes\debug.js') -Destination (Join-Path $dstRoutes 'debug.js')

Write-Host "Copied debugLogger.js and debug.js to $dstRoot\middleware and $dstRoot\routes" -ForegroundColor Green
Write-Host "Next: Add the snippet in backend-debug-patch\app_patch_snippet.txt to your main server file (app.js or index.js), then restart the server." -ForegroundColor Yellow

Write-Host "To test the endpoint after restart run:" -ForegroundColor Cyan
Write-Host "Invoke-RestMethod -Uri http://localhost:4000/debug/echo -Method POST -Body (@{ hello = 'world' } | ConvertTo-Json) -ContentType 'application/json' -Verbose"
