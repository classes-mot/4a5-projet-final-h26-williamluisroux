import express from 'express';
import forumsController from '../controllers/forums-controller.js';
import { check } from 'express-validator';
import checkAuth from '../middleware/check-auth.js';
import checkOwner from '../middleware/check-owner.js';

const router = express.Router();

router.get('/', forumsController.getForums);

router.use(checkAuth);

router.post('/', forumsController.createForum);

router.delete('/:fid', forumsController.deleteForum);


export default router;