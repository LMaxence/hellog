# hellog

_Your new logger !_

`hellog` is a general-purpose logging library.

It offers a `console.log`-like API and formatting, colored lines and timestamps (or not if desired), all that with 0 dependencies.

## Install

```bash
npm install --save hellog
```

## Get started

```js
const { Hellog } = require('hellog');

const logger = new Hellog();

const obj = {
  some: 'bar',
  foo: {
    nested: { bar: 'test', test: 'bar', hello: 2 },
  },
};

logger.log(obj);
logger.success(obj);
logger.debug(obj);
logger.error(new Error('test'));
logger.warn(new Error('test'));
```

![image](./assets/result.png 'Output')

## Transport and options

### Console

This is the transport used by default. It outputs messages withing the console, enriched with some information and colors.

```js
const { Hellog, transports } = require('hellog');

const transport = new transports.Console({
  showLevel: true,
  timestamp: true,
});

const logger = new Hellog({
  transports: [transport],
});
```

#### Options

`timestamp` (`boolean`): _Whether or not to display the log time_
`showLevel` (`boolean`): _Whether or not to display the log level_

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
