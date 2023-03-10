export interface MicroserviceResponseWrapper {
  success: boolean;
  code: number;
  result?: unknown[] | boolean;
}
