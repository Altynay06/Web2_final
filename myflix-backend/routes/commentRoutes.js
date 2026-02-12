const express = require('express');
const router = express.Router();

const commentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/movie/:movieId', commentController.getForMovie);

router.post('/', authenticate, commentController.create);
router.put('/:id', authenticate, commentController.update);
router.delete('/:id', authenticate, commentController.delete);

module.exports = router;
