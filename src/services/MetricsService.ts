import ms = require('ms')
import { Context } from 'koa'
import { collectDefaultMetrics, DefaultMetricsCollectorConfiguration, register, Counter, Summary } from 'prom-client'

const defaultConfig: DefaultMetricsCollectorConfiguration = {
  timeout: ms('5s'),
  prefix: 'adminapi_'
} as any // Type definition is wrong. Will need to be fixed

// Start monitoring all default recommended stats
// https://prometheus.io/docs/instrumenting/writing_clientlibs/#standard-and-runtime-collectors
collectDefaultMetrics(defaultConfig)

/**
 * Detailed HTTP Metrics
 */

const labelNames = ['method', 'handler', 'code']

const httpRequestsTotal = new Counter({
  labelNames,
  name: 'adminapi_http_requests_total',
  help: 'Total number of HTTP requests'
})

const httpRequestDurationMicroseconds = new Summary({
  labelNames,
  name: 'adminapi_http_request_duration_microseconds',
  help: 'Duration of HTTP requests in microseconds'
})

const httpRequestSizeBytes = new Summary({
  labelNames,
  name: 'adminapi_http_request_size_bytes',
  help: 'Duration of HTTP requests size in bytes'
})

const httpResponseSizeBytes = new Summary({
  labelNames,
  name: 'adminapi_http_response_size_bytes',
  help: 'Duration of HTTP response size in bytes'
})

function getMicroseconds() {
  const now = process.hrtime()
  return now[0] * 1000000 + now[1] / 1000
}

export const PROMETHEUS_CONTENT_TYPE = register.contentType

export function getPrometheusMetrics() {
  return register.metrics()
}

export async function KoaPrometheusMiddleware(ctx: Context, next: () => Promise<void>) {
  // Incoming request timestamp
  const startEpoch = getMicroseconds()

  await next()

  if (ctx.request.length) {
    // Request bytes
    httpRequestSizeBytes
      .labels(ctx.request.method, ctx.request.path, ctx.response.status.toString())
      .observe(ctx.request.length)
  }

  // Response bytes
  if (ctx.response.length) {
    httpResponseSizeBytes
      .labels(ctx.request.method, ctx.request.path, ctx.response.status.toString())
      .observe(ctx.response.length)
  }

  // Tracking request duration
  httpRequestDurationMicroseconds
    .labels(ctx.request.method, ctx.request.path, ctx.response.status.toString())
    .observe(getMicroseconds() - startEpoch)

  // Total number of requests
  httpRequestsTotal.labels(ctx.request.method, ctx.request.path, ctx.response.status.toString()).inc()
}
