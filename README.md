# hellog

_Your new logger !_

`hellog` is a general-purpose logging library.

It offers a `console.log`-like API and formatting, **extensible type-safety** colored lines and timestamps (or not if desired), all that with 0 dependencies.

## Install

```bash
npm install --save @steffthestunt/hellog
```

## Get started

```js
const { Hellog } = require('hellog');

const logger = new Hellog();

const obj = {
  foo: {
    foo: {
      foo: {
        foo: {
          foo: 'bar',
        },
      },
    },
  },
};

logger.log(obj);
logger.success('Hello world !');
logger.debug(obj);
logger.error(new Error('test'));
logger.warn(new Error('test'));
```

![image](./assets/get-started.png 'Output')

## Transport and options

### Console

This is the transport used by default. It outputs messages withing the console, enriched with some information and colors.

```js
const { Hellog, transports } = require('hellog');

const transport = new transports.Console();

const logger = new Hellog({
  transports: [transport],
});
```

### File

A transport for outputting messages within a file.

```js
const { Hellog, transports } = require('hellog');

const transport = new transports.FileTransport();

const logger = new Hellog({
  transports: [transport],
});
```

It ouptus JSON objects by default:

```txt
{"timestamp":"2021-12-26T15:14:13.668Z","message":"{\n  some: 'bar',\n  foo: { nested: { bar: 'test', test: 'bar', hello: 2 } }\n}","level":"info"}
{"timestamp":"2021-12-26T15:14:13.669Z","message":"{\n  some: 'bar',\n  foo: { nested: { bar: 'test', test: 'bar', hello: 2 } }\n}","level":"success"}
{"timestamp":"2021-12-26T15:14:13.669Z","message":"{\n  some: 'bar',\n  foo: { nested: { bar: 'test', test: 'bar', hello: 2 } }\n}","level":"debug"}
{"timestamp":"2021-12-26T15:14:13.669Z","message":"Error: test\n    at Object.<anonymous> (/Users/escape/Code/hellog/tester.js:19:14)\n    at Module._compile (node:internal/modules/cjs/loader:1101:14)\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)\n    at Module.load (node:internal/modules/cjs/loader:981:32)\n    at Function.Module._load (node:internal/modules/cjs/loader:822:12)\n    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)\n    at node:internal/main/run_main_module:17:47","level":"error"}
{"timestamp":"2021-12-26T15:14:13.669Z","message":"Error: test\n    at Object.<anonymous> (/Users/escape/Code/hellog/tester.js:20:13)\n    at Module._compile (node:internal/modules/cjs/loader:1101:14)\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)\n    at Module.load (node:internal/modules/cjs/loader:981:32)\n    at Function.Module._load (node:internal/modules/cjs/loader:822:12)\n    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)\n    at node:internal/main/run_main_module:17:47","level":"warning"}
```

It can also output strings:

```js
const { Hellog, transports } = require('hellog');

const fileTransport = new transports.FileTransport({
  outType: 'string',
  filename: '/path/to/your/log/file', // defaults to "output.log"
});

const logger = new Hellog({
  transports: [fileTransport],
});
```

```txt
2021-12-26 15:20:42 | [info]    | {
2021-12-26 15:20:42 | [info]    |   some: 'bar',
2021-12-26 15:20:42 | [info]    |   foo: { nested: { bar: 'test', test: 'bar', hello: 2 } }
2021-12-26 15:20:42 | [info]    | }
2021-12-26 15:20:42 | [success] | {
2021-12-26 15:20:42 | [success] |   some: 'bar',
2021-12-26 15:20:42 | [success] |   foo: { nested: { bar: 'test', test: 'bar', hello: 2 } }
2021-12-26 15:20:42 | [success] | }
2021-12-26 15:20:42 | [debug]   | {
2021-12-26 15:20:42 | [debug]   |   some: 'bar',
2021-12-26 15:20:42 | [debug]   |   foo: { nested: { bar: 'test', test: 'bar', hello: 2 } }
2021-12-26 15:20:42 | [debug]   | }
2021-12-26 15:20:42 | [error]   | Error: test
2021-12-26 15:20:42 | [error]   |     at Object.<anonymous> (/Users/escape/Code/hellog/tester.js:21:14)
2021-12-26 15:20:42 | [error]   |     at Module._compile (node:internal/modules/cjs/loader:1101:14)
2021-12-26 15:20:42 | [error]   |     at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)
2021-12-26 15:20:42 | [error]   |     at Module.load (node:internal/modules/cjs/loader:981:32)
2021-12-26 15:20:42 | [error]   |     at Function.Module._load (node:internal/modules/cjs/loader:822:12)
2021-12-26 15:20:42 | [error]   |     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
2021-12-26 15:20:42 | [error]   |     at node:internal/main/run_main_module:17:47
2021-12-26 15:20:42 | [warning] | Error: test
2021-12-26 15:20:42 | [warning] |     at Object.<anonymous> (/Users/escape/Code/hellog/tester.js:22:13)
2021-12-26 15:20:42 | [warning] |     at Module._compile (node:internal/modules/cjs/loader:1101:14)
2021-12-26 15:20:42 | [warning] |     at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)
2021-12-26 15:20:42 | [warning] |     at Module.load (node:internal/modules/cjs/loader:981:32)
2021-12-26 15:20:42 | [warning] |     at Function.Module._load (node:internal/modules/cjs/loader:822:12)
2021-12-26 15:20:42 | [warning] |     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
2021-12-26 15:20:42 | [warning] |     at node:internal/main/run_main_module:17:47
```

#### Options

##### `outType: 'json' | 'string'`

Defaults to `"json"`, the type of output of the file transport

##### `filename: string`

Defaults to `"output.log"`, the path to the file where logs are written. Can absolute or relative. However, we recommend using absolute paths.

## Extensibilty

The logging functionalities of `Hellog` are designed to be extensible. You can add personalized behaviour to the following elements of the logger:

- Message context elaboration
- Message formatting on a per-transport basis

Hellog is also designed to guarantee type-safety even with your custom implementations !

### Life cycle

To better understand where you can perform custom logic, let's quickly review the lifecycle of a message within the logger.

_The logger is called_

```js
new Hellog().log({ foo: bar }, 'Hello world');
```

#### **Context elaboration**

The very first thing done by `Hellog` is converting these inputs into a string.

> We use `util.format` to do so, the same function used in the global `console`. That is the reason why `Hellog` can offer a console-like API.

Once we have a string, a context object is created. At this point, the type of the context object is `PreparedMessage`.

```ts
{
  timestamp: Date,
  message: string
  level: LogLevel
}
```

Then, for each transport, it's `log` method is called. This method is guaranteed to exist, because it is on the `BaseTransport` abstract class, extended by all transports classes.

Here the default implementation of the `log` method on the `BaseTransport class`. Let's break this down.

```ts
export abstract class BaseTransport<
  T extends PreparedMessage = PreparedMessage
> {
  //...

  log(log: T) {
    const messages = this.prepareTransport(log);
    const fMessages = messages.map((message) => this.format(message));
    fMessages.forEach((fMessage) => this.transport(fMessage));
  }

  //...
}
```

#### **Transport preparation**

In `Hellog`, messages are formatted and displayed on a _per-line_ basis. Meaning here that if your log spans on mutliple lines, it is breaked into a list of lines on the `"\n"` character.

Each one of these lines will be formatted during the rest of the execution.

> **This behaviour can be overriden when writing your own transport class.** For example, the `File` transport is implemented as follows:

```ts
export class FileTransport<T extends PreparedMessage = PreparedMessage> {
  //...

  prepareTransport(log: T): T[] {
    if (this.outType === 'json') {
      return [log];
    } else {
      return log.message.split('\n').map((message) => ({ ...log, message }));
    }
  }

  //...
}
```

Here, we don't want to break line when outputting JSON message, this is left to any system that will monitor this and read the log file.

**Each input in the resulting list is passed to the `format` method.**

#### **Formatting**

Formatting is performed on a **per-line** basis. Each transport is instanciated with a list of formatters, that extends the Formatter type.

```ts
export type Formatter<T extends PreparedMessage = PreparedMessage> = (
  current: string,
  context: T
) => string;
```

For each line, every formatters are called in the order defined by the list provided during class instanciation. By default the base transport uses three standard formats (provided by the library itself).

Here is the default implementation of the `format` step:

```ts
export abstract class BaseTransport<
  T extends PreparedMessage = PreparedMessage
> {
  formatters: Formatter[] = [addLevel(), addTimestamp(), colorize()];

  //...

  format(preparedLine: T): string {
    let formattedMessage = preparedLine.message;
    for (const formatter of this.formatters) {
      formattedMessage = formatter(formattedMessage, preparedLine);
    }
    return formattedMessage;
  }

  //...
}
```

> You can override this behaviour when doing your own transport class.

#### Message transportation

Once the log is nothing more than a list of string, the `transport` method of the transport is called for each resulting string.

Very various thing happen at this point. by default, a simple `console.log` is performed here. The `FileTransport` writes into a `fs.WriteStream`. You can implement a transport where the lines are sent over HTTP. [Here are some examples](https://www.youtube.com/watch?v=1MkzF9cFs2I).

### Improve formatting

### Improve context elaboration

If you need to add additional data into the `PreparedMessage` object being passed along this cycle, you can using the `additionalContext` when instanciating the `Hellog` object.

You can even do it with type safety and completion !

```ts
import { Hellog } from './logger';

interface ExtendedContext extends PreparedMessage {
  id: number;
}

const displayId: Formatter<ExtendedContext> = (
  current: string,
  context: ExtendedContext
) => {
  return `${context.id} | ${current}`;
};

const csle = new transports.Console<ExtendedContext>({
  formatters: [
    formatters.addLevel(true),
    displayId,
    formatters.addTimestamp(),
    formatters.colorize(),
  ],
});

const logger = new Hellog<ExtendedContext>({
  transports: [csle],
  additionalContext: (message) => ({
    ...message,
    id: Math.floor(Math.random() * 1000),
  }),
});

logger.success(new Error('test'));
```
