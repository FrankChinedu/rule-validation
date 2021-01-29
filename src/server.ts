import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';

import Route from './routes/index';

import { APP_PORT, NODE_ENV } from './config/env';

const app = express();

app.use(json());
app.use(cors());

Route(app);

app.use((req, res) =>
  res
    .status(404)
    .json({ message: 'Route not found.', status: 'error', data: null }),
);

app.use(function (err, req, res, next) {
  if (err) {
    res.status(400).json({
      message: 'Invalid JSON payload passed.',
      status: 'error',
      data: null,
    });
  }
  next();
});

if (NODE_ENV !== 'test') {
  /* istanbul ignore next */
  app.listen(APP_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`server is listening on port ${APP_PORT}`);
  });
}

export { app };
