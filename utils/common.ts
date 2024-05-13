import bcrypt from 'bcrypt';
import { Response } from 'express';
import HttpStatus from 'http-status-codes';

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
