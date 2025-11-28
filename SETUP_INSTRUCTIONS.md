# Setup & Running Instructions

Complete, verified instructions for setting up and running the AI Financial Wellness application.

---

## 📋 Prerequisites

Before you start, make sure you have:
- ✅ Node.js v14+ installed
- ✅ npm v6+ installed (comes with Node.js)
- ✅ ~500MB free disk space for node_modules

Check your versions:
```powershell
node --version
npm --version
```

---

## 🚀 Step-by-Step Setup

### Step 1: Clone or Navigate to Project

```powershell
# If cloning:
git clone https://github.com/Lerato-leo/Ai-containerized-application.git
cd Ai-containerized-application

# Or if already cloned, just navigate:
cd Ai-containerized-application
```

### Step 2: Install Backend Dependencies

From the project root directory:

```powershell
npm install
```

**Expected Output:**
```
added 111 packages, and audited 112 packages in 11s
...
found 0 vulnerabilities
```

### Step 3: Install Frontend Dependencies

```powershell
cd frontend
npm install
cd ..
```

**Expected Output:**
```
added 1308 packages, and audited 1309 packages in 2m
...
webpack compiled with 1 warning
```

> ⚠️ **Note:** Warnings about deprecated packages are normal and don't affect functionality.

### Step 4: Configure AI (Optional)

The `.env` file is pre-created. To enable AI-powered advice:

1. Edit `.env` in the project root
2. Replace `your_api_key_here` with your actual Gemini API key
3. Get a **FREE** API key (no credit card needed):
   - Go to: https://aistudio.google.com/app/apikey
   - Click "Create API key"
   - Copy the key
   - Paste into `.env`: `AI_API_KEY=your_copied_key`

**Without API Key:** The app works perfectly with rule-based financial advice!

---

## ▶️ Running the Application

### Terminal 1: Start Backend

```powershell
node server.js
```

**Wait for this output:**
```
Backend running on port 3000
```

If you see this, the backend is ready! ✅

### Terminal 2: Start Frontend

Open a **new terminal window/tab** and run:

```powershell
cd frontend
npm start
```

**What happens next:**
1. React will compile (takes 30-60 seconds on first run)
2. You'll see: `webpack compiled with 1 warning`
3. Your browser will automatically open to http://localhost:3001

**If browser doesn't open automatically:**
- Manually open: http://localhost:3001

---

## ✅ Application Ready!

When you see both messages, you're good to go:

| Component | Status | URL |
|-----------|--------|-----|
| Backend | `Backend running on port 3000` | http://localhost:3000 |
| Frontend | Browser opened automatically | http://localhost:3001 |

---

## 🧪 Test the Application

### Quick Test Flow:

1. **Create Account**
   - Click "Create Account" 
   - Enter any name and email
   - Click "Create"

2. **Add Financial Data**
   - Add some income (e.g., 15000 salary)
   - Add some expenses (e.g., 5000 rent, 2000 savings)
   - Click "Get AI Insights"

3. **Explore Dashboards**
   - Try all 4 tabs: Analysis, Summary, Spending, Goals
   - Toggle theme with theme button
   - Logout and log back in

4. **Verify Data Persists**
   - Refresh the page (F5)
   - Your account and data should still be there

---

## 🆘 Troubleshooting

### Backend won't start - "Port 3000 already in use"

```powershell
# Kill the process using port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Then try again:
node server.js
```

### Frontend won't start - "Port 3001 already in use"

React will automatically ask to use a different port. Just answer "yes" when prompted.

### Backend won't start - "Module not found"

```powershell
# Reinstall backend dependencies:
npm install

# Make sure you're in the root directory (not frontend)
```

### Frontend won't compile - Missing dependencies

```powershell
# Go to frontend and reinstall:
cd frontend
npm cache clean --force
npm install
npm start
```

### React shows "Cannot GET /"

This is normal - the root path isn't set up. Just navigate to http://localhost:3001 in your browser.

### AI advice says "Check your API key"

- Either you don't have `.env` with a key, OR
- Your API key is incorrect, OR
- Your internet connection is down

The app will automatically use rule-based advice instead.

