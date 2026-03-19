import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3001),
  DATABASE_URL: Joi.string().required(),
});
