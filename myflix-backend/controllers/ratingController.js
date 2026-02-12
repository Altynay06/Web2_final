const mongoose = require('mongoose');
const Rating = require('../models/Rating');
const Movie = require('../models/Movie');

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

exports.add = async (req, res, next) => {
  try {
    const { movieId, rating } = req.body;
    const userId = req.user.userId;

    if (!movieId || !isValidObjectId(movieId)) {
      return res.status(400).json({ error: 'Invalid movieId' });
    }

    const value = Number(rating);
    if (!Number.isFinite(value) || value < 1 || value > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const movie = await Movie.findById(movieId).select('_id');
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    const updatedRating = await Rating.findOneAndUpdate(
      { movieId, userId },
      { value },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const agg = await Rating.aggregate([
      { $match: { movieId: new mongoose.Types.ObjectId(movieId) } },
      { $group: { _id: '$movieId', avg: { $avg: '$value' }, count: { $sum: 1 } } }
    ]);

    const avg = agg[0] ? agg[0].avg : value;
    const count = agg[0] ? agg[0].count : 1;

    const avgRounded = Number(avg.toFixed(1));
    await Movie.findByIdAndUpdate(movieId, { rating: avgRounded });

    return res.json({
      success: true,
      movieId,
      myRating: updatedRating.value,
      averageRating: avgRounded,
      ratingsCount: count
    });
  } catch (err) {
    next(err);
  }
};
