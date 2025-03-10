const express = require('express');
const Lab = require('../models/Lab');

const router = express.Router();

router.get('/labs', async (req, res) => {
  try {
    const labs = await Lab.find();
    res.json(labs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
