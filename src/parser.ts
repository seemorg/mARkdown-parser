import type { Block, ParseResult, ParseMetaData, ContentItem } from './types';
import { Chapter } from './types/Chapter';
import { Page } from './types/Page';
import { splitParagraphByBlockQuotes } from './utils/block-quote';
import { extractPageNumberFromLine } from './utils/page';
import { sanitizeLine } from './utils/sanitize';
import { splitStringByHemistichs } from './utils/verse';

// @see https://maximromanov.github.io/mARkdown/#-section-headers
const handleHeader = (line: string) => {
  const match = line.match(/^### (\|+)\s*(.*)/);
  if (match) {
    const level = match[1].length;
    let title = match[2].trim().replace(/@QB@|@QE@/g, '');

    // if the title has an opening or closing parentheses, but missing the other one, add it
    if (title.includes('(') && !title.includes(')')) {
      title += ')';
    } else if (title.includes(')') && !title.includes('(')) {
      title = '(' + title;
    }

    // remove space between parentheses and text inside them
    title = title.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');

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
  const chapters: Chapter[] = [];
  const content: ContentItem[] = [];

  let isMetadata = true;
  let currentParagraph = '';
  let currentParagraphContext: Block['extraContext'] | undefined;
  let currentPage: Page | null = null;
  let currentBlocks: Block[] = [];

  const addContentBlock = (block: Block) => {
    if (currentPage) {
      currentBlocks.push(block);
    } else {
      content.push({ blocks: [block] });
    }
  };

  const finalizePage = () => {
    if (currentPage && currentBlocks.length > 0) {
      content.push({ ...currentPage, blocks: currentBlocks });
      currentBlocks = [];
      // currentPage = null;
    }
  };

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
      const { string: pageString, volume, page } = pageNumber;
      currentPage = { volume, page };
      line = line.replace(pageString, '');
      finalizePage();
    }

    // @see https://maximromanov.github.io/mARkdown/#morphological-patterns
    if (line.startsWith('#~:')) {
      const category = line.slice(3).replaceAll(':', '').trim();
      if (category !== 'undefined') {
        addContentBlock({ type: 'category', content: category });
      }
    } else if (line.startsWith('# |')) {
      const title = line.slice(3).trim();
      addContentBlock({ type: 'title', content: title });
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
          const headerBlock = {
            type: 'header',
            level: headerValue.level,
            content: headerValue.title,
          } as Block;
          addContentBlock(headerBlock);
          chapters.push({
            ...(currentPage ? currentPage : {}),
            level: headerValue.level,
            title: headerValue.title,
          });
        }
      }

      biosAndEvents.forEach((entry) => {
        if (line.startsWith(entry.prefix)) {
          addContentBlock({
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
          addContentBlock({
            type: 'verse',
            content: hemistichs.map((hemistich) => hemistich.trim()),
          });
        } else {
          const segments = splitParagraphByBlockQuotes(currentParagraph);
          segments.forEach((segment) => {
            if (currentParagraphContext) {
              segment.extraContext = currentParagraphContext;
            }
            addContentBlock(segment);
          });
        }

        currentParagraph = '';
        currentParagraphContext = undefined;
      }
    }
  }

  finalizePage();

  return { metadata, chapters, content };
}
