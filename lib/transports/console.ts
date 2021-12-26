import * as util from 'util';
import { LogLevel } from '../levels';
import { BaseTransport } from './base';

export interface ConsoleOptions {
  timestamp?: boolean;
  showLevel?: boolean;
}

export class Console implements BaseTransport {
  timestamp = true;
  showLevel = true;

  constructor(opts?: ConsoleOptions) {
    if (opts) {
      if (opts.timestamp !== undefined) {
        this.timestamp = opts.timestamp;
      }

      if (opts.showLevel !== undefined) {
        this.showLevel = opts.showLevel;
      }
    }
  }

  formatLine(message?: any, level: LogLevel = LogLevel.INFO) {
    let formattedMessage = message;

    if (this.showLevel) {
      const toPad = 7 - level.length;
      formattedMessage =
        `\x1b[1m[${level}]\x1b[22m${' '.repeat(toPad)} | ` + formattedMessage;
    }

    if (this.timestamp) {
      const ts = new Date()
        .toISOString()
        .replace(/T/, ' ') // replace T with a space
        .replace(/\..+/, '');
      formattedMessage = `${ts} | ` + formattedMessage;
    }

    if (level === LogLevel.SUCCESS) {
      formattedMessage = '\x1b[32m' + formattedMessage + '\x1b[0m';
    }

    if (level === LogLevel.DEBUG) {
      formattedMessage = '\x1b[34m' + formattedMessage + '\x1b[0m';
    }

    if (level === LogLevel.ERROR) {
      formattedMessage = '\x1b[31m' + formattedMessage + '\x1b[0m';
    }

    if (level === LogLevel.WARNING) {
      formattedMessage = '\x1b[33m' + formattedMessage + '\x1b[0m';
    }
    return formattedMessage;
  }

  _log(level: LogLevel, message?: any, ...optionalParams: any[]) {
    const lines = util.format(message).split('\n');
    for (const line of lines) {
      const out = this.formatLine(line, level);
      console.log(out, ...optionalParams);
    }
  }

  success(message?: any, ...optionalParams: any[]): void {
    this._log(LogLevel.SUCCESS, message, ...optionalParams);
  }

  debug(message?: any, ...optionalParams: any[]): void {
    this._log(LogLevel.DEBUG, message, ...optionalParams);
  }

  log(message?: any, ...optionalParams: any[]): void {
    this._log(LogLevel.INFO, message, ...optionalParams);
  }

  warn(message?: any, ...optionalParams: any[]): void {
    this._log(LogLevel.WARNING, message, ...optionalParams);
  }

  error(message?: any, ...optionalParams: any[]): void {
    this._log(LogLevel.ERROR, message, ...optionalParams);
  }
}
