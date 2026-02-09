const express = require('express');
const router = express.Router();
const { 
  getMovies, 
  getMovie, 
  createMovie, 
  updateMovie, 
  deleteMovie 
} = require('../controllers/movieController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateMovie } = require('../middleware/validationMiddleware');

// Protect all routes
router.use(authenticate);

router.route('/')
  .get(getMovies)
  .post(validateMovie, createMovie);

router.route('/:id')
  .get(getMovie)
  .put(validateMovie, updateMovie)
  .delete(deleteMovie);

module.exports = router;