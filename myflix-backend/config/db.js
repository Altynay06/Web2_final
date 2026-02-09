require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Проверка доступных коллекций
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Available collections:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

testConnection();