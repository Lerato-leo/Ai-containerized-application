# Multi-stage build for FinanceAI application

# Stage 1: Build the React frontend
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup backend and serve frontend
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY src/ ./src/
COPY server.js ./
COPY .env* ./
COPY --from=frontend-build /app/frontend/build ./public
EXPOSE 3000
CMD ["node", "server.js"]
