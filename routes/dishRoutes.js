const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const dishController = require('../controllers/dishController');

// GET /api/dishes
// router.get('/', dishController.getDishes);
router.get('/', 
  [auth, roleCheck(['admin', 'waiter'])],
  dishController.getDishes
);

// GET /api/dishes/:id
// router.get('/:id', dishController.getDishById);
router.get('/:id',
  [auth, roleCheck(['admin', 'waiter'])],
  dishController.getDishById
);

// POST /api/dishes
router.post('/',
  [
    auth,
    roleCheck(['admin']),
    [
      check('name', 'El nombre es requerido').not().isEmpty(),
      check('price', 'El precio es requerido').isNumeric(),
      check('ingredients', 'Los ingredientes son requeridos').not().isEmpty(),
      check('categoryId', 'La categoría es requerida').not().isEmpty(),
      check('image', 'La imagen es requerida').not().isEmpty()
    ]
  ],
  dishController.createDish
);

// PUT /api/dishes/:id
router.put('/:id',
  [
    auth,
    roleCheck(['admin']),
    [
      check('name', 'El nombre es requerido').not().isEmpty(),
      check('price', 'El precio es requerido').isNumeric(),
      check('ingredients', 'Los ingredientes son requeridos').not().isEmpty(),
      check('categoryId', 'La categoría es requerida').not().isEmpty(),
      check('image', 'La imagen es requerida').not().isEmpty()
    ]
  ],
  dishController.updateDish
);

// DELETE /api/dishes/:id
router.delete('/:id',
  [auth, roleCheck(['admin'])],
  dishController.deleteDish
);

// GET /api/dishes/category/:categoryId
router.get('/category/:categoryId', dishController.getDishesByCategory);

module.exports = router;