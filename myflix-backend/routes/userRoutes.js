const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/favorites', authenticate, userController.getFavorites);
router.post('/favorites', authenticate, userController.addFavorite);
router.delete('/favorites/:movieId', authenticate, userController.removeFavorite);

module.exports = router;
