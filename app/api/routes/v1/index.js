const express = require('express');
const router = express.Router();

router.use('/v1', require('./users'));
router.use('/v1', require('./shipments'));

module.exports = router;