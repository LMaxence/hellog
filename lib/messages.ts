import { HellogLevel } from './levels.js';
import { SerializedError } from './errors.js';

export interface HellogMessage {
  content: string;
  timestamp: Date;
  level: HellogLevel;
  meta: Record<string, unknown>;
  error?: SerializedError;
}
