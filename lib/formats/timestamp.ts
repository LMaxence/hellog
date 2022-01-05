import { PreparedMessage } from '../entities';

export function addTimestamp() {
  return (currentMessage: string, context: PreparedMessage) => {
    const ts = context.timestamp
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '');
    return `${ts} ` + currentMessage;
  };
}
