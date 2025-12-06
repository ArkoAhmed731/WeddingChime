const express = require('express');
const { createCandidate } = require('../controllers/candidateController');

const router = express.Router();

router.post('/', createCandidate);

module.exports = router;
