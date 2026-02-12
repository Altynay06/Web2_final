const mongoose = require('mongoose');
const User = require('../models/User');
const Movie = require('../models/Movie');

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

exports.getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId)
      .populate('favorites', 'title year rating posterUrl genre'); 

    return res.json(user ? user.favorites : []);
  } catch (err) {
    next(err);
  }
};

exports.addFavorite = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { movieId } = req.body;

    if (!movieId || !isValidObjectId(movieId)) {
      return res.status(400).json({ error: 'Invalid movieId' });
    }

    const movieExists = await Movie.findById(movieId).select('_id');
    if (!movieExists) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const user = await User.findById(userId).select('favorites');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const already = user.favorites.some(f => f.toString() === movieId);
    if (!already) {
      user.favorites.push(movieId);
      await user.save();
    }

    return res.json({ success: true, added: !already });
  } catch (err) {
    next(err);
  }
};

exports.removeFavorite = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { movieId } = req.params;

    if (!movieId || !isValidObjectId(movieId)) {
      return res.status(400).json({ error: 'Invalid movieId' });
    }

    const user = await User.findById(userId).select('favorites');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const before = user.favorites.length;
    user.favorites = user.favorites.filter(f => f.toString() !== movieId);
    const after = user.favorites.length;

    if (after !== before) {
      await user.save();
    }

    return res.json({ success: true, removed: after !== before });
  } catch (err) {
    next(err);
  }
};
