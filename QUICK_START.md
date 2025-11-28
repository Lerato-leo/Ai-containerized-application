# Quick Start Guide

Get your AI Financial Wellness App running in 3 simple steps!

## ⚡ Quick Setup (5 minutes)

### 1. Install Backend Dependencies
From the project root directory:
```powershell
npm install
```

### 2. Install Frontend Dependencies
```powershell
cd frontend
npm install
cd ..
```

### 3. Configure API Key (Optional)
The `.env` file already exists. To add AI capabilities, edit `.env` and add your free Gemini API key:
```env
PORT=3000
AI_PROVIDER=gemini
AI_API_KEY=your_api_key_here
AI_MODEL=gemini-1.5-flash
```

Get your **FREE** API key at: https://aistudio.google.com/app/apikey (no credit card required)

> **Note:** The app works perfectly without an API key - it uses intelligent rule-based financial advice as fallback.

### 4. Run the Application

**Open Terminal 1** - Start Backend:
```powershell
node server.js
```
Expected output: `Backend running on port 3000`

**Open Terminal 2** - Start Frontend:
```powershell
cd frontend
npm start
```
Expected output: React will compile and automatically open http://localhost:3001 in your browser

**That's it!** Your app is now running with:
- Backend API: http://localhost:3000
- Frontend App: http://localhost:3001
- Databases auto-created in `data/` folder

---

## 📝 First Time Usage

1. **Create Account**: Enter your name and email
2. **Add Income**: List your income sources with categories
3. **Add Expenses**: List your expenses (separate "Savings" category)
4. **Get Advice**: Click "Get AI Insights" for personalized recommendations
5. **Explore Dashboards**: Navigate between 4 different views

---

## 🎯 Features at a Glance

| Feature | Description |
|---------|-------------|
| 💰 **Enhanced Analysis** | Full financial breakdown with AI advice |
| 📊 **Quick Summary** | At-a-glance metrics |
| 🛒 **Spending Dashboard** | Category-wise expense analysis |
| 🎯 **Goals Dashboard** | Smart goal planning with timelines |
| 🎨 **Theme Toggle** | Light (peach) and dark modes |
| 🔐 **Authentication** | Login/logout with profile |

---

## 🔑 Important Notes

- **Currency**: All amounts in South African Rands (R)
- **Savings**: Use "Savings" category for tracked savings
- **AI Fallback**: Works without API key using rule-based advice
- **Data Storage**: Saved locally in `data/` folder

---

## 🆘 Quick Troubleshooting

### Port already in use?
```bash
# Windows - Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Frontend not loading?
```bash
cd frontend
npm cache clean --force
npm install
npm start
```

### No AI advice?
- Check `.env` has correct API key
- Verify internet connection
- App will use rule-based fallback automatically

---

## 📚 Learn More

- Full documentation: `README.md`
- Change log: `CHANGELOG.md`
- API endpoints: See README.md "API Endpoints" section

---

## 🎨 Pro Tips

1. **Separate Savings**: Always use "Savings" category for money you're actively saving
2. **Use Categories**: Categorize income/expenses for better insights
3. **Check Goals**: Visit Goals Dashboard for long-term planning
4. **Try Themes**: Toggle between light and dark mode for comfort
5. **Save Results**: Check "Save for later" to track progress over time

---

**Built with ❤️ by SyntaxNova**
