import { IRouterContext } from 'koa-router'
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../../types/Errors'
import { AxiosError } from 'axios'

export const errorHandler = async (ctx: IRouterContext, next: () => Promise<any>) => {
  try {
    await next()
  } catch (error) {
    if (error.isAxiosError) {
      const extractedError = extractAxiosError(error as AxiosError)
      console.error(reduceAxiosError(error))
      ctx.status = extractedError.code
      ctx.body = extractedError.content
    } else {
      switch (error.constructor) {
        case BadRequestError:
          ctx.status = 400
          ctx.body = (error as BadRequestError).body ? error.body : error.message
          break
        case UnauthorizedError:
          ctx.status = 401
          ctx.body = error.message
          break
        case NotFoundError:
          ctx.status = 404
          ctx.body = error.message
          break
        case ConflictError:
          ctx.status = 409
          ctx.body = error.message
          break
        default:
          ctx.status = 500
          ctx.body = 'Internal Server Error Check Logs'
          console.error(error)
      }
    }
  }
}

export const extractAxiosError = (error: AxiosError) => {
  if (error.response) {
    if (error.response.data) {
      return { code: error.response.status, content: error.response.data }
    }
    return { code: error.response.status, content: error.message }
  } else {
    return { code: 500, content: error.message }
  }
}

export const reduceAxiosError = (error: AxiosError) => {
  const config = error.config
    ? {
        method: error.config.method,
        url: error.config.url,
        data: error.config.data,
        headers: error.config.headers
      }
    : undefined
  const request = error.request
    ? {
        _header: error.request._header,
        method: error.request.method,
        path: error.request.path
      }
    : undefined
  const response = error.response
    ? {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        data: error.response.data
      }
    : undefined
  return {
    name: error.name,
    stack: error.stack,
    message: error.message,
    code: error.code,
    config,
    request,
    response,
    isAxiosError: error.isAxiosError
  }
}
