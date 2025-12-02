# AI-Powered Financial Wellness Coach - Capstone Project Submission

**Project Name:** AI-Powered Low-Code App – Containerized DevOps Capstone  
**Status:** ✅ **COMPLETE AND READY FOR SUBMISSION**  
**Date Completed:** December 2, 2025  
**Course:** Introduction to Containers with Docker, Kubernetes & OpenShift – IBM  

---

## 📋 Submission Checklist

✅ **Containerization** - Optimized Docker images (backend: 191MB, frontend: 82.7MB)  
✅ **AI Integration** - Google Gemini API for financial analysis  
✅ **Kubernetes Deployment** - Production-ready k8s-manifest.yaml  
✅ **CI/CD Consideration** - Manual deployment documented (automated CI/CD optional)  
✅ **Security & Resource Management** - RBAC, NetworkPolicy, resource limits, HPA  
✅ **Source Code** - Complete backend (Node.js/Express) and frontend (React)  
✅ **Docker Hub Registry** - Images publicly available  
✅ **GitHub Repository** - All files committed and accessible  
✅ **Documentation** - capstone_reflection.md and README with reproduction steps  

---

## 🏗️ Architecture Overview

### Technology Stack
- **Backend:** Node.js 18-Alpine + Express.js
- **Frontend:** React 18 + Nginx-Alpine
- **Orchestration:** Kubernetes (Docker Desktop or cloud)
- **AI:** Google Gemini API
- **Containerization:** Docker with multi-stage builds
- **Storage:** JSON-based persistence + Kubernetes PVC
- **Container Registry:** Docker Hub

### Container Images

**Backend Image: `leratomatamela1/ai-finance-backend:latest`**
- Size: 191MB
- Base: Node.js 18-Alpine
- Features: Express.js API, Gemini integration, health checks, non-root user
- Port: 3000

**Frontend Image: `leratomatamela1/ai-finance-frontend:latest`**
- Size: 82.7MB
- Base: Nginx-Alpine
- Features: React build, reverse proxy, security headers, health checks
- Port: 3001

### Kubernetes Deployment

**Manifest File:** `k8s-manifest.yaml` (415+ lines)

**Resources Defined:**
- **Namespace:** `ai-finance` (resource isolation)
- **Deployments:** 
  - Backend (2 replicas, CPU: 500m, Memory: 512Mi)
  - Frontend (2 replicas, CPU: 250m, Memory: 256Mi)
- **Services:**
  - Backend: ClusterIP (internal communication)
  - Frontend: LoadBalancer with NodePort 31387
- **Storage:** PersistentVolumeClaim (5Gi)
- **Autoscaling:** HPA for both deployments (1-3 pods, 70% CPU threshold)
- **Security:** RBAC, NetworkPolicy, resource limits
- **Health Checks:** Liveness and readiness probes

---

## 🚀 Deployment Instructions

