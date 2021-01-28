import express, { Router } from 'express';
import Controller from '../controller';
import validate from '../middleware';

const router = express.Router() as Router;

router.get('/', Controller.get);
router.post('/validate-rule', validate, Controller.post);

export default router;
