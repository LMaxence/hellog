import assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import { Hellog } from './hellog.js';
import { HellogLevel } from './levels.js';
import { HellogMessage } from './messages.js';
import {
  HellogColorizeDefaultPlugin,
  HellogLineBreakDefaultPlugin,
  HellogPlugin,
  HellogPrettyDefaultPlugin,
  HellogStdoutDefaultPlugin,
} from './plugins.js';
import { SerializedError } from './errors.js';

class StoredLogsTransportPlugin extends HellogPlugin {
  readonly logs: HellogMessage[] = [];

  override write(_message: HellogMessage): void {
    this.logs.push(_message);
  }
}

describe(Hellog.name, () => {
  it('should have a default max level', () => {
    const logger = new Hellog();
    assert.strictEqual(logger.maxLevel, HellogLevel.INFO);
  });

  it('should have a custom max level', () => {
    const logger = new Hellog({ level: HellogLevel.ERROR });
    assert.strictEqual(logger.maxLevel, HellogLevel.ERROR);
  });

  it('should log with custom meta if provided', () => {
    const store = new StoredLogsTransportPlugin();
    const logger = new Hellog({ meta: { foo: 'bar' }, plugins: [store] });

    logger.info('Hello, world!');
    assert.strictEqual(store.logs.length, 1);
    assert.strictEqual(store.logs[0]?.meta['foo'], 'bar');
    assert.strictEqual(store.logs[0]?.content, 'Hello, world!');
  });

  it('should log with custom dynamic meta if provided', () => {
    const store = new StoredLogsTransportPlugin();
    const logger = new Hellog({
      meta: () => ({ foo: 'bar' }),
      plugins: [store],
    });

    logger.info('Hello, world!');
    assert.strictEqual(store.logs.length, 1);
    assert.strictEqual(store.logs[0]?.meta['foo'], 'bar');
    assert.strictEqual(store.logs[0]?.content, 'Hello, world!');
  });

  it('should have default plugins', () => {
    const logger = new Hellog();
    assert.strictEqual(logger.plugins.length, 4);

    assert(logger.plugins[0] instanceof HellogLineBreakDefaultPlugin);
    assert(logger.plugins[1] instanceof HellogPrettyDefaultPlugin);
    assert(logger.plugins[2] instanceof HellogColorizeDefaultPlugin);
    assert(logger.plugins[3] instanceof HellogStdoutDefaultPlugin);
  });

  it('should have custom plugins', () => {
    const logger = new Hellog({
      plugins: [],
    });
    assert.strictEqual(logger.plugins.length, 0);
  });

  it('should call the plugins', () => {
    const logger = new Hellog({
      plugins: [new HellogLineBreakDefaultPlugin()],
    });

    for (const plugin of logger.plugins) {
      const formatMock = mock.fn((messages: HellogMessage[]) => messages);
      const writeMock = mock.fn((_message: HellogMessage) => {});

      plugin.format = formatMock;
      plugin.write = writeMock;

      logger.error('Hello, world!');
      assert.strictEqual(formatMock.mock.calls.length, 1);
      assert.strictEqual(writeMock.mock.calls.length, 1);
    }
  });

  it('should not log below the max level', () => {
    const plugin = new HellogLineBreakDefaultPlugin();
    const logger = new Hellog({
      level: HellogLevel.ERROR,
      plugins: [plugin],
    });

    const formatMock = mock.fn((messages: HellogMessage[]) => messages);
    plugin.format = formatMock;

    logger.trace('Hello, world!');
    logger.debug('Hello, world!');
    logger.info('Hello, world!');
    logger.warn('Hello, world!');
    logger.error('Hello, world!');

    assert.strictEqual(formatMock.mock.calls.length, 1);
  });
});

