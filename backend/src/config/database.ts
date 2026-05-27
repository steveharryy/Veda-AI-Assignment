import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/veda-ai';

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('💚 MongoDB connection successfully established.');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❤️ MongoDB connection encountered error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('💛 MongoDB disconnected.');
    });

    await mongoose.connect(MONGO_URI);
  } catch (error) {
    console.error('💥 Database initialization failed:', error);
    process.exit(1);
  }
};
