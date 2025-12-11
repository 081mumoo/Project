// File: backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const pool = req.app.locals.pool;

    try {
        // 1. Check if user exists
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert user (FIXED: Uses 'password_hash' to match your DB)
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, 'user']
        );

        // 4. Create Token
        const token = jwt.sign({ id: result.insertId, role: 'user' }, process.env.JWT_SECRET || 'epc', { expiresIn: '1h' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: result.insertId, name, email, role: 'user' }
        });
    } catch (err) {
        console.error("Registration Error:", err); // This will print the exact error to your terminal
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const pool = req.app.locals.pool;

    try {
        // 1. Check user
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const user = users[0];

        // 2. Validate password (FIXED: Checks against 'password_hash')
        const validPass = await bcrypt.compare(password, user.password_hash); 
        if (!validPass) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // 3. Create Token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'epc', { expiresIn: '1h' });

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

module.exports = router;