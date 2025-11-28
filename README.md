# AI Financial Wellness Application

A smart financial management application that helps users track income, expenses, and savings while providing AI-powered financial advice. Built with React and Node.js, featuring a beautiful peach-themed interface and intelligent goal planning.

**Tagline:** *"The world of financial freedom"*  
**Powered by:** SyntaxNova

---

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure login and registration system
- **Financial Tracking**: Track income and expenses by category
- **Smart Savings Calculation**: Automatically calculates actual savings (tracked + leftover money)
- **AI-Powered Advice**: Google Gemini AI integration with intelligent rule-based fallback
- **Financial Health Scoring**: Get instant health assessments and recommendations

### Multiple Dashboards
1. **Enhanced Analysis Dashboard**: Comprehensive financial overview with charts
2. **Quick Summary Dashboard**: At-a-glance financial metrics
3. **Spending Dashboard**: Detailed expense breakdown by category
4. **Goals Dashboard**: Intelligent goal planning with priority-based recommendations

### Smart Features
- **Theme Toggle**: Beautiful light mode (peach/cream) and dark mode
- **Goal Prioritization**: Critical, High, Medium, and Low priority goals
- **Achievability Analysis**: Near-term (2 years) and long-term goal classification
- **Impact Projections**: See how increasing savings affects goal timelines
- **South African Context**: All amounts in Rands (R) with SA-specific advice

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Google Gemini API key (**optional** - app works without it)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lerato-leo/Ai-containerized-application.git
   cd Ai-containerized-application
   ```

2. **Install backend dependencies**
   ```powershell
   npm install
   ```

3. **Install frontend dependencies**
   ```powershell
   cd frontend
   npm install
   cd ..
   ```

4. **Configure environment variables (Optional)**
   
   The `.env` file is already created. To enable AI-powered advice, edit `.env` and add your Gemini API key:
   ```env
   PORT=3000

   # Google Gemini AI Configuration (Optional)
   AI_PROVIDER=gemini
   AI_API_KEY=your_api_key_here
   AI_MODEL=gemini-1.5-flash
   ```

   **Get your FREE API key** (no credit card needed):
   - Visit: https://aistudio.google.com/app/apikey
   - Copy your API key
   - Paste it into `.env` as `AI_API_KEY`
   
   > **Without API key?** No problem! The app automatically falls back to intelligent rule-based financial advice.

### Running the Application

**Terminal 1 - Start Backend Server**
```bash
node server.js
```
✅ Expected output: `Backend running on port 3000`  
📍 Backend API available at: http://localhost:3000

**Terminal 2 - Start Frontend Application**
```bash
cd frontend
npm start
```
✅ Expected output: React compiles successfully, then automatically opens your browser  
📍 Frontend application available at: http://localhost:3001

**Automatic Setup:**
- React detects backend is running on port 3000 and uses it as proxy
- If React asks about different port, say "yes" (will use port 3001)
- `data/` folder auto-created for JSON storage
- `.env` configuration auto-loaded

**Application is ready when you see:**
- Backend: ✓ Running on port 3000
- Frontend: ✓ Compiled successfully
- Browser: Opens to http://localhost:3001

---

## 📁 Project Structure

```
Ai-containerized-application/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   └── src/
│       ├── components/      # React components
│       │   ├── EnhancedFinancialAnalyzer.js  # Main analysis form
│       │   ├── QuickSummaryDashboard.js      # Quick overview
│       │   ├── SpendingDashboard.js          # Expense details
│       │   ├── GoalsDashboard.js             # Goal planning
│       │   └── Dashboard.css                  # Shared styles
│       ├── App.js           # Main app component with routing
│       └── App.css          # Global styles and themes
├── src/                     # Backend source code
│   ├── controllers.js       # API endpoint handlers
│   ├── services.js          # Business logic and AI integration
│   ├── database.js          # JSON-based data storage
│   ├── route.js             # API routes
│   └── utils.js             # Utility functions
├── data/                    # Data storage (auto-generated)
│   ├── users.json          # User profiles
│   └── results.json        # Analysis results
├── server.js               # Express server entry point
├── package.json            # Backend dependencies
├── .env                    # Environment configuration
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

---

## 🎨 Color Scheme

