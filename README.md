# OpenITI mARkdown Parser

A library for parsing OpenITI special [mARkdown](https://maximromanov.github.io/mARkdown/) syntax into friendly JSON format.

[![Build Status][build-badge]][build]
[![MIT License][license-badge]][license]
[![NPM Version][npm-badge]][npm]
[![Minziped Size][size-badge]][npm]
[![NPM Monthly downloads][downloads-badge]][npm]

## Installation

using npm:

```ssh
npm install @openiti/markdown-parser
```

using yarn:

```ssh
yarn add @openiti/markdown-parser
```

## Getting Started

You can use the library in your project like this:

```js
import { parseMarkdown } from '@openiti/markdown-parser';

const markdown = `
// ...
`;

const parsed = parseMarkdown(markdown);
console.log(parsed);
```

<!-- Links -->

[build-badge]: https://github.com/seemorg/markdown-parser/workflows/CI/badge.svg
[build]: https://github.com/seemorg/markdown-parser/actions?query=workflow%3ACI
[license-badge]: https://badgen.net/github/license/openiti/markdown-parser
[license]: https://github.com/seemorg/markdown-parser/blob/main/LICENSE
[npm]: https://www.npmjs.com/package/@openiti/markdown-parser
[npm-badge]: https://badgen.net/npm/v/@openiti/markdown-parser
[downloads-badge]: https://img.shields.io/npm/dm/@openiti/markdown-parser.svg
[size-badge]: https://badgen.net/packagephobia/publish/@openiti/markdown-parser
