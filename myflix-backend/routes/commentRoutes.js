const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/authMiddleware');

router.get('/movie/:movieId', commentController.getForMovie);
router.post('/', auth, commentController.create);
router.put('/:id', auth, commentController.update);
router.delete('/:id', auth, commentController.delete);

module.exports = router;
