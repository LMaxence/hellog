/**
 * Owns named duration timers and their serialization.
 *
 * Uses `process.hrtime.bigint()` for sub-millisecond monotonic precision.
 */
export class HellogTimer {
  private readonly _timers = new Map<string, bigint>();

  /**
   * Start a timer for the given label. Call {@link end} to stop it.
   */
  start(label: string): void {
    this._timers.set(label, process.hrtime.bigint());
  }

  /**
   * Stop a timer started with {@link start} and return the elapsed time in
   * milliseconds, or `undefined` if the label was never started. A timer can
   * only be ended once.
   */
  end(label: string): number | undefined {
    const start = this._timers.get(label);
    if (start === undefined) return undefined;
    this._timers.delete(label);
    return Number(process.hrtime.bigint() - start) / 1_000_000;
  }

  /**
   * Serialize an elapsed duration into the log message form, e.g.
   * `"request: 12.345ms"`.
   */
  static format(label: string, ms: number): string {
    return `${label}: ${ms.toFixed(3)}ms`;
  }
}
