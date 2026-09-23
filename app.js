const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// CORS: si CORS_ORIGIN está definido (lista separada por comas) solo se aceptan esos orígenes
const origins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()) : '*';
app.use(cors({ origin: origins }));
app.use(express.json({ limit: '100kb' }));

app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
