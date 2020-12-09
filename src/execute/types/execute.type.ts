export enum RconErrorResponse {
  REFUSED = 'ECONNREFUSED',
}

export interface RconSuccessfulResponse {
  body: string | boolean;
}
export interface RconFailedResponse {
  error: string;
}

export type RconResponse = RconSuccessfulResponse | RconFailedResponse;
