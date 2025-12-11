const express = require('express');
const router = express.Router();

// GET /api/forum
router.get('/', async (req, res) => {
    res.json([]);
});

module.exports = router;