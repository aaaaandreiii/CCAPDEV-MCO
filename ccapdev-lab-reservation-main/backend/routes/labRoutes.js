const express = require('express');
const { getAllLabs, getLabById } = require('../controllers/LabController');

const router = express.Router();

router.get('/', getAllLabs);
router.get('/:labID', getLabById);

module.exports = router;