### Light Mode (Default)
- **Background**: Warm cream (#fef8f3, #fffbf7)
- **Text**: Rich brown (#2d1810, #8b6f5c)
- **Accent**: Peachy coral (#e67e50)
- **Borders**: Soft peach (#f4e4d7)
- **Header**: Warm gradient (#f4a460 → #e67e50)

### Dark Mode
- **Background**: Deep navy (#1a1d29, #252936)
- **Text**: Soft white (#e9ecef, #adb5bd)
- **Accent**: Soft purple (#7c8adb)
- **Borders**: Subtle gray (#3d4152)
- **Header**: Purple gradient (#4a5899 → #5a3d7a)

---

## 🔧 API Endpoints

### User Management
- `POST /users/create` - Create new user account
- `POST /users/login` - User login
- `GET /users/:userId/results` - Get user's analysis history

### Financial Analysis
- `POST /analyze` - Analyze financial data and get AI advice
- `POST /summary` - Get quick financial summary
- `POST /health-report` - Get detailed health report with score

### Response Format
```json
{
  "success": true,
  "metrics": {
    "totalIncome": 15000,
    "totalExpenses": 12000,
    "actualMonthlySavings": 3000,
    "savingsRate": 20,
    "overspending": false
  },
  "aiAdvice": "Financial health analysis...",
  "resultId": "uuid",
  "saved": true
}
```

---

## 🤖 AI Integration

### Google Gemini AI
- **Model**: gemini-1.5-flash (fastest, recommended)
- **Alternative**: gemini-1.5-pro (higher quality)
- **Free Tier**: 15 requests/minute, 1,500 requests/day
- **No credit card required**

### Intelligent Fallback System
If AI is unavailable or API key is not configured, the app uses a sophisticated rule-based advice system that provides:
- Financial health assessment
- Personalized recommendations based on savings rate
- South African financial context (banks, investment options)
- Actionable monthly steps

---

## 💡 Key Features Explained

### Savings Calculation Logic
The app separates "Savings" category from regular expenses:
```javascript
actualMonthlySavings = trackedSavings + (income - expenses - trackedSavings)
savingsRate = (actualMonthlySavings / income) × 100
```

### Goal Priority System
- **Critical**: Emergency fund, debt elimination
- **High**: Education fund, home down payment
- **Medium**: Vacation, car purchase
- **Low**: Luxury items, hobby investments

### Financial Health Score
Score calculated from:
- Savings rate (0-40 points)
- Income diversification (0-10 points)
- Result: 0-100 score with status (Excellent/Good/Fair/Needs Improvement)

---

## 📊 Technology Stack

### Frontend
- React 18.2.0
- React Router
- Axios for API calls
- CSS Variables for theming

### Backend
- Node.js
- Express 4.18.2
- Axios 1.6.0 (AI API calls)
- UUID 9.0.0 (user IDs)
- dotenv (environment config)

### Data Storage
- JSON file-based storage
- User profiles in `data/users.json`
- Analysis results in `data/results.json`

### AI Provider
- Google Gemini API (primary)
- Rule-based fallback system

---

## 🛠️ Development

### Code Structure
The backend follows a clean, simple architecture:
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and AI integration
- **Database**: JSON file operations
- **Routes**: API endpoint definitions

### Adding New Features
1. Add API endpoint in `src/route.js`
2. Create controller function in `src/controllers.js`
3. Add business logic in `src/services.js`
4. Create React component in `frontend/src/components/`
5. Update routing in `frontend/src/App.js`

---

## 🔒 Security Notes

- **User Data**: Stored locally in JSON files (not suitable for production)
- **API Keys**: Keep `.env` file private, never commit to Git
- **Authentication**: Basic email-based auth (enhance for production)
- **Passwords**: Currently not hashed (implement bcrypt for production)

### Production Recommendations
- Use PostgreSQL or MongoDB instead of JSON files
- Implement JWT authentication
- Add password hashing (bcrypt)
- Set up HTTPS
- Add rate limiting
- Implement input validation and sanitization

---

## 🐛 Troubleshooting

### Backend won't start
- Check if port 3000 is available
- Verify all dependencies are installed: `npm install`
- Check `.env` file exists and is formatted correctly

### Frontend won't start
- Check if port 3001 is available
- Verify frontend dependencies: `cd frontend && npm install`
- Clear cache: `npm cache clean --force`

### AI advice not working
- Verify AI_API_KEY in `.env` is correct
- Check Gemini API quota at https://aistudio.google.com
- App will automatically fall back to rule-based advice

### Data not saving
- Check `data/` directory exists
- Verify write permissions
- Check server console for error messages

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

- **SyntaxNova** - Application development
- **Google Gemini** - AI-powered financial advice
- **React Community** - Frontend framework
- **Node.js Community** - Backend runtime

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

**Repository**: https://github.com/Lerato-leo/Ai-containerized-application

---

*Built with ❤️ for financial wellness*
