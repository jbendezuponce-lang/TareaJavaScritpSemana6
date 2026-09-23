// Campos que el cliente puede enviar. Cualquier otro (id, role, etc.) se ignora.
const ALLOWED_FIELDS = ['name', 'email'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function pickAllowed(body = {}) {
  const data = {};
  for (const field of ALLOWED_FIELDS) {
    if (body[field] !== undefined) data[field] = typeof body[field] === 'string' ? body[field].trim() : body[field];
  }
  return data;
}

function checkFields(data) {
  const errors = [];
  if ('name' in data && (typeof data.name !== 'string' || data.name.length < 2 || data.name.length > 100)) {
    errors.push('name debe ser un texto de 2 a 100 caracteres');
  }
  if ('email' in data && (typeof data.email !== 'string' || !EMAIL_REGEX.test(data.email) || data.email.length > 150)) {
    errors.push('email no es válido');
  }
  return errors;
}

// POST: name y email obligatorios
exports.validateCreate = (req, res, next) => {
  const data = pickAllowed(req.body);
  const errors = checkFields(data);
  if (!data.email) errors.unshift('email es obligatorio');
  if (!data.name) errors.unshift('name es obligatorio');
  if (errors.length) return res.status(400).json({ errors: [...new Set(errors)] });
  req.userData = data;
  next();
};

// PUT: al menos un campo, y los que vengan deben ser válidos
exports.validateUpdate = (req, res, next) => {
  const data = pickAllowed(req.body);
  if (Object.keys(data).length === 0) {
    return res.status(400).json({ errors: [`Envía al menos uno de: ${ALLOWED_FIELDS.join(', ')}`] });
  }
  const errors = checkFields(data);
  if (errors.length) return res.status(400).json({ errors });
  req.userData = data;
  next();
};

// :id debe ser un entero positivo
exports.validateId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ errors: ['El id debe ser un número entero positivo'] });
  }
  req.userId = id;
  next();
};
