import * as koa from 'koa'

export const accessLogMiddleware = async (ctx: koa.Context, next: () => Promise<any>) => {
  const start = new Date()

  try {
    await next()
  } finally {
    const diff = Date.now() - start.valueOf()

    const res = ctx.response
    const req = ctx.request
    const headers = req.headers

    const httpVersion = ctx.req.httpVersion
    const remoteIp = ctx.ip || 'X'
    const xForwardedFor = headers['x-forwarded-for'] || '-'
    const requestId = headers['x-request-id'] || '-'
    const referrer = headers.referer || '-'
    const userAgent = headers['user-agent'] || '-'
    const reqHost = headers.host || '-'
    const resLength = res.length || 0

    const userId = ctx.state.user ? ctx.state.user.sub : '-'
    console.info(
      `${start.toISOString()} ${xForwardedFor} ${remoteIp} ${requestId} ${userId} - ${req.method} ${reqHost}${
        req.url
      } HTTP/${httpVersion} ${res.status} ${resLength} ${diff} "${referrer}" "${userAgent}"`
    )
  }
}
