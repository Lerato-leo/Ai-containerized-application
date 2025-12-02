# CI/CD Pipeline Setup Guide

**GitHub Actions Automated Build & Deployment**

This guide explains how to set up and use the automated CI/CD pipeline for the AI Finance Application.

---

## Overview

The CI/CD pipeline automates:
1. ✅ **Build & Test** - Build Node.js backend and React frontend
2. ✅ **Docker Build** - Create optimized Docker images for backend and frontend
3. ✅ **Docker Push** - Push images to Docker Hub automatically
4. ✅ **Kubernetes Deploy** - Deploy to Kubernetes cluster (optional)
5. ✅ **Notifications** - Report build status and results

---

## Prerequisites

### GitHub Setup
- GitHub repository with Actions enabled
- Main branch protected (optional but recommended)

### Docker Hub Setup
- Docker Hub account (create at [docker.com](https://docker.com))
- Docker username and access token

### Kubernetes Setup (Optional)
- Kubernetes cluster (Docker Desktop, AWS EKS, Google GKE, etc.)
- `kubeconfig` file for cluster access

---

## Configuration

### Step 1: Add Docker Hub Secrets

Go to your GitHub repository and add secrets:

**Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

| Secret Name | Value | Get From |
|-------------|-------|----------|
| `DOCKER_USERNAME` | Your Docker Hub username | Docker Hub profile |
| `DOCKER_PASSWORD` | Your Docker Hub access token | Docker Hub → Account Settings → Security → Access Tokens |

**How to create Docker Hub access token:**
1. Go to [Docker Hub](https://hub.docker.com)
2. Click your profile → Account Settings
3. Select "Security" → "New Access Token"
4. Give it a name (e.g., "GitHub CI/CD")
5. Copy the token and add it as `DOCKER_PASSWORD` secret

### Step 2: Add Kubernetes Secrets (Optional)

If you want automatic Kubernetes deployment:

**Settings → Secrets and variables → Actions → New repository secret**

Add:

| Secret Name | Value |
|-------------|-------|
| `KUBE_CONFIG` | Base64-encoded kubeconfig file |

**Get your kubeconfig (Docker Desktop example):**
```bash
# For Docker Desktop Kubernetes
cat ~/.kube/config | base64

# For other clusters, replace ~/.kube/config with your kubeconfig path
```

### Step 3: Add Gemini API Key Secret (Optional)

For encrypted API key in pipeline:

```bash
# Add to GitHub Secrets
GEMINI_API_KEY=your_actual_key_here
```

Then reference in pipeline:
```yaml
env:
  AI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

---

## How It Works

### Trigger Events

The pipeline runs automatically on:

1. **Push to main branch**
   ```bash
   git push origin main
   # Pipeline runs automatically
   ```

2. **Pull request to main branch**
   - Builds and tests but doesn't push to Docker Hub
   - Good for PR validation

3. **Manual trigger (workflow dispatch)**
   - GitHub UI → Actions → Select workflow → Run workflow

### Pipeline Jobs

**Job 1: Build & Test**
- Installs Node.js dependencies
- Builds React frontend
- Runs tests (if available)
- ✅ Runs on every push/PR
- ⏱️ ~2-3 minutes

**Job 2: Build Backend Docker Image**
- Builds backend Docker image from `Dockerfile.backend`
- Pushes to Docker Hub: `leratomatamela1/ai-finance-backend:latest`
- ✅ Only runs if tests pass
- ⏱️ ~3-5 minutes

**Job 3: Build Frontend Docker Image**
- Builds frontend Docker image from `Dockerfile.frontend`
- Pushes to Docker Hub: `leratomatamela1/ai-finance-frontend:latest`
- ✅ Only runs if tests pass
- ⏱️ ~2-3 minutes

**Job 4: Deploy to Kubernetes (Optional)**
- Updates `k8s-manifest.yaml` with latest image tags
- Applies manifest to Kubernetes cluster
- ✅ Only runs on successful build + push to main
- ⏱️ ~2-5 minutes
- ⚠️ Requires `KUBE_CONFIG` secret to be set

**Job 5: Notifications**
- Reports pipeline status
- Shows Docker image URLs
- ✅ Always runs to report results

### Total Pipeline Duration
- **Build & Test**: 2-3 min
- **Docker Build & Push**: 5-8 min
- **Deploy to K8s**: 2-5 min (if enabled)
- **Total**: ~10-15 minutes

---

## Workflow File

Location: `.github/workflows/docker-build-deploy.yml`

Key sections:

```yaml
# Trigger conditions
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:  # Manual trigger

# Jobs that run in parallel (unless dependencies specified)
jobs:
  build-and-test:
    # ... test steps ...
  
  build-backend-image:
    needs: build-and-test  # Wait for build-and-test to finish
    # ... docker build & push ...
  
  build-frontend-image:
    needs: build-and-test  # Wait for build-and-test to finish
    # ... docker build & push ...
  
  deploy-kubernetes:
    needs: [build-backend-image, build-frontend-image]  # Wait for both
    # ... kubernetes deploy ...
```

---

## Usage Examples

### Example 1: Automatic Pipeline on Git Push

```bash
# Make changes
echo "New feature" >> README.md

# Commit and push
git add README.md
git commit -m "Add new feature"
git push origin main

# Pipeline automatically starts!
# View at: GitHub → Actions → Docker Build & Deploy to Kubernetes
```

### Example 2: Pull Request Pipeline

```bash
# Create feature branch
git checkout -b feature/new-analysis

# Make changes and commit
git commit -am "Add new analysis feature"
git push origin feature/new-analysis

# Create PR on GitHub
# Pipeline runs to validate changes (doesn't push to Docker Hub)
```

### Example 3: Manual Pipeline Trigger

```bash
# On GitHub UI
GitHub → Actions → Docker Build & Deploy to Kubernetes
Click "Run workflow"
```

---

## Viewing Pipeline Results

### On GitHub UI

1. **Go to Actions tab**
   - GitHub → Actions → Docker Build & Deploy to Kubernetes

2. **Click the latest run**
   - See all jobs and their status

3. **Click a job for details**
   - View logs and step-by-step output

### Check Docker Hub

After successful run, verify images on Docker Hub:

```bash
# View backend image
https://hub.docker.com/r/leratomatamela1/ai-finance-backend

# View frontend image
https://hub.docker.com/r/leratomatamela1/ai-finance-frontend
```

### Verify Kubernetes Deployment

```bash
# Check if pods are running
kubectl get pods -n ai-finance

# Check rollout status
kubectl rollout status deployment/ai-finance-backend -n ai-finance

# View deployment logs
kubectl logs -n ai-finance deployment/ai-finance-backend
```

---

## Troubleshooting

### Docker Hub Auth Failed

**Error:**
```
Error response from daemon: unauthorized: incorrect username or password
```

**Solution:**
1. Verify `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets are correct
2. Create new access token on Docker Hub
3. Update `DOCKER_PASSWORD` secret with new token

### Kubernetes Deploy Failed

**Error:**
```
Error: unable to connect to the server: dial tcp: lookup kubernetes.docker.internal on 127.0.0.1:53: no such host
```

**Solution:**
1. Verify `KUBE_CONFIG` secret is set (base64-encoded)
2. Ensure cluster is running and accessible
3. Check cluster connectivity from GitHub runners (may need firewall rules)

### Pipeline Timeout

**Error:**
```
The operation timed out.
```

**Solution:**
- Pipeline runs ~10-15 minutes total
- May timeout if Docker build is slow
- Increase timeout in workflow file if needed

### Image Not Updated on Docker Hub

**Problem:**
- Code changed but image wasn't updated

**Solution:**
1. Verify pipeline ran (check GitHub Actions)
2. Check if build/test failed (would prevent push)
3. Verify tags are correct (should be `:latest` and `:v1.0`)

---

## Best Practices

### 1. Semantic Versioning

Update image tags based on changes:

```yaml
tags: |
  ${{ secrets.DOCKER_USERNAME }}/ai-finance-backend:latest
  ${{ secrets.DOCKER_USERNAME }}/ai-finance-backend:v1.0.0
```

### 2. Branch Protection

Require CI/CD to pass before merging:

**GitHub → Settings → Branches → Branch protection rules**
- Check "Require status checks to pass before merging"
- Select "docker-build-deploy"

### 3. Notifications

Add Slack or email notifications:

```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

### 4. Automated Tests

Add test script to pipeline:

```bash
# Add to package.json
"test": "npm run test:backend && npm run test:frontend"

# Pipeline will run: npm test
```

### 5. Security Scanning

Scan images for vulnerabilities:

```yaml
- name: Trivy Scan
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ${{ secrets.DOCKER_USERNAME }}/ai-finance-backend:latest
```

---

## Workflow Diagrams

### Basic Flow

```
Push to Main
    ↓
Build & Test
    ↓
├─ Build Backend Image
├─ Build Frontend Image
    ↓
Deploy to Kubernetes (optional)
    ↓
Notification
```

### With Branch Protection

```
Create PR
    ↓
Build & Test (PR validation)
    ↓
Review & Approve
    ↓
Merge to Main
    ↓
Full Pipeline (build, push, deploy)
    ↓
Production Update
```

---

## Environment Variables in Pipeline

The pipeline can access:

```yaml
# GitHub Context
github.event_name      # 'push', 'pull_request', 'workflow_dispatch'
github.ref             # 'refs/heads/main'
github.actor           # Username who triggered the pipeline
github.run_id          # Unique run identifier

# Job Context
job.status             # 'success', 'failure'
matrix.node-version    # '18' in our case

# Secrets (injected)
secrets.DOCKER_USERNAME
secrets.DOCKER_PASSWORD
secrets.KUBE_CONFIG
secrets.GEMINI_API_KEY
```

---

## Advanced Customization

### Run Tests Before Building

```yaml
- name: Run Backend Tests
  run: npm test

- name: Run Frontend Tests
  run: cd frontend && npm test
```

### Build Only Specific Components

```yaml
# Only build backend if src/ changed
- name: Build Backend
  if: contains(github.event.head_commit.modified, 'src/')
  run: docker build -f Dockerfile.backend .
```

### Deploy to Multiple Registries

```yaml
- name: Push to Docker Hub
  run: docker push leratomatamela1/ai-finance-backend:latest

- name: Push to GitHub Container Registry
  run: docker push ghcr.io/${{ github.repository }}/ai-finance-backend:latest
```

---

## Monitoring & Maintenance

### Weekly Review

- Check failed pipelines (GitHub → Actions)
- Review Docker Hub for outdated images
- Check Kubernetes deployments

### Monthly Tasks

- Update base images (Node.js, Nginx)
- Security scans for vulnerabilities
- Cleanup old images from Docker Hub
- Review pipeline logs

### Quarterly Tasks

- Update GitHub Actions versions
- Review and update Docker best practices
- Performance optimization
- Documentation updates

---

## Summary

| Component | Status | Duration |
|-----------|--------|----------|
| GitHub Actions Setup | ✅ Ready | 5 min |
| Docker Hub Integration | ✅ Ready | Automatic |
| Build & Test | ✅ Ready | 2-3 min |
| Docker Build & Push | ✅ Ready | 5-8 min |
| Kubernetes Deploy | ⚠️ Optional | 2-5 min |
| Total Pipeline Time | | ~10-15 min |

Your CI/CD pipeline is now **fully automated**! Every push to main will:
- Build your application
- Create Docker images
- Push to Docker Hub
- (Optionally) Deploy to Kubernetes

---

**Next Steps:**
1. ✅ Add Docker Hub secrets to GitHub
2. ✅ Test pipeline with a git push
3. ✅ Monitor GitHub Actions for successful run
4. ✅ Verify images appear on Docker Hub

---

For more info, see [GitHub Actions Documentation](https://docs.github.com/en/actions)
