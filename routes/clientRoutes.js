const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const clientController = require('../controllers/clientController');

// GET /api/clients
router.get('/', 
  [auth, roleCheck(['admin', 'waiter'])], 
  clientController.getClients
);

// GET /api/clients/:id
router.get('/:id', 
  [auth, roleCheck(['admin', 'waiter'])],
  clientController.getClientById
);

// POST /api/clients
router.post('/',
  [
    auth,
    roleCheck(['admin']),
    [
      check('name', 'El nombre es requerido').not().isEmpty(),
      check('email', 'Incluye un email válido').isEmail(),
      check('phone', 'El teléfono debe tener 9 dígitos').matches(/^\d{9}$/),
      check('dni', 'El DNI debe tener 8 dígitos').matches(/^\d{8}$/),
    ]
  ],
  clientController.createClient
);

// PUT /api/clients/:id
router.put('/:id',
  [
    auth,
    roleCheck(['admin']),
    [
      check('name', 'El nombre es requerido').not().isEmpty(),
      check('email', 'Incluye un email válido').isEmail(),
      check('phone', 'El teléfono debe tener 9 dígitos').matches(/^\d{9}$/),
      check('dni', 'El DNI debe tener 8 dígitos').matches(/^\d{8}$/),
    ]
  ],
  clientController.updateClient
);

// DELETE /api/clients/:id
router.delete('/:id',
  [auth, roleCheck(['admin'])],
  clientController.deleteClient
);

module.exports = router;
