import { ZodError } from 'zod';

export const validate = (schema) => async (req, res, next) => {
  try {
    const data = await schema.parseAsync(req.body);
    req.validatedData = data;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: 'Dados inválidos',
        details: error.errors
      });
    } else {
      next(error);
    }
  }
};