import express from 'express';
import messagesController from '../controllers/messages-controller.js';
import { check } from 'express-validator';
import checkAuth from '../middleware/check-auth.js';

const router = express.Router();

router.get('/:fid', messagesController.getMessagesByForumId);

router.use(checkAuth);

router.post('/:fid', messagesController.createMessage);

router.delete('/:mid', messagesController.deleteMessage);


export default router;