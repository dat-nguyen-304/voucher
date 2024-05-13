import { ErrorRequestHandler } from 'express';
import HttpStatus from 'http-status-codes';
import { Error } from 'mongoose';
import { ZodError } from 'zod';
import { IGenericErrorMessage } from '../types/error.type';
import { ErrorResponse } from '../errors/error.response';
import handleMongooseError from '../errors/handleMongooseError';
import handleZodError from '../errors/handleZodError';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong!';
    let errorMessages: IGenericErrorMessage[] = [];
    if (error instanceof Error.ValidationError) {
        const simplifiedError = handleMongooseError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    } else if (error instanceof ZodError) {
        const simplifiedError = handleZodError(error);
        message = simplifiedError.message;
        statusCode = simplifiedError.statusCode;
        errorMessages = simplifiedError.errorMessages;
    } else if (error instanceof ErrorResponse) {
        statusCode = error.status;
        message = error.message;
        errorMessages = error.message ? [{ path: '', message: error.message }] : [];
    } else if (error instanceof Error) {
        message = error.message;
        errorMessages = error.message ? [{ path: '', message: error.message }] : [];
    }

    const statusCodeText = HttpStatus.getStatusText(statusCode);

    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        errorMessages,
        responseStatus: statusCodeText.toUpperCase().split(' ').join('_')
    });
    next();
};

export default globalErrorHandler;
