import { Hellog } from './hellog.js';

const logger = new Hellog();

logger.info('Hello, world!');
logger.info('This is an info message.');
logger.warn('This is a warning message.');
logger.error('This is an error message.');

// Accepts any input
logger.info('Logging a number:', 123);
logger.info('Logging an object:', { key: 'value' });

// Outputs
logger.info('Logging an array:', [1, 2, 3]);
