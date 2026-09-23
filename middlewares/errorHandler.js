// Rutas que no existen
exports.notFound = (req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

// Manejador global: registra el detalle en el servidor y responde sin exponerlo
exports.errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es JSON válido' });
  }
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
};
