const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const User = require('../models/User');

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

exports.getForMovie = async (req, res, next) => {
  try {
    const movieId = req.params.movieId || req.query.movieId;

    if (!movieId || !isValidObjectId(movieId)) {
      return res.status(400).json({ success: true, comments: [] });
    }

    const comments = await Comment.find({ movieId }).sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { movieId, text } = req.body;
    const userId = req.user.userId;

    if (!movieId || !isValidObjectId(movieId) || !text || !text.trim()) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }

    const user = await User.findById(userId).select('username');
    if (!user) return res.status(401).json({ error: 'User not found' });

    const comment = await Comment.create({
      movieId,
      userId,
      userName: user.username,
      text: text.trim()
    });

    res.status(201).json({ success: true, comment });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { text } = req.body;
    const userId = req.user.userId;
    const { id } = req.params;

    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid comment id' });
    if (!text || !text.trim()) return res.status(400).json({ error: 'Text is required' });

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    comment.text = text.trim();
    comment.edited = true;
    comment.updatedAt = new Date();
    await comment.save();

    res.json({ success: true, comment });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid comment id' });

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await Comment.deleteOne({ _id: id });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
