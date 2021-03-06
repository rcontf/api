export enum RconErrorResponse {
  REFUSED = 'ECONNREFUSED',
  NOT_FOUND = 'ENOTFOUND',
  UNAUTHENTICATED = 'Error: Unable to authenticate',
}

export interface RconSuccessfulResponse {
  body: string;
}
export interface RconFailedResponse {
  error: string;
}

export type RconResponse = RconSuccessfulResponse | RconFailedResponse;
