const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/profileController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

//storage for pfp
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `profile_${Date.now()}.png`);
    }
});

const upload = multer({ storage });

router.get('/:id', getUserProfile);
router.put('/:id', upload.single("profilePicture"), updateUserProfile);

module.exports = router;
