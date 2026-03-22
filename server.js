const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// In-memory storage for chat messages (for demo purposes)
let chatMessages = [];
let users = new Set();

// Initialize Google AI
const GOOGLE_API_KEY = 'AIzaSyApocfJ8d2kQ042tGgb6gpT0QLZCHZqjOs';
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const aiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Gaming Chat Proxy API',
    version: '1.0.0',
    endpoints: {
      chat: '/api/chat',
      upload: '/api/upload',
      users: '/api/users',
      history: '/api/history',
      ai: '/api/ai'
    }
  });
});

// Get all online users
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    users: Array.from(users),
    count: users.size
  });
});

// Send chat message
app.post('/api/chat', (req, res) => {
  try {
    const { username, message, room = 'general' } = req.body;
    
    if (!username || !message) {
      return res.status(400).json({
        success: false,
        error: 'Username and message are required'
      });
    }
    
    // Add user to online users
    users.add(username);
    
    const chatMessage = {
      id: uuidv4(),
      username,
      message,
      room,
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    
    chatMessages.push(chatMessage);
    
    // Keep only last 100 messages per room
    const roomMessages = chatMessages.filter(msg => msg.room === room);
    if (roomMessages.length > 100) {
      chatMessages = chatMessages.filter(msg => msg.room !== room || 
        roomMessages.indexOf(msg) >= roomMessages.length - 100);
    }
    
    res.json({
      success: true,
      message: chatMessage
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// AI Chat Proxy Endpoint
app.post('/api/ai', async (req, res) => {
  try {
    const { message, username, room = 'general' } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }
    
    console.log(`🤖 AI Request from ${username}: ${message}`);
    
    // Call Google AI API
    const result = await aiModel.generateContent(message);
    const response = await result.response;
    const aiResponse = response.text();
    
    // Add user to online users
    if (username) {
      users.add(username);
    }
    
    // Save user message
    if (username) {
      const userMessage = {
        id: uuidv4(),
        username,
        message,
        room,
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      chatMessages.push(userMessage);
    }
    
    // Save AI response
    const aiMessage = {
      id: uuidv4(),
      username: 'AI Assistant',
      message: aiResponse,
      room,
      timestamp: new Date().toISOString(),
      type: 'ai'
    };
    chatMessages.push(aiMessage);
    
    // Keep only last 100 messages per room
    const roomMessages = chatMessages.filter(msg => msg.room === room);
    if (roomMessages.length > 100) {
      chatMessages = chatMessages.filter(msg => msg.room !== room || 
        roomMessages.indexOf(msg) >= roomMessages.length - 100);
    }
    
    res.json({
      success: true,
      aiMessage: aiMessage
    });
    
  } catch (error) {
    console.error('🤖 AI Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'AI service temporarily unavailable',
      details: error.message
    });
  }
});

// Get chat history
app.get('/api/history', (req, res) => {
  try {
    const { room = 'general', limit = 50 } = req.query;
    
    const roomMessages = chatMessages
      .filter(msg => msg.room === room)
      .slice(-parseInt(limit))
      .reverse();
    
    res.json({
      success: true,
      messages: roomMessages,
      count: roomMessages.length
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Upload photo
app.post('/api/upload', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }
    
    const { username, caption, room = 'general' } = req.body;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username is required'
      });
    }
    
    // Add user to online users
    users.add(username);
    
    const photoMessage = {
      id: uuidv4(),
      username,
      caption: caption || '',
      room,
      timestamp: new Date().toISOString(),
      type: 'photo',
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: `/uploads/${req.file.filename}`
    };
    
    chatMessages.push(photoMessage);
    
    res.json({
      success: true,
      message: photoMessage
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Upload failed'
    });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size too large. Maximum size is 5MB.'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎮 Gaming Chat Proxy API running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`🤖 AI Proxy: Google Gemini 2.5 Flash`);
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`📡 AI Endpoint: http://localhost:${PORT}/api/ai`);
});

module.exports = app;
