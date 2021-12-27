import { LogLevel, PreparedMessage } from '../entities';

function colorizeByLevel(level: LogLevel, message: string) {
  switch (level) {
    case LogLevel.SUCCESS:
      return '\x1b[32m' + message + '\x1b[0m';
    case LogLevel.WARNING:
      return '\x1b[33m' + message + '\x1b[0m';
    case LogLevel.INFO:
      return message;
    case LogLevel.ERROR:
      return '\x1b[31m' + message + '\x1b[0m';
    case LogLevel.DEBUG:
      return '\x1b[34m' + message + '\x1b[0m';
    default:
      return message;
  }
}

export function colorize() {
  return (currentMessage: string, context: PreparedMessage): string => {
    return colorizeByLevel(context.level, currentMessage);
  };
}
