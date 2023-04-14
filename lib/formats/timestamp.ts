import type { PreparedMessage } from '../entities/index.js';

export function addTimestamp() {
  return (currentMessage: string, context: PreparedMessage) => {
    const ts = context.timestamp
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '');
    return `${ts} ` + currentMessage;
  };
}
