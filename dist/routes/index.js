"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const Compose = require("koa-compose");
const bodyParser = require("koa-bodyparser");
const BaseRoute_1 = require("./BaseRoute");
exports.unLoggedRoutes = Compose([BaseRoute_1.BaseRoute.routes(), BaseRoute_1.BaseRoute.allowedMethods()]);
const appRoute = new Router();
function setLoggedRoutes(app) {
    appRoute.use(bodyParser());
}
exports.setLoggedRoutes = setLoggedRoutes;
