const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const Chat = require('../models/Chat');

module.exports = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"]
    }
  });

  // Middleware para autenticación
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    // Unirse a sala según rol
    if (socket.user.role === 'client') {
      socket.join(`client-${socket.user.id}`);
    } else {
      socket.join('staff');
    }

    // Enviar mensaje
    socket.on('send_message', async (data) => {
      try {
        const chat = await Chat.findById(data.chatId);
        if (!chat) return;

        const newMessage = {
          content: data.content,
          sender: socket.user.id,
          senderType: socket.user.role === 'client' ? 'Client' : 
                     socket.user.role === 'waiter' ? 'Waiter' : 'Admin'
        };

        chat.messages.push(newMessage);
        chat.lastMessage = data.content;
        chat.unreadCount += 1;
        await chat.save();

        // Emitir a las salas correspondientes
        if (socket.user.role === 'client') {
          socket.to('staff').emit('new_message', {
            chatId: chat._id,
            message: newMessage
          });
        } else {
          socket.to(`client-${chat.clientId}`).emit('new_message', {
            chatId: chat._id,
            message: newMessage
          });
        }
      } catch (err) {
        console.error('Error al enviar mensaje:', err);
      }
    });

    // Marcar mensajes como leídos
    socket.on('mark_read', async (chatId) => {
      try {
        await Chat.findByIdAndUpdate(chatId, {
          $set: { 
            'messages.$[].read': true,
            unreadCount: 0
          }
        });

        socket.to('staff').emit('messages_read', chatId);
      } catch (err) {
        console.error('Error al marcar mensajes como leídos:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Usuario desconectado');
    });
  });

  return io;
};