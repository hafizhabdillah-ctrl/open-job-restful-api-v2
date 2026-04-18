import Joi from 'joi';

export const categoryPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

export const categoryUpdatePayloadSchema = Joi.object({
  name: Joi.string(),
});

export const categoryQueryShcema = Joi.object({
  name: Joi.string(),
});

export const validateQuery = (schema) => (req, res, next) => { const { error, value } = schema.validate(req.query, {
  abortEarly: false,
  allowUnknown: false,
  stripUnknown: true
});

if (error) return next(error);
req.validated = value;
next();
};