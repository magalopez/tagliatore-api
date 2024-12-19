const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const orderController = require('../controllers/orderController');

// GET /api/orders
router.get('/', 
  [auth, roleCheck(['admin', 'waiter'])], 
  orderController.getOrders
);

// GET /api/orders/status/:status
router.get('/status/:status',
  [auth, roleCheck(['admin', 'waiter'])],
  orderController.getOrdersByStatus
);

// GET /api/orders/waiter/:waiterId
router.get('/waiter/:waiterId',
  [auth, roleCheck(['admin', 'waiter'])],
  orderController.getOrdersByWaiter
);

// POST /api/orders
router.post('/',
  [
    auth,
    roleCheck(['admin', 'waiter']),
    [
      check('tableNumber', 'Número de mesa es requerido').isNumeric(),
      check('items', 'Items son requeridos').isArray(),
      check('items.*.dishId', 'ID de platillo es requerido').not().isEmpty(),
      check('items.*.quantity', 'Cantidad debe ser mayor a 0').isInt({ min: 1 }),
      check('total', 'Total es requerido').isNumeric(),
      check('clientId', 'Cliente es requerido').not().isEmpty(),
      check('waiterId', 'Mesero es requerido').not().isEmpty()
    ]
  ],
  orderController.createOrder
);

// PUT /api/orders/:id/status
router.put('/:id/status',
  [
    auth,
    roleCheck(['admin', 'waiter']),
    [
      check('status', 'Estado no válido')
        .isIn(['pending', 'preparing', 'ready', 'delivered', 'cancelled'])
    ]
  ],
  orderController.updateOrderStatus
);

// PUT /api/orders/:id
router.put('/:id',
  [
    auth,
    roleCheck(['admin', 'waiter']),
    [
      check('tableNumber', 'Número de mesa es requerido').isNumeric(),
      check('items', 'Items son requeridos').isArray(),
      check('total', 'Total es requerido').isNumeric()
    ]
  ],
  orderController.updateOrder
);

// DELETE /api/orders/:id
router.delete('/:id',
  [auth, roleCheck(['admin', 'waiter'])],
  orderController.cancelOrder
);

module.exports = router;
