import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3002),
  DATABASE_URL: Joi.string().required(),
  PRODUCTS_SERVICE_URL: Joi.string().uri().required(),
});
