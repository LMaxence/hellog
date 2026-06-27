/**
 * Static meta or a factory resolved fresh on every log call.
 */
export type MetaInput = Record<string, unknown> | (() => Record<string, unknown>);

/**
 * Owns meta resolution and parent/child merging.
 *
 * A factory source is re-evaluated on every {@link resolve}, so dynamic meta
 * (e.g. a request id read from async-local storage) stays current.
 */
export class HellogMeta {
  private readonly source: MetaInput | undefined;

  constructor(source: MetaInput | undefined) {
    this.source = source;
  }

  /**
   * Resolve the source to a plain object. Returns `{}` when unset.
   */
  resolve(): Record<string, unknown> {
    if (!this.source) return {};
    return typeof this.source === 'function' ? this.source() : this.source;
  }

  /**
   * Merge per-call extra meta on top of the resolved base meta. Extra keys win.
   */
  merge(extra: Record<string, unknown> | undefined): Record<string, unknown> {
    return { ...this.resolve(), ...extra };
  }

  /**
   * Derive a child meta that layers `extra` over this one. Resolution stays
   * lazy: both this meta and `extra` are re-resolved each time the child is
   * resolved, and child keys win over parent keys.
   */
  child(extra: MetaInput): HellogMeta {
    return new HellogMeta(() => ({ ...this.resolve(), ...new HellogMeta(extra).resolve() }));
  }
}
