import { throwIfUndefined } from '../util';
import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;

export const APP_PORT =
  process.env.PORT || throwIfUndefined(process.env.APP_PORT, 'APP PORT');
