const mongoose = require('mongoose');

/**
 * Connect to MongoDB.
 * Attempts to connect via process.env.MONGO_URI.
 * If not provided or connection fails, automatically spins up
 * an in-memory MongoDB instance (MongoMemoryServer) for zero-setup local development!
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (mongoUri) {
      try {
        const conn = await mongoose.connect(mongoUri);
        console.log(`✅ MongoDB Connected to remote/local instance: ${conn.connection.host}`);
        return;
      } catch (err) {
        console.warn(`⚠️ Failed to connect to MONGO_URI (${err.message}). Falling back to in-memory MongoDB...`);
      }
    } else {
      console.log('ℹ️ No MONGO_URI provided in .env. Starting in-memory MongoDB server...');
    }

    // Fallback: Start in-memory MongoDB server
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const conn = await mongoose.connect(uri);
    console.log(`✅ In-Memory MongoDB Connected successfully: ${conn.connection.host}`);
    console.log(`💡 Note: Data is saved during server session. To persist permanently, set MONGO_URI in .env`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
