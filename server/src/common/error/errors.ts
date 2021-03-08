// @ts-ignore
abstract class ErrorBase {
  constructor(
    public message: string | string[],
    public code: string,
    public variables: object,
  ) {}
}

class NotFoundError extends ErrorBase {
  constructor(message: string | string[], variables: {}) {
    super(message, 'ENTITY_NOT_FOUND', variables)
  }
}

export class DocumentNotFoundError extends ErrorBase {
  constructor(document: string | string[], variables: {}) {
    super(document, 'DOCUMENT_NOT_FOUND', variables)
  }
}

export class IllegalOperationError extends ErrorBase {
  constructor(message: string | string[], variables = {}) {
    super(message, 'ILLEGAL_OPERATION', variables);
  }
}

export class UserInputError extends ErrorBase {
  constructor(message: string | string[], variables = {}) {
    super(message, 'USER_INPUT_ERROR', variables)
  }
}
