// controllers/movieController.js
const mongoose = require('mongoose');
const Movie = require('../models/Movie');

function parseLimit(value, fallback = 20, max = 100) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n) || n <= 0) return fallback;
  return Math.min(n, max);
}
function parsePage(value, fallback = 1) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n) || n <= 0) return fallback;
  return n;
}
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

exports.getMovies = async (req, res, next) => {
  try {
    const { q, genre, year, sort = '-createdAt', limit, page } = req.query;

    const filter = {};

    if (q && String(q).trim()) {
      filter.title = { $regex: String(q).trim(), $options: 'i' };
    }
    if (genre && String(genre).trim()) {
      filter.genre = String(genre).trim();
    }
    if (year) {
      const y = parseInt(year, 10);
      if (!Number.isNaN(y)) filter.year = y;
    }

    const lim = parseLimit(limit);
    const pg = parsePage(page);
    const skip = (pg - 1) * lim;

    const [movies, total] = await Promise.all([
      Movie.find(filter).sort(sort).skip(skip).limit(lim),
      Movie.countDocuments(filter)
    ]);

    res.json({
      success: true,
      movies,
      pagination: {
        page: pg,
        limit: lim,
        total,
        pages: Math.ceil(total / lim)
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid movie id' });

    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    res.json({ success: true, movie });
  } catch (err) {
    next(err);
  }
};

exports.createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create({
      ...req.body,
      createdBy: req.user?.userId
    });

    res.status(201).json({ success: true, movie });
  } catch (err) {
    next(err);
  }
};

exports.updateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid movie id' });

    const movie = await Movie.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    res.json({ success: true, movie });
  } catch (err) {
    next(err);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid movie id' });

    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    res.json({ success: true, message: 'Movie deleted successfully' });
  } catch (err) {
    next(err);
  }
};
