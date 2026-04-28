import express from 'express';
import forumsController from '../controllers/forums-controller.js';
import { check } from 'express-validator';
import checkAuth from '../middleware/check-auth.js';

const router = express.Router();

router.get('/', forumsController.getForums);
router.get('/:fid', forumsController.getForumById)

router.use(checkAuth);

router.post('/', check('titre').not().isEmpty(), forumsController.createForum);

router.delete('/:fid', forumsController.deleteForum);


export default router;