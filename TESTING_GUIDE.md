# AI Finance Application - Complete Testing Guide

**Last Updated:** December 2, 2025  
**Status:** ✅ Ready for Testing  
**Environment:** Kubernetes (Docker Desktop)

---

## 🎯 Application Overview

**AI Financial Wellness Coach** is a full-stack React + Node.js application for personal financial management with AI-powered insights using Google Gemini API.

### Core Features
1. **User Management** - User registration, login, profile management
2. **Financial Dashboard** - Overview of income, expenses, and savings
3. **Financial Analysis** - Detailed analysis with AI-powered insights
4. **Health Report** - Financial health score (0-100) with recommendations
5. **Goals Tracking** - Set and monitor financial goals
6. **Spending Dashboard** - Track and categorize expenses
5. **Multiple Dashboards** - View financial data from different angles
6. **History Management** - Save and load analysis results

---

## 🧪 Test Scenarios

### Test 1: Frontend Accessibility
**Objective:** Verify the web interface loads and is responsive

**Steps:**
1. Open browser to `http://localhost:31387` (or NodePort shown in `kubectl get svc`)
2. Verify page loads without errors
3. Check all UI elements are visible:
   - ✓ Form inputs (Income, Expenses, Goals)
   - ✓ Buttons (Analyze, Login, Register)
   - ✓ Tabs/Navigation
   - ✓ Theme colors (Peach/Cream or Dark Navy)

**Expected Result:**
- React app loads successfully
- No console errors
- Form is interactive and responsive

---

### Test 2: User Registration
**Objective:** Create a new user account

**Steps:**
1. On frontend, if not logged in, click "Create New Account"
2. Enter:
   - Name: `Test User`
   - Email: `test@example.com`
3. Click "Register"

**Expected Result:**
```json
{
  "success": true,
  "user": {
    "id": "uuid-string",
    "name": "Test User",
    "email": "test@example.com",
    "createdAt": "timestamp"
  }
}
```
- User is created
- You're logged in automatically
- See "Welcome, Test User" message

**Backend Validation:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

---

### Test 3: User Login
**Objective:** Login with existing user account

**Steps:**
1. If logged out, click "I have an account"
2. Enter:
   - Email: `test@example.com`
3. Click "Login"

**Expected Result:**
```json
{
  "success": true,
  "user": {
    "id": "uuid-string",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```
- User is authenticated
- Dashboard loads with user data
- Can see previous analysis history

**Backend Test:**
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

### Test 4: Financial Summary
**Objective:** Calculate quick income/expense balance

**Steps:**
1. On frontend, enter:
   - Income: `15000` (Monthly salary)
   - Expenses: `10000` (Monthly costs)
2. Click "Get Quick Summary"

**Expected Result:**
```json
{
  "success": true,
  "totalIncome": 15000,
  "totalExpenses": 10000,
  "balance": 5000
}
```
- Shows total income
- Shows total expenses
- Calculates balance (income - expenses)

**Backend Test:**
```bash
curl -X POST http://localhost:3000/api/summary \
  -H "Content-Type: application/json" \
  -d '{
    "income": [{"amount":15000,"category":"Salary"}],
    "expenses": [{"amount":10000,"category":"Living"}]
  }'
```

---

### Test 5: Health Report
**Objective:** Get financial health score and insights

**Steps:**
1. On frontend, enter:
   - Income: `15000`
   - Expenses: `8000`
   - Optional Goals: "Save for emergency fund"
2. Click "Get Health Report"

**Expected Result:**
```json
{
  "success": true,
  "healthScore": 85,
  "status": "Excellent",
  "statusColor": "green",
  "metrics": {
    "totalIncome": 15000,
    "totalExpenses": 8000,
    "savingsRate": 46.7
  },
  "insights": {
    "monthlyBalance": 7000,
    "yearlyProjection": 84000,
    "emergencyFundTarget": 48000
  }
}
```

**Scoring System:**
- **80-100:** Excellent (green) ✓
- **60-79:** Good (blue)
- **40-59:** Fair (yellow)
- **0-39:** Needs Improvement (red)

**Backend Test:**
```bash
curl -X POST http://localhost:3000/api/health-report \
  -H "Content-Type: application/json" \
  -d '{
    "income": [{"amount":15000,"category":"Salary"}],
    "expenses": [{"amount":8000,"category":"Living"}]
  }'
```

---

### Test 6: AI Financial Analysis
**Objective:** Get AI-powered financial advice from Gemini

**Steps:**
1. On frontend, enter:
   - Income sources (e.g., Salary: 15000, Freelance: 2000)
   - Expense categories (e.g., Rent: 5000, Food: 1000, Transport: 500)
   - Goals (e.g., "Build emergency fund", "Pay off debt")
2. Click "Analyze with AI"
3. Check the "Results" section

**Expected Result:**
```json
{
  "success": true,
  "metrics": {
    "totalIncome": 17000,
    "totalExpenses": 6500,
    "savingsRate": 38.2
  },
  "aiAdvice": "Financial Advisor for South Africa...\n\n1. Financial health summary...\n2. Recommendations...",
  "resultId": "uuid-string",
  "saved": true
}
```

