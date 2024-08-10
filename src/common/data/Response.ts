export class Response<T> {
  private errorCode: number;
  private errorMessage: string;
  private data: T;

  constructor(errorCode: number, errorMessage: string, data: T) {
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
    this.data = data;
  }
}
