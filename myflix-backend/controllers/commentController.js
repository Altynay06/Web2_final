const Comment = require('../models/Comment');

exports.getForMovie = async (req, res, next) => {
	try {
		const movieId = req.params.movieId || req.query.movieId;
		if (!movieId) return res.status(400).json([]);
		const comments = await Comment.find({ movieId }).sort({ createdAt: -1 });
		res.json(comments);
	} catch (err) {
		next(err);
	}
};

exports.create = async (req, res, next) => {
	try {
		const { movieId, text } = req.body;
		if (!movieId || !text) return res.status(400).json({ error: 'Missing fields' });

		const comment = await Comment.create({
			movieId,
			userId: req.user.id,
			userName: req.user.name,
			text
		});

		res.status(201).json(comment);
	} catch (err) {
		next(err);
	}
};

exports.update = async (req, res, next) => {
	try {
		const { text } = req.body;
		const comment = await Comment.findById(req.params.id);
		if (!comment) return res.status(404).json({ error: 'Comment not found' });
		if (comment.userId.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

		comment.text = text;
		comment.edited = true;
		comment.updatedAt = new Date();
		await comment.save();
		res.json(comment);
	} catch (err) {
		next(err);
	}
};

exports.delete = async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.id);
		if (!comment) return res.status(404).json({ error: 'Comment not found' });
		if (comment.userId.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

		await comment.remove();
		res.json({ success: true });
	} catch (err) {
		next(err);
	}
};
