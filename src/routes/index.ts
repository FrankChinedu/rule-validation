import { Express } from 'express';
import Router from './app';

export default (app: Express): void => {
  app.use('/', Router);
};
