# Test Backend Endpoints

$baseUrl = "http://localhost:3000"

Write-Host "=== Testing AI Finance Backend Endpoints ===" -ForegroundColor Green
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing /health endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "$baseUrl/health" -Method GET -SkipHttpErrorCheck
    Write-Host "Status: $($healthResponse.StatusCode)"
    Write-Host "Response: $($healthResponse.Content)"
}
catch {
    Write-Host "Error: $_"
}
Write-Host ""

# Test 2: Get Users
Write-Host "2. Testing GET /api/users..." -ForegroundColor Yellow
try {
    $usersResponse = Invoke-WebRequest -Uri "$baseUrl/api/users" -Method GET -SkipHttpErrorCheck
    Write-Host "Status: $($usersResponse.StatusCode)"
    Write-Host "Response: $($usersResponse.Content)"
}
catch {
    Write-Host "Error: $_"
}
Write-Host ""

# Test 3: Create User
Write-Host "3. Testing POST /api/users (Create User)..." -ForegroundColor Yellow
try {
    $userBody = @{
        name     = "John Doe"
        email    = "john@example.com"
        password = "secure123"
    } | ConvertTo-Json

    $createUserResponse = Invoke-WebRequest -Uri "$baseUrl/api/users" `
        -Method POST `
        -ContentType "application/json" `
        -Body $userBody `
        -SkipHttpErrorCheck
    Write-Host "Status: $($createUserResponse.StatusCode)"
    Write-Host "Response: $($createUserResponse.Content)"
}
catch {
    Write-Host "Error: $_"
}
Write-Host ""

# Test 4: Financial Summary
Write-Host "4. Testing POST /api/summary..." -ForegroundColor Yellow
try {
    $summaryBody = @{
        income   = @(@{ amount = 5000 })
        expenses = @(@{ amount = 1200 }, @{ amount = 400 })
    } | ConvertTo-Json

    $summaryResponse = Invoke-WebRequest -Uri "$baseUrl/api/summary" `
        -Method POST `
        -ContentType "application/json" `
        -Body $summaryBody `
        -SkipHttpErrorCheck
    Write-Host "Status: $($summaryResponse.StatusCode)"
    Write-Host "Response: $($summaryResponse.Content)"
}
catch {
    Write-Host "Error: $_"
}
Write-Host ""

# Test 5: Health Report
Write-Host "5. Testing POST /api/health-report..." -ForegroundColor Yellow
try {
    $reportBody = @{
        income   = @(@{ amount = 5000 })
        expenses = @(@{ amount = 1200 })
    } | ConvertTo-Json

    $reportResponse = Invoke-WebRequest -Uri "$baseUrl/api/health-report" `
        -Method POST `
        -ContentType "application/json" `
        -Body $reportBody `
        -SkipHttpErrorCheck
    Write-Host "Status: $($reportResponse.StatusCode)"
    Write-Host "Response: $($reportResponse.Content)"
}
catch {
    Write-Host "Error: $_"
}
Write-Host ""

Write-Host "=== All Tests Complete ===" -ForegroundColor Green
