const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movieController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { validateMovie } = require('../middleware/validationMiddleware'); // <-- импорт сверху

router.get('/', movieController.getMovies);
router.get('/:id', movieController.getMovieById);

router.post('/', authenticate, authorize('admin'), validateMovie, movieController.createMovie);
router.put('/:id', authenticate, authorize('admin'), validateMovie, movieController.updateMovie);
router.delete('/:id', authenticate, authorize('admin'), movieController.deleteMovie);

module.exports = router;
