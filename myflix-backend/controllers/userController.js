const User = require('../models/User');
const Movie = require('../models/Movie');

exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user ? user.favorites : []);
  } catch (err) { next(err); }
};

exports.addFavorite = async (req, res, next) => {
  try {
    const { movieId } = req.body;
    if (!movieId) return res.status(400).json({ error: 'Missing movieId' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.favorites.includes(movieId)) user.favorites.push(movieId);
    await user.save();
    res.json({ success: true });
  } catch (err) { next(err); }
};

exports.removeFavorite = async (req, res, next) => {
  try {
    const movieId = req.params.movieId;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.favorites = user.favorites.filter(f => f.toString() !== movieId.toString());
    await user.save();
    res.json({ success: true });
  } catch (err) { next(err); }
};
