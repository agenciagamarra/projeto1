import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { adminAuth } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', adminAuth, userController.list);
router.get('/:id', adminAuth, userController.getById);
router.put('/:id', adminAuth, userController.update);
router.delete('/:id', adminAuth, userController.delete);

export default router;