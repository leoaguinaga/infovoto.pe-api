export interface ServiceResponse<T> {
  statusCode: number;
  message: string;
  success: boolean;
  data: T;
}