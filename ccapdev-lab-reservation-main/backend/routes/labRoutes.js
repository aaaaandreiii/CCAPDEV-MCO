// const express = require('express');
// const Lab = require('../models/Lab');
// const { getAllLabs, getLabById } = require('../controllers/labController');

// const router = express.Router();

// router.get('/', getAllLabs);
// router.get('/:labID', getLabById);
// router.get('/labs', async (req, res) => {
//   try {
//     const labs = await Lab.find();
//     res.json(labs);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;


const express = require("express");
const { getAllLabs, getLabById } = require("../controllers/labController");

const router = express.Router();

router.get("/", getAllLabs);
router.get("/:labID", getLabById);

module.exports = router;
