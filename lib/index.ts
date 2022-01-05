export * from './entities';
export * as formats from './formats';
export { Hellog } from './logger';
export * as transports from './transports';

import { Hellog } from './logger';
const logger = new Hellog();

logger.error(new Error('test'));
logger.log(new Error('test'));
logger.debug(new Error('test'));
logger.success(new Error('test'));
logger.warn(new Error('test'));
