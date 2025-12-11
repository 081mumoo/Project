require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== DATABASE CONNECTION ====================
// We create the pool first so it is ready for the middleware
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '9554Mumo*',
    database: process.env.DB_NAME || 'exotic_paws_db',
    waitForConnections: true,
    connectionLimit: 10
});

// ==================== MIDDLEWARE ====================
// Allow all origins (for easier testing)
app.use(cors()); 
app.use(bodyParser.json());
app.use(express.static('../frontend')); 

// CRITICAL FIX: Attach Database to Request BEFORE loading routes
app.use((req, res, next) => {
    req.app.locals.pool = pool;
    next();
});

// ==================== AUTHENTICATION MIDDLEWARE ====================
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied - No token provided' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET || 'epc', (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// ==================== ROOT ROUTE ====================
app.get('/', (req, res) => {
    res.json({
        message: '✅ Exotic Paws API Server is Running!',
        version: '1.0.0',
        note: 'Access the frontend at http://localhost:3000/login.html'
    });
});

// ==================== API ROUTES ====================
// Now that pool is attached, these routes will work
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pets', authenticateToken, require('./routes/pets'));
app.use('/api/appointments', authenticateToken, require('./routes/appointments'));
app.use('/api/adoptions', authenticateToken, require('./routes/adoptions'));
app.use('/api/cart', authenticateToken, require('./routes/cart'));
app.use('/api/forum', authenticateToken, require('./routes/forum'));
app.use('/api/services', authenticateToken, require('./routes/services'));
app.use('/api/health', authenticateToken, require('./routes/health'));

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🌐 Frontend served from http://localhost:${PORT}/login.html`);
});

module.exports = app;