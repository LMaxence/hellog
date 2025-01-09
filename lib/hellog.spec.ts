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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
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
