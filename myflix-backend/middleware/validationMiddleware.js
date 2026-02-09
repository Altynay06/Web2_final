const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
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
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .escape(),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .escape(),
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`Year must be between 1900 and ${new Date().getFullYear()}`),
  body('genre')
    .isArray({ min: 1 }).withMessage('At least one genre is required'),
  body('status')
    .optional()
    .isIn(['watched', 'to_watch', 'watching']),
  handleValidationErrors
];