const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const categoryController = require('../controllers/categoryController');

// GET /api/categories
router.get('/', categoryController.getCategories);

// GET /api/categories/active
router.get('/active', categoryController.getActiveCategories);

// GET /api/categories/:id
router.get('/:id', categoryController.getCategoryById);

// POST /api/categories
router.post('/',
  [
    auth,
    roleCheck(['admin']),
    [
      check('name', 'El nombre es requerido').not().isEmpty(),
      check('description', 'La descripción es requerida').not().isEmpty()
    ]
  ],
  categoryController.createCategory
);

// PUT /api/categories/:id
router.put('/:id',
  [
    auth,
    roleCheck(['admin']),
    [
      check('name', 'El nombre es requerido').not().isEmpty(),
      check('description', 'La descripción es requerida').not().isEmpty()
    ]
  ],
  categoryController.updateCategory
);

// DELETE /api/categories/:id
router.delete('/:id',
  [auth, roleCheck(['admin'])],
  categoryController.deleteCategory
);

module.exports = router;