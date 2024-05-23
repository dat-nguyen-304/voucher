import { RequestHandler } from 'express';

import { sendSuccessResponse } from '../utils/common';
import { AuthService } from '../services/auth.service';

const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const data = await AuthService.registerUser(req.body);
    sendSuccessResponse(res, data, 201);
  } catch (error) {
    next(error);
  }
};

const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const data = await AuthService.loginUser(req.body);
    sendSuccessResponse(res, data);
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
  registerUser,
  loginUser
};
