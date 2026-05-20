const errorHandler = (err, _req, res, _next) => {
  console.error('Error:', err);

  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
    return res.status(400).json({ error: 'Validation error', details: errors });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map((e) => ({ field: e.path, message: `${e.path} already exists` }));
    return res.status(409).json({ error: 'Duplicate entry', details: errors });
  }

  return res.status(err.statusCode || 500).json({
    error: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
