// @ts-ignore
abstract class ErrorBase {
  constructor(
    public message: string,
    public code: string,
    public variables: object,
  ) {}
}

class NotFoundError extends ErrorBase {
  constructor(message: string, variables: {}) {
    super(message, 'ENTITY_NOT_FOUND', variables)
  }
}

export class UserInputError extends ErrorBase {
  constructor(message: string, variables = {}) {
    super(message, 'USER_INPUT_ERROR', variables)
  }
}
