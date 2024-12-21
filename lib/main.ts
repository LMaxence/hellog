import { Hellog } from './hellog.js';
import { HellogLevel } from './levels.js';

const logger = new Hellog({
  level: HellogLevel.TRACE,
  meta: {
    service: 'hellog',
  },
});

logger.error('Hello, world!');
logger.trace('Hello, world!');
logger.error(
  JSON.stringify(
    {
      hello: 'world 2',
      foo: 'bar',
      some: {
        nested: {
          data: 'here',
        },
      },
    },
    null,
    2,
  ),
);
logger.info('Hello, world!');
logger.warn('Hello, world!');

logger.error(new Error('Hello, world!'));
