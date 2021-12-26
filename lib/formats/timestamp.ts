import { PreparedMessage } from '../entities';

export function addTimestamp(currentMessage: string, context: PreparedMessage) {
  const ts = context.timestamp
    .toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '');
  return `${ts} | ` + currentMessage;
}
