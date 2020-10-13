export class BadRequestError extends Error {
  body?: object

  constructor(message?: string, body?: object) {
    super(message)
    this.body = body
  }
}

export class NotFoundError extends Error {}

export class ConflictError extends Error {}

export class UnauthorizedError extends Error {}

export class AuthExtTokenError extends Error {
  error: any

  constructor(e: any) {
    super('Authorization Extension failed getting token.')
    this.error = e
  }
}

export class AuthExtControllerError extends Error {
  error: any

  constructor(e: any) {
    super('Authorization Extension controller error.')
    this.error = e
  }
}
