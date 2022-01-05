import { PreparedMessage } from '../entities';

export function addLevel(bold = true) {
  return function (currentMessage: string, context: PreparedMessage) {
    const toPad = Math.floor((7 - context.level.length) / 2);
    const levelString =
      context.level.length % 2 === 0
        ? `${' '.repeat(toPad)}${context.level}${' '.repeat(toPad + 1)}`
        : `${' '.repeat(toPad)}${context.level}${' '.repeat(toPad)}`;
    return bold
      ? `\x1b[1m[${levelString}]\x1b[22m ` + currentMessage
      : `[${levelString}] ` + currentMessage;
  };
}
