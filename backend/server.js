
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const { processQuestion } = require('./ai-agent-gemini');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// Test database connection route
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      success: true, 
      message: 'Database connection successful',
      timestamp: result.rows[0].now 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY user_id');
    res.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY order_date DESC');
    res.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Execute custom SQL query
app.post('/api/query', async (req, res) => {
  try {
    const { sql } = req.body;
    
    if (!sql) {
      return res.status(400).json({ 
        success: false, 
        message: 'SQL query is required' 
      });
    }

    const result = await pool.query(sql);
    res.json({ 
      success: true, 
      data: result.rows,
      rowCount: result.rowCount 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// AI-powered natural language query endpoint
app.post('/api/ai-query', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ 
        success: false, 
        message: 'Question is required' 
      });
    }

    console.log('\n=== NEW AI QUERY ===');
    const result = await processQuestion(question);
    console.log('=== QUERY COMPLETE ===\n');
    
    res.json(result);
  } catch (error) {
    console.error('Error in AI query:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
