import { ErrorMessage, KeyOfErrorMessage } from '../enum/error-message.enum';

export class ServiceException extends Error {
  private readonly status: number;
  private readonly errorCode: string;

  constructor(errorCode: KeyOfErrorMessage, status: number, message?: string) {
    super(message || ErrorMessage[errorCode]);
    this.name = errorCode;
    this.status = status;
    this.errorCode = errorCode;
  }

  getStatus() {
    return this.status;
  }

  getErrorCode() {
    return this.errorCode;
  }

  getMessage() {
    return this.message;
  }
}
