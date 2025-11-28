const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const RESULTS_FILE = path.join(DATA_DIR, 'results.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(RESULTS_FILE)) {
  fs.writeFileSync(RESULTS_FILE, JSON.stringify([], null, 2));
}

// Read and write helpers
const readJSON = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return [];
  }
};

const writeJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// User operations
exports.createUser = (userData) => {
  const users = readJSON(USERS_FILE);
  const newUser = {
    id: uuidv4(),
    name: userData.name,
    email: userData.email,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  writeJSON(USERS_FILE, users);
  return newUser;
};

exports.getUser = (userId) => {
  const users = readJSON(USERS_FILE);
  return users.find(u => u.id === userId);
};

exports.getUserByEmail = (email) => {
  const users = readJSON(USERS_FILE);
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

exports.getAllUsers = () => {
  return readJSON(USERS_FILE);
};

exports.deleteUser = (userId) => {
  const users = readJSON(USERS_FILE);
  const filtered = users.filter(u => u.id !== userId);
  writeJSON(USERS_FILE, filtered);
  
  // Also delete user's results
  const results = readJSON(RESULTS_FILE);
  const filteredResults = results.filter(r => r.userId !== userId);
  writeJSON(RESULTS_FILE, filteredResults);
  
  return filtered.length < users.length;
};

// Result operations
exports.saveResult = (resultData) => {
  const results = readJSON(RESULTS_FILE);
  const newResult = {
    id: uuidv4(),
    userId: resultData.userId,
    userName: resultData.userName,
    date: new Date().toISOString(),
    income: resultData.income,
    expenses: resultData.expenses,
    goals: resultData.goals,
    metrics: resultData.metrics,
    aiAdvice: resultData.aiAdvice,
    healthScore: resultData.healthScore,
  };
  results.push(newResult);
  writeJSON(RESULTS_FILE, results);
  return newResult;
};

exports.getUserResults = (userId) => {
  const results = readJSON(RESULTS_FILE);
  return results.filter(r => r.userId === userId).sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
};

exports.getResult = (resultId) => {
  const results = readJSON(RESULTS_FILE);
  return results.find(r => r.id === resultId);
};

exports.deleteResult = (resultId) => {
  const results = readJSON(RESULTS_FILE);
  const filtered = results.filter(r => r.id !== resultId);
  writeJSON(RESULTS_FILE, filtered);
  return filtered.length < results.length;
};

exports.getAllResults = () => {
  return readJSON(RESULTS_FILE).sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
};
