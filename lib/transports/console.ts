import { PreparedMessage } from '../entities';
import { BaseOptions, BaseTransport } from './base';

export class Console<
  T extends PreparedMessage = PreparedMessage
> extends BaseTransport<T> {
  timestamp = true;
  showLevel = true;

  constructor(opts?: BaseOptions) {
    super(opts);
  }

  prepareTransport(log: T): T[] {
    const lines = log.message.split('\n');
    const messages: T[] = [];
    for (const line of lines) {
      messages.push({ ...log, message: line });
    }
    return messages;
  }
}
