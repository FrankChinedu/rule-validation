/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi, { Schema, ValidationError } from 'joi';
import { NextFunction, Response, Request } from 'express';

import { getDataValue } from '../util';

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
      let message = `${key} is required.`;
      const include = ['rule', 'data'].includes(key);

      if (!include) {
        message = `${key} is not allowed.`;
      }
      return res.status(400).json({ message, status: 'error', data: null });
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

export const ruleValidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const body = req.body;

  const schema = Joi.object({
    rule: Joi.object({
      field: Joi.string().required(),
      condition: Joi.string()
        .valid('eq', 'neq', 'gt', 'gte', 'contains')
        .required(),
      condition_value: [Joi.string().required(), Joi.number().required()],
    }),
  });

  const { error } = schema.validate(body, {
    allowUnknown: true,
  });
  if (error) {
    return res.status(400).json({
      message: `${error.details[0].message}.`,
      status: 'error',
      data: null,
    });
  }

  next();
};

export const dataValidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const rule = req.body.rule;
  const data = req.body.data;

  const field = rule.field as string;

  if (typeof data === 'object') {
    const isArray = Array.isArray(data);

    if (!isArray) {
      const fieldSplit = field.split('.');

      const result = getDataValue(data, fieldSplit);

      if (!result) {
        return res.status(400).json({
          message: `field ${field} is missing from data.`,
          status: 'error',
          data: null,
        });
      }
    } else {
      const condition = rule.condition;
      if (condition !== 'contains' || isNaN(+field)) return next();
      if (+field > data.length) {
        return res.status(400).json({
          message: `field ${field} is missing from data.`,
          status: 'error',
          data: null,
        });
      }
    }
  }
  next();
};
