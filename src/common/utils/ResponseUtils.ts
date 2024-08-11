import { Response } from '../data/response/Response';
export class ResponseUtils {
  public static ok<T>(data: T): Response<T> {
    return new Response(0, 'Success', data);
  }

  public static error<T>(errorCode: number, errorMessage: string): Response<T> {
    return new Response(errorCode, errorMessage, null);
  }

  public static response<T>(
    errorCode: number,
    errorMessage: string,
    data: T,
  ): Response<T> {
    return new Response(errorCode, errorMessage, data);
  }
}
