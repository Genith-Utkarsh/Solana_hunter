import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connString = process.env.MONGODB_URI || 'mongodb+srv://buvautkarsh849:wXMMIfWA6J6CEVA8@cluster0.g427upx.mongodb.net/solana-hunter?retryWrites=true&w=majority';
    
    const conn = await mongoose.connect(connString);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
