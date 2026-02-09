const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

// Используйте конкретные функции
router.get('/favorites', authenticate, getFavorites);
router.post('/favorites', authenticate, addFavorite);
router.delete('/favorites/:movieId', authenticate, removeFavorite);

module.exports = router;