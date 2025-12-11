const express = require('express');
const router = express.Router();

// GET: Fetch all bookings for the logged-in user
router.get('/', async (req, res) => {
    const pool = req.app.locals.pool;
    try {
        const [bookings] = await pool.query(
            'SELECT * FROM service_bookings WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(bookings);
    } catch (err) {
        console.error("Error fetching services:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST: Create a new booking
router.post('/book', async (req, res) => {
    const pool = req.app.locals.pool;
    const { service_type, service_name, pet_name, preferred_date, notes } = req.body;

    try {
        const [result] = await pool.query(
            `INSERT INTO service_bookings 
            (user_id, service_type, service_name, pet_name, preferred_date, notes) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.id, service_type, service_name, pet_name, preferred_date, notes]
        );

        res.status(201).json({ message: 'Service booked successfully', id: result.insertId });
    } catch (err) {
        console.error("Error booking service:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT: Mark a service as Completed (Simulated "Check Done")
router.put('/:id/complete', async (req, res) => {
    const pool = req.app.locals.pool;
    try {
        await pool.query(
            'UPDATE service_bookings SET status = "Completed" WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        res.json({ message: 'Service marked as completed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;