const Waiter = require('../models/Waiter');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Obtener todos los meseros activos
exports.getWaiters = async (req, res) => {
  try {
    const waiters = await Waiter.find()
      .select('-password')  // Excluir password
      .sort({ name: 1 });
    res.json(waiters);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Obtener un mesero por ID
exports.getWaiterById = async (req, res) => {
  try {
    const waiter = await Waiter.findById(req.params.id).select('-password');
    if (!waiter) {
      return res.status(404).json({ msg: 'Mesero no encontrado' });
    }
    res.json(waiter);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Crear nuevo mesero
exports.createWaiter = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, dni, phone, address, schedule, startDate } = req.body;

  try {
    let waiter = await Waiter.findOne({ $or: [{ email }, { dni }] });
    if (waiter) {
      return res.status(400).json({ msg: 'El mesero ya existe' });
    }

    waiter = new Waiter({
      name,
      email,
      password,
      dni,
      phone,
      address,
      schedule,
      startDate: new Date(startDate)
    });

    await waiter.save();

    // No enviar el password en la respuesta
    const waiterResponse = waiter.toObject();
    delete waiterResponse.password;

    res.json(waiterResponse);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Actualizar mesero
exports.updateWaiter = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let waiter = await Waiter.findById(req.params.id);
    if (!waiter) {
      return res.status(404).json({ msg: 'Mesero no encontrado' });
    }

    // Si hay nueva contraseña, hashearla
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    waiter = await Waiter.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select('-password');

    res.json(waiter);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Eliminar mesero (lógicamente)
exports.deleteWaiter = async (req, res) => {
  try {
    const waiter = await Waiter.findById(req.params.id);
    if (!waiter) {
      return res.status(404).json({ msg: 'Mesero no encontrado' });
    }

    await Waiter.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: false } }
    );

    res.json({ msg: 'Mesero eliminado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};
