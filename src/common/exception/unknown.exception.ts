export class UnknownException extends Error {
  private readonly status: number;

  constructor(message?: string, status?: number) {
    super(message || 'Unknown Error');
    this.name = UnknownException.name;
    this.status = status || 500;
  }

  getStatus() {
    return this.status;
  }

  getMessage() {
    return this.message;
  }
}
