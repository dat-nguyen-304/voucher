import { Error } from 'mongoose';
import { IGenericErrorMessage, IGenericErrorResponseInput } from '../types/error.type';

const handleMongooseError = (err: Error.ValidationError): IGenericErrorResponseInput => {
  let message = 'Validation Error';
  const errors: IGenericErrorMessage[] = Object.values(err.errors).map(
    (validatorError: Error.ValidatorError | Error.CastError) => {
      return { path: validatorError.path, message: validatorError.message };
    }
  );
  message = errors[0].message;

  const error: IGenericErrorResponseInput = {
    errorMessages: errors,
    message: message,
    statusCode: 400
  };
  return error;
};

export default handleMongooseError;
