import { BaseTransport } from './transports/base';
import { Console } from './transports/console';

export interface HellogOptions {
  transports: BaseTransport[];
}

export class Hellog {
  opts: HellogOptions = {
    transports: [new Console()],
  };

  constructor(opts?: HellogOptions) {
    if (opts) {
      this.opts = opts;
    }
  }

  log(message?: any, ...optionalParams: any[]): void {
    for (const transport of this.opts.transports) {
      transport.log(message, ...optionalParams);
    }
  }

  debug(message?: any, ...optionalParams: any[]): void {
    for (const transport of this.opts.transports) {
      transport.debug(message, ...optionalParams);
    }
  }

  success(message?: any, ...optionalParams: any[]): void {
    for (const transport of this.opts.transports) {
      transport.success(message, ...optionalParams);
    }
  }

  warn(message?: any, ...optionalParams: any[]): void {
    for (const transport of this.opts.transports) {
      transport.warn(message, ...optionalParams);
    }
  }

  error(message?: any, ...optionalParams: any[]): void {
    for (const transport of this.opts.transports) {
      transport.error(message, ...optionalParams);
    }
  }
}
