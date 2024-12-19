const Dish = require('../models/Dish');
const { validationResult } = require('express-validator');

// Obtener todos los platillos
exports.getDishes = async (req, res) => {
  try {
    const dishes = await Dish.find({ isActive: true })  // Solo platillos activos
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });
    res.json(dishes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Obtener un platillo por ID
exports.getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id)
      .populate('categoryId', 'name');
    
    if (!dish) {
      return res.status(404).json({ msg: 'Platillo no encontrado' });
    }
    
    res.json(dish);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Platillo no encontrado' });
    }
    res.status(500).send('Error en el servidor');
  }
};

// Crear un nuevo platillo
exports.createDish = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newDish = new Dish(req.body);
    await newDish.save();
    
    const dish = await Dish.findById(newDish._id)
      .populate('categoryId', 'name');
    
    res.json(dish);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Actualizar un platillo
exports.updateDish = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let dish = await Dish.findById(req.params.id);
    
    if (!dish) {
      return res.status(404).json({ msg: 'Platillo no encontrado' });
    }

    dish = await Dish.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('categoryId', 'name');

    res.json(dish);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Platillo no encontrado' });
    }
    res.status(500).send('Error en el servidor');
  }
};

// Eliminar un platillo (eliminación lógica)
exports.deleteDish = async (req, res) => {
  try {
    let dish = await Dish.findById(req.params.id);
    
    if (!dish) {
      return res.status(404).json({ msg: 'Platillo no encontrado' });
    }

    // Eliminación lógica
    dish = await Dish.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: false } },
      { new: true }
    );

    res.json({ msg: 'Platillo eliminado' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Platillo no encontrado' });
    }
    res.status(500).send('Error en el servidor');
  }
};

// Obtener platillos por categoría
exports.getDishesByCategory = async (req, res) => {
  try {
    const dishes = await Dish.find({ 
      categoryId: req.params.categoryId,
      isActive: true 
    }).populate('categoryId', 'name');
    
    res.json(dishes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};