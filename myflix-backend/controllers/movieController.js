const Movie = require('../models/Movie');

exports.list = async (req, res, next) => {
	try {
		const { limit = 20, sort = '-rating', genre } = req.query;
		const q = {};
		if (genre) q.genre = genre;
		const movies = await Movie.find(q).sort(sort).limit(parseInt(limit, 10));
		res.json(movies);
	} catch (err) {
		next(err);
	}
}

// Get all movies for user
exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, movies });
  } catch (error) {
    next(error);
  }
};

// Get single movie
exports.getMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

// Create movie
exports.createMovie = async (req, res, next) => {
  try {
    const movieData = {
      ...req.body,
      userId: req.user.userId
    };

    const movie = await Movie.create(movieData);
    
    res.status(201).json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

// Update movie
exports.updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

// Delete movie
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({ success: true, message: 'Movie deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
	try {
		const movie = await Movie.findById(req.params.id);
		if (!movie) return res.status(404).json({ error: 'Movie not found' });
		res.json(movie);
	} catch (err) {
		next(err);
	}
};

exports.search = async (req, res, next) => {
	try {
		const q = req.query.q || '';
		const results = await Movie.find({ title: { $regex: q, $options: 'i' } }).limit(50);
		res.json(results);
	} catch (err) {
		next(err);
	}
};

// Admin/create endpoints (optional)
exports.create = async (req, res, next) => {
	try {
		const movie = await Movie.create(req.body);
		res.status(201).json(movie);
	} catch (err) {
		next(err);
	}
};
