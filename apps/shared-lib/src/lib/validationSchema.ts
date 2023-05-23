import * as Joi from 'joi';

export const validationSchema = (port: number) =>
  Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test', 'provision')
      .default('development'),
    PORT: Joi.number().default(port),
    JWT_SECRET: Joi.string(),
  });
