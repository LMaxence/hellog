import assert from 'node:assert';
import { describe, it } from 'node:test';
import { HellogTimer } from './timer.js';

describe(HellogTimer.name, () => {
  it('should return a non-negative elapsed time for a started timer', () => {
    const timer = new HellogTimer();
    timer.start('req');
    const ms = timer.end('req');
    assert.strictEqual(typeof ms, 'number');
    assert.ok((ms as number) >= 0);
  });

  it('should return undefined when ending an unknown label', () => {
    const timer = new HellogTimer();
    assert.strictEqual(timer.end('never-started'), undefined);
  });

  it('should only allow a timer to be ended once', () => {
    const timer = new HellogTimer();
    timer.start('req');
    assert.strictEqual(typeof timer.end('req'), 'number');
    assert.strictEqual(timer.end('req'), undefined);
  });

  it('should track multiple labels independently', () => {
    const timer = new HellogTimer();
    timer.start('a');
    timer.start('b');
    assert.strictEqual(typeof timer.end('a'), 'number');
    assert.strictEqual(typeof timer.end('b'), 'number');
  });

  it('should serialize a duration into the log message form', () => {
    assert.strictEqual(HellogTimer.format('req', 12.3456), 'req: 12.346ms');
    assert.strictEqual(HellogTimer.format('boot', 0), 'boot: 0.000ms');
  });
});
