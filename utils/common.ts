import bcrypt from 'bcrypt';
import { Response } from 'express';
import { ITokenPayload } from '../types/common.type';
const JWT = require('jsonwebtoken');
require('dotenv').config();

interface ResponseData<T> {
    success: true;
    statusCode: number;
    data: T;
    message: string;
    errorMessages: [];
}

export const sendSuccessResponse = <T>(
    res: Response,
    data: T,
    statusCode: number = 200,
    message: string = 'Request processed successfully'
) => {
    const responseData: ResponseData<T> = {
        data: data,
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
