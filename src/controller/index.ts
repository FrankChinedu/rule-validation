import { Request, Response } from 'express';

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

  post: async (req: Request, res: Response): Promise<Response> => {
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
};

export default Controller;
