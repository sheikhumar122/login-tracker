import express from  'express';
import { Details, Login, Register } from '../controllers/userController.js';
import { isUser } from '../middleware/auth.js';
export const  userRouter = express.Router();

userRouter.post( '/register', Register);
userRouter.post( '/login', Login);
userRouter.get("/dashboard", isUser,Details)
