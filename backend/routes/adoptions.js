const express = require('express');
const router = express.Router();

// POST /api/adoptions/apply
router.post('/apply', async (req, res) => {
    try {
        res.status(201).json({ message: 'Adoption application submitted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;