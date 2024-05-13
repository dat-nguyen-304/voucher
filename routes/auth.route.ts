import express from 'express';
import { AuthValidation } from '../middleware/validations/auth.validation';
import { validateRequest } from '../middleware';
import { AuthController } from '../controllers/auth.controller';

export const authRouter = express.Router();

authRouter.post('/register', validateRequest(AuthValidation.registerUser), AuthController.registerUser);

authRouter.post('/login', validateRequest(AuthValidation.loginUser), AuthController.loginUser);
