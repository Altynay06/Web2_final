
require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const commentRoutes = require('./routes/commentRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false, 
  })
);



app.use(express.json());

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
}));

const FRONTEND_DIR = path.join(__dirname, '..', 'fronted');
app.use(express.static(FRONTEND_DIR));

app.get('/', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(' Successfully connected to MongoDB Atlas');
    console.log(` Database: ${mongoose.connection.db.databaseName}`);
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err.message);
    process.exit(1);
  });

mongoose.connection.on('connected', () => console.log(' Mongoose connected to DB'));
mongoose.connection.on('error', (err) => console.error(' Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.log(' Mongoose disconnected'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ratings', ratingRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'MyFlix API is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

app.use((req, res) => {
  const notFoundPath = path.join(FRONTEND_DIR, '404.html');
  res.status(404).sendFile(notFoundPath, (err) => {
    if (err) res.status(404).send('404 Not Found');
  });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open site: http://localhost:${PORT}/`);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT. Closing server...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
