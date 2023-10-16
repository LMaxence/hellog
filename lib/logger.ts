import * as util from 'node:util';
import type { PreparedMessage } from './entities/index.js';
import { LogLevel } from './entities/levels.js';
import { BaseTransport } from './transports/base.js';
import { Console } from './transports/console.js';

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

  _log(level: LogLevel, message?: unknown, ...utilFormatParams: unknown[]) {
    const out = util.format(message, ...utilFormatParams);
    const logObject = this.prepareObject(level, out);
    for (const transport of this.transports) {
      transport.log(logObject);
    }
  }

  log(message?: unknown, ...optionalParams: unknown[]): void {
    this._log(LogLevel.INFO, message, ...optionalParams);
  }

  debug(message?: unknown, ...optionalParams: unknown[]): void {
    this._log(LogLevel.DEBUG, message, ...optionalParams);
  }

  success(message?: unknown, ...optionalParams: unknown[]): void {
    this._log(LogLevel.SUCCESS, message, ...optionalParams);
  }

  warn(message?: unknown, ...optionalParams: unknown[]): void {
    this._log(LogLevel.WARNING, message, ...optionalParams);
  }

  trace(message?: unknown, ...optionalParams: unknown[]): void {
    this._log(LogLevel.TRACE, message, ...optionalParams);
  }

  error(message?: unknown, ...optionalParams: unknown[]): void {
    this._log(LogLevel.ERROR, message, ...optionalParams);
  }
}
