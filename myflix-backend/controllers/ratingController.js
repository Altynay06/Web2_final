const Rating = require('../models/Rating');
const Movie = require('../models/Movie');

exports.add = async (req, res, next) => {
	try {
		const { movieId, rating } = req.body;
		if (!movieId || !rating) return res.status(400).json({ error: 'Missing fields' });

		// upsert user rating
		const existing = await Rating.findOne({ movieId, userId: req.user.id });
		if (existing) {
			existing.value = rating;
			await existing.save();
		} else {
			await Rating.create({ movieId, userId: req.user.id, value: rating });
		}

		// recalc average
		const agg = await Rating.aggregate([
			{ $match: { movieId: require('mongoose').Types.ObjectId(movieId) } },
			{ $group: { _id: '$movieId', avg: { $avg: '$value' } } }
		]);

		const avg = agg[0] ? agg[0].avg : rating;
		await Movie.findByIdAndUpdate(movieId, { rating: Number(avg.toFixed(1)) });

		res.json({ success: true, rating: avg });
	} catch (err) {
		next(err);
	}
};
