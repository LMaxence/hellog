import { PreparedMessage } from '../entities';
import { BaseOptions, BaseTransport } from './base';

export class Console<
  T extends PreparedMessage = PreparedMessage
> extends BaseTransport<T> {
  constructor(opts?: BaseOptions<T>) {
    super(opts);
  }
}
