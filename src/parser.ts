import type { Block, ParseResult, ParseMetaData } from './types';
import { splitParagraphByBlockQuotes } from './utils/block-quote';
import { extractPageNumberFromLine } from './utils/page';
import { sanitizeLine } from './utils/sanitize';
import { splitStringByHemistichs } from './utils/verse';

// @see https://maximromanov.github.io/mARkdown/#-section-headers
const handleHeader = (line: string) => {
  const match = line.match(/^### (\|+)\s*(.*)/);
  if (match) {
    const level = match[1].length;
    const title = match[2].trim();
    return { level, title };
  }

  return null;
};

// @see https://maximromanov.github.io/mARkdown/#-biographies-and-events
const biosAndEvents = [
  {
    prefix: '### $$$$',
    context: 'names_list',
  },
  {
    prefix: '### $$$',
    context: 'cross_reference_biography',
  },
  {
    prefix: '### $$',
    context: 'woman_biography',
  },
  {
    prefix: '### $',
    context: 'man_biography',
  },
  {
    prefix: '### @ RAW',
    context: 'historical_events_batch',
  },
  {
    prefix: '### @',
    context: 'historical_events',
  },
];

export function parseMarkdown(markdownText: string): ParseResult {
  const lines = markdownText.split('\n');

  const metadata: ParseMetaData = {};
  const content: Block[] = [];

  let isMetadata = true;
  let currentParagraph = '';
  let currentParagraphContext: Block['extraContext'] | undefined;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line === '######OpenITI#') {
      continue;
    }

    if (line === '#META#Header#End#') {
      isMetadata = false;
      continue;
    }

    if (isMetadata && line.startsWith('#META#')) {
      const [keyValue, value] = line.split('::').map((part) => part.trim());
      const key = keyValue?.split('.')[1];

      if (key && value) {
        if (metadata[key] && metadata[key] !== 'NODATA') continue; // skip duplicate keys
        metadata[key] = value;
      }

      continue;
    }

    line = sanitizeLine(line).trim();

    if (line.length < 1) continue;

    // if the line ends with this format:
    // PageV##P###, where V## is the volume number, and P### is the page number. Volume number must be two digits, page number—three (padded with zeros when necessary)
    const pageNumber = extractPageNumberFromLine(line);
    if (pageNumber) {
      line = line.replace(pageNumber.string, '');
    }

    // @see https://maximromanov.github.io/mARkdown/#morphological-patterns
    if (line.startsWith('#~:')) {
      const category = line.slice(3).replaceAll(':', '').trim();
      if (category !== 'undefined') {
        content.push({ type: 'category', content: category });
      }
    } else if (line.startsWith('# |')) {
      const title = line.slice(3).trim();
      content.push({ type: 'title', content: title });
    } else if (line.startsWith('# ')) {
      currentParagraph = line.slice(2).trim() + ' ';

      // @see https://maximromanov.github.io/mARkdown#-riw%C4%81y%C4%81t-units
      if (currentParagraph.startsWith('$RWY$')) {
        currentParagraph = currentParagraph.slice(5).trim();
        currentParagraphContext = 'riwaya';
      }
    } else if (line.startsWith('~~')) {
      currentParagraph += line.slice(2).trim() + ' ';
    } else {
      if (line.startsWith('### |')) {
        const headerValue = handleHeader(line);
        if (headerValue) {
          content.push({
            type: 'header',
            level: headerValue.level,
            content: headerValue.title,
          });
        }
      }

      biosAndEvents.forEach((entry) => {
        if (line.startsWith(entry.prefix)) {
          content.push({
            type: 'paragraph',
            content: line.slice(entry.prefix.length).trim(),
            extraContext: entry.context as Block['extraContext'],
          });
        }
      });
    }

    // If this is the end of the paragraph, add it to the content array.
    if (currentParagraph.length > 0) {
      const nextLine = lines[i + 1];

      // if this is the last line, or the next line is not part of the same paragraph, add the current paragraph to the content array
      if (!nextLine || !nextLine.startsWith('~~')) {
        const hemistichs = splitStringByHemistichs(currentParagraph);

        if (hemistichs.length > 1) {
          // this is a verse
          content.push({
            type: 'verse',
            content: hemistichs.map((hemistich) => hemistich.trim()),
          });
        } else {
          const segments = splitParagraphByBlockQuotes(currentParagraph);
          segments.forEach((segment) => {
            if (currentParagraphContext) {
              segment.extraContext = currentParagraphContext;
            }
            content.push(segment);
          });
        }

        currentParagraph = '';
        currentParagraphContext = undefined;
      }
    }

    if (pageNumber) {
      content.push({
        type: 'pageNumber',
        content: { volume: pageNumber.volume, page: pageNumber.page },
      });
    }
  }

  return { metadata, content };
}
