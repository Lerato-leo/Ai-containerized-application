# How to Access the Application

## Local Development

### Prerequisites
- Node.js v18+
- npm v8+
- Optional: Google Gemini API key for AI features

### Running Locally

**Terminal 1 - Start Backend:**
```powershell
$env:PORT=5000 ; node server.js
```

**Terminal 2 - Start Frontend:**
```powershell
cd frontend
npm start
```

### Access the App

**Frontend:** http://localhost:3002  
**Backend API:** http://localhost:5000

The app automatically opens in your browser when React compiles.

## Cloud Deployment (Railway.app)

This application is configured for **Railway.app** deployment:

1. Push code to GitHub
2. Connect your GitHub repo to Railway.app
3. Railway automatically builds and deploys using `railway.toml`
4. Your app is live in minutes!

**Deployment Features:**
- Automatic builds on GitHub push
- Multi-service setup (backend + frontend)
- Health checks every 10 seconds
- Environment variables configured
- Zero-downtime deployments

---

## Step 4: Port-Forward Backend (Optional - for API testing)

In **another terminal** (keep step 2 running), run:

```powershell
kubectl port-forward -n ai-finance svc/ai-finance-backend-svc 3000:3000
```

Now you can test APIs:
```powershell
# Test health
curl http://localhost:3000/health

# Create user
curl -X POST http://localhost:3000/api/users `
  -H "Content-Type: application/json" `
  -d '{"name":"Test User","email":"test@example.com"}'
```

---

## Why This is Needed

- ❌ `http://localhost:3001` - Won't work WITHOUT port-forward
- ❌ `http://localhost:31387` - Only works if you configure Docker Desktop differently
- ✅ `http://localhost:3001` - Works WITH `kubectl port-forward` running

---

## Quick Access Script

Create a PowerShell script called `start-app.ps1`:

```powershell
# Start port-forward in background
Write-Host "Starting port-forward for frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "kubectl port-forward -n ai-finance svc/ai-finance-frontend-svc 3001:3001"

# Wait a moment
Start-Sleep -Seconds 2

# Open browser
Write-Host "Opening browser..."
Start-Process "http://localhost:3001"

Write-Host "App is ready! Keep the port-forward terminal open."
```

Run it:
```powershell
.\start-app.ps1
```

---

## Troubleshooting

### Port already in use?
```powershell
# Kill process on port 3001
Get-Process | Where-Object {$_.Name -eq "kubectl"} | Stop-Process -Force

# Try again
kubectl port-forward -n ai-finance svc/ai-finance-frontend-svc 3001:3001
```

### Port-forward keeps disconnecting?
```powershell
# Use explicit address
kubectl port-forward -n ai-finance svc/ai-finance-frontend-svc 3001:3001 --address=0.0.0.0
```

### Can't access from browser?
```powershell
# Verify pods are running
kubectl get pods -n ai-finance

# Check pod logs
kubectl logs -n ai-finance deployment/ai-finance-frontend --tail=20
```

---

## What to Test

Once you have `http://localhost:3001` open:

1. **Register Account**
   - Click "Create New Account"
   - Enter name and email
   - Click Register

2. **Add Financial Data**
   - Enter Income (e.g., 5000)
   - Enter Expenses (e.g., 1200)
   - Enter Goals (optional)

3. **Analyze**
   - Click "Analyze with AI"
   - Wait for AI response (2-5 seconds)
   - Check financial health score

4. **Explore Dashboards**
   - Click tabs: Summary, Spending, Goals
   - View different perspectives of data

5. **Login Again**
   - Logout
   - Login with same email
   - Verify previous data is saved

---

## All Features Working ✅

✅ Frontend pod running  
✅ Backend pod running  
✅ Services configured  
✅ API endpoints responding  
✅ Data persistence working  

**The app is fully functional - just need port-forward to access it!**
