# Multi-stage build for AI Financial Wellness Application

# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/src ./src
COPY frontend/public ./public
RUN npm run build

# Stage 2: Build the backend with frontend
FROM node:18-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production && npm cache clean --force

# Copy application code
COPY server.js .
COPY src/ ./src/

# Copy built frontend from builder stage
COPY --from=frontend-build /app/frontend/build ./public

# Copy environment template
COPY .env.example ./

# Create data directory with proper permissions
RUN mkdir -p data && chown -R nodejs:nodejs data /app

# Switch to non-root user
USER nodejs

# Set environment variables
ENV NODE_ENV=production \
    PORT=5000 \
    NODE_OPTIONS=--max-old-space-size=256

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["node", "server.js"]
