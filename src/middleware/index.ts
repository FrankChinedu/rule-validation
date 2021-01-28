/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi, { Schema, ValidationError } from 'joi';
import { NextFunction, Response, Request } from 'express';

const getSchema = (validationSchema): Schema => {
  const schema = Joi.object().keys({
    rule: Joi.object().required(),
    data: validationSchema,
  });

  return schema;
};

const parseError = (error: ValidationError): string => {
  const key = error.details[0].context?.key as string;
  return key;
};

export default async function validate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> {
  const body = req.body;

  const data = body.data;
  const rule = body.rule;

  if (rule || typeof rule === 'string') {
    if (typeof rule !== 'object' || Array.isArray(rule)) {
      return res.status(400).json({
        message: `rule should be an object.`,
        status: 'error',
        data: null,
      });
    }
  }
  let dataValidation: any = Joi.string().required();

  if (data && typeof data !== 'object' && typeof data !== 'string') {
    return res.status(400).json({
      message: `data should be an object | string | array.`,
      status: 'error',
      data: null,
    });
  } else if (typeof data === 'object') {
    dataValidation = Array.isArray(data)
      ? Joi.array().required()
      : Joi.object().required();
  }

  const schema = getSchema(dataValidation);

  try {
    const { error } = schema.validate(body);
    if (error) {
      const key = parseError(error);
      return res
        .status(400)
        .json({ message: `${key} is required.`, status: 'error', data: null });
    }
  } catch (err) {
    if (err) {
      return res
        .status(400)
        .json({ message: 'An error occured.', status: 'error', data: null });
    }
  }

  next();
}
