const express = require('express');
const router = express.Router();

// GET /api/appointments
router.get('/', async (req, res) => {
    try {
        const [appointments] = await req.app.locals.pool.query('SELECT * FROM appointments WHERE user_id = ?', [req.user.id]);
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/appointments
router.post('/', async (req, res) => {
    const appointment = req.body;
    try {
        const [result] = await req.app.locals.pool.query(
            'INSERT INTO appointments (user_id, pet_name, service, date, time, veterinarian, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, appointment.petName, appointment.service, appointment.date, appointment.time, appointment.veterinarian, appointment.notes]
        );
        res.status(201).json({ message: 'Appointment booked', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;