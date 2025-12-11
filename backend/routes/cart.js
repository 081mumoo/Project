const express = require('express');
const router = express.Router();

// GET /api/cart
router.get('/', async (req, res) => {
    res.json([]);
});

module.exports = router;