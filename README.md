# OpenITI mARkdown Parser

A library for parsing OpenITI special [mARkdown](https://maximromanov.github.io/mARkdown/) syntax into friendly JSON format.

[![Build Status][build-badge]][build]
[![MIT License][license-badge]][license]
[![NPM Version][npm-badge]][npm]
[![Minziped Size][size-badge]][npm]
[![NPM Monthly downloads][downloads-badge]][npm]

## Features

- Parses OpenITI mARkdown headers, paragraphs, verses, biographies, historical events, and more into JSON.
- Extracts metadata and structural elements preserving their context and hierarchy.
- Supports parsing of complex morphological patterns and riwāyāt units.
- Handles pagination and block quotes within the text.

  
## Installation

using npm:

```ssh
npm install @openiti/markdown-parser
```

using yarn:

```ssh
yarn add @openiti/markdown-parser
```

## Usage

To use `mARkdown-parser`, import the `parseMarkdown` function from the package and pass your OpenITI mARkdown text to it. The function will return a JSON object containing the parsed content.

```js
import { parseMarkdown } from '@openiti/markdown-parser';

const mARkdown = `
// ...
`;

const parsed = parseMarkdown(mARkdown);
console.log(parsed);
```

### Sample Output

The following is an example output of the parser, showing how it structures different elements of the OpenITI mARkdown:

```json
[
  {
    "type": "title",
    "content": "رسالة في التوبة"
  },
  {
    "type": "pageNumber",
    "content": {
      "volume": "01",
      "page": "218"
    }
  },
  {
    "type": "paragraph",
    "content": "فصل"
  },
  {
    "type": "paragraph",
    "content": "قال الإمام العلامة شيخ الإسلام تقي الدين أبو العباس أحمد بن عبدالحليم ابن تيمية رحمه الله"
  }
  ...
]
```


## API Reference

### parseMarkdown(markdownText: string): ParseResult

Parses a string of OpenITI mARkdown into a structured JSON format.

#### Parameters

- `markdownText` (string) - The OpenITI mARkdown text to be parsed.

#### Returns

- `ParseResult` (Object) - A JSON object representing the parsed content. The `ParseResult` object includes `metadata` and `content` properties.

## Types

### Block

Represents the smallest unit of content, such as a title, header, paragraph, blockquote, etc.

### ParseResult

An object containing `metadata` and `content`. `metadata` is an object of key-value pairs extracted from the mARkdown, while `content` is an array of `Block` objects representing the structured content of the document.

## Blocks

The library defines several blocks to structure the parsed content. Here's a detailed look at the `Block` types:

| Type            | Description                                                                                       |
|-----------------|---------------------------------------------------------------------------------------------------|
| `title`         | Represents a title within the text.                                                              |
| `header-1`      | Denotes a level 1 header, the highest level, typically used for major sections.                  |
| `header-2`      | Denotes a level 2 header, used for subsections under a `header-1`.                               |
| `header-3`      | Denotes a level 3 header, used for sub-subsections under a `header-2`.                           |
| `header-4`      | Denotes a level 4 header, indicating further subdivision under a `header-3`.                     |
| `header-5`      | The lowest level header, indicating the most granular sectioning under a `header-4`.             |
| `paragraph`     | Represents a paragraph of text.                                                                  |
| `blockquote`    | Indicates a block of text that is quoted from another source.                                    |
| `category`      | A categorization label, used for organizing content into categories.                             |
| `verse`         | Represents a verse, typically in poetry or Quranic verses. Each array item is a hemistich.       |
| `pageNumber`    | Denotes the page number. The content includes an object with `volume` and `page` strings.        |
| `year_of_birth` | Indicates the year of birth of a person, in Hijri.                                               |
| `year_of_death` | Indicates the year of death of a person, in Hijri.                                               |
| `year`          | General purpose year, used in various contexts, in Hijri.                                        |
| `age`           | Represents the age of a person, in Hijri years.                                                  |


## Contributing

Contributions are welcome! Please submit pull requests or open issues on the GitHub repository.

## License

This project is licensed under the MIT License.

## Acknowledgments

This library is built to support the work done by the OpenITI team and the larger community working on Arabic and Islamicate texts. For more information on OpenITI mARkdown conventions, visit [Maxim Romanov's mARkdown guide](https://maximromanov.github.io/mARkdown/).

<!-- Links -->

[build-badge]: https://github.com/seemorg/markdown-parser/workflows/CI/badge.svg
[build]: https://github.com/seemorg/markdown-parser/actions?query=workflow%3ACI
[license-badge]: https://badgen.net/github/license/openiti/markdown-parser
[license]: https://github.com/seemorg/markdown-parser/blob/main/LICENSE
[npm]: https://www.npmjs.com/package/@openiti/markdown-parser
[npm-badge]: https://badgen.net/npm/v/@openiti/markdown-parser
[downloads-badge]: https://img.shields.io/npm/dm/@openiti/markdown-parser.svg
[size-badge]: https://badgen.net/packagephobia/publish/@openiti/markdown-parser
