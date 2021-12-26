import * as util from 'util';
import { PreparedMessage } from './entities';
import { LogLevel } from './entities/levels';
import { BaseTransport } from './transports/base';
import { Console } from './transports/console';

export type ContextExtension = (
  message: PreparedMessage
) => PreparedMessage & { [key: string]: any };

export interface HellogOptions {
  transports?: BaseTransport[];
  additionalContext?: ContextExtension;
}

export class Hellog {
  transports: BaseTransport[] = [new Console()];
  additionalContext?: ContextExtension;

  constructor(opts?: HellogOptions) {
    if (opts && opts.transports) {
      this.transports = opts.transports;
    }
    if (opts && opts.additionalContext) {
      this.additionalContext = opts.additionalContext;
    }
  }

  prepareObject(level: LogLevel, out: string): PreparedMessage {
    const timestamp = new Date();
    let context: PreparedMessage = { timestamp, level, message: out };
    if (this.additionalContext) {
      context = this.additionalContext(context);
    }
    return context;
  }

  _log(level: LogLevel, message?: any, ...utilFormatParams: any[]) {
    const out = util.format(message, ...utilFormatParams);
    const logObject = this.prepareObject(level, out);
    for (const transport of this.transports) {
      transport.log(logObject);
    }
  }

  log(message?: any, ...optionalParams: any[]): void {
    this._log(LogLevel.INFO, message, ...optionalParams);
  }

  debug(message?: any, ...optionalParams: any[]): void {
    this._log(LogLevel.DEBUG, message, ...optionalParams);
  }

  success(message?: any, ...optionalParams: any[]): void {
    this._log(LogLevel.SUCCESS, message, ...optionalParams);
  }

  warn(message?: any, ...optionalParams: any[]): void {
    this._log(LogLevel.WARNING, message, ...optionalParams);
  }

  error(message?: any, ...optionalParams: any[]): void {
    this._log(LogLevel.ERROR, message, ...optionalParams);
  }
}