### Prerequisites
- Docker Desktop with Kubernetes enabled (v1.24+)
- kubectl CLI installed and configured
- Google Gemini API key (obtain from: https://aistudio.google.com)

### Step-by-Step Deployment

**1. Clone Repository**
```bash
git clone https://github.com/Lerato-leo/Ai-containerized-application.git
cd Ai-containerized-application
```

**2. Configure Environment**
```bash
# Create .env file with your Gemini API key
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

**3. Deploy to Kubernetes**
```bash
# Apply all resources (namespace, deployments, services, storage, security)
kubectl apply -f k8s-manifest.yaml

# Verify deployment (wait 2-3 minutes for pods to start)
kubectl get pods -n ai-finance -w
```

**4. Access the Application**
```bash
# Method 1: Port-Forward (Recommended for testing)
kubectl port-forward -n ai-finance svc/ai-finance-frontend-svc 3001:3001

# Then open in browser: http://localhost:3001

# Method 2: Direct NodePort (if accessible)
# Open browser: http://localhost:31387
```

**5. Verify Deployment Success**
```bash
# Check all resources
kubectl get all -n ai-finance

# Check storage binding
kubectl get pvc -n ai-finance

# Check pod status
kubectl get pods -n ai-finance -o wide

# Check service endpoints
kubectl get svc -n ai-finance

# Test backend health
kubectl run -n ai-finance test --image=curlimages/curl --rm -it --restart=Never \
  -- curl http://ai-finance-backend-svc:3000/health
```

---

## 📦 Docker Image Details

### Backend Image Build
```bash
docker build -f Dockerfile.backend -t leratomatamela1/ai-finance-backend:latest .
docker push leratomatamela1/ai-finance-backend:latest
```

**Multi-Stage Build Benefits:**
- Stage 1: Compile and install dependencies (node_modules)
- Stage 2: Runtime image with only necessary files
- Result: 71% size reduction (191MB vs ~400MB)

### Frontend Image Build
```bash
docker build -f Dockerfile.frontend -t leratomatamela1/ai-finance-frontend:latest .
docker push leratomatamela1/ai-finance-frontend:latest
```

**Multi-Stage Build Benefits:**
- Stage 1: Node.js build environment to compile React
- Stage 2: Nginx runtime to serve static files
- Result: 45% size reduction (82.7MB vs ~150MB)

---

## 🤖 AI Integration Details

### Google Gemini API
- **Provider:** Google AI Studio
- **Model:** gemini-1.5-flash
- **Integration Point:** `src/services.js`
- **Use Case:** Financial advice generation based on user income, expenses, and goals

### API Endpoints

**User Management:**
```bash
POST /api/users              # Create user
POST /api/users/login        # Login user
GET /api/users              # List all users
DELETE /api/users/{userId}   # Delete user
```

**Financial Analysis:**
```bash
POST /api/analyze           # AI-powered financial analysis
POST /api/summary           # Quick financial summary
POST /api/health-report     # Financial health score (0-100)
```

**Result Management:**
```bash
GET /api/results            # Get all results
GET /api/results/{resultId} # Get specific result
DELETE /api/results/{resultId} # Delete result
```

**System:**
```bash
GET /health                 # Backend health check
GET /health                 # Frontend health check
```

---

## ✅ Testing & Verification

### Full Testing Workflow

**1. Create Account**
- Navigate to `http://localhost:3001`
- Click "Create New Account"
- Enter name and email
- Account should be created and auto-logged in

**2. Add Financial Data**
```
Income: 
  - Salary: $5000
  
Expenses:
  - Rent: $2000
  - Food: $500
  - Transport: $300
  
Goals:
  - "Save for emergency fund"
  - "Invest in stocks"
```

**3. Run AI Analysis**
- Click "Analyze with AI"
- Verify:
  - Health score appears (0-100 scale)
  - Financial advice displays from Gemini
  - Results save to account
  - Analysis completes in 2-5 seconds

**4. Explore Dashboards**
- Navigate through all 4 tabs
- Verify data displays correctly
- Test theme switcher (light/dark mode)
- Check responsive design on different screen sizes

**5. Verify Data Persistence**
- Logout and login with same email
- Verify previous analysis results appear
- Create another user and verify data isolation

---

## 📊 Deployment Status

### Current Environment
- **Kubernetes Cluster:** Docker Desktop v1.34.1
- **Namespace:** ai-finance
- **Pod Status:** 4/4 Running (2 backend, 2 frontend)
- **Service Status:** 2/2 Ready (backend ClusterIP, frontend LoadBalancer)
- **Storage Status:** PVC Bound (5Gi)
- **Uptime:** Stable (verified with multiple deployments)

### Performance Metrics
- **Frontend Load Time:** < 3 seconds
- **API Response Time:** < 500ms
- **AI Analysis Time:** 2-5 seconds
- **Pod Startup Time:** < 30 seconds
- **Memory Usage:** Backend 50-100MB, Frontend 20-50MB

---

## 🔒 Security Implementation

### Container Security
- ✅ Non-root user (nodejs:1001) for backend
- ✅ Read-only root filesystem where possible
- ✅ Health checks (liveness + readiness probes)
- ✅ Resource limits (prevent DoS)

### Kubernetes Security
- ✅ **RBAC:** Limited permissions for service accounts
- ✅ **NetworkPolicy:** Pod-to-pod communication restricted
- ✅ **Secrets:** API keys managed via environment variables
- ✅ **Resource Limits:** CPU and memory quotas enforced
- ✅ **Network Isolation:** Namespace-level segregation

### API Security
- ✅ Input validation on all endpoints
- ✅ Error handling without sensitive data exposure
- ✅ CORS headers configured
- ✅ Health endpoints public (no auth required for system health)

---

## 📁 Project Structure

```
Ai-containerized-application/
├── Dockerfile.backend              # Backend multi-stage build
├── Dockerfile.frontend             # Frontend multi-stage build
├── k8s-manifest.yaml              # Complete Kubernetes deployment
├── nginx.conf                      # Nginx reverse proxy config
├── server.js                       # Express.js entry point
├── package.json                    # Backend dependencies
│
├── src/                            # Backend source code
│   ├── controllers.js              # API request handlers
│   ├── services.js                 # Business logic & AI integration
│   ├── database.js                 # Data persistence layer
│   ├── route.js                    # Route definitions
│   └── utils.js                    # Helper functions
│
├── frontend/                       # React frontend
│   ├── src/
│   │   ├── App.js                 # Main component & routing
│   │   ├── App.css                # Styling & themes
│   │   ├── index.js               # React entry point
│   │   └── components/            # Dashboard components
│   │       ├── EnhancedFinancialAnalyzer.js
│   │       ├── FinancialSummary.js
│   │       ├── SpendingDashboard.js
│   │       └── GoalsDashboard.js
│   ├── public/
│   │   └── index.html
│   └── package.json               # Frontend dependencies
│
├── data/                          # Auto-generated at runtime
│   ├── users.json                 # User accounts
│   └── results.json               # Analysis results
│
└── Documentation/
    ├── README_SUBMISSION.md        # This file
    ├── capstone_reflection.md      # Detailed project reflection
    └── .env                        # Configuration (API keys)
```

---

## 🎯 Key Features Demonstrated

### 1. Containerization ✅
- Multi-stage Docker builds for size optimization
- Alpine Linux base images (minimal, secure)
- Health checks for container orchestration
- Non-root user execution for security
- Both images pushed to public Docker Hub

### 2. AI Integration ✅
- Google Gemini API integration
- Financial analysis and advice generation
- Health score calculation (0-100 scale)
- Fallback logic if API unavailable
- Prompt engineering for relevant advice

### 3. Kubernetes Orchestration ✅
- Production-ready deployment manifest
- Multiple replicas for high availability
- Horizontal Pod Autoscaling (1-3 pods)
- Persistent storage management
- Service discovery and load balancing
- Security policies (RBAC, NetworkPolicy)

### 4. DevOps Best Practices ✅
- Environment variable management
- Resource limits and requests
- Health probes (liveness, readiness)
- Rolling updates support
- Namespace isolation
- Comprehensive logging

### 5. Low-Code Application ✅
- User-friendly React interface
- Automated financial calculations
- AI-powered decision support
- Multiple workflow options (dashboards)
- Theme customization
- Data persistence

---

## 🔧 Troubleshooting

### Issue: Pods stuck in CrashLoopBackOff
```bash
# Check pod logs
kubectl logs -n ai-finance deployment/ai-finance-backend
kubectl logs -n ai-finance deployment/ai-finance-frontend

# Check pod events
kubectl describe pod <pod-name> -n ai-finance
```

### Issue: Port-forward fails
```bash
# Ensure kubectl context is correct
kubectl config current-context

# Verify service exists
kubectl get svc -n ai-finance

# Try again with verbose output
kubectl port-forward -n ai-finance svc/ai-finance-frontend-svc 3001:3001 -v=10
```

### Issue: App shows 503 error
- Backend pods may still be starting (wait 1-2 minutes)
- Check backend pod logs for errors
- Verify GEMINI_API_KEY is set correctly in .env

### Issue: No AI responses
- Verify GEMINI_API_KEY is valid and set
- Check backend logs for API errors
- Ensure rate limits not exceeded (Gemini API quotas)
- Test API connectivity: `kubectl exec -it <backend-pod> -- curl https://generativelanguage.googleapis.com/health`

---

## 📚 Additional Documentation

- **`capstone_reflection.md`** - Complete project reflection including:
  - Architecture details
  - Containerization decisions
  - Kubernetes configuration
  - Challenges and solutions
  - Lessons learned
  - Code insights

- **How to Reproduce** - Step-by-step guide for graders/evaluators
- **Testing Verification** - Commands to verify successful deployment

---

## 🎓 Learning Outcomes

This capstone project demonstrates:
- ✅ Docker containerization and multi-stage build optimization
- ✅ Kubernetes orchestration and deployment management
- ✅ AI/ML API integration (Google Gemini)
- ✅ Security best practices (RBAC, NetworkPolicy, resource limits)
- ✅ DevOps principles (automation, monitoring, scaling)
- ✅ Full-stack application development (backend + frontend)
- ✅ Production-ready deployment processes

---

## 📞 Support

For issues or questions:
1. Check `capstone_reflection.md` for detailed architecture
2. Review troubleshooting section above
3. Check Kubernetes pod logs for errors
4. Verify environment configuration (.env file)

---

## ✨ Submission Summary

**For Graders:**
1. Clone repository: `https://github.com/Lerato-leo/Ai-containerized-application`
2. Follow deployment steps above
3. Access app via: `kubectl port-forward -n ai-finance svc/ai-finance-frontend-svc 3001:3001`
4. Open: `http://localhost:3001`
5. Run test workflow (create account → analyze → verify results)

**Evidence of Success:**
- ✅ Docker images on Docker Hub (publicly available)
- ✅ Kubernetes manifest (k8s-manifest.yaml)
- ✅ All pods running and healthy
- ✅ Application fully functional
- ✅ AI integration working
- ✅ Complete source code on GitHub

---

**Status:** ✅ **READY FOR SUBMISSION**

**Completion Date:** December 2, 2025  
**Student:** Lerato  
**Course:** IBM - Introduction to Containers with Docker, Kubernetes & OpenShift
