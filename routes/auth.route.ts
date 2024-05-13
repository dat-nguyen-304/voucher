import express from 'express';
import { AuthValidation } from '../middleware/validations/auth.validation';
import { validateRequest } from '../middleware';

const router = express.Router();

router.post('/register', validateRequest(AuthValidation.registerUser), AuthController.registerUser);

router.post('/login', validateRequest(AuthValidation.loginUser), AuthController.loginUser);
