import type { PreparedMessage } from '../entities/index.js';
import { BaseTransport, type BaseOptions } from './base.js';

export class Console<
  T extends PreparedMessage = PreparedMessage
> extends BaseTransport<T> {
  constructor(opts?: BaseOptions<T>) {
    super(opts);
  }
}
