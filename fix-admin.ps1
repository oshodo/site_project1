# Run this to create/fix admin user on Render API
$BASE = "https://sabaisale.onrender.com/api"

Write-Host "Checking API health..." -ForegroundColor Cyan
try {
  $health = Invoke-RestMethod -Uri "$BASE/health" -Method GET
  Write-Host "API is online!" -ForegroundColor Green
} catch {
  Write-Host "API not responding. Wait 30 seconds and try again." -ForegroundColor Red
  exit
}

Write-Host "Registering admin user..." -ForegroundColor Cyan
try {
  $r = Invoke-RestMethod -Uri "$BASE/auth/register" -Method POST -ContentType "application/json" -Body '{"name":"Jeevan Shakya","email":"jeevan@sabaisale.com","password":"Jeevan@Sabaisale"}'
  Write-Host "Admin registered! Token: $($r.token.Substring(0,20))..." -ForegroundColor Green
} catch {
  Write-Host "User may already exist - trying login..." -ForegroundColor Yellow
  try {
    $r = Invoke-RestMethod -Uri "$BASE/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"jeevan@sabaisale.com","password":"Jeevan@Sabaisale"}'
    Write-Host "Login successful!" -ForegroundColor Green
  } catch {
    Write-Host "Login failed. Check credentials." -ForegroundColor Red
    exit
  }
}

Write-Host ""
Write-Host "NOW: Go to Atlas -> sabaisale -> users -> set role to 'admin' for jeevan@sabaisale.com" -ForegroundColor Yellow
Write-Host "Then login at https://sabaisale.vercel.app/login" -ForegroundColor Cyan
