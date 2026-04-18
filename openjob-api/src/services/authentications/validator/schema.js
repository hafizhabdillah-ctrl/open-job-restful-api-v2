import Joi from 'joi';

export const postAuthenticationPayloadSchema = Joi.object({
  // name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  // role: Joi.string().required(),
});

export const putAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export const deleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});