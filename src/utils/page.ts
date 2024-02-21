import { TypedBlock } from '../types';

type Page =
  | (TypedBlock<'pageNumber'>['content'] & {
      string: string;
    })
  | null;

/**
 * This function extracts the page number from the line.
 * @see https://maximromanov.github.io/mARkdown/#-page-numbers
 *
 * @param {string} line
 * @returns {Page}
 */
export function extractPageNumberFromLine(line: string): Page {
  // match currentParagraph with regex to get the page number
  const pageNumber = line.match(/PageV\d{2}P\d{3}/);
  if (!pageNumber?.[0]) return null;

  return {
    string: pageNumber[0], // the matched string to be removed from the currentParagraph
    volume: pageNumber[0].slice(5, 7),
    page: pageNumber[0].slice(8),
  };
}
