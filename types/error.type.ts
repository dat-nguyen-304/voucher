export interface IGenericErrorMessage {
  path: string | number;
  message: string;
}

export type IGenericErrorResponse = {
  success: false;
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
  responseStatus: string;
};

export type IGenericErrorResponseInput = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};
