const express = require('express');
const router = express.Router();
const { processDocument } = require('../controllers/documentController');
const upload = require('../middleware/upload');

router.post('/upload', upload.single('document'), processDocument);

module.exports = router;