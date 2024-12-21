import { HellogLevel } from './levels.js';
import { HellogMessage } from './messages.js';

export abstract class HellogPlugin {
  format(message: HellogMessage[]): HellogMessage[] {
    return message;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  write(_message: HellogMessage): void {}
}

export class HellogLineBreakDefaultPlugin extends HellogPlugin {
  override format(messages: HellogMessage[]): HellogMessage[] {
    const formatted: HellogMessage[] = [];

    for (const message of messages) {
      for (const line of message.content.split('\n')) {
        formatted.push({ ...message, content: line });
      }
    }

    return formatted;
  }
}

export class HellogStdoutDefaultPlugin extends HellogPlugin {
  override write(message: HellogMessage): void {
    const content = message.content + '\n';
    if (message.level === HellogLevel.ERROR) {
      process.stderr.write(content);
      return;
    }
    process.stdout.write(content);
  }
}

export class HellogPrettyDefaultPlugin extends HellogPlugin {
  override format(messages: HellogMessage[]): HellogMessage[] {
    const formatted: HellogMessage[] = [];

    for (const message of messages) {
      formatted.push({
        ...message,
        content: `${message.timestamp.toISOString()} [${message.level}] ${message.content}`,
      });
    }

    return formatted;
  }
}

export class HellogLogFormatDefaultPlugin extends HellogPlugin {
  override format(messages: HellogMessage[]): HellogMessage[] {
    const formatted: HellogMessage[] = [];

    for (const message of messages) {
      const data: Record<string, string> = {
        timestamp: message.timestamp.toISOString(),
        level: message.level,
        message: message.content,
      };
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (const key in message.meta) data[key] = message.meta[key]!;

      let content = '';
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (const key in data) content += `${key}="${data[key]!}" `;

      formatted.push({ ...message, content });
    }

    return formatted;
  }
}

export class HellogJsonDefaultPlugin extends HellogPlugin {
  override format(messages: HellogMessage[]): HellogMessage[] {
    const formatted: HellogMessage[] = [];

    for (const message of messages) {
      const { meta, ...rest } = message;
      const content: Record<string, unknown> = rest;

      for (const key in meta) content[key] = meta[key];
      formatted.push({ ...message, content: JSON.stringify(content) });
    }

    return formatted;
  }
}

export class HellogColorizeDefaultPlugin extends HellogPlugin {
  override format(messages: HellogMessage[]): HellogMessage[] {
    const formatted: HellogMessage[] = [];

    for (const message of messages) {
      let content = message.content;
      switch (message.level) {
        case HellogLevel.TRACE:
          content = `\x1b[37m${content}\x1b[0m`;
          break;
        case HellogLevel.DEBUG:
          content = `\x1b[36m${content}\x1b[0m`;
          break;
        case HellogLevel.WARN:
          content = `\x1b[33m${content}\x1b[0m`;
          break;
        case HellogLevel.ERROR:
          content = `\x1b[31m${content}\x1b[0m`;
          break;
      }

      formatted.push({ ...message, content });
    }

    return formatted;
  }
}
