const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const chatController = require('../controllers/chatController');

// GET /api/chats
router.get('/', auth, chatController.getChats);

// POST /api/chats
router.post('/', [
  auth,
  check('waiterId', 'ID del mesero es requerido').not().isEmpty(),
  check('message', 'El mensaje es requerido').not().isEmpty()
], chatController.createChat);

// POST /api/chats/message
router.post('/message', [
  auth,
  check('chatId', 'ID del chat es requerido').not().isEmpty(),
  check('content', 'El mensaje es requerido').not().isEmpty()
], chatController.addMessage);

module.exports = router;
