import Joi from 'joi';
/* eslint-disable camelcase */

export const applicationPayloadSchema = Joi.object({
  job_id: Joi.string().required(),
});

export const applicationUpdatePayloadSchema = Joi.object({
  status: Joi.string().required()
});