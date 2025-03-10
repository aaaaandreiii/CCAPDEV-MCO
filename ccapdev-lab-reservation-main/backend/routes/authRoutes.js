const express = require('express');
const { register, login, deleteAccount } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/delete-account', deleteAccount);

module.exports = router;