**Backend Test:**
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "income": [
      {"name":"Salary","category":"Employment","amount":15000},
      {"name":"Freelance","category":"Side Income","amount":2000}
    ],
    "expenses": [
      {"name":"Rent","category":"Housing","amount":5000},
      {"name":"Food","category":"Food","amount":1000},
      {"name":"Transport","category":"Transport","amount":500}
    ],
    "goals": ["Build emergency fund", "Pay off debt"],
    "userId": "user-id-optional",
    "userName": "Test User",
    "saveResult": true
  }'
```

---

### Test 7: Dashboards
**Objective:** Verify all dashboard views work

**Dashboards to Test:**

#### 1. Financial Analyzer (Main Form)
- Input income and expenses
- Set financial goals
- Analyze with AI
- Save results

#### 2. Financial Summary Dashboard
- Shows quick balance
- Income vs expenses comparison
- Savings calculation

#### 3. Spending Dashboard
- Breakdown of expenses by category
- Visual representation
- Monthly projections

#### 4. Goals Dashboard
- List of 10 pre-set financial goals
- Priority ranking
- Action items

**Expected Result:**
- All dashboards load without errors
- Data displays correctly
- Can switch between views
- Responsive on mobile/tablet

---

### Test 8: Data Persistence
**Objective:** Verify data saves and loads correctly

**Steps:**
1. Login as Test User
2. Perform financial analysis
3. Log out
4. Log back in
5. Verify previous analysis appears in history

**Expected Result:**
- Analysis results are saved
- Can view previous analyses
- Results persist across sessions
- History shows results in order

**Backend Test:**
```bash
# Get user results
curl http://localhost:3000/api/users/{userId}/results

# Expected response
{
  "success": true,
  "results": [
    {
      "id": "uuid",
      "userId": "user-id",
      "totalIncome": 17000,
      "totalExpenses": 6500,
      "date": "timestamp"
    }
  ]
}
```

---

### Test 9: Error Handling
**Objective:** Verify error messages are clear and helpful

**Test Cases:**

#### Missing Required Fields
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{}'

# Expected: 400 error with message
```

#### Invalid User Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@example.com"}'

# Expected: 404 error "No account found"
```

#### Duplicate User Registration
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'

# Expected: 400 error "User already exists"
```

---

### Test 10: Performance
**Objective:** Verify app loads and responds quickly

**Metrics to Check:**
1. **Frontend Load Time:** < 3 seconds
2. **API Response Time:** < 500ms
3. **AI Analysis Time:** 2-5 seconds (depends on Gemini)
4. **Memory Usage:** < 500MB

**Test:**
```bash
# Time the API response
time curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{...}' | jq .
```

---

## 🔍 Manual Testing Checklist

### Frontend UI
- [ ] Page loads without errors
- [ ] All buttons are clickable
- [ ] Form inputs accept values
- [ ] Theme applies correctly
- [ ] Responsive design works
- [ ] Navigation between tabs works
- [ ] Error messages display clearly

### Backend API
- [ ] Health endpoint responds ✓
- [ ] All endpoints return correct status codes
- [ ] JSON responses are valid
- [ ] Error handling works
- [ ] Input validation works
- [ ] Data persists correctly

### User Journey
- [ ] Can register new user
- [ ] Can login with existing user
- [ ] Can create analysis
- [ ] Can view results
- [ ] Can access history
- [ ] Can logout

### Data Integrity
- [ ] Income calculations are correct
- [ ] Expense calculations are correct
- [ ] Savings rate is accurate
- [ ] Health score is appropriate
- [ ] Results save properly
- [ ] Results load on login

---

## 🐛 Troubleshooting

### Frontend Won't Load
```bash
# Check if frontend pod is running
kubectl get pods -n ai-finance

# Check frontend logs
kubectl logs -n ai-finance deployment/ai-finance-frontend --tail=50

# Check if service is accessible
kubectl get svc -n ai-finance
```

### Backend Not Responding
```bash
# Check backend pods
kubectl get pods -n ai-finance

# Check backend logs
kubectl logs -n ai-finance deployment/ai-finance-backend --tail=50

# Test health endpoint
kubectl run -n ai-finance test-pod --image=curlimages/curl --rm -it --restart=Never \
  -- curl http://ai-finance-backend-svc:3000/health
```

### API Errors
```bash
# Check if environment variables are set
kubectl get secret -n ai-finance ai-finance-secret -o yaml

# Verify ConfigMap
kubectl get configmap -n ai-finance ai-finance-config -o yaml
```

---

## 📊 Test Results Summary

Use this template to document your test results:

```
TEST RESULTS - AI Finance Application
Date: [DATE]
Tester: [YOUR NAME]

✓ Frontend Accessibility: PASSED
✓ User Registration: PASSED
✓ User Login: PASSED
✓ Financial Summary: PASSED
✓ Health Report: PASSED
✓ AI Analysis: PASSED
✓ Dashboards: PASSED
✓ Data Persistence: PASSED
✓ Error Handling: PASSED
✓ Performance: PASSED

Overall Status: READY FOR PRODUCTION
Issues Found: None
Notes: All features working as expected
```

---

## 🚀 Ready to Deploy?

When all tests pass, the application is ready for production:
1. All UI components working ✓
2. All API endpoints responding ✓
3. Data persists correctly ✓
4. Error handling working ✓
5. Performance acceptable ✓

**Next Steps:**
- Push changes to main branch
- Create release version
- Deploy to production cluster
- Monitor logs and metrics
- Gather user feedback

---

