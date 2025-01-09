import { format } from 'node:util';
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
  meta?: Record<string, string> | (() => Record<string, string>);
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
   * Default plugins used by the logger when none are provided.
   */
  static DefaultPlugins = [
    new HellogLineBreakDefaultPlugin(),
    new HellogPrettyDefaultPlugin(),
    new HellogColorizeDefaultPlugin(),
    new HellogStdoutDefaultPlugin(),
  ];

  constructor(readonly options?: HellogOptions) {}

  get maxLevel(): HellogLevel {
    return this.options?.level ?? HellogLevel.INFO;
  }

  get plugins(): HellogPlugin[] {
    return this.options?.plugins ?? Hellog.DefaultPlugins;
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

  private _log(data: unknown[], level: HellogLevel): void {
    if (HellogLevelOrder[level] < HellogLevelOrder[this.maxLevel]) return;

    let metaObject: Record<string, string>;
    const meta = this.options?.meta;
    if (meta && typeof meta === 'function') {
      metaObject = meta();
    } else {
      metaObject = meta ?? {};
    }

    let messages: HellogMessage[] = [
      {
        content: format(...data),
        timestamp: new Date(),
        level,
        meta: metaObject,
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

  trace(...data: unknown[]): void {
    this._log(data, HellogLevel.TRACE);
  }

  debug(...data: unknown[]): void {
    this._log(data, HellogLevel.DEBUG);
  }

  info(...data: unknown[]): void {
    this._log(data, HellogLevel.INFO);
  }

  warn(...data: unknown[]): void {
    this._log(data, HellogLevel.WARN);
  }

  error(...data: unknown[]): void {
    this._log(data, HellogLevel.ERROR);
  }
}
