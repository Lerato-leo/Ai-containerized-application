# 👥 Collaborator Guide

Welcome to the AI Financial Wellness Application! This guide helps collaborators set up the project and contribute effectively.

---

## 🚀 Getting Started (For New Collaborators)

### 1. Clone the Repository
```bash
git clone https://github.com/Lerato-leo/Ai-containerized-application.git
cd Ai-containerized-application
```

### 2. Check Current Branch
```bash
git branch -a
# You should see: application (the main working branch)
git checkout application
```

### 3. Install Dependencies
The project has TWO package.json files - one for backend, one for frontend.

**Backend Dependencies:**
```bash
npm install
```
This installs from the root `package.json`:
- express (REST API server)
- axios (HTTP client)
- dotenv (environment variables)
- cors (cross-origin requests)
- uuid (user ID generation)

**Frontend Dependencies:**
```bash
cd frontend
npm install
cd ..
```
This installs from `frontend/package.json`:
- react (UI framework)
- react-scripts (build tools)
- axios (HTTP client)

### 4. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
AI_PROVIDER=gemini
AI_API_KEY=your_free_gemini_api_key_here
AI_MODEL=gemini-1.5-flash
```

**Get your FREE API key** (no credit card):
1. Visit: https://aistudio.google.com/app/apikey
2. Click "Create API key"
3. Copy the key
4. Paste into `.env`

> **Note:** The `.env` file is in `.gitignore` - never commit it!

---

## ⚙️ Running the Application

### Option 1: Manual (Two Terminals)

**Terminal 1 - Backend:**
```bash
node server.js
# Expected: Backend running on port 3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Expected: Compiled successfully, opens http://localhost:3001
```

### Option 2: Using npm scripts
```bash
# From root directory
npm start
```

---

## 📁 Project Structure

```
Ai-containerized-application/
├── package.json                 # Backend dependencies
├── server.js                    # Express server entry point
├── .env                         # Environment config (NOT in git)
├── .gitignore                   # Excludes node_modules, .env, data/
│
├── frontend/
│   ├── package.json            # React dependencies
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js              # Main app with routing
│       ├── App.css             # Themes (light/dark)
│       └── components/
│           ├── EnhancedFinancialAnalyzer.js  # Main form
│           ├── Dashboard.js
│           ├── SpendingDashboard.js
│           ├── GoalsDashboard.js
│           └── FinancialSummary.js
│
├── src/                        # Backend API
│   ├── controllers.js          # Route handlers
│   ├── services.js             # Business logic + AI
│   ├── database.js             # JSON storage
│   ├── route.js                # API routes
│   └── utils.js                # Utilities
│
├── data/                       # Auto-generated data folder
│   ├── users.json             # User profiles
│   └── results.json           # Analysis results
│
└── docs/
    ├── README.md              # Full documentation
    ├── QUICK_START.md         # Quick setup guide
    ├── CHANGELOG.md           # Version history
    └── PROJECT_SUMMARY.md     # Project status
```

---

## 🔄 Git Workflow for Collaborators

### Before Starting Work

1. **Sync with main branch:**
   ```bash
   git fetch origin
   git checkout application
   git pull origin application
   ```

2. **Create feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   # Examples: feature/user-profile, feature/charts, feature/mobile-responsive
   ```

### While Working

1. **Make your changes**
2. **Test locally:**
   ```bash
   npm start          # Backend
   cd frontend && npm start  # Frontend
   ```

3. **Commit regularly:**
   ```bash
   git add .
   git commit -m "Clear, descriptive message about what you changed"
   ```

### Before Pushing

1. **Pull latest changes:**
   ```bash
   git fetch origin
   git rebase origin/application
   ```

2. **Push your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request on GitHub:**
   - Go to https://github.com/Lerato-leo/Ai-containerized-application
   - Click "Compare & pull request"
   - Add description of changes
   - Wait for review

---

## 🐛 Common Issues & Solutions

### "Cannot find module" error
```bash
# Solution: Reinstall dependencies
npm install
cd frontend
npm install
```

### Port 3000 already in use
```bash
# Windows: Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Mac/Linux:
lsof -i :3000 | grep -v PID | awk '{print $2}' | xargs kill -9
```

### Frontend won't compile
```bash
# Clear cache and reinstall
cd frontend
npm cache clean --force
rm -r node_modules package-lock.json
npm install
npm start
```

### .env file not being loaded
- Make sure `.env` is in the root directory (same level as `server.js`)
- Restart backend after editing `.env`
- Check that key names match exactly (case-sensitive)

---

## ✅ Code Quality Standards

### Before Committing

