import type {
  Block,
  ParseResult,
  ParseMetaData,
  ContentItem,
  TypedBlock,
} from './types';
import { Chapter } from './types/Chapter';
import { Page } from './types/Page';
import { splitParagraphByBlockQuotes } from './utils/block-quote';
import { extractPageNumberFromLine } from './utils/page';
import { prefixes } from './utils/prefixes';
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
  let currentHeaders: TypedBlock<'header'>[] = [];

  const addContentBlock = (block: Block) => {
    currentBlocks.push(block);
    if (block.type === 'header') {
      currentHeaders.push(block);
    }
  };

  const finalizePage = () => {
    content.push({
      ...(currentPage ? currentPage : {}),
      blocks: currentBlocks,
    });
    chapters.push(
      ...(currentHeaders.map((header) => ({
        ...(currentPage ? currentPage : {}),
        level: header.level,
        title: header.content,
      })) as Chapter[])
    );
    currentBlocks = [];
    currentHeaders = [];
    currentPage = null;
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

    line = sanitizeLine(line);

    if (line.length < 1) continue;

    // if the line ends with this format:
    // PageV##P###, where V## is the volume number, and P### is the page number. Volume number must be two digits, page number—three (padded with zeros when necessary)
    const pageNumber = extractPageNumberFromLine(line);
    if (pageNumber) {
      const { volume, page } = pageNumber;
      currentPage = { volume, page };
      line = line.replace(new RegExp(pageNumber.strings.join('|'), 'g'), '');
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
        }
      }

      for (const entry of prefixes) {
        if (line.startsWith(entry.prefix)) {
          addContentBlock({
            type: 'paragraph',
            content: line.slice(entry.prefix.length).trim(),
            extraContext: entry.context as Block['extraContext'],
          });
          break;
        }
      }
    }

    // If this is the end of the paragraph, add it to the content array.
    if (currentParagraph.length > 0) {
      const nextLine = lines[i + 1];

      // if this is the last line, or the next line is not part of the same paragraph, add the current paragraph to the content array
      if (!nextLine || !nextLine.startsWith('~~')) {
        const hemistichs = splitStringByHemistichs(currentParagraph);

        if (hemistichs.length > 1) {
          // if it's an odd number, treat [0] as a paragraph
          if (hemistichs.length % 2 !== 0) {
            const nonVerse = hemistichs.shift()!;
            const segments = splitParagraphByBlockQuotes(nonVerse);
            segments.forEach((segment) => {
              if (currentParagraphContext) {
                segment.extraContext = currentParagraphContext;
              }
              addContentBlock(segment);
            });
          }

          // this is a verse
          addContentBlock({
            type: 'verse',
            content: hemistichs,
          });
        } else {
          // clean any % from the current paragraph
          currentParagraph = currentParagraph.replace(/%/g, '');
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

    if (currentPage) {
      finalizePage();
    }
  }

  finalizePage();

  return { metadata, chapters, content };
}
