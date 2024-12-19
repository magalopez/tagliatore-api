const Chat = require('../models/Chat');
const { validationResult } = require('express-validator');
const Waiter = require('../models/Waiter');

exports.getChats = async (req, res) => {
  try {
    let query = {};
    
    // Si es cliente, solo ver sus chats
    if (req.user.role === 'client') {
      query.clientId = req.user.id;
    }
    // Si es mesero, solo ver sus chats
    else if (req.user.role === 'waiter') {
      query.waiterId = req.user.id;
    }

    const chats = await Chat.find(query)
      .populate('clientId', 'name email')
      .populate('waiterId', 'name')
      .sort('-updatedAt');

    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
};

exports.createChat = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Errores de validación:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { waiterId, message } = req.body;
    console.log('Datos recibidos:', { waiterId, message });
    console.log('Usuario en request:', req.user);

    if (!waiterId || !message) {
      console.log('Faltan datos requeridos');
      return res.status(400).json({ msg: 'WaiterId y message son requeridos' });
    }

    // Validar que el mesero existe
    const waiter = await Waiter.findById(waiterId);
    
    if (!waiter) {
      return res.status(404).json({ msg: 'Mesero no encontrado' });
    }

    // Verificar si ya existe un chat activo
    const existingChat = await Chat.findOne({
      clientId: req.user.id,
      waiterId,
      status: 'active'
    });

    if (existingChat) {
      return res.status(400).json({ msg: 'Ya existe un chat activo con este mesero' });
    }

    // Crear nuevo chat con mensaje inicial
    const newChat = new Chat({
      clientId: req.user.id,
      waiterId,
      messages: [{
        content: message,
        sender: req.user.id,
        senderModel: 'Client'
      }],
      lastMessage: message,
      status: 'active'
    });

    await newChat.save();

    // Poblar los datos antes de enviar la respuesta
    const populatedChat = await Chat.findById(newChat._id)
      .populate('clientId', 'name')
      .populate('waiterId', 'name');

    res.json(populatedChat);

  } catch (err) {
    console.error('Error al crear chat:', err);
    res.status(500).send('Error en el servidor');
  }
};

exports.addMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ msg: 'Chat no encontrado' });
    }

    // Verificar permisos
    if (req.user.role === 'client' && chat.clientId.toString() !== req.user.id ||
        req.user.role === 'waiter' && chat.waiterId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No autorizado' });
    }

    chat.messages.push({
      content,
      sender: req.user.id,
      senderModel: req.user.role === 'client' ? 'Client' : 'Waiter'
    });
    chat.lastMessage = content;

    await chat.save();
    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
};
