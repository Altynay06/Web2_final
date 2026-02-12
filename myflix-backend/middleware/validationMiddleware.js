const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  return res.status(400).json({
    error: errors.array().map(e => e.msg).join(', ')
  });
}

  next();
};

exports.validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
    .escape(),
  body('email')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

exports.validateLogin = [
  body('email')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

exports.validateMovie = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`Year must be between 1900 and ${new Date().getFullYear()}`),
  body('genre')
    .isArray({ min: 1 }).withMessage('At least one genre is required'),
  body('posterUrl')
    .optional()
    .isURL().withMessage('posterUrl must be a valid URL'),
  body('trailerUrl')
  .optional()
  .matches(/^[a-zA-Z0-9_-]{6,20}$/)
  .withMessage('trailerUrl must be a valid YouTube video ID'),

  handleValidationErrors
];
