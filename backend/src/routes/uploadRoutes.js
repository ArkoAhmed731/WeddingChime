const express = require('express');
const upload = require('../middleware/upload');
const { handleUpload } = require('../controllers/uploadController');

const router = express.Router();

router.post('/profile-photo', upload.single('file'), handleUpload);
router.post('/nid-passport', upload.single('file'), handleUpload);
router.post('/biodata-doc', upload.single('file'), handleUpload);

module.exports = router;
