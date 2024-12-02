export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: err.errors
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: err.message
    });
  }

  res.status(500).json({
    error: 'Erro interno do servidor'
  });
};