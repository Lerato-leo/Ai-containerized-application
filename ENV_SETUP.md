# Environment Configuration Guide

**AI Financial Wellness Application - Environment Setup**

This guide explains how to configure environment variables for local development and Railway.app deployment.

---

## Quick Setup

### 1. Copy Template File

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` with your settings:

```dotenv
PORT=5000
NODE_ENV=production
AI_PROVIDER=gemini
AI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-1.5-flash
LOG_LEVEL=info
```

### 3. Optional: Get Gemini API Key

For AI-powered financial advice, get a FREE API key:
- Visit: https://aistudio.google.com/app/apikey
- Create new API key (no credit card required)
- Add to `.env`

**Note:** App works great without API key using rule-based advice!

---

## Environment Variables Reference

### Core Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Backend server port |
| `NODE_ENV` | `production` | Development or production |
| `LOG_LEVEL` | `info` | Log verbosity: debug, info, warn, error |

### AI Configuration (Optional)

| Variable | Default | Description |
|----------|---------|-------------|
| `AI_PROVIDER` | `gemini` | AI provider (gemini) |
| `AI_API_KEY` | N/A | Google Gemini API key |
| `AI_MODEL` | `gemini-1.5-flash` | Model: flash or pro |

### Frontend Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://localhost:5000` | Backend API URL |

---

## Getting Your Gemini API Key

### Step 1: Visit Google AI Studio
https://aistudio.google.com/app/apikey

### Step 2: Create API Key
- Click "Create API Key"
- Select default project (or create new one)
- Copy the key

### Step 3: Add to .env
```dotenv
AI_API_KEY=your_copied_key_here
```
- Select your project (or create a new one)
- Copy the generated key

### Step 3: Add to .env File

```dotenv
AI_API_KEY=YOUR_KEY_HERE
```

### Step 4: Test the Connection

After deployment, verify the API key works:

```bash
# Port-forward to backend
kubectl port-forward -n ai-finance svc/ai-finance-backend-svc 3000:3000

# Test the health endpoint
curl http://localhost:3000/health
```

Expected response:
```json
{"message":"AI Financial Wellness Coach Backend Running"}
```

---

## Local Development Setup

### 1. Install Dependencies

```bash
# Backend
npm install

# Frontend
cd frontend
npm install
cd ..
```

### 2. Create .env File

```bash
cp .env.example .env
# Edit .env and add your Gemini API key
```

### 3. Run Backend

```bash
npm start
# Server runs on http://localhost:3000
```

### 4. Run Frontend (in new terminal)

```bash
cd frontend
npm start
# App opens on http://localhost:3001
```

---

## Kubernetes Deployment Setup

### 1. Prepare Environment

```bash
# Copy template
cp .env.example .env

# Add your API key to .env
# Edit the file and replace 'your_actual_gemini_api_key_here'
```

### 2. Update k8s-manifest.yaml

The manifest automatically reads from `.env` and creates a Secret:

```yaml
# In k8s-manifest.yaml Secret section:
stringData:
  AI_API_KEY: "your_actual_gemini_api_key_here"
```

**Option A: Update the manifest directly**
```bash
# Edit k8s-manifest.yaml and replace the API key in the Secret section
```

**Option B: Create Secret from .env file**
```bash
# Extract API key from .env
API_KEY=$(grep AI_API_KEY .env | cut -d'=' -f2)

# Create Secret
kubectl create secret generic ai-finance-secret \
  --from-literal=AI_API_KEY=$API_KEY \
  -n ai-finance
```

### 3. Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace ai-finance

# Apply manifest
kubectl apply -f k8s-manifest.yaml

# Verify deployment
kubectl get pods -n ai-finance
kubectl get secrets -n ai-finance
```

### 4. Verify Configuration

```bash
# Check ConfigMap
kubectl describe cm ai-finance-config -n ai-finance

# Check Secret exists (but don't print the value)
kubectl get secret ai-finance-secret -n ai-finance

# Test backend pod
kubectl run -n ai-finance test-pod --image=curlimages/curl --rm -it --restart=Never -- \
  curl http://ai-finance-backend-svc:3000/health
