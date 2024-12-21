import { Hellog } from './hellog.js';
import { HellogLevel } from './levels.js';
import {
  HellogLogFormatDefaultPlugin,
  HellogStdoutDefaultPlugin,
} from './plugins.js';

const logger = new Hellog({
  level: HellogLevel.TRACE,
  plugins: [
    new HellogLogFormatDefaultPlugin(),
    new HellogStdoutDefaultPlugin(),
  ],
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
