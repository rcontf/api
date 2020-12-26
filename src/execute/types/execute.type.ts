export enum RconErrorResponse {
  REFUSED = 'ECONNREFUSED',
}

export interface RconSuccessfulResponse {
  body: string;
}
export interface RconFailedResponse {
  error: string;
}

export type RconResponse = RconSuccessfulResponse | RconFailedResponse;
