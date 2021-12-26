import fs from 'fs';
import * as util from 'util';
import { LogLevel } from '../levels';
import { BaseTransport } from './base';

type OutType = 'json' | 'string';

export interface FileOptions {
  outType?: OutType;
  filename?: string;
}

export class FileTransport implements BaseTransport {
  outType: OutType = 'json';
  filename = 'output.log';
  stream: fs.WriteStream;

  constructor(opts?: FileOptions) {
    if (opts?.outType !== undefined) {
      this.outType = opts.outType;
    }

    if (opts?.filename !== undefined) {
      this.filename = opts.filename;
    }

    this.stream = fs.createWriteStream(this.filename, { flags: 'a' });
  }

  formatLine(message?: any, level: LogLevel = LogLevel.INFO) {
    let formattedMessage = message;

    const toPad = 7 - level.length;
    formattedMessage = `[${level}]${' '.repeat(toPad)} | ` + formattedMessage;

    const ts = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    formattedMessage = `${ts} | ` + formattedMessage;

    return formattedMessage;
  }

  _write(level: LogLevel, message?: any) {
    const out = util.format(message);
    if (this.outType === 'json') {
      const outObjectString = JSON.stringify({
        timestamp: new Date().toISOString(),
        message: out,
        level,
      });
      this.stream.write(`${outObjectString}\n`);
    } else {
      for (const line of out.split('\n')) {
        this.stream.write(`${this.formatLine(line, level)}\n`);
      }
    }
  }

  success(message?: any): void {
    this._write(LogLevel.SUCCESS, message);
  }

  debug(message?: any): void {
    this._write(LogLevel.DEBUG, message);
  }

  log(message?: any): void {
    this._write(LogLevel.INFO, message);
  }

  warn(message?: any): void {
    this._write(LogLevel.WARNING, message);
  }

  error(message?: any): void {
    this._write(LogLevel.ERROR, message);
  }
}
