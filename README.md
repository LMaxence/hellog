# Hellog

_Your new logger!_

`hellog` is a general-purpose logging library.

It offers a `console.log`-like API and formatting, plugin-based extensibility, all that with 0 dependencies.

## Installation

```sh
npm install @steffthestunt/hellog
```

## Usage

Import `hellog` into your project and start logging:

```javascript
import Hellog from '@steffthestunt/hellog';

// Initialize with default config
const logger = new Hellog();

logger.debug('Hello, world!');
// Outputs : 2024-12-21T13:48:08.064Z [INFO] Hello, world!

logger.info('This is an info message.');
// Outputs : 2024-12-21T13:48:08.064Z [INFO] This is an info message.

logger.warn('This is a warning message.');
// Outputs : 2024-12-21T13:48:08.064Z [WARN] This is a warning message.

logger.error('This is an error message.');
// Outputs : 2024-12-21T13:48:08.064Z [ERROR] This is an error message.

logger.info('Logging a number:', 123);
// Outputs : 2024-12-21T13:48:08.064Z [INFO] Logging a number: 123

logger.info('Logging an object:', { key: 'value' });
// Outputs : 2024-12-21T13:48:08.064Z [INFO] Logging an object: { key: 'value' }

logger.info('Logging an array:', [1, 2, 3]);
// Outputs : 2024-12-21T13:48:08.064Z [INFO] Logging an array: [ 1, 2, 3 ]
```

## Features

- **Console-like API**: Use `debug`, `info`, `warn`, and `error` methods.
- **Plugin-based extensibility**: Extend functionality with plugins.
- **Zero dependencies**: Lightweight and easy to integrate.

## Plugins

Hellog's plugin system allows you to extend its functionality. Plugins can modify log messages and control how they are output.

### Default Plugins

Hellog comes with these plugins enabled by default:

- `HellogLineBreakDefaultPlugin` - A plugin to split `console.log` messages that would span over multiple lines and format each line separately.
- `HellogPrettyDefaultPlugin` - A plugin to format log messages in a more readable way: `{timestamp} [{level}] {message}`.
- `HellogStdoutDefaultPlugin` - A plugin to output log messages to stdout or stderr depending on the level.

### Creating a Plugin

Plugins are created by extending the `HellogPlugin` base class:

```javascript
import { HellogPlugin } from '@steffthestunt/hellog';

class TimestampPlugin extends HellogPlugin {
  transform(message, level) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${message}`;
  }
}

// Initialize logger with custom plugins
const logger = new Hellog({
  plugins: [new TimestampPlugin()],
});
```

### Plugin Examples

Common plugin configurations:

```javascript
import {
  HellogLineBreakPlugin,
  HellogPrettyPlugin,
  HellogStdoutPlugin,
} from '@steffthestunt/hellog';

// Initialize with multiple plugins
const logger = new Hellog({
  plugins: [
    // Default plugins
    new HellogLineBreakPlugin(),
    new HellogPrettyPlugin(),
    new HellogStdoutPlugin(),

    // Custom plugins
    new TimestampPlugin(),
  ],
});
```
