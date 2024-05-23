import { RequestHandler } from 'express';
import { UnauthorizedError } from '../errors/error.response';
const JWT = require('jsonwebtoken');
require('dotenv').config();

export const authenticate: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers['authorization'] || '';
  const tokenType = 'Bearer ';
  if (typeof authHeader === 'undefined' || !authHeader.includes(tokenType)) {
    throw new UnauthorizedError('Authentication token missing');
  }
  const accessToken = authHeader.replace(tokenType, '');

  const decodedUser = JWT.verify(accessToken, process.env.PRIVATE_KEY);
  // @ts-expect-error only intended to use in specific need
  req.user = decodedUser;
  return next();
};
