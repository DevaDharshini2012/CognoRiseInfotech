const express = require('express');
const router = express.Router();
const Result = require('../models/result');

// Submit quiz results
router.post('/submit', async (req, res) => {
    const { username, category, score } = req.body;

    try {
        const result = new Result({ username, category, score });
        await result.save();
        res.status(200).send('Results saved successfully');
    } catch (error) {
        res.status(500).send('Error saving results');
    }
});

module.exports = router;
