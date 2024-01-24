export class UnknownException extends Error {
  private readonly status: number;

  constructor(e?: Error) {
    super(e?.message || 'Unknown Error');
    this.name = UnknownException.name;
  }

  getMessage() {
    return this.message;
  }
}
