'use strict'

class ServiceError extends Error{
    constructor(public message: string, public error: string, public status: number) {
        super(message);
        this.message = message
        this.error = error
        this.status = status
    }

    public toJSON(){
        return {
            message: this.message,
            status: this.status,
            error: this.error
        }
    }
}

export class ValidationError extends ServiceError{
    constructor(data: string) {
        super(data, 'validation_error', 403);
    }
}

export class ProcessingError extends ServiceError{
    constructor(data: string) {
        super(data, 'processing_error', 403);
    }
}

export class ServerError extends ServiceError{
    constructor(data: string) {
        super(data, 'server_error', 500);
    }
}

export class AuthenticationError extends ServiceError {
    constructor(data: string) {
        super(data, 'authentication_error', 401);
    }
}

export class DataBaseError extends ServiceError{
    constructor(data: string) {
        super(data, 'database_error', 502);
    }
}