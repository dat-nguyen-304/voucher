import bcrypt from 'bcrypt';
import { Response, RequestHandler } from 'express';
import HttpStatus from 'http-status-codes';
import { UnauthorizedError } from '../errors/error.response';
import { ITokenPayload } from '../types/common.type';
const JWT = require('jsonwebtoken');
require('dotenv').config();

interface ResponseData<T> {
    success: true;
    statusCode: number;
    data: T;
    message: string;
    responseStatus: string;
    errorMessages: [];
}

export const sendSuccessResponse = <T>(
    res: Response,
    data: T,
    statusCode: number = 200,
    message: string = 'Request processed successfully'
) => {
    const statusCodeText = HttpStatus.getStatusText(statusCode);
    const responseData: ResponseData<T> = {
        data: data,
        responseStatus: statusCodeText.toUpperCase().split(' ').join('_'),
        statusCode: statusCode,
        message,
        success: true,
        errorMessages: []
    };
    res.status(statusCode).json(responseData);
};

export const hashPassword = async (str: string) => {
    const saltRounds = await bcrypt.genSalt(1);
    const hash = bcrypt.hash(str, saltRounds);
    return hash;
};

export const createTokenPair = async (payload: ITokenPayload) => {
    try {
        const accessToken = await JWT.sign(payload, process.env.PRIVATE_KEY, {
            expiresIn: '2 days'
        });

        const refreshToken = await JWT.sign(payload, process.env.PRIVATE_KEY, {
            expiresIn: '7 days'
        });

        return { accessToken, refreshToken };
    } catch (error) {
        console.log({ error });
    }
};

export const authenticate: RequestHandler = async (req, res, next) => {
    const accessToken = req;
    if (!accessToken) throw new UnauthorizedError('Need access token');

    const decodedUser = JWT.verify(accessToken, process.env.PRIVATE_KEY);
    // @ts-expect-error only intended to use in specific need
    req.user = decodedUser;
    return next();
};
