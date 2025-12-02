#!/bin/sh

echo "=== Testing AI Finance Backend API ==="
echo ""

echo "1. Testing User Registration..."
curl -X POST http://ai-finance-backend-svc:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}' \
  -s | head -c 200
echo ""
echo ""

echo "2. Testing User Login..."
curl -X POST http://ai-finance-backend-svc:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -s | head -c 200
echo ""
echo ""

echo "3. Testing Financial Summary..."
curl -X POST http://ai-finance-backend-svc:3000/api/summary \
  -H "Content-Type: application/json" \
  -d '{"income":5000,"expenses":2000,"savings":1500}' \
  -s | head -c 200
echo ""
echo ""

echo "4. Testing Health Report..."
curl -X POST http://ai-finance-backend-svc:3000/api/health-report \
  -H "Content-Type: application/json" \
  -d '{"income":5000,"expenses":2000,"savings":1500}' \
  -s | head -c 200
echo ""
echo ""

echo "5. Testing Get Users..."
curl -X GET http://ai-finance-backend-svc:3000/api/users \
  -H "Content-Type: application/json" \
  -s | head -c 200
echo ""
echo ""

echo "=== All Tests Complete ===" 
