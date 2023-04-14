import { LogLevel } from './levels.js';

export interface PreparedMessage {
  message: string;
  level: LogLevel;
  timestamp: Date;
}
