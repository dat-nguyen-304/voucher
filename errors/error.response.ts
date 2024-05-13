const StatusCode = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409
};

const StatusMessage = {
    BAD_REQUEST: 'BAD_REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT'
};

export class ErrorResponse {
    status: number;
    message: string;
    constructor(message: string, status: number) {
        this.message = message;
        this.status = status;
    }
}

export class ConflictError extends ErrorResponse {
    constructor(message = StatusMessage.CONFLICT, status = StatusCode.CONFLICT) {
        super(message, status);
    }
}

export class BadRequestError extends ErrorResponse {
    constructor(message = StatusMessage.BAD_REQUEST, status = StatusCode.BAD_REQUEST) {
        super(message, status);
    }
}

export class UnauthorizedError extends ErrorResponse {
    constructor(message = StatusMessage.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
        super(message, statusCode);
    }
}

export class NotFoundError extends ErrorResponse {
    constructor(message = StatusMessage.NOT_FOUND, statusCode = StatusCode.NOT_FOUND) {
        super(message, statusCode);
    }
}

export class ForbiddenError extends ErrorResponse {
    constructor(message = StatusMessage.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode);
    }
}
