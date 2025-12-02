# Environment Configuration Guide

**Last Updated:** December 2, 2025

---

## Overview

This project uses environment variables for configuration management. The `.env` file contains all sensitive and deployment-specific settings.

---

## Files

### `.env.example` (Template)
- **Purpose:** Template file showing all required environment variables
- **Usage:** Copy this file and rename to `.env`, then fill in actual values
- **Security:** Safe to commit to Git (contains no actual secrets)

### `.env` (Actual Configuration)
- **Purpose:** Your actual configuration with real API keys and settings
- **Usage:** Used by the application at runtime
- **Security:** ⚠️ **NEVER commit this file to Git** (contains real API keys)

---

## Quick Setup

### For Local Development

```bash
# 1. Copy the example file
cp .env.example .env

# 2. Edit the .env file with your values
# Open .env and replace:
# - AI_API_KEY with your actual Gemini API key from https://ai.google.dev/
# - Other settings as needed for your environment

# 3. Verify your .env file is in .gitignore (it should be)
cat .gitignore | grep ".env"

# 4. Start the application
npm install
npm start
```

### For Docker/Kubernetes Deployment

```bash
# Option 1: Kubernetes Secret from .env file
kubectl create secret generic ai-finance-secret \
  --from-env-file=.env \
  -n ai-finance

# Option 2: Update k8s-manifest.yaml directly
# Edit k8s-manifest.yaml and replace:
# stringData:
#   AI_API_KEY: "your_actual_key_here"
```

---

## Environment Variables Reference

### Application Settings

| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `PORT` | `3000` | Backend server port | No |
| `NODE_ENV` | `production` | Application environment (development, production, testing) | No |

### AI/LLM Configuration

| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `AI_PROVIDER` | `gemini` | AI provider (gemini, huggingface) | No |
| `AI_API_KEY` | - | API key for AI provider | **YES** |
| `AI_MODEL` | `gemini-1.5-flash` | Model to use for AI | No |
| `AI_API_URL` | HuggingFace URL | API endpoint for AI provider | No |

### Database Configuration

| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `DATA_DIR` | `./data` | Directory for JSON database files | No |

### Frontend Configuration

| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `FRONTEND_PORT` | `3001` | Frontend server port | No |

### Kubernetes Configuration

| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `K8S_NAMESPACE` | `ai-finance` | Kubernetes namespace | No |
| `DOCKER_BACKEND_IMAGE` | `leratomatamela1/ai-finance-backend:latest` | Backend Docker image | No |
| `DOCKER_FRONTEND_IMAGE` | `leratomatamela1/ai-finance-frontend:latest` | Frontend Docker image | No |

### Logging & Debug

| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `LOG_LEVEL` | `info` | Log level (error, warn, info, debug) | No |
| `DEBUG` | `false` | Enable debug mode | No |

---

## How to Get API Keys

### Google Gemini API Key

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Click "Get API Key"
3. Create a new API key or use existing project
4. Copy the API key
5. Paste into `.env` file as `AI_API_KEY=your_key_here`

### HuggingFace Token (Alternative AI Provider)

