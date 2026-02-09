require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const User = require('./models/User');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Movie.deleteMany({});
    await User.deleteMany({});

    // Create test user
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'admin'
    });

    // Create test movies
    const movies = [
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through dream-sharing technology.',
        year: 2010,
        genre: ['Action', 'Sci-Fi', 'Thriller'],
        rating: 8.8,
        status: 'watched',
        userId: user._id,
        imageUrl: 'https://example.com/inception.jpg'
      },
      {
        title: 'The Shawshank Redemption',
        description: 'Two imprisoned men bond over a number of years.',
        year: 1994,
        genre: ['Drama'],
        rating: 9.3,
        status: 'to_watch',
        userId: user._id,
        imageUrl: 'https://example.com/shawshank.jpg'
      }
    ];

    await Movie.insertMany(movies);
    console.log('✅ Test data seeded successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();