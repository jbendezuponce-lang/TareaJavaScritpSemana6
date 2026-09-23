const User = require('../models/userModel');

// Express 5 envía automáticamente al manejador de errores
// cualquier excepción de una función async, así que no hace falta try/catch.

exports.getUsers = async (req, res) => {
  res.json(await User.getAll());
};

exports.getUser = async (req, res) => {
  const user = await User.getById(req.userId);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(user);
};

exports.createUser = async (req, res) => {
  const id = await User.create(req.userData);
  res.status(201).json(await User.getById(id));
};

exports.updateUser = async (req, res) => {
  const found = await User.update(req.userId, req.userData);
  if (!found) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(await User.getById(req.userId));
};

exports.deleteUser = async (req, res) => {
  const found = await User.delete(req.userId);
  if (!found) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.status(204).end();
};
