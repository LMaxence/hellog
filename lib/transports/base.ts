export interface BaseTransport {
  debug(message?: any, ...optionalParams: any[]): void;
  success(message?: any, ...optionalParams: any[]): void;
  log(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;
}
