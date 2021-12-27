import { PreparedMessage } from './prepared-messages';

export type Formatter<T extends PreparedMessage = PreparedMessage> = (
  current: string,
  context: T
) => string;
export type FromatterGen = (...opts: any[]) => Formatter;