1. Go to [HuggingFace](https://huggingface.co/settings/tokens)
2. Create a new token with "read" permissions
3. Copy the token
4. Set `AI_PROVIDER=huggingface` in `.env`
5. Paste token as `AI_API_KEY=your_token_here`

---

## Git Configuration

Make sure `.env` is never committed:

### Check `.gitignore`

```bash
# Verify .env is in .gitignore
cat .gitignore | grep ".env"
```

Expected output:
```
.env
```

### If .env was accidentally committed:

```bash
# Remove from Git history (but keep local file)
git rm --cached .env

# Verify it's removed
git status

# Commit the change
git commit -m "Remove .env file from tracking"
```

---

## Environment Configuration by Deployment Type

### Development (Local Machine)

```bash
# .env file
PORT=3000
NODE_ENV=development
AI_PROVIDER=gemini
AI_API_KEY=your_test_key_here
DEBUG=true
LOG_LEVEL=debug
```

**Access:**
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:3001`

### Docker (Local Container)

```bash
# Run with environment variables
docker run -e AI_API_KEY=your_key_here \
           -e PORT=3000 \
           -e NODE_ENV=production \
           leratomatamela1/ai-finance-backend:latest
```

### Docker Compose

```yaml
services:
  backend:
    environment:
      - AI_API_KEY=your_key_here
      - PORT=3000
      - NODE_ENV=production
```

### Kubernetes

```bash
# Create secret from .env
kubectl create secret generic ai-finance-secret \
  --from-file=.env \
  -n ai-finance

# Or create from literal values
kubectl create secret generic ai-finance-secret \
  --from-literal=AI_API_KEY=your_key_here \
  -n ai-finance

# Update k8s-manifest.yaml and apply
kubectl apply -f k8s-manifest.yaml
```

---

## Security Best Practices

### ✅ DO:
- ✅ Use `.env.example` as template
- ✅ Keep `.env` in `.gitignore`
- ✅ Rotate API keys regularly
- ✅ Use different keys for different environments
- ✅ Store keys in secure vaults (AWS Secrets Manager, Azure Key Vault)
- ✅ Use Kubernetes Secrets for production

### ❌ DON'T:
- ❌ Commit `.env` file to Git
- ❌ Share API keys via chat or email
- ❌ Use same key for development and production
- ❌ Log or print sensitive variables
- ❌ Store secrets in source code or comments
- ❌ Use placeholder keys like "your_key_here" in production

---

## Troubleshooting

### "AI_API_KEY not found" Error

**Problem:** Application shows "API key missing" or similar error

**Solution:**
1. Verify `.env` file exists: `ls -la .env`
2. Check AI_API_KEY is set: `cat .env | grep AI_API_KEY`
3. Verify key is not empty or placeholder
4. Restart the application
5. Check logs: `npm start` (development) or `docker logs <container_id>` (Docker)

### Kubernetes Pod Error: "Secret not found"

**Problem:** Pod fails to start with secret reference error

**Solution:**
1. Verify secret exists: `kubectl get secrets -n ai-finance`
2. Check secret content: `kubectl get secret ai-finance-secret -n ai-finance -o yaml`
3. Recreate secret if needed: 
   ```bash
   kubectl delete secret ai-finance-secret -n ai-finance
   kubectl create secret generic ai-finance-secret \
     --from-literal=AI_API_KEY=your_key_here \
     -n ai-finance
   ```

### Port Already in Use

**Problem:** "Address already in use" error

**Solution:**
1. Change PORT in `.env` to an unused port
2. Or kill the process using the port:
   ```bash
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

---

## Example Workflows

### Setup for Fresh Deployment

```bash
# 1. Clone repository
git clone https://github.com/Lerato-leo/Ai-containerized-application.git
cd Ai-containerized-application

# 2. Setup environment
cp .env.example .env
# Edit .env and add your API key

# 3. Deploy to Kubernetes
kubectl apply -f k8s-manifest.yaml

# 4. Update secret with real API key
kubectl delete secret ai-finance-secret -n ai-finance
kubectl create secret generic ai-finance-secret \
  --from-env-file=.env \
  -n ai-finance

# 5. Restart pods
kubectl rollout restart deployment/ai-finance-backend -n ai-finance
kubectl rollout restart deployment/ai-finance-frontend -n ai-finance

# 6. Verify deployment
kubectl get pods -n ai-finance
```

### Environment Variable Override

```bash
# Docker: Override at runtime
docker run -e AI_API_KEY=new_key_here \
           -e DEBUG=true \
           leratomatamela1/ai-finance-backend:latest

# Kubernetes: Update ConfigMap
kubectl edit configmap ai-finance-config -n ai-finance
# Then restart pods to apply changes
kubectl rollout restart deployment/ai-finance-backend -n ai-finance
```

---

## Additional Resources

- [Google Gemini API Docs](https://ai.google.dev/)
- [HuggingFace Documentation](https://huggingface.co/docs)
- [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
- [Docker Environment Variables](https://docs.docker.com/compose/environment-variables/)
- [12 Factor App - Config](https://12factor.net/config)

---

## Questions?

See `README.md` for deployment instructions or `capstone_reflection.md` for architecture details.
