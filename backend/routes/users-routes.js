import express from 'express';
import usersController from '../controllers/users-controller.js';
import { check } from 'express-validator';
import checkAuth from '../middleware/check-auth.js';
import checkOwner from '../middleware/check-owner.js';
import fileUpload from '../middleware/file-upload.js';

const router = express.Router();

router.post('/register', usersController.registerUser);

router.post('/login', usersController.login);

// Un user/guest ne peut pas accéder/modifier le profile d'un autre user
router.use(checkAuth);

// checkOwner utilise le :uid, donc il a besoin d'être appelé dans la route contrairement a checkAuth
router.get('/profile/:uid', checkOwner, usersController.getUserById);

router.patch('/profile/:uid', checkOwner, check('name').not().isEmpty(), usersController.updateUserNameById);

router.patch('/profile/:uid/image', checkOwner, fileUpload.single('image'), usersController.updateUserPictureById);

export default router;