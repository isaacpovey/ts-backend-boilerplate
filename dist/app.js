"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KCors = require("kcors");
const Koa = require("koa");
const KLogger = require("koa-logger");
const routes_1 = require("./routes");
const http = require("http");
const env_1 = require("./env");
const ms = require("ms");
const app = new Koa();
app.use(KCors({ credentials: true }));
if (process.env.NODE_ENV === 'production') {
    app.use(routes_1.unLoggedRoutes);
    app.use(KLogger()); // Don't log unlogged routes in production
}
else {
    app.use(KLogger());
    app.use(routes_1.unLoggedRoutes);
}
routes_1.setLoggedRoutes(app);
const server = http.createServer(app.callback());
server.listen(env_1.env.PORT, '0.0.0.0', () => {
    console.info(`Running application on ${env_1.env.PORT}`);
});
function safeProcessExit(exitCode = 0) {
    const closeTimeout = ms('30s');
    server.close(() => process.exit(exitCode));
    setTimeout(() => {
        console.warn(`Server did not close in ${closeTimeout}ms`);
        process.exit(exitCode);
    }, closeTimeout).unref();
}
function uncaughtExceptionHandler(e) {
    console.error(e);
    safeProcessExit(1);
}
function unhandledRejectionHandler(reason) {
    console.error(reason);
    safeProcessExit(1);
}
/**
 * Uncaught Error handling for cases where the app
 * dies unexpectedly.
 */
process.on('uncaughtException', uncaughtExceptionHandler);
process.on('unhandledRejection', unhandledRejectionHandler);
// On SIGINT, close server first and then exit process
process.on('SIGINT', () => process.exit(0));
// On SIGTERM ( sent by default in Kubernetes )
// Initiate graceful shutdown
process.on('SIGTERM', () => {
    console.info('Shutting down!');
    safeProcessExit(1);
});