### Data not saving

Check that the `data/` folder exists. It should be auto-created:
```powershell
# Check if folder exists:
Test-Path ".\data"

# If not, the app will create it when you save first result
```

---

## 📁 Project Structure

```
Ai-containerized-application/
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/       # Dashboard components
│   │   ├── App.js           # Main routing
│   │   └── App.css          # Theming
│   ├── public/
│   ├── package.json
│   └── node_modules/        # (auto-created by npm)
├── src/                      # Backend application
│   ├── controllers.js        # API handlers
│   ├── services.js           # Business logic
│   ├── database.js           # Data storage
│   ├── route.js              # Routes
│   └── utils.js              # Utilities
├── data/                     # (auto-created) JSON data storage
│   ├── users.json
│   └── results.json
├── .env                      # Configuration (keep private!)
├── .gitignore               # Git settings
├── server.js                # Backend entry point
├── package.json             # Backend dependencies
├── README.md                # Full documentation
├── QUICK_START.md           # Quick reference
├── SETUP_INSTRUCTIONS.md    # This file
└── CHANGELOG.md             # Version history
```

---

## 🎨 Features to Try

| Feature | How to Access |
|---------|--------------|
| **User Login** | Create account, logout/login in header |
| **Financial Analysis** | Main "Analyzer" tab |
| **Quick Summary** | "Summary" tab |
| **Spending Breakdown** | "Spending" tab |
| **Goal Planning** | "Goals" tab |
| **Theme Toggle** | Button in top-right corner |
| **Save Results** | Check "Save for later" in analyzer |
| **View History** | See saved results in summary tab |

---

## 🔑 Important Notes

1. **Data Storage**: All data stored locally in `data/` folder (JSON files)
2. **Currency**: South African Rands (R)
3. **Savings Category**: Use "Savings" category for tracked savings, separate from expenses
4. **AI Key**: Optional! App works great without it
5. **Theme**: Light mode (peach) by default, dark mode available
6. **No Passwords**: App uses email-only authentication for demo

---

## 🚀 What's Next?

### For Development:
- Backend: `npm run dev` (uses nodemon for auto-reload)
- Check `README.md` for API endpoints
- View `CHANGELOG.md` for feature details

### For Deployment:
- Frontend: Deploy to Vercel, Netlify, or similar
- Backend: Deploy to Railway, Render, Heroku
- Database: Upgrade from JSON to PostgreSQL/MongoDB

### For Production:
- Add password hashing (bcrypt)
- Implement JWT authentication
- Enable HTTPS
- Add rate limiting
- Validate all inputs
- Use environment variables for all configs

---

## ✨ Pro Tips

1. **First Time?** Try the demo flow:
   - Create account with name="Demo" email="demo@example.com"
   - Add income: R15,000 (Salary)
   - Add expenses: R5,000 (Rent), R2,000 (Food), R3,000 (Savings)
   - Click "Get AI Insights"

2. **Test All Dashboards:**
   - Try each of the 4 tabs
   - Use the Goals dashboard to set 10 financial goals
   - Toggle between light and dark themes

3. **Check the Data:**
   - Look in `data/users.json` and `data/results.json`
   - Each analysis is saved with a unique ID
   - User data persists across browser sessions

4. **Test Fallback AI:**
   - Close the app
   - Change `.env` to have wrong API key: `AI_API_KEY=wrong_key`
   - Create a new user and analyze
   - You'll see rule-based advice instead of AI advice
   - It's quite good! 😊

---

## 📞 Support

**Issue not in this guide?**
- Check `README.md` for comprehensive documentation
- See `QUICK_START.md` for common tasks
- Review `CHANGELOG.md` for known issues
- Open an issue on GitHub

---

## ✅ Completion Checklist

After setup, verify:
- [ ] Backend running on port 3000
- [ ] Frontend running on port 3001
- [ ] Can create user account
- [ ] Can add income and expenses
- [ ] Can view all 4 dashboards
- [ ] Can toggle light/dark theme
- [ ] Can logout and login
- [ ] Data persists after refresh

---

**Ready to build and test!** 🎉

Questions? See README.md for comprehensive documentation.

