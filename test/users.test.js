// Tests de la API sin base de datos: se reemplazan los métodos del modelo por dobles en memoria.
const { test, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const User = require('../models/userModel');
const db = require('../db');
const app = require('../app');

let users;
beforeEach(() => {
  users = [{ id: 1, name: 'Ana', email: 'ana@mail.com' }];
  User.getAll = async () => users;
  User.getById = async (id) => users.find((u) => u.id === id) || null;
  User.create = async (data) => {
    const id = users.length + 1;
    users.push({ id, ...data });
    return id;
  };
  User.update = async (id, data) => {
    const u = users.find((x) => x.id === id);
    if (u) Object.assign(u, data);
    return Boolean(u);
  };
  User.delete = async (id) => {
    const before = users.length;
    users = users.filter((u) => u.id !== id);
    return users.length < before;
  };
});
after(() => db.end());

test('GET /api/users lista usuarios', async () => {
  const res = await request(app).get('/api/users').expect(200);
  assert.equal(res.body.length, 1);
});

test('GET /api/users/:id devuelve 404 si no existe', async () => {
  await request(app).get('/api/users/99').expect(404);
});

// --- Pruebas propias del Paso 13 ---

// (a) un id no numérico devuelve 400
test('GET /api/users/:id con id no numérico devuelve 400', async () => {
  const res = await request(app).get('/api/users/abc').expect(400);
  assert.ok(Array.isArray(res.body.errors));
  assert.match(res.body.errors[0], /entero positivo/);
});

// (b) el POST ignora los campos id y role (asignación masiva)
test('POST /api/users ignora los campos id y role enviados por el cliente', async () => {
  const res = await request(app)
    .post('/api/users')
    .send({ name: 'Luis', email: 'luis@mail.com', role: 'admin', id: 999 })
    .expect(201);
  assert.notEqual(res.body.id, 999);
  assert.equal(res.body.id, 2); // asignado por la "BD" (doble en memoria), no por el cliente
  assert.equal(res.body.role, undefined);
  assert.equal(res.body.name, 'Luis');
});

// (c) un email duplicado devuelve 409 (se simula el error con code: 'ER_DUP_ENTRY')
test('POST /api/users con email duplicado devuelve 409', async () => {
  User.create = async () => {
    const err = new Error("Duplicate entry 'ana@mail.com' for key 'email'");
    err.code = 'ER_DUP_ENTRY';
    throw err;
  };
  const res = await request(app)
    .post('/api/users')
    .send({ name: 'Ana 2', email: 'ana@mail.com' })
    .expect(409);
  assert.equal(res.body.error, 'Ya existe un usuario con ese email');
});

// (d) un error interno responde 500 con el mensaje genérico, sin detalles de SQL
test('GET /api/users responde 500 genérico si el modelo falla sin filtrar detalles de SQL', async () => {
  User.getAll = async () => {
    throw new Error("ER_BAD_FIELD_ERROR: Unknown column 'x' in 'field list'");
  };
  const res = await request(app).get('/api/users').expect(500);
  assert.equal(res.body.error, 'Error interno del servidor');
  const body = JSON.stringify(res.body);
  assert.ok(!body.includes('ER_BAD_FIELD_ERROR'));
  assert.ok(!body.includes('SQL'));
});
