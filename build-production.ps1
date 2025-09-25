# Build script for production deployment to public_HTML

Write-Host "Building Angular frontend and PHP backend for production..." -ForegroundColor Green

# Create dist directory
if (!(Test-Path "dist")) { New-Item -ItemType Directory -Path "dist" }
if (!(Test-Path "dist\backend")) { New-Item -ItemType Directory -Path "dist\backend" }
if (!(Test-Path "dist\backend\api")) { New-Item -ItemType Directory -Path "dist\backend\api" }
if (!(Test-Path "dist\backend\config")) { New-Item -ItemType Directory -Path "dist\backend\config" }

# Build Angular frontend for production
Write-Host "Building Angular frontend..." -ForegroundColor Yellow
Set-Location frontend
& ng build --configuration production --output-path ../dist/frontend
Set-Location ..

# Copy PHP backend files
Write-Host "Copying PHP backend files..." -ForegroundColor Yellow
Copy-Item -Path "backend\*.php" -Destination "dist\backend\" -Recurse -Force
Copy-Item -Path "backend\api\*" -Destination "dist\backend\api\" -Recurse -Force
Copy-Item -Path "backend\config\*" -Destination "dist\backend\config\" -Recurse -Force
Copy-Item -Path "backend\database.sql" -Destination "dist\backend\" -Force

Write-Host ""
Write-Host "Build complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Files ready for upload to public_HTML:" -ForegroundColor Cyan
Write-Host "- Frontend: dist/frontend/ (upload contents to public_HTML root)" -ForegroundColor White
Write-Host "- Backend: dist/backend/ (upload to public_HTML/api/ or subdirectory)" -ForegroundColor White
Write-Host "- Database: Run dist/backend/database.sql on your MySQL server" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update database.php with your hosting database credentials" -ForegroundColor White
Write-Host "2. Upload dist/frontend/* to public_HTML/" -ForegroundColor White
Write-Host "3. Upload dist/backend/* to public_HTML/api/" -ForegroundColor White
Write-Host "4. Import database.sql to your MySQL database" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue"