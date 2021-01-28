import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import consola from 'consola';

import Route from './routes/index';

import { APP_PORT, NODE_ENV } from './config/env';

const app = express();

app.use(json());
app.use(cors());

Route(app);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

if (NODE_ENV !== 'test') {
  app.listen(APP_PORT, () => {
    consola.success(`server is listening on port ${APP_PORT}`);
  });
}

export { app };
