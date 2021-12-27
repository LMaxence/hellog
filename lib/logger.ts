import * as util from 'util';
import { PreparedMessage } from './entities';
import { LogLevel } from './entities/levels';
import { BaseTransport } from './transports/base';
import { Console } from './transports/console';

export type ContextExtension<T extends PreparedMessage = PreparedMessage> = (
  message: PreparedMessage
) => T;

export interface HellogOptions<T extends PreparedMessage = PreparedMessage> {
  transports?: BaseTransport<T>[];
  additionalContext?: ContextExtension<T>;
}

export class Hellog<T extends PreparedMessage = PreparedMessage> {
  transports: BaseTransport<T>[] = [new Console()];
  additionalContext?: ContextExtension<T>;

  constructor(opts?: HellogOptions<T>) {
    if (opts && opts.transports) {
      this.transports = opts.transports;
    }
    if (opts && opts.additionalContext) {
      this.additionalContext = opts.additionalContext;
    }
  }

  prepareObject(level: LogLevel, out: string): T {
    const timestamp = new Date();
    let context: PreparedMessage = { timestamp, level, message: out };
    if (this.additionalContext) {
      context = this.additionalContext(context);
    }
    return context as T;
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
