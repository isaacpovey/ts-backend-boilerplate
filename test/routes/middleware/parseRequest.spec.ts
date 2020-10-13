import { IRouterContext } from 'koa-router'
import { parseRequest, simpleBodyValidate } from '../../../src/routes/middleware/parseRequest'
import { BadRequestError } from '../../../src/types/Errors'

jest.mock('../../../src/env', () => ({
  env: {
    REGION: { env: 'test', cluster: 'us1' }
  }
}))

jest.mock('../../../src/axios', () => ({
  axiosInstance: {
    request: jest.fn().mockImplementation(() => Promise.resolve({ data: 'Test1' }))
  }
}))

async function testSuccessfulParseRequest(region?: object) {
  const serviceFunction = jest.fn(() => Promise.resolve('test'))
  const ctx = {
    params: { test: 'test' },
    request: {
      query: region,
      body: { test2: 'test2' }
    },
    response: {},
    state: {}
  }
  await parseRequest(serviceFunction)((ctx as any) as IRouterContext)
  expect(serviceFunction).toBeCalledWith({
    query: region,
    body: { test2: 'test2' },
    params: { test: 'test' }
  })
  expect((ctx as IRouterContext).response.body).toEqual('test')
  expect((ctx as IRouterContext).response.status).toEqual(200)
}

describe('parseRequest', () => {
  it('should parse request without region', async () => {
    expect(await testSuccessfulParseRequest(undefined))
  })

  it('should parse request with region', async () => {
    expect(await testSuccessfulParseRequest({ environment: 'test', instance: 'us1' }))
  })

  it('should set correct response for created', async () => {
    const serviceFunction = jest.fn(() => Promise.resolve({ status: 201 }))
    const ctx = {
      request: {},
      response: {},
      state: {}
    }
    await parseRequest(serviceFunction)((ctx as any) as IRouterContext)
    expect(serviceFunction).toBeCalledWith({ params: undefined, body: undefined, query: undefined })
    expect((ctx as IRouterContext).response.body).toEqual('Created')
    expect((ctx as IRouterContext).response.status).toEqual(201)
  })
})

describe('simpleBodyValidate', () => {
  it('should throw a bad request error if the body is undefined', () => {
    try {
      const response = simpleBodyValidate(undefined)
    } catch (error) {
      expect(error.constructor).toEqual(BadRequestError)
      expect(error.message).toEqual('Must send json as the body for this request.')
    }
  })

  it('should throw a bad request error if the body is not an object', () => {
    try {
      const response = simpleBodyValidate('not an object')
    } catch (error) {
      expect(error.constructor).toEqual(BadRequestError)
      expect(error.message).toEqual('Must send json as the body for this request.')
    }
  })
})
