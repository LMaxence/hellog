import type { PreparedMessage } from './prepared-messages.js';

export type Formatter<T extends PreparedMessage = PreparedMessage> = (
  current: string,
  context: T
) => string;
export type FromatterGen = (...opts: unknown[]) => Formatter;
