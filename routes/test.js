import {Router} from 'express';
import {login} from '../controllers/auth.controller.js';
import {createUser, listUsers, me} from "../controllers/user.controller.js";
import {requireAuth} from "../middleware/auth.js";

export const authRouter = Router();
authRouter.post('/login', login);


export const userRouter = Router();
userRouter.post('/', createUser);
userRouter.get('/', listUsers);
userRouter.get('/me', requireAuth, me);