```

---

## AI Model Selection

### Gemini 1.5 Flash (Recommended)

**Default: `gemini-1.5-flash`**

- ⚡ **Fast**: Sub-second latency
- 💰 **Cheap**: Lower API costs
- ✅ **Efficient**: Good for financial analysis
- 📊 **Performance**: Suitable for real-time applications

Use this for:
- Production deployments
- High-volume usage
- Cost-sensitive applications

### Gemini 1.5 Pro

**Option: `gemini-1.5-pro`**

- 🧠 **Smarter**: More nuanced responses
- 🐢 **Slower**: 2-5 second latency
- 💸 **Expensive**: Higher API costs
- 🎯 **Better**: For complex financial scenarios

Use this for:
- Deep financial analysis
- Complex investment advice
- When accuracy > speed

---

## Troubleshooting

### API Key Not Working

```bash
# Check Secret is mounted correctly
kubectl exec -it deployment/ai-finance-backend -n ai-finance -- env | grep AI_API_KEY

# Verify backend can access API
kubectl logs -n ai-finance deployment/ai-finance-backend --tail=20
```

Expected error if key is wrong:
```
Error: Invalid API Key format
```

### ConfigMap Not Applied

```bash
# Verify ConfigMap exists
kubectl get configmap ai-finance-config -n ai-finance

# Describe it
kubectl describe cm ai-finance-config -n ai-finance
```

### Pod Can't Reach Gemini API

```bash
# Check pod logs for network errors
kubectl logs -n ai-finance deployment/ai-finance-backend --tail=50

# Test pod network connectivity
kubectl run -n ai-finance test-pod --image=curlimages/curl --rm -it --restart=Never -- \
  curl https://generativelanguage.googleapis.com/
```

---

## Security Best Practices

### 🔒 API Key Management

1. **Never commit .env to git**
   ```bash
   # Add to .gitignore (already done)
   echo ".env" >> .gitignore
   ```

2. **Use Kubernetes Secrets for production**
   ```bash
   # The k8s-manifest.yaml already creates a Secret
   kubectl get secret ai-finance-secret -n ai-finance
   ```

3. **Rotate keys periodically**
   - Update in Google AI Studio
   - Update Secret in Kubernetes
   - Restart pods

4. **Limit key scope**
   - Use API key restrictions in Google Cloud
   - Restrict to specific APIs (Generative Language API only)
   - Set usage limits and alerts

### 🔐 Environment Isolation

- Development: Use different API key than production
- Staging: Use staging Gemini resources
- Production: Use production API key with limits

---

## Environment Files

### .env (Local Development & Docker)

```dotenv
# Development configuration
PORT=3000
NODE_ENV=development
AI_PROVIDER=gemini
AI_API_KEY=your_dev_key
AI_MODEL=gemini-1.5-flash
```

### .env.example (Template)

```dotenv
# Example configuration
# Copy to .env and update values
PORT=3000
NODE_ENV=production
AI_PROVIDER=gemini
AI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-1.5-flash
```

### k8s-manifest.yaml (Kubernetes)

```yaml
# ConfigMap: Application settings
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: ai-finance-config
  namespace: ai-finance
data:
  AI_PROVIDER: "gemini"
  AI_MODEL: "gemini-1.5-flash"

---
# Secret: API key (sensitive)
apiVersion: v1
kind: Secret
metadata:
  name: ai-finance-secret
  namespace: ai-finance
type: Opaque
stringData:
  AI_API_KEY: "your_actual_gemini_api_key_here"
```

---

## Summary

| Environment | Setup Method | API Key Storage | Notes |
|-------------|--------------|-----------------|-------|
| **Local Dev** | `.env` file | Plain text `.env` | For development only |
| **Docker** | `.env` file | Passed to container | Don't push to registry |
| **Kubernetes** | k8s-manifest.yaml | Secret resource | Secure, encrypted at rest |

---

## Next Steps

1. ✅ Get your Gemini API key from [ai.google.dev](https://ai.google.dev)
2. ✅ Update `.env` with your key
3. ✅ Deploy with `kubectl apply -f k8s-manifest.yaml`
4. ✅ Verify with health check endpoint
5. ✅ Access app via port-forward: `kubectl port-forward -n ai-finance svc/ai-finance-frontend-svc 3001:3001`

---

**Questions?** Check the main README.md for deployment instructions.
