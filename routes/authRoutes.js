// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', [
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'Incluye un email válido').isEmail(),
  check('password', 'La contraseña debe tener 6 o más caracteres').isLength({ min: 6 }),
  check('role', 'Rol no válido').isIn(['admin', 'waiter', 'client'])
], authController.register);

// POST /api/auth/login
router.post('/login', [
  check('email', 'Incluye un email válido').isEmail(),
  check('password', 'La contraseña es obligatoria').exists()
], authController.login);

// GET /api/auth/me
router.get('/me', auth, authController.getMe);

// PUT /api/auth/profile
router.put('/profile', auth, authController.updateProfile);

module.exports = router;
