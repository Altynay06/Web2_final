const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
	movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	value: { type: Number, required: true, min: 1, max: 5 },
	createdAt: { type: Date, default: Date.now }
});

ratingSchema.index({ movieId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
