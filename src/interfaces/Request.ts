export interface TypedRequestBody<T> extends Express.Request {
  body: T
}

import { Query, Params } from 'express-serve-static-core'

export interface TypedRequestQuery<T extends Query> extends Express.Request {
  query: T
}

export interface TypedRequestParams<T extends Params> extends Express.Request {
  params: T
}

export interface TypedRequest<T extends Params, U> extends Express.Request {
  params: T
  body: U
}