1. **Test your code locally:**
   - Backend: All API endpoints should work
   - Frontend: No console errors, UI renders correctly

2. **Check for obvious issues:**
   ```bash
   # Look for console.log statements and remove them
   grep -r "console.log" src/ frontend/src/
   ```

3. **Follow existing code style:**
   - Use same naming conventions
   - Match indentation (2 spaces)
   - Add comments for complex logic

### Commit Message Format
```
[Type] Brief description

Optional longer explanation of why this change was needed.
```

**Types:**
- `[FEATURE]` - New functionality
- `[FIX]` - Bug fix
- `[REFACTOR]` - Code cleanup (no behavior change)
- `[DOCS]` - Documentation update
- `[STYLE]` - Code formatting
- `[TEST]` - Test additions/modifications

**Examples:**
```
[FEATURE] Add expense category filtering to SpendingDashboard
[FIX] Fix login validation not showing error messages
[DOCS] Update QUICK_START with troubleshooting section
```

---

## 📚 Key Files to Know

### Backend Logic
- `src/controllers.js` - All API endpoint handlers
- `src/services.js` - Financial calculations, AI integration
- `src/database.js` - How data is saved/loaded from JSON
- `server.js` - Express configuration

### Frontend Components
- `frontend/src/App.js` - Main component, routing setup
- `frontend/src/components/EnhancedFinancialAnalyzer.js` - Main form (most changes here)
- `frontend/src/App.css` - Themes, colors, styling

### Configuration
- `.env` - API keys and ports (NOT in git)
- `.gitignore` - What files NOT to commit
- `package.json` - Dependencies in root and frontend/

---

## 🎨 Design Guidelines

### Colors
- **Light Mode:** Peach (#e67e50) + Cream (#fef8f3)
- **Dark Mode:** Purple (#7c8adb) + Navy (#1a1d29)
- See `frontend/src/App.css` for exact values

### Typography
- **Font Size:** 14px (body), 18px (headers), 24px (titles)
- **Font Family:** System default (no custom fonts)

### Spacing
- Use CSS variables: `var(--spacing-sm)`, `var(--spacing-md)`, `var(--spacing-lg)`

---

## 🚀 Pushing Changes

### Step-by-Step

1. **Ensure all tests pass:**
   ```bash
   # Manually test the app in browser
   # Check backend console for errors
   # Test all affected features
   ```

2. **Commit final changes:**
   ```bash
   git add .
   git commit -m "[FEATURE] Your descriptive message"
   ```

3. **Pull latest from origin:**
   ```bash
   git fetch origin
   git rebase origin/application
   ```

4. **Push to GitHub:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request:**
   - GitHub will show a "Compare & pull request" button
   - Add a clear description
   - Reference any related issues
   - Wait for review before merging

### If Something Goes Wrong

**Undo last commit (before pushing):**
```bash
git reset --soft HEAD~1
# Make changes
git commit -m "Fixed message"
```

**Cancel push (before merging to main):**
```bash
git push origin --delete feature/your-branch-name
```

---

## 📞 Getting Help

### Common Resources
1. **README.md** - Full project documentation
2. **CHANGELOG.md** - What's been done previously
3. **QUICK_START.md** - Setup troubleshooting
4. **Inline code comments** - Check the source files

### API Documentation
All endpoints in `src/controllers.js` are documented with:
- What data they expect
- What they return
- Example usage

### For Questions
1. Check existing documentation first
2. Look at related code for examples
3. Add a comment in the code if something is unclear
4. Create an Issue on GitHub for discussion

---

## ✨ Tips for Success

1. **Keep branches focused** - One feature per branch
2. **Test before pushing** - Run the app locally
3. **Write clear commit messages** - Future you will thank current you
4. **Comment complex logic** - Especially financial calculations
5. **Update docs** - If you change how something works, update CHANGELOG.md
6. **No console.logs in production** - Remove debug logs before committing
7. **Review your changes** - Use `git diff` before committing

---

## 📋 Checklist Before Pushing

- [ ] All dependencies installed (`npm install`, `cd frontend && npm install`)
- [ ] `.env` file created with API key
- [ ] Backend runs without errors (`node server.js`)
- [ ] Frontend compiles successfully (`npm start`)
- [ ] Tested the changed features in the app
- [ ] No `console.log` statements left
- [ ] Code follows project style
- [ ] Commit messages are clear
- [ ] Latest changes pulled from origin
- [ ] Ready to create Pull Request

---

**Happy collaborating!** 🎉

---

**Built by:** SyntaxNova  
**Repository:** https://github.com/Lerato-leo/Ai-containerized-application  
**Main Branch:** application
