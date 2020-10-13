"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceAxiosError = exports.extractAxiosError = exports.errorHandler = void 0;
const Errors_1 = require("../../types/Errors");
exports.errorHandler = async (ctx, next) => {
    try {
        await next();
    }
    catch (error) {
        if (error.isAxiosError) {
            const extractedError = exports.extractAxiosError(error);
            console.error(exports.reduceAxiosError(error));
            ctx.status = extractedError.code;
            ctx.body = extractedError.content;
        }
        else {
            switch (error.constructor) {
                case Errors_1.BadRequestError:
                    ctx.status = 400;
                    ctx.body = error.body ? error.body : error.message;
                    break;
                case Errors_1.UnauthorizedError:
                    ctx.status = 401;
                    ctx.body = error.message;
                    break;
                case Errors_1.NotFoundError:
                    ctx.status = 404;
                    ctx.body = error.message;
                    break;
                case Errors_1.ConflictError:
                    ctx.status = 409;
                    ctx.body = error.message;
                    break;
                default:
                    ctx.status = 500;
                    ctx.body = 'Internal Server Error Check Logs';
                    console.error(error);
            }
        }
    }
};
exports.extractAxiosError = (error) => {
    if (error.response) {
        if (error.response.data) {
            return { code: error.response.status, content: error.response.data };
        }
        return { code: error.response.status, content: error.message };
    }
    else {
        return { code: 500, content: error.message };
    }
};
exports.reduceAxiosError = (error) => {
    const config = error.config
        ? {
            method: error.config.method,
            url: error.config.url,
            data: error.config.data,
            headers: error.config.headers
        }
        : undefined;
    const request = error.request
        ? {
            _header: error.request._header,
            method: error.request.method,
            path: error.request.path
        }
        : undefined;
    const response = error.response
        ? {
            status: error.response.status,
            statusText: error.response.statusText,
            headers: error.response.headers,
            data: error.response.data
        }
        : undefined;
    return {
        name: error.name,
        stack: error.stack,
        message: error.message,
        code: error.code,
        config,
        request,
        response,
        isAxiosError: error.isAxiosError
    };
};
