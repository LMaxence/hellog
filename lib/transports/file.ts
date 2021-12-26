import fs from 'fs';
import { PreparedMessage } from '../entities';
import { BaseOptions, BaseTransport } from './base';

type OutType = 'json' | 'string';

export interface FileOptions extends BaseOptions {
  outType?: OutType;
  filename?: string;
}

export class FileTransport<
  T extends PreparedMessage = PreparedMessage
> extends BaseTransport<T> {
  outType: OutType = 'json';
  filename = 'output.log';
  stream: fs.WriteStream;

  constructor(opts?: FileOptions) {
    // By default, the file transport does not format the message and logs 'as is'
    super({ formatters: [], ...opts });
    if (opts?.outType !== undefined) {
      this.outType = opts.outType;
    }

    if (opts?.filename !== undefined) {
      this.filename = opts.filename;
    }

    this.stream = fs.createWriteStream(this.filename, { flags: 'a' });
  }

  prepareTransport(log: T): T[] {
    if (this.outType === 'json') {
      return [log];
    } else {
      return log.message.split('\n').map((message) => ({ ...log, message }));
    }
  }

  format(preparedLine: T): string {
    let formattedMessage = preparedLine.message;
    for (const formatter of this.formatters) {
      formattedMessage = formatter(formattedMessage, preparedLine);
    }
    return this.outType === 'json'
      ? JSON.stringify({ ...preparedLine, message: formattedMessage })
      : formattedMessage;
  }

  transport(log: string): void {
    this.stream.write(`${log}\n`);
  }
}
