import { IRouterContext } from 'koa-router'
import { BadRequestError } from '../../types/Errors'
import { ServiceFunction } from '../../types/ServiceFunction'
import * as _ from 'lodash'

export interface Created {
  status: number
  data: any
}

export interface ServiceRequest<A = undefined, B = undefined, C = undefined> {
  params: A
  body?: B
  query?: C
}

export const parseRequest = <Params, Result, Body = undefined, Query = undefined>(
  serviceFunction: ServiceFunction<Params, Result, Body, Query>
) => async (ctx: IRouterContext) => {
  const response = await serviceFunction({
    params: ctx.params,
    body: ctx.request.body,
    query: ctx.request.query
  })
  mapResponse(ctx, response)
}

export const simpleBodyValidate = <T>(body?: any) => {
  if (_.isUndefined(body) || !_.isObject(body)) {
    throw new BadRequestError('Must send json as the body for this request.')
  }
  return body as { [P in keyof T]?: T[P] }
}

const mapResponse = (ctx: IRouterContext, response: any) => {
  if (response.status && (response || { status: 0 }).status === 201) {
    ctx.response.body = response.data || 'Created'
    ctx.response.status = 201
  } else {
    ctx.response.body = response
    ctx.response.status = 200
  }
}
