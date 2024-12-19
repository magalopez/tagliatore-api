const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const waiterController = require('../controllers/waiterController');

// GET /api/waiters
router.get('/', 
  [auth, roleCheck(['admin', 'waiter', 'client'])], 
  waiterController.getWaiters
);

// GET /api/waiters/:id
router.get('/:id',
  [auth, roleCheck(['admin', 'waiter'])],
  waiterController.getWaiterById
);

// POST /api/waiters
router.post('/',
  [
    auth,
    roleCheck(['admin']),
    [
      check('name', 'El nombre es requerido').not().isEmpty(),
      check('email', 'Email válido es requerido').isEmail(),
      check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
      check('dni', 'DNI debe tener 8 dígitos').matches(/^\d{8}$/),
      check('phone', 'Teléfono debe tener 9 dígitos').matches(/^\d{9}$/),
      check('address', 'La dirección es requerida').not().isEmpty(),
      check('schedule', 'El horario debe ser morning, evening o night').isIn(['morning', 'evening', 'night']),
      check('startDate', 'La fecha de inicio es requerida').not().isEmpty()
    ]
  ],
  waiterController.createWaiter
);

// PUT /api/waiters/:id
router.put('/:id',
  [
    auth,
    roleCheck(['admin']),
    [
      check('name', 'El nombre es requerido').not().isEmpty(),
      check('email', 'Email válido es requerido').isEmail(),
      check('dni', 'DNI debe tener 8 dígitos').matches(/^\d{8}$/),
      check('phone', 'Teléfono debe tener 9 dígitos').matches(/^\d{9}$/),
      check('address', 'La dirección es requerida').not().isEmpty(),
      check('schedule', 'El horario debe ser morning, evening o night').isIn(['morning', 'evening', 'night'])
    ]
  ],
  waiterController.updateWaiter
);

// DELETE /api/waiters/:id
router.delete('/:id',
  [auth, roleCheck(['admin'])],
  waiterController.deleteWaiter
);

module.exports = router;
