const express = require('express');
const router = express.Router();

// GET: Fetch records for a specific pet
router.get('/:petId', async (req, res) => {
    const pool = req.app.locals.pool;
    try {
        const [records] = await pool.query(
            'SELECT * FROM health_records WHERE pet_id = ? ORDER BY date_recorded DESC',
            [req.params.petId]
        );
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST: Add a new health record
router.post('/add', async (req, res) => {
    const pool = req.app.locals.pool;
    const { pet_id, record_type, title, value, date_recorded, next_due_date, notes } = req.body;
    try {
        await pool.query(
            `INSERT INTO health_records (pet_id, record_type, title, value, date_recorded, next_due_date, notes) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [pet_id, record_type, title, value, date_recorded, next_due_date, notes]
        );
        res.status(201).json({ message: 'Record added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;