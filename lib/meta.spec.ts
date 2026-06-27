import assert from 'node:assert';
import { describe, it } from 'node:test';
import { HellogMeta } from './meta.js';

describe(HellogMeta.name, () => {
  it('should resolve undefined source to an empty object', () => {
    assert.deepStrictEqual(new HellogMeta(undefined).resolve(), {});
  });

  it('should resolve a static object source', () => {
    assert.deepStrictEqual(new HellogMeta({ service: 'api' }).resolve(), { service: 'api' });
  });

  it('should resolve a factory source freshly on every call', () => {
    let counter = 0;
    const meta = new HellogMeta(() => ({ seq: ++counter }));
    assert.deepStrictEqual(meta.resolve(), { seq: 1 });
    assert.deepStrictEqual(meta.resolve(), { seq: 2 });
  });

  it('should merge extra meta on top of the base, extra winning', () => {
    const meta = new HellogMeta({ service: 'api', env: 'prod' });
    assert.deepStrictEqual(meta.merge({ env: 'staging', requestId: '1' }), {
      service: 'api',
      env: 'staging',
      requestId: '1',
    });
  });

  it('should merge with undefined extra unchanged', () => {
    assert.deepStrictEqual(new HellogMeta({ service: 'api' }).merge(undefined), { service: 'api' });
  });

  it('should layer child meta over parent, child winning', () => {
    const parent = new HellogMeta({ service: 'api', env: 'prod' });
    const child = parent.child({ env: 'staging', requestId: '1' });
    assert.deepStrictEqual(child.resolve(), {
      service: 'api',
      env: 'staging',
      requestId: '1',
    });
  });

  it('should re-evaluate dynamic parent and child sources lazily', () => {
    let parentSeq = 0;
    let childSeq = 0;
    const parent = new HellogMeta(() => ({ parentSeq: ++parentSeq }));
    const child = parent.child(() => ({ childSeq: ++childSeq }));
    assert.deepStrictEqual(child.resolve(), { parentSeq: 1, childSeq: 1 });
    assert.deepStrictEqual(child.resolve(), { parentSeq: 2, childSeq: 2 });
  });

  it('should nest children arbitrarily', () => {
    const root = new HellogMeta({ a: 1 });
    const nested = root.child({ b: 2 }).child({ c: 3 });
    assert.deepStrictEqual(nested.resolve(), { a: 1, b: 2, c: 3 });
  });
});
