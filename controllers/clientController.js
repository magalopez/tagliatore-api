const Client = require('../models/Client');
const { validationResult } = require('express-validator');

// Obtener todos los clientes activos
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find({ isActive: true })
      .sort({ name: 1 });
    res.json(clients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Obtener un cliente por ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ msg: 'Cliente no encontrado' });
    }
    res.json(client);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Cliente no encontrado' });
    }
    res.status(500).send('Error en el servidor');
  }
};

// Crear nuevo cliente
exports.createClient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, dni } = req.body;

  try {
    // Verificar si ya existe un cliente con ese email o DNI
    let clientExists = await Client.findOne({ 
      $or: [{ email }, { dni }]
    });

    if (clientExists) {
      return res.status(400).json({ 
        msg: 'Ya existe un cliente con ese email o DNI' 
      });
    }

    const client = new Client({
      name,
      email,
      phone,
      dni,
    });

    await client.save();
    res.json(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Actualizar cliente
exports.updateClient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ msg: 'Cliente no encontrado' });
    }

    // Si el email o DNI se está actualizando, verificar que no exista
    if (req.body.email && req.body.email !== client.email) {
      const emailExists = await Client.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({ msg: 'El email ya está registrado' });
      }
    }

    if (req.body.dni && req.body.dni !== client.dni) {
      const dniExists = await Client.findOne({ dni: req.body.dni });
      if (dniExists) {
        return res.status(400).json({ msg: 'El DNI ya está registrado' });
      }
    }

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedClient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Eliminar cliente (lógicamente)
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ msg: 'Cliente no encontrado' });
    }

    await Client.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: false } },
      { new: true }
    );

    res.json({ msg: 'Cliente eliminado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};
