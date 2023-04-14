import type { Formatter, PreparedMessage } from '../entities/index.js';
import { addLevel } from '../formats/add-level.js';
import { colorize } from '../formats/colorize.js';
import { addTimestamp } from '../formats/timestamp.js';

export interface BaseOptions<T extends PreparedMessage = PreparedMessage> {
  formatters?: Formatter<T>[];
}

export abstract class BaseTransport<
  T extends PreparedMessage = PreparedMessage
> {
  formatters: Formatter<T>[] = [addLevel(), addTimestamp(), colorize()];

  constructor(opts?: BaseOptions<T>) {
    if (opts && opts.formatters) {
      this.formatters = opts.formatters;
    }
  }

  prepareTransport(log: T): T[] {
    return log.message.split('\n').map((message) => ({ ...log, message }));
  }

  format(preparedLine: T): string {
    let formattedMessage = preparedLine.message;
    for (const formatter of this.formatters) {
      formattedMessage = formatter(formattedMessage, preparedLine);
    }
    return formattedMessage;
  }

  transport(log: string): void {
    console.log(log);
  }

  log(log: T) {
    const messages = this.prepareTransport(log);
    const fMessages = messages.map((message) => this.format(message));
    for (const fMessage of fMessages) this.transport(fMessage);
  }
}
