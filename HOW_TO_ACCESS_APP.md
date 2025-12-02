# How to Access the Application Locally

The application is running **inside Kubernetes pods**, not on your local machine. To access it, you need to set up port-forwarding.

## Step 1: Open Terminal/PowerShell

## Step 2: Port-Forward Frontend (React App)

Run this command and **keep it running** (don't close the terminal):

```powershell
kubectl port-forward -n ai-finance svc/ai-finance-frontend-svc 3001:3001
```

You should see:
```
Forwarding from 127.0.0.1:3001 -> 3001
Forwarding from [::1]:3001 -> 3001
```

## Step 3: Open Browser

In a **new browser tab**, go to:
```
http://localhost:3001
```

You should see the React app load with the financial analyzer form.

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
