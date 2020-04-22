import * as KCors from 'kcors'
import * as Koa from 'koa'
import * as KLogger from 'koa-logger'
import { setLoggedRoutes, unLoggedRoutes } from './routes'
import * as http from 'http'
import { env } from './env'
import ms = require('ms')

const app = new Koa()

app.use(KCors({ credentials: true }))

if (process.env.NODE_ENV === 'production') {
  app.use(unLoggedRoutes)
  app.use(KLogger()) // Don't log unlogged routes in production
} else {
  app.use(KLogger())
  app.use(unLoggedRoutes)
}


setLoggedRoutes(app)

const server = http.createServer(app.callback())

server.listen(env.PORT, '0.0.0.0', () => {
  console.info(`Running application on ${env.PORT}`)
})

function safeProcessExit(exitCode = 0) {

  const closeTimeout = ms('30s')

  server.close(() => process.exit(exitCode))

  setTimeout(() => {
    console.warn(`Server did not close in ${closeTimeout}ms`)
    process.exit(exitCode)
  }, closeTimeout).unref()
}

function uncaughtExceptionHandler(e: Error) {
  console.error(e)
  safeProcessExit(1)
}

function unhandledRejectionHandler(reason: {} | null | undefined) {
  console.error(reason)
  safeProcessExit(1)
}

/**
 * Uncaught Error handling for cases where the app
 * dies unexpectedly.
 */
process.on('uncaughtException', uncaughtExceptionHandler)
process.on('unhandledRejection', unhandledRejectionHandler)

// On SIGINT, close server first and then exit process
process.on('SIGINT', () => process.exit(0))

// On SIGTERM ( sent by default in Kubernetes )
// Initiate graceful shutdown
process.on('SIGTERM', () => {
  console.info('Shutting down!')
  safeProcessExit(1)
})
