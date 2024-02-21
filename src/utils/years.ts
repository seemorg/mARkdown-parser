import { Block } from '../types';

const prefixToYearTypeMap = {
  YB: 'year_of_birth',
  YD: 'year_of_death',
  YY: 'year',
  YA: 'age',
};

/**
 * This function splits the input string by years,
 * and returns an array of blocks, where each block is either
 * a paragraph or a year.
 *
 * @see https://maximromanov.github.io/mARkdown/#-years-ah
 *
 * @param {string} input
 * @returns {Block[]}
 */
export function splitStringByYear(input: string): Block[] {
  const regex = /@Y[BDYA]\((\d+)\)/g;
  const matches = Array.from(input.matchAll(regex));

  const segments: Block[] = [];

  let lastIndex = 0;
  for (const match of matches) {
    if (!match?.[1]) continue;

    const yearType =
      prefixToYearTypeMap[
        match[0].slice(1, 3) as keyof typeof prefixToYearTypeMap
      ];
    const year = parseInt(match[1]);

    const beforeYear = input.slice(lastIndex, match.index);
    if (beforeYear) {
      segments.push({ type: 'paragraph', content: beforeYear });
    }

    segments.push({
      type: yearType as 'year_of_birth' | 'year_of_death' | 'year' | 'age',
      content: year,
    });

    lastIndex = (match?.index ?? 0) + match[0].length;
  }

  const afterLastYear = input.slice(lastIndex);
  if (afterLastYear) {
    segments.push({ type: 'paragraph', content: afterLastYear });
  }

  return segments;
}
