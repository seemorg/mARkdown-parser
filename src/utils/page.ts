import { Page } from '../types/Page';

type PageResult =
  | (Page & {
      strings: string[];
    })
  | null;

const pageNumberRegex = /PageV\d{2}P\d{3,4}/g;

/**
 * This function extracts the page number from the line.
 * @see https://maximromanov.github.io/mARkdown/#-page-numbers
 *
 * @param {string} line
 * @returns {PageResult | null}
 */
export function extractPageNumberFromLine(line: string): PageResult | null {
  // match currentParagraph with regex to get the page number
  // PageV01P001 or PageV01P0001
  const pageNumberMatches = Array.from(line.matchAll(pageNumberRegex));
  if (pageNumberMatches.length === 0) {
    return null;
  }

  const stringsToRemove: string[] = [];
  let vol: number;
  let pg: number;

  pageNumberMatches.forEach((match) => {
    const matchString = match[0];
    stringsToRemove.push(matchString);

    const page = parseInt(matchString.slice(8));

    if (!pg || page < pg) {
      const volume = parseInt(matchString.slice(5, 7));
      vol = volume;
      pg = page;
    }
  });

  return {
    // the matched strings to be removed from the currentParagraph
    strings: stringsToRemove,
    volume: vol!,
    page: pg!,
  };
}
