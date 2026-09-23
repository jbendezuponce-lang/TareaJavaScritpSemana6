const db = require('../db');

// Columnas que se devuelven al cliente (nunca SELECT *)
const PUBLIC_COLUMNS = 'id, name, email';

const User = {
  async getAll() {
    const [rows] = await db.query(`SELECT ${PUBLIC_COLUMNS} FROM users ORDER BY id`);
    return rows;
  },

  async getById(id) {
    const [rows] = await db.query(`SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = ?`, [id]);
    return rows[0] || null;
  },

  async create({ name, email }) {
    const [result] = await db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    return result.insertId;
  },

  // Solo actualiza los campos recibidos; devuelve true si el usuario existía
  async update(id, fields) {
    const [result] = await db.query('UPDATE users SET ? WHERE id = ?', [fields, id]);
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = User;
