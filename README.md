# hellog

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
const hellog = require('@steffthestunt/hellog');

hellog.log('Hello, world!');
hellog.info('This is an info message.');
hellog.warn('This is a warning message.');
hellog.error('This is an error message.');

// Accepts any input
hellog.log('Logging a number:', 123);
hellog.log('Logging an object:', { key: 'value' });
hellog.log('Logging an array:', [1, 2, 3]);
```

## Features

- **Console-like API**: Use `log`, `info`, `warn`, and `error` methods.
- **Plugin-based extensibility**: Extend functionality with plugins.
- **Zero dependencies**: Lightweight and easy to integrate.

## Examples

Basic logging:

```javascript
hellog.log('This is a log message.');
hellog.info('This is an info message.');
hellog.warn('This is a warning message.');
hellog.error('This is an error message.');

// Accepts any input
hellog.log('Logging a number:', 123);
hellog.log('Logging an object:', { key: 'value' });
hellog.log('Logging an array:', [1, 2, 3]);
```
