/**
 * Split a string by hemistichs
 * @see https://maximromanov.github.io/mARkdown/#-verses-of-poetry
 *
 * @param {string} input
 * @returns {string[]}
 */
export function splitStringByHemistichs(input: string): string[] {
  const parts = input.split('%~%');
  return parts;
}
