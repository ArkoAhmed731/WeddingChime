const express = require('express');
const { getDropdown } = require('../controllers/dropdownController');

const router = express.Router();

router.get('/:type', getDropdown);

module.exports = router;
