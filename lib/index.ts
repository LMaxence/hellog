export * from './entities';
export * as formats from './formats';
export { Hellog } from './logger';
export * as transports from './transports';

import { Hellog } from './logger';

// interface ExtendedContext extends PreparedMessage {
//   id: number;
// }

// const displayId: Formatter<ExtendedContext> = (
//   current: string,
//   context: ExtendedContext
// ) => {
//   return `${context.id} | ${current}`;
// };

// const csle = new transports.Console<ExtendedContext>({
//   formatters: [
//     formatters.addLevel(true),
//     formatters.addTimestamp(),
//     formatters.colorize(),
//     // displayId,
//   ],
// });

// const logger = new Hellog<ExtendedContext>({
//   transports: [csle],
//   additionalContext: (message) => ({
//     ...message,
//     id: Math.floor(Math.random() * 1000),
//   }),
// });

// // logger.success(new Error('test'));
// // logger.success({ foo: { foo: { foo: { foo: { foo: 'bar' } } } } });
// // logger.success('hello', 'hello', 'hello 2');
// const obj = { foo: { foo: { foo: { foo: { foo: 'bar' } } } } };

// logger.log(obj);
// logger.success('Hello world !');
// logger.debug(obj);
// logger.error(new Error('test'));
// logger.warn(new Error('test'));

const logger = new Hellog();

const obj = {
  foo: {
    foo: {
      foo: {
        foo: {
          foo: 'bar',
        },
      },
    },
  },
};

logger.log(obj);
logger.success('Hello world !');
logger.debug(obj);
logger.error(new Error('test'));
logger.warn(new Error('test'));
