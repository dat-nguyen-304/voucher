import { ErrorRequestHandler } from 'express';
import { Error as MongooseError } from 'mongoose';
import { ZodError } from 'zod';
import { IGenericErrorMessage } from '../types/error.type';
import { ErrorResponse } from '../errors/error.response';
import handleMongooseError from '../errors/handleMongooseError';
import handleZodError from '../errors/handleZodError';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessages: IGenericErrorMessage[] = [];
  if (error instanceof MongooseError.ValidationError) {
    console.log('mongoose error');
    const simplifiedError = handleMongooseError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ZodError) {
    console.log('zod error');
    const simplifiedError = handleZodError(error);
    message = simplifiedError.message;
    statusCode = simplifiedError.statusCode;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ErrorResponse) {
    console.log('Custom error');
    statusCode = error.status;
    message = error.message;
    errorMessages = error.message ? [{ path: '', message: error.message }] : [];
  } else if (error instanceof Error) {
    console.log('Normal error');
    message = error.message;
    errorMessages = error.message ? [{ path: '', message: error.message }] : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    errorMessages
  });
  next();
};
export default globalErrorHandler;
