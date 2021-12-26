import { LogLevel } from './levels';

export interface PreparedMessage {
  message: string;
  level: LogLevel;
  timestamp: Date;
}
