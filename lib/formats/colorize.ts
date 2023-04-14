import { LogLevel, type PreparedMessage } from '../entities/index.js';

function colorizeByLevel(level: LogLevel, message: string) {
  switch (level) {
    case LogLevel.SUCCESS: {
      return '\u001B[32m' + message + '\u001B[0m';
    }
    case LogLevel.WARNING: {
      return '\u001B[33m' + message + '\u001B[0m';
    }
    case LogLevel.INFO: {
      return message;
    }
    case LogLevel.ERROR: {
      return '\u001B[31m' + message + '\u001B[0m';
    }
    case LogLevel.DEBUG: {
      return '\u001B[34m' + message + '\u001B[0m';
    }
    default: {
      return message;
    }
  }
}

export function colorize() {
  return (currentMessage: string, context: PreparedMessage): string => {
    return colorizeByLevel(context.level, currentMessage);
  };
}
