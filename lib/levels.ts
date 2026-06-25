export const HellogLevel = {
  TRACE: 'TRACE',
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  WARN: 'WARN',
  ERROR: 'ERROR',
} as const;

export type HellogLevel = (typeof HellogLevel)[keyof typeof HellogLevel];

export const HellogLevelOrder = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  SUCCESS: 3,
  WARN: 4,
  ERROR: 5,
} as const;
