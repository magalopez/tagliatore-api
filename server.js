const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const httpServer = createServer(app);

// Configuración de Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Conectado'))
  .catch(err => console.log('Error en MongoDB:', err));

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/dishes', require('./routes/dishRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/waiters', require('./routes/waiterRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));

// Manejo de Socket.IO
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('send_message', async (data) => {
    try {
      // Emitir el mensaje a todos los usuarios en la sala del chat
      io.to(data.chatId).emit('receive_message', {
        chatId: data.chatId,
        message: data.message
      });
    } catch (err) {
      console.error('Error al procesar mensaje:', err);
    }
  });

  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`Usuario unido al chat: ${chatId}`);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
