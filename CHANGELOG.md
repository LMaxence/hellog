# [3.6.0](https://github.com/LMaxence/hellog/compare/v3.5.0...v3.6.0) (2026-06-27)


### Features

* child loggers, structured meta, Error serialization, timers, TTY-aware color ([b529c95](https://github.com/LMaxence/hellog/commit/b529c958e2bf9e1711aa00b32cf6cca0059f602a))

# [3.5.0](https://github.com/LMaxence/hellog/compare/v3.4.1...v3.5.0) (2026-06-25)


### Bug Fixes

* **ci:** remove explicit pnpm version, let action-setup read from packageManager ([42ba746](https://github.com/LMaxence/hellog/commit/42ba74629c9d26895cdd8e7118320d7032a4d604))
* **ci:** remove registry-url from setup-node to unblock OIDC npm auth ([191fcf2](https://github.com/LMaxence/hellog/commit/191fcf29841304972bf8f5cc766dbc052b264095))
* **ci:** remove registry-url to allow @semantic-release/npm OIDC path ([cb2b218](https://github.com/LMaxence/hellog/commit/cb2b218be7f4e2e2bbdf19f37938a43a2e4a0802))
* **ci:** restore registry-url and use pnpm exec for semantic-release ([b85a24f](https://github.com/LMaxence/hellog/commit/b85a24f9ab93ffc0c5bc87c523be5c9bc1d60d97))
* **ci:** switch to GITHUB_TOKEN and npm trusted publishing ([c648aae](https://github.com/LMaxence/hellog/commit/c648aae971959bc934bc5ec9b83e4e26686e13d0))
* **ci:** upgrade to semantic-release@25 with @semantic-release/npm@13 for OIDC support ([f839676](https://github.com/LMaxence/hellog/commit/f8396766f2b10c93a1bf5c3406aaf718883a7509))


### Features

* migrate toolchain to Node 26, pnpm, TypeScript 7, and OXC ([b694335](https://github.com/LMaxence/hellog/commit/b6943358ab62c02c176c33bef242aca1f36d94fe))

## [3.4.1](https://github.com/LMaxence/hellog/compare/v3.4.0...v3.4.1) (2025-01-09)


### Bug Fixes

* expose success method in hellog object ([c1c77b2](https://github.com/LMaxence/hellog/commit/c1c77b28cdc8f7e3f8cbc6cc6ae588ad351673af))

# [3.4.0](https://github.com/LMaxence/hellog/compare/v3.3.0...v3.4.0) (2025-01-09)


### Features

* add support for success level and add log proxy method for info level ([1636122](https://github.com/LMaxence/hellog/commit/1636122e1e629083cdf27cee1c8b17ed65504d71))

# [3.3.0](https://github.com/LMaxence/hellog/compare/v3.2.0...v3.3.0) (2025-01-09)


### Features

* add support for dynamic meta keys in hellog ([7fa2739](https://github.com/LMaxence/hellog/commit/7fa2739405a70fcbd943faf80227062d42e3448d))

# [3.2.0](https://github.com/LMaxence/hellog/compare/v3.1.0...v3.2.0) (2025-01-09)


### Features

* add support for custom keys in default logfmt plugin ([ac01271](https://github.com/LMaxence/hellog/commit/ac01271956949d8c01cb736a11838559a6b046c2))

# [3.1.0](https://github.com/LMaxence/hellog/compare/v3.0.0...v3.1.0) (2024-12-21)


### Bug Fixes

* add prettier ignore to ignore changelog ([54e1145](https://github.com/LMaxence/hellog/commit/54e1145dddb59fc43807b537e176d5f5db59b705))


### Features

* add  method and docstrings to hellog class ([609bb1b](https://github.com/LMaxence/hellog/commit/609bb1bb5ebdea26237b647687be12868f1cdfd7))

# [3.0.0](https://github.com/LMaxence/hellog/compare/v2.3.1...v3.0.0) (2024-12-21)


### Bug Fixes

* fix formatting ([55bd8e7](https://github.com/LMaxence/hellog/commit/55bd8e77e7f1feeffa37f9bc60f31efcbe4cd483))
* fix semantic release ([10e08c1](https://github.com/LMaxence/hellog/commit/10e08c19f8cd91a7568cca2672b827de2f7b6183))
* fix semantic release ([4b300dc](https://github.com/LMaxence/hellog/commit/4b300dcb2536e905058fbe9ed7c42328a02b3b7c))
* fix semantic release ([2d4c221](https://github.com/LMaxence/hellog/commit/2d4c221b4e2b85727b9ad1a705628c18cdfab931))
* run CI on main ([83dcedd](https://github.com/LMaxence/hellog/commit/83dcedd7f48b2daebed394f7e31cb14ae68437b9))
* use npm in CIs ([a8d2877](https://github.com/LMaxence/hellog/commit/a8d287734db0a5eb708ea726973943b74877a0ab))


### Features

* add semantic release ([55c13f5](https://github.com/LMaxence/hellog/commit/55c13f576e61de5f0d1aea2f0ef343c94bcbff98))
* rewrite library for v3 and bump dependencies ([926ff07](https://github.com/LMaxence/hellog/commit/926ff07d5b3204efcc155db3057ccbb5739154a8))


### BREAKING CHANGES

* This commit introduces breaking changes for all existing APIs of Hellog as it is a rewrite of the library
