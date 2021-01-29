import express, { Router } from 'express';
import Controller from '../controller';
import validate, { ruleValidate, dataValidate } from '../middleware';

const router = express.Router() as Router;

router.get('/', Controller.get);
router.post(
  '/validate-rule',
  validate,
  ruleValidate,
  dataValidate,
  Controller.post,
);

export default router;
