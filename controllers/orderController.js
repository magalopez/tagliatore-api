const Order = require('../models/Order');
const { validationResult } = require('express-validator');

// Obtener todas las órdenes
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('clientId', 'name')
      .populate('waiterId', 'name')
      .populate('items.dishId', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Obtener órdenes por estado
exports.getOrdersByStatus = async (req, res) => {
  try {
    const orders = await Order.find({ status: req.params.status })
      .populate('clientId', 'name')
      .populate('waiterId', 'name')
      .populate('items.dishId', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Crear nueva orden
exports.createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const order = new Order(req.body);
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('clientId', 'name')
      .populate('waiterId', 'name')
      .populate('items.dishId', 'name');

    res.json(populatedOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Actualizar estado de orden
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Orden no encontrada' });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(req.params.id)
      .populate('clientId', 'name')
      .populate('waiterId', 'name')
      .populate('items.dishId', 'name');

    res.json(updatedOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Actualizar orden
exports.updateOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Orden no encontrada' });
    }

    // Solo permitir actualizar si está pendiente
    if (order.status !== 'pending') {
      return res.status(400).json({ 
        msg: 'Solo se pueden modificar órdenes pendientes' 
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    .populate('clientId', 'name')
    .populate('waiterId', 'name')
    .populate('items.dishId', 'name');

    res.json(updatedOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Cancelar orden
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Orden no encontrada' });
    }

    // Solo permitir cancelar si está pendiente o en preparación
    if (!['pending', 'preparing'].includes(order.status)) {
      return res.status(400).json({ 
        msg: 'No se puede cancelar una orden que ya está lista o entregada' 
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ msg: 'Orden cancelada' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Obtener órdenes por mesero
exports.getOrdersByWaiter = async (req, res) => {
  try {
    const orders = await Order.find({ waiterId: req.params.waiterId })
      .populate('clientId', 'name')
      .populate('waiterId', 'name')
      .populate('items.dishId', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};
