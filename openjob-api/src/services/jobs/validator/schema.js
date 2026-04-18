import Joi from 'joi';
/* eslint-disable camelcase */

export const jobPayloadSchema = Joi.object({
  company_id: Joi.string().required(),
  category_id: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  job_type: Joi.string().required(),
  experience_level: Joi.string().required(),
  location_type: Joi.string().required(),
  location_city: Joi.string().optional(),
  salary_min: Joi.number().optional(),
  salary_max: Joi.number().optional(),
  is_salary_visible: Joi.boolean().optional(),
  status: Joi.string().required(),
});

export const jobUpdatePayloadSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  job_type: Joi.string(),
  experience_level: Joi.string(),
  location_type: Joi.string(),
  location_city: Joi.string(),
  salary_min: Joi.number(),
  salary_max: Joi.number(),
  is_salary_visible: Joi.boolean(),
  status: Joi.string(),
});

export const jobQuerySchema = Joi.object({
  title: Joi.string().allow(''),
  'company-name': Joi.string().allow(''),
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