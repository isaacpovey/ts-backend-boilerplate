"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KoaPrometheusMiddleware = exports.getPrometheusMetrics = exports.PROMETHEUS_CONTENT_TYPE = void 0;
const ms = require("ms");
const prom_client_1 = require("prom-client");
const defaultConfig = {
    timeout: ms('5s'),
    prefix: 'adminapi_'
}; // Type definition is wrong. Will need to be fixed
// Start monitoring all default recommended stats
// https://prometheus.io/docs/instrumenting/writing_clientlibs/#standard-and-runtime-collectors
prom_client_1.collectDefaultMetrics(defaultConfig);
/**
 * Detailed HTTP Metrics
 */
const labelNames = ['method', 'handler', 'code'];
const httpRequestsTotal = new prom_client_1.Counter({
    labelNames,
    name: 'adminapi_http_requests_total',
    help: 'Total number of HTTP requests'
});
const httpRequestDurationMicroseconds = new prom_client_1.Summary({
    labelNames,
    name: 'adminapi_http_request_duration_microseconds',
    help: 'Duration of HTTP requests in microseconds'
});
const httpRequestSizeBytes = new prom_client_1.Summary({
    labelNames,
    name: 'adminapi_http_request_size_bytes',
    help: 'Duration of HTTP requests size in bytes'
});
const httpResponseSizeBytes = new prom_client_1.Summary({
    labelNames,
    name: 'adminapi_http_response_size_bytes',
    help: 'Duration of HTTP response size in bytes'
});
function getMicroseconds() {
    const now = process.hrtime();
    return now[0] * 1000000 + now[1] / 1000;
}
exports.PROMETHEUS_CONTENT_TYPE = prom_client_1.register.contentType;
function getPrometheusMetrics() {
    return prom_client_1.register.metrics();
}
exports.getPrometheusMetrics = getPrometheusMetrics;
async function KoaPrometheusMiddleware(ctx, next) {
    // Incoming request timestamp
    const startEpoch = getMicroseconds();
    await next();
    if (ctx.request.length) {
        // Request bytes
        httpRequestSizeBytes
            .labels(ctx.request.method, ctx.request.path, ctx.response.status.toString())
            .observe(ctx.request.length);
    }
    // Response bytes
    if (ctx.response.length) {
        httpResponseSizeBytes
            .labels(ctx.request.method, ctx.request.path, ctx.response.status.toString())
            .observe(ctx.response.length);
    }
    // Tracking request duration
    httpRequestDurationMicroseconds
        .labels(ctx.request.method, ctx.request.path, ctx.response.status.toString())
        .observe(getMicroseconds() - startEpoch);
    // Total number of requests
    httpRequestsTotal.labels(ctx.request.method, ctx.request.path, ctx.response.status.toString()).inc();
}
exports.KoaPrometheusMiddleware = KoaPrometheusMiddleware;
