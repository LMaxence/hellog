import { PreparedMessage } from '../entities';

export function addLevel(bold = true) {
  return function (currentMessage: string, context: PreparedMessage) {
    const toPad = 7 - context.level.length;
    return bold
      ? `\x1b[1m[${context.level}]\x1b[22m${' '.repeat(toPad)} | ` +
          currentMessage
      : `[${context.level}]${' '.repeat(toPad)} | ` + currentMessage;
  };
}
