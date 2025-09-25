// Only load dotenv in development - Railway provides variables automatically
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const ExpenseDatabase = require('./database-postgres');
const { createToken, authenticateToken, optionalAuth, authLimiter, apiLimiter } = require('./auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CLIENT_URL, /\.railway\.app$/].filter(Boolean)
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', apiLimiter);

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Initialize database with retry logic
let db;
async function initializeDatabase(retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Database initialization attempt ${i + 1}/${retries}`);
      db = new ExpenseDatabase();
      await db.init();
      
      // Create seed data if it's the first run
      if (process.env.NODE_ENV !== 'production') {
        await db.createSeedData();
      }
      console.log('✅ Database initialized successfully');
      return true;
    } catch (error) {
      console.error(`❌ Database initialization failed (attempt ${i + 1}):`, error.message);
      if (i < retries - 1) {
        console.log(`⏳ Waiting 5 seconds before retry...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  console.error('❌ Failed to initialize database after all retries');
  return false;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: db ? 'connected' : 'disconnected'
  });
});

// Categories for expenses
const categories = [
  'General',
  'Food & Dining',
  'Groceries',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Subscriptions',
  'Personal Care',
  'Others'
];

// Get categories
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

// Start server
async function startServer() {
  console.log('🚀 Starting expense tracker server...');
  
  const dbInitialized = await initializeDatabase();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📱 Optimized for iPhone 15 Pro`);
    console.log(`📊 Database status: ${dbInitialized ? 'Connected' : 'Disconnected'}`);
    
    if (!dbInitialized) {
      console.log('⚠️  Server started without database. Check Railway PostgreSQL service connection.');
    }
  });
}

startServer().catch(console.error);
