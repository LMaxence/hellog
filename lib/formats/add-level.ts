import type { PreparedMessage } from '../entities/index.js';

export function addLevel(bold = true) {
  return function (currentMessage: string, context: PreparedMessage) {
    const toPad = Math.floor((7 - context.level.length) / 2);
    const levelString =
      context.level.length % 2 === 0
        ? `${' '.repeat(toPad)}${context.level}${' '.repeat(toPad + 1)}`
        : `${' '.repeat(toPad)}${context.level}${' '.repeat(toPad)}`;
    return bold
      ? `\u001B[1m[${levelString}]\u001B[22m ` + currentMessage
      : `[${levelString}] ` + currentMessage;
  };
}
