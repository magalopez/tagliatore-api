// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado');
  } catch (err) {
    console.error('Error en la conexión MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;