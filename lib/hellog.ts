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
  meta?: Record<string, string>;
}

export class Hellog {
  static DefaultPlugins = [
    new HellogLineBreakDefaultPlugin(),
    new HellogPrettyDefaultPlugin(),
    new HellogColorizeDefaultPlugin(),
    new HellogStdoutDefaultPlugin(),
  ];

  constructor(private readonly options?: HellogOptions) {}

  get maxLevel(): HellogLevel {
    return this.options?.level ?? HellogLevel.INFO;
  }

  get plugins(): HellogPlugin[] {
    return this.options?.plugins ?? Hellog.DefaultPlugins;
  }

  get meta(): Record<string, string> {
    return this.options?.meta ?? {};
  }

  private _log(data: unknown, level: HellogLevel): void {
    if (HellogLevelOrder[level] < HellogLevelOrder[this.maxLevel]) return;

    let messages: HellogMessage[] = [
      {
        content: format(data),
        timestamp: new Date(),
        level,
        meta: this.meta,
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

  trace(data: unknown): void {
    this._log(data, HellogLevel.TRACE);
  }

  debug(data: unknown): void {
    this._log(data, HellogLevel.DEBUG);
  }

  info(data: unknown): void {
    this._log(data, HellogLevel.INFO);
  }

  warn(data: unknown): void {
    this._log(data, HellogLevel.WARN);
  }

  error(data: unknown): void {
    this._log(data, HellogLevel.ERROR);
  }
}
