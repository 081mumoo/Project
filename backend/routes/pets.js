// File: backend/routes/pets.js
const express = require('express');
const router = express.Router();

// GET: Retrieve all pets belonging to the logged-in user
router.get('/', async (req, res) => {
    const pool = req.app.locals.pool;
    try {
        // We use req.user.id which comes from the authenticateToken middleware
        const [pets] = await pool.query(
            'SELECT * FROM pets WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(pets);
    } catch (err) {
        console.error("Error fetching pets:", err);
        res.status(500).json({ error: 'Server error fetching pets' });
    }
});

// POST: Add a new pet
router.post('/', async (req, res) => {
    const pool = req.app.locals.pool;
    const { name, species, breed, age_years, age_months, weight, gender, color, location } = req.body;

    try {
        const [result] = await pool.query(
            `INSERT INTO pets 
            (user_id, name, species, breed, age_years, age_months, weight, gender, color, location) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [req.user.id, name, species, breed, age_years, age_months, weight, gender, color, location]
        );

        // Return the newly created pet object
        res.status(201).json({
            id: result.insertId,
            user_id: req.user.id,
            name, species, breed,
            message: 'Pet added successfully'
        });
    } catch (err) {
        console.error("Error adding pet:", err);
        res.status(500).json({ error: 'Server error adding pet' });
    }
});

// DELETE: Remove a pet
router.delete('/:id', async (req, res) => {
    const pool = req.app.locals.pool;
    try {
        // Verify the pet belongs to the user before deleting
        const [result] = await pool.query(
            'DELETE FROM pets WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pet not found or unauthorized' });
        }

        res.json({ message: 'Pet deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error deleting pet' });
    }
});

module.exports = router;