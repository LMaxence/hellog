import { HellogLevel } from './levels.js';

export interface HellogMessage {
  content: string;
  timestamp: Date;
  level: HellogLevel;
  meta: Record<string, string>;
}
