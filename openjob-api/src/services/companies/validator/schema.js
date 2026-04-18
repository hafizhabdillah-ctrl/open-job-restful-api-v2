import Joi from 'joi';

export const companyPayloadSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  description: Joi.string().required(),
});

export const companyUpdatePayloadSchema = Joi.object({
  name: Joi.string(),
  location: Joi.string(),
  description: Joi.string(),
});

export const companyQueryShcema = Joi.object({
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