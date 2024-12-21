import assert from 'node:assert';
import { describe, it } from 'node:test';
import { HellogLevel } from './levels.js';
import {
  HellogColorizeDefaultPlugin,
  HellogJsonDefaultPlugin,
  HellogLineBreakDefaultPlugin,
  HellogLogFormatDefaultPlugin,
  HellogPrettyDefaultPlugin,
} from './plugins.js';

describe(HellogLogFormatDefaultPlugin.name, () => {
  it("should format a message's content into a log-formatted string", () => {
    const plugin = new HellogLogFormatDefaultPlugin();
    const source = {
      level: HellogLevel.INFO,
      meta: { foo: 'bar' },
      timestamp: new Date('2021-01-01T00:00:00Z'),
      content: 'Hello, world!',
    };
    const result = plugin.format([source]);

    const message = result.at(0);
    assert.notEqual(message, undefined);

    assert.strictEqual(message?.level, source.level);
    assert.equal(message.meta['foo'], source.meta.foo);
    assert.strictEqual(
      message.timestamp.toISOString(),
      source.timestamp.toISOString(),
    );
    assert.strictEqual(
      message.content,
      'timestamp="2021-01-01T00:00:00.000Z" level="INFO" message="Hello, world!" foo="bar"',
    );
  });

  it("should format a message's content into a JSON object, handling multiple lines", () => {
    const plugin = new HellogLogFormatDefaultPlugin();
    const source = {
      level: HellogLevel.INFO,
      meta: { foo: 'bar' },
      timestamp: new Date('2021-01-01T00:00:00Z'),
      content: 'Hello, world! \nThis is a new line.',
    };
    const result = plugin.format([source]);

    const message = result.at(0);
    assert.notEqual(message, undefined);

    assert.strictEqual(message?.level, source.level);
    assert.equal(message.meta['foo'], source.meta.foo);
    assert.strictEqual(
      message.timestamp.toISOString(),
      source.timestamp.toISOString(),
    );
    assert.strictEqual(
      message.content,
      'timestamp="2021-01-01T00:00:00.000Z" ' +
        'level="INFO" ' +
        'message="Hello, world! \nThis is a new line." ' +
        'foo="bar"',
    );
  });
});

describe(HellogJsonDefaultPlugin.name, () => {
  it("should format a message's content into a JSON object", () => {
    const plugin = new HellogJsonDefaultPlugin();
    const source = {
      level: HellogLevel.INFO,
      meta: { foo: 'bar' },
      timestamp: new Date('2021-01-01T00:00:00Z'),
      content: 'Hello, world!',
    };
    const result = plugin.format([source]);

    const message = result.at(0);
    assert.notEqual(message, undefined);

    assert.strictEqual(message?.level, source.level);
    assert.equal(message.meta['foo'], source.meta.foo);
    assert.strictEqual(
      message.timestamp.toISOString(),
      source.timestamp.toISOString(),
    );
    assert.strictEqual(
      message.content,
      '{"level":"INFO","timestamp":"2021-01-01T00:00:00.000Z","content":"Hello, world!","foo":"bar"}',
    );
  });

  it("should format a message's content into a JSON object, handling multiple lines", () => {
    const plugin = new HellogJsonDefaultPlugin();
    const source = {
      level: HellogLevel.INFO,
      meta: { foo: 'bar' },
      timestamp: new Date('2021-01-01T00:00:00Z'),
      content: 'Hello, world! \nThis is a new line.',
    };
    const result = plugin.format([source]);

    const message = result.at(0);
    assert.notEqual(message, undefined);

    assert.strictEqual(message?.level, source.level);
    assert.equal(message.meta['foo'], source.meta.foo);
    assert.strictEqual(
      message.timestamp.toISOString(),
      source.timestamp.toISOString(),
    );
    assert.strictEqual(
      message.content,
      '{"level":"INFO","timestamp":"2021-01-01T00:00:00.000Z","content":"Hello, world! \\nThis is a new line.","foo":"bar"}',
    );
  });
});

describe(HellogColorizeDefaultPlugin.name, () => {
  it('should not do anything for INFO level', () => {
    const plugin = new HellogColorizeDefaultPlugin();
    const source = {
      level: HellogLevel.INFO,
      meta: { foo: 'bar' },
      timestamp: new Date('2021-01-01T00:00:00Z'),
      content: 'Hello, world!',
    };
    const result = plugin.format([source]);

    const message = result.at(0);
    assert.notEqual(message, undefined);

    assert.strictEqual(message?.level, source.level);
    assert.equal(message.meta['foo'], source.meta.foo);
    assert.strictEqual(
      message.timestamp.toISOString(),
      source.timestamp.toISOString(),
    );
    assert.strictEqual(message.content, source.content);
  });

  it("should apply the correct color code depending on the message's level", () => {
    const plugin = new HellogColorizeDefaultPlugin();
    const baseSource = {
      meta: { foo: 'bar' },
      timestamp: new Date('2021-01-01T00:00:00Z'),
      content: 'Hello, world!',
    };

    const sources = [
      { level: HellogLevel.TRACE, ...baseSource },
      { level: HellogLevel.DEBUG, ...baseSource },
      { level: HellogLevel.WARN, ...baseSource },
      { level: HellogLevel.ERROR, ...baseSource },
    ];

    const results = plugin.format(sources);

    for (const [index, source] of sources.entries()) {
      const message = results.at(index);
      assert.notEqual(message, undefined);

      assert.strictEqual(message?.level, source.level);
      assert.equal(message.meta['foo'], source.meta.foo);
      assert.strictEqual(
        message.timestamp.toISOString(),
        source.timestamp.toISOString(),
      );

      switch (source.level) {
        case HellogLevel.TRACE:
          assert.strictEqual(message.content, '\x1b[37mHello, world!\x1b[0m');
          break;
        case HellogLevel.DEBUG:
          assert.strictEqual(message.content, '\x1b[36mHello, world!\x1b[0m');
          break;
        case HellogLevel.WARN:
          assert.strictEqual(message.content, '\x1b[33mHello, world!\x1b[0m');
          break;
        case HellogLevel.ERROR:
          assert.strictEqual(message.content, '\x1b[31mHello, world!\x1b[0m');
          break;
      }
    }
  });
});

describe(HellogPrettyDefaultPlugin.name, () => {
  it('should format a message into a pretty string', () => {
    const plugin = new HellogPrettyDefaultPlugin();
    const source = {
      level: HellogLevel.INFO,
      meta: { foo: 'bar' },
      timestamp: new Date('2021-01-01T00:00:00Z'),
      content: 'Hello, world!',
    };
    const result = plugin.format([source]);

    const message = result.at(0);
    assert.notEqual(message, undefined);

    assert.strictEqual(message?.level, source.level);
    assert.equal(message.meta['foo'], source.meta.foo);
    assert.strictEqual(
      message.timestamp.toISOString(),
      source.timestamp.toISOString(),
    );
    assert.strictEqual(
      message.content,
      '2021-01-01T00:00:00.000Z [INFO] Hello, world!',
    );
  });
});

describe(HellogLineBreakDefaultPlugin.name, () => {
  it('should convert a message with multiple lines into multiple messages', () => {
    const plugin = new HellogLineBreakDefaultPlugin();
    const source = {
      level: HellogLevel.INFO,
      meta: { foo: 'bar' },
      timestamp: new Date('2021-01-01T00:00:00Z'),
      content: 'Hello, world!\nThis is a new line.',
    };
    const result = plugin.format([source]);

    assert.strictEqual(result.length, 2);

    const message1 = result.at(0);
    assert.notEqual(message1, undefined);

    assert.strictEqual(message1?.level, source.level);
    assert.equal(message1.meta['foo'], source.meta.foo);
    assert.strictEqual(
      message1.timestamp.toISOString(),
      source.timestamp.toISOString(),
    );
    assert.strictEqual(message1.content, 'Hello, world!');

    const message2 = result.at(1);
    assert.notEqual(message2, undefined);

    assert.strictEqual(message2?.level, source.level);
    assert.equal(message2.meta['foo'], source.meta.foo);
    assert.strictEqual(
      message2.timestamp.toISOString(),
      source.timestamp.toISOString(),
    );
    assert.strictEqual(message2.content, 'This is a new line.');
  });
});
