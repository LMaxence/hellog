import { PreparedMessage } from './prepared-messages';

export type Formatter = (current: string, context: PreparedMessage) => string;
