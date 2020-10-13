import { ServiceRequest } from '../routes/middleware/parseRequest'

export type ServiceFunction<Params, Result, Body = undefined, Query = undefined> = (
  sr: ServiceRequest<Params, Body, Query>
) => Promise<Result>
