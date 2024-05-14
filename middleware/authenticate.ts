import { RequestHandler } from 'express';
import { UnauthorizedError } from '../errors/error.response';
const JWT = require('jsonwebtoken');
require('dotenv').config();

export const authenticate: RequestHandler = async (req, res, next) => {
    const accessToken = req;
    if (!accessToken) throw new UnauthorizedError('Need access token');

    const decodedUser = JWT.verify(accessToken, process.env.PRIVATE_KEY);
    // @ts-expect-error only intended to use in specific need
    req.user = decodedUser;
    return next();
};
