import { IRouterContext } from 'koa-router'
import { BadRequestError, UnauthorizedError, NotFoundError } from '../../../src/types/Errors'
import { errorHandler } from '../../../src/routes/middleware/errorHandling'
import { AxiosError } from 'axios'

const ctx = {
  throw: jest.fn(),
  body: undefined,
  status: 404
}

async function testError(error: () => Promise<any>, code: number, message: any) {
  await errorHandler((ctx as any) as IRouterContext, error)
  expect(ctx.body).toEqual(message)
  expect(ctx.status).toEqual(code)
}

const originalConsoleError = console.error

describe('errorHandling', () => {
  it('should handle custom error types', async () => {
    const badRequest = jest.fn(() => Promise.reject(new BadRequestError('bad request')))
    const badRequestWithBody = jest.fn(() => Promise.reject(new BadRequestError('bad request', { test: 'test' })))
    const unauthorizedRequest = jest.fn(() => Promise.reject(new UnauthorizedError('unauthorized')))
    const notFoundRequest = jest.fn(() => Promise.reject(new NotFoundError('not found')))
    await testError(badRequest, 400, 'bad request')
    await testError(unauthorizedRequest, 401, 'unauthorized')
    await testError(notFoundRequest, 404, 'not found')
    await errorHandler((ctx as any) as IRouterContext, badRequestWithBody)
    expect(ctx.body).toMatchObject({ test: 'test' })
    expect(ctx.status).toEqual(400)
  })

  it('should handle errors other than axios or default', async () => {
    console.error = jest.fn()
    const error = jest.fn(() => Promise.reject(Error('test')))
    await testError(error, 500, 'Internal Server Error Check Logs')
    expect(console.error).toBeCalledWith(Error('test'))
  })

  it('should handle and parse axios errors with response and data', async () => {
    console.error = jest.fn()
    const axiosError: AxiosError = {
      name: 'test',
      stack: 'test-stack',
      message: 'test-message',
      request: {
        test: jest.fn()
      },
      response: {
        status: 401,
        data: { body: 'test' },
        statusText: 'unauthorized',
        headers: {},
        config: {
          method: 'post',
          url: 'test.com'
        }
      },
      config: {
        method: 'post',
        url: 'test.com'
      },
      isAxiosError: true,
      toJSON: () => ({ ...axiosError, toJSON: undefined })
    }
    const error = jest.fn(() => Promise.reject(axiosError))
    await testError(error, 401, { body: 'test' })
  })

  it('should handle and parse axios errors with response but no data', async () => {
    console.error = jest.fn()
    const axiosError: AxiosError = {
      name: 'test',
      stack: 'test-stack',
      message: 'test-message',
      request: {
        test: jest.fn()
      },
      response: {
        status: 401,
        data: undefined,
        statusText: 'unauthorized',
        headers: {},
        config: {
          method: 'post',
          url: 'test.com'
        }
      },
      config: {
        method: 'post',
        url: 'test.com'
      },
      isAxiosError: true,
      toJSON: () => ({ ...axiosError, toJSON: undefined })
    }
    const error = jest.fn(() => Promise.reject(axiosError))
    await testError(error, 401, 'test-message')
  })

  it('should handle and parse axios errors with no response and no code', async () => {
    console.error = jest.fn()
    const axiosError: AxiosError = {
      name: 'test',
      stack: 'test-stack',
      message: 'test-message',
      request: {
        test: jest.fn()
      },
      config: {
        method: 'post',
        url: 'test.com'
      },
      isAxiosError: true,
      toJSON: () => ({ ...axiosError, toJSON: undefined })
    }
    const error = jest.fn(() => Promise.reject(axiosError))
    await testError(error, 500, 'test-message')
  })

  afterEach(() => {
    console.error = originalConsoleError
  })
})
