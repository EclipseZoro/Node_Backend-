import {Router} from 'express';
import {createUser, listUsers, me, getUserById, updateUser} from "../controllers/user.controller.js";
import {requireAuth} from "../middleware/auth.js";
import { allowSelforAdmin } from '../middleware/roles.js';
import { deleteUser } from '../controllers/user.controller.js';


export const userRouter = Router();

userRouter.post('/', createUser);
userRouter.get('/', listUsers);
userRouter.get('/me', requireAuth, me);
//get user by id (allowed for self or admin only)
userRouter.get('/:id', requireAuth, allowSelforAdmin, getUserById);
userRouter.patch('/:id', requireAuth, allowSelforAdmin, updateUser);
// only letting the admin to delete a user
userRouter.delete('/:id', requireAuth, requireRole('admin'), deleteUser);
