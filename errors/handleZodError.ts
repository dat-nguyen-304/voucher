import { ZodError } from 'zod';
import { IGenericErrorMessage, IGenericErrorResponseInput } from '../types/error.type';

const handleZodError = (error: ZodError): IGenericErrorResponseInput => {
    const statusCode = 400;
    let message = 'Validation Error';
    const errorMessages: IGenericErrorMessage[] = error.issues.map(issue => {
        return {
            message: issue.message,
            path: issue.path[issue.path.length - 1]
        };
    });
    message = errorMessages[0].message;

    return {
        statusCode,
        message,
        errorMessages
    };
};

export default handleZodError;
