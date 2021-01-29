/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { getDataValue } from '../util';

type conditionType = 'eq' | 'neq' | 'gt' | 'gte' | 'contains';
interface IRule {
  field: string | number;
  condition: conditionType;
  condition_value: string;
}

const Controller = {
  get: async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({
      message: 'My Rule-Validation API',
      status: 'success',
      data: {
        name: 'Obi Chinedu Frank',
        github: '@FrankChinedu',
        email: 'frankieetchy@gmail.com',
        mobile: '07069297676',
        twitter: '@frankieetchy',
      },
    });
  },

  post: async (req: Request, res: Response): Promise<Response | undefined> => {
    const rule = req.body.rule as IRule;
    const data = req.body.data as { [key: string]: any } | string | string[];
    const field = rule.field as string;
    const condition = rule.condition;
    const condition_value = rule.condition_value;

    const evaluate = (
      fieldValue: string | number,
      condition: conditionType,
      condition_value: string | number,
    ) => {
      const evalData = {
        eq: (fieldValue, condition_value) => fieldValue === condition_value,
        neq: (fieldValue, condition_value) => fieldValue !== condition_value,
        gt: (fieldValue, condition_value) => fieldValue > condition_value,
        gte: (fieldValue, condition_value) => fieldValue >= condition_value,
        contains: (fieldValue, condition_value) =>
          fieldValue !== condition_value,
      };

      return evalData[condition](fieldValue, condition_value);
    };
    const fieldArray = field.split('.');
    try {
      const evaluatedValue = evaluate(
        getDataValue(data as any, fieldArray),
        condition,
        condition_value,
      );

      if (evaluatedValue === false) {
        throw new Error(field);
      }

      const message = `field ${field} successfully validated.`;
      const validation = {
        error: false,
        field,
        field_value: getDataValue(data as any, fieldArray),
        condition,
        condition_value,
      };

      return res.status(200).json({
        message,
        status: 'success',
        data: { validation },
      });
    } catch (error) {
      const value = error.toString().split(': ')[1];
      const message = `field ${value} failed validation.`;
      const validation = {
        error: true,
        field,
        field_value: getDataValue(data as any, fieldArray),
        condition,
        condition_value,
      };
      return res.status(400).json({
        message,
        status: 'error',
        data: { validation },
      });
    }
  },
};

export default Controller;
