const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, ratingController.add);

module.exports = router;
