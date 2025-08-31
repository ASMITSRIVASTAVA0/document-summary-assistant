const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // URL-encode the @ symbol in password
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 
      'mongodb+srv://asmitsrivas0:asm123%40PSIT@cluster0.mcn1orw.mongodb.net/document-summary-db?retryWrites=true&w=majority&appName=Cluster0', 
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;