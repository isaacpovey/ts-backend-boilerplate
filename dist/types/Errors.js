"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthExtControllerError = exports.AuthExtTokenError = exports.UnauthorizedError = exports.ConflictError = exports.NotFoundError = exports.BadRequestError = void 0;
class BadRequestError extends Error {
    constructor(message, body) {
        super(message);
        this.body = body;
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends Error {
}
exports.NotFoundError = NotFoundError;
class ConflictError extends Error {
}
exports.ConflictError = ConflictError;
class UnauthorizedError extends Error {
}
exports.UnauthorizedError = UnauthorizedError;
class AuthExtTokenError extends Error {
    constructor(e) {
        super('Authorization Extension failed getting token.');
        this.error = e;
    }
}
exports.AuthExtTokenError = AuthExtTokenError;
class AuthExtControllerError extends Error {
    constructor(e) {
        super('Authorization Extension controller error.');
        this.error = e;
    }
}
exports.AuthExtControllerError = AuthExtControllerError;
