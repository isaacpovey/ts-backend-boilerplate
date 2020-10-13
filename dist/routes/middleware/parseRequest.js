"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleBodyValidate = exports.parseRequest = void 0;
const Errors_1 = require("../../types/Errors");
const _ = require("lodash");
exports.parseRequest = (serviceFunction) => async (ctx) => {
    const response = await serviceFunction({
        params: ctx.params,
        body: ctx.request.body,
        query: ctx.request.query
    });
    mapResponse(ctx, response);
};
exports.simpleBodyValidate = (body) => {
    if (_.isUndefined(body) || !_.isObject(body)) {
        throw new Errors_1.BadRequestError('Must send json as the body for this request.');
    }
    return body;
};
const mapResponse = (ctx, response) => {
    if (response.status && (response || { status: 0 }).status === 201) {
        ctx.response.body = response.data || 'Created';
        ctx.response.status = 201;
    }
    else {
        ctx.response.body = response;
        ctx.response.status = 200;
    }
};
