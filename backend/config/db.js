import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  const conn = await mongoose.connect(uri);

  console.log(`MongoDB connected: ${conn.connection.host}`);
  console.log(`Database: ${conn.connection.name}`);

  return conn;
};

export default connectDB;
