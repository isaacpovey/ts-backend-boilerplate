"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLoggedRoutes = exports.unLoggedRoutes = void 0;
const Router = require("koa-router");
const Compose = require("koa-compose");
const bodyParser = require("koa-bodyparser");
const BaseRoute_1 = require("./BaseRoute");
const errorHandling_1 = require("./middleware/errorHandling");
exports.unLoggedRoutes = Compose([BaseRoute_1.BaseRoute.routes(), BaseRoute_1.BaseRoute.allowedMethods()]);
const appRoute = new Router();
function setLoggedRoutes(app) {
    appRoute.use(bodyParser(), errorHandling_1.errorHandler);
    app.use(appRoute.routes()).use(appRoute.allowedMethods());
}
exports.setLoggedRoutes = setLoggedRoutes;
