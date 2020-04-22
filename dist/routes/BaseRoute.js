"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
exports.BaseRoute = new Router();
exports.BaseRoute.get('/ping', async (ctx) => {
    ctx.body = 'pong';
});