describe('Hellog.child', () => {
  it('should merge static parent + child meta', () => {
    const store = new StoredLogsTransportPlugin();
    const parent = new Hellog({ meta: { service: 'api' }, plugins: [store] });
    const child = parent.child({ requestId: '123' });
    child.info('hello');
    assert.strictEqual(store.logs[0]?.meta['service'], 'api');
    assert.strictEqual(store.logs[0]?.meta['requestId'], '123');
  });

  it('should not affect parent meta', () => {
    const store = new StoredLogsTransportPlugin();
    const parent = new Hellog({ meta: { service: 'api' }, plugins: [store] });
    parent.child({ requestId: '123' }).info('child log');
    parent.info('parent log');
    assert.strictEqual(store.logs[0]?.meta['requestId'], '123');
    assert.strictEqual(store.logs[1]?.meta['requestId'], undefined);
  });

  it('should support dynamic meta in child', () => {
    const store = new StoredLogsTransportPlugin();
    let counter = 0;
    const parent = new Hellog({ meta: { service: 'api' }, plugins: [store] });
    const child = parent.child(() => ({ seq: String(++counter) }));
    child.info('first');
    child.info('second');
    assert.strictEqual(store.logs[0]?.meta['seq'], '1');
    assert.strictEqual(store.logs[1]?.meta['seq'], '2');
  });

  it('should nest children', () => {
    const store = new StoredLogsTransportPlugin();
    const root = new Hellog({ meta: { a: '1' }, plugins: [store] });
    root.child({ b: '2' }).child({ c: '3' }).info('nested');
    assert.strictEqual(store.logs[0]?.meta['a'], '1');
    assert.strictEqual(store.logs[0]?.meta['b'], '2');
    assert.strictEqual(store.logs[0]?.meta['c'], '3');
  });
});

describe('Hellog.isLevelEnabled', () => {
  it('should return true for levels at or above maxLevel', () => {
    const logger = new Hellog({ level: HellogLevel.WARN });
    assert.strictEqual(logger.isLevelEnabled(HellogLevel.WARN), true);
    assert.strictEqual(logger.isLevelEnabled(HellogLevel.ERROR), true);
  });

  it('should return false for levels below maxLevel', () => {
    const logger = new Hellog({ level: HellogLevel.WARN });
    assert.strictEqual(logger.isLevelEnabled(HellogLevel.DEBUG), false);
    assert.strictEqual(logger.isLevelEnabled(HellogLevel.INFO), false);
  });
});

describe('Hellog.time / timeEnd', () => {
  it('should log a positive durationMs and clean up the timer', () => {
    const store = new StoredLogsTransportPlugin();
    const logger = new Hellog({ level: HellogLevel.DEBUG, plugins: [store] });
    logger.time('op');
    logger.timeEnd('op');
    assert.strictEqual(store.logs.length, 1);
    const durationMs = store.logs[0]?.meta['durationMs'];
    assert.ok(typeof durationMs === 'number' && durationMs >= 0);
    assert.ok(store.logs[0]?.content.includes('op:'));
  });

  it('should do nothing for unknown label', () => {
    const store = new StoredLogsTransportPlugin();
    const logger = new Hellog({ level: HellogLevel.DEBUG, plugins: [store] });
    logger.timeEnd('nonexistent');
    assert.strictEqual(store.logs.length, 0);
  });
});

describe('Hellog structured meta', () => {
  it('should accept non-string meta values', () => {
    const store = new StoredLogsTransportPlugin();
    const logger = new Hellog({ meta: { port: 8080, debug: true }, plugins: [store] });
    logger.info('started');
    assert.strictEqual(store.logs[0]?.meta['port'], 8080);
    assert.strictEqual(store.logs[0]?.meta['debug'], true);
  });
});

describe('Hellog Error serialization', () => {
  it('should attach serialized error to message when Error is logged', () => {
    const store = new StoredLogsTransportPlugin();
    const logger = new Hellog({ plugins: [store] });
    const err = new TypeError('bad input');
    logger.error('caught', err);
    const msg = store.logs[0];
    assert.ok(msg);
    assert.ok(msg.error !== undefined);
    const e = msg.error as SerializedError;
    assert.strictEqual(e.name, 'TypeError');
    assert.strictEqual(e.message, 'bad input');
    assert.ok(typeof e.stack === 'string');
  });

  it('should not set error field for non-Error arguments', () => {
    const store = new StoredLogsTransportPlugin();
    const logger = new Hellog({ plugins: [store] });
    logger.info('plain message');
    assert.strictEqual(store.logs[0]?.error, undefined);
  });
});
