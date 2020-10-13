"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRoute = void 0;
const Router = require("koa-router");
exports.BaseRoute = new Router();
exports.BaseRoute.get('/ping', async (ctx) => {
    ctx.body = 'pong';
});
