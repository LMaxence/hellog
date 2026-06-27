import { format } from 'node:util';
import { serializeError } from './errors.js';
import { HellogLevel, HellogLevelOrder } from './levels.js';
import { HellogMessage } from './messages.js';
import {
  HellogColorizeDefaultPlugin,
  HellogLineBreakDefaultPlugin,
  HellogPlugin,
  HellogPrettyDefaultPlugin,
  HellogStdoutDefaultPlugin,
} from './plugins.js';

interface HellogOptions {
  level?: HellogLevel;
  plugins?: HellogPlugin[];
  meta?: Record<string, unknown> | (() => Record<string, unknown>);
}

/**
 * A simple logger.
 *
 * See {@link HellogOptions} for configuration options.
 *
 * See {@link HellogPlugin} for plugin interface.
 *
 * @example
 * ```typescript
 * import { Hellog } from './hellog.js';
 * const logger = new Hellog({maxLevel: HellogLevel.ERROR});
 *
 * logger.trace('This is a trace message.');
 * logger.info('Hello, world!');
 * ```
 * @example
 * ```typescript
 * import { Hellog } from './hellog.js';
 *
 * const logger = new Hellog({
 *  level: HellogLevel.ERROR,
 *  plugins: [
 *   new HellogLineBreakDefaultPlugin(),
 *   new HellogPrettyDefaultPlugin(),
 *   new HellogColorizeDefaultPlugin(),
 *   new HellogStdoutDefaultPlugin(),
 *  ],
 *  meta: {
 *   service: 'my-service',
 *  },
 * });
 */
export class Hellog {
  /**
   * Returns a fresh default plugin stack. Each logger instance gets its own
   * plugin instances to prevent cross-logger state bleed.
   */
  static defaultPlugins(): HellogPlugin[] {
    return [
      new HellogLineBreakDefaultPlugin(),
      new HellogPrettyDefaultPlugin(),
      new HellogColorizeDefaultPlugin(),
      new HellogStdoutDefaultPlugin(),
    ];
  }

  readonly options: HellogOptions | undefined;
  private readonly _timers = new Map<string, bigint>();

  constructor(options?: HellogOptions) {
    this.options = options;
  }

  get maxLevel(): HellogLevel {
    return this.options?.level ?? HellogLevel.INFO;
  }

  get plugins(): HellogPlugin[] {
    return this.options?.plugins ?? Hellog.defaultPlugins();
  }

  /**
   * Returns true when logs at the given level will be processed.
   * Use to guard expensive argument construction.
   */
  isLevelEnabled(level: HellogLevel): boolean {
    return HellogLevelOrder[level] >= HellogLevelOrder[this.maxLevel];
  }

  /**
   *  Add a plugin to the logger.
   *
   * @param plugin {@link HellogPlugin} The plugin to add to the logger.
   * @returns
   */
  with(plugin: HellogPlugin): Hellog {
    return new Hellog({
      ...this.options,
      plugins: [...this.plugins, plugin],
    });
  }

  /**
   * Create a child logger that inherits level + plugins and merges additional
   * meta on top of the parent's. Supports static or dynamic meta.
   *
   * @example
   * ```ts
   * const reqLog = logger.child({ requestId: 'abc' });
   * reqLog.info('handling request'); // includes requestId in meta
   * ```
   */
  child(meta: Record<string, unknown> | (() => Record<string, unknown>)): Hellog {
    const parentMeta = this.options?.meta;
    return new Hellog({
      ...this.options,
      meta: () => ({
        ...Hellog._resolveMeta(parentMeta),
        ...Hellog._resolveMeta(meta),
      }),
    });
  }

  /**
   * Start a timer for the given label. Call {@link timeEnd} to stop it.
   * Uses `process.hrtime.bigint()` for sub-millisecond monotonic precision.
   */
  time(label: string): void {
    this._timers.set(label, process.hrtime.bigint());
  }

  /**
   * Stop a timer started with {@link time} and log the elapsed duration.
   * Logs at DEBUG level by default.
   *
   * @param label - The label used in {@link time}.
   * @param level - The log level to use (default: DEBUG).
   */
  timeEnd(label: string, level: HellogLevel = HellogLevel.DEBUG): void {
    const start = this._timers.get(label);
    if (start === undefined) return;
    this._timers.delete(label);
    const ms = Number(process.hrtime.bigint() - start) / 1_000_000;
    this._log([`${label}: ${ms.toFixed(3)}ms`], level, { durationMs: ms });
  }

  private static _resolveMeta(
    meta: Record<string, unknown> | (() => Record<string, unknown>) | undefined,
  ): Record<string, unknown> {
    if (!meta) return {};
    if (typeof meta === 'function') return meta();
    return meta;
  }

  private _log(data: unknown[], level: HellogLevel, extraMeta?: Record<string, unknown>): void {
    if (HellogLevelOrder[level] < HellogLevelOrder[this.maxLevel]) return;

    const metaObject: Record<string, unknown> = {
      ...Hellog._resolveMeta(this.options?.meta),
      ...extraMeta,
    };

    const err = data.find((d): d is Error => d instanceof Error);
    const serialized = serializeError(err);

    let messages: HellogMessage[] = [
      {
        content: format(...data),
        timestamp: new Date(),
        level,
        meta: metaObject,
        ...(serialized !== undefined ? { error: serialized } : {}),
      },
    ];

    for (const plugin of this.plugins) {
      messages = plugin.format(messages);
    }

    for (const message of messages) {
      for (const plugin of this.plugins) {
        plugin.write(message);
      }
    }
  }

  /**
   * Log a message at the trace level.
   * @param data The data to log.
   */
  trace(...data: unknown[]): void {
    this._log(data, HellogLevel.TRACE);
  }

  /**
   * Log a message at the debug level.
   * @param data The data to log.
   */
  debug(...data: unknown[]): void {
    this._log(data, HellogLevel.DEBUG);
  }

  /**
   * Log a message at the info level. Similar to {@link info}.
   * @param data The data to log.
   */
  log(...data: unknown[]): void {
    this._log(data, HellogLevel.INFO);
  }

  /**
   * Log a message at the info level. Similar to {@link log}.
   * @param data The data to log.
   */
  info(...data: unknown[]): void {
    this._log(data, HellogLevel.INFO);
  }

  /**
   * Log a message at the success level.
   * @param data The data to log.
   */
  success(...data: unknown[]): void {
    this._log(data, HellogLevel.SUCCESS);
  }

  /**
   * Log a message at the warn level.
   * @param data The data to log.
   */
  warn(...data: unknown[]): void {
    this._log(data, HellogLevel.WARN);
  }

  /**
   * Log a message at the error level.
   * @param data The data to log.
   */
  error(...data: unknown[]): void {
    this._log(data, HellogLevel.ERROR);
  }
}
