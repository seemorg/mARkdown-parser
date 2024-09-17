// trim and filter out empty strings
const prepareParts = (parts: string[]): string[] => {
  const newParts: string[] = [];
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed) {
      newParts.push(trimmed);
    }
  }

  return newParts;
};

/**
 * Split a string by hemistichs
 * @see https://maximromanov.github.io/mARkdown/#-verses-of-poetry
 *
 * @param {string} input
 * @returns {string[]}
 */
export function splitStringByHemistichs(input: string): string[] {
  // check if the input has %~%
  if (input.includes('%~%')) {
    const parts = input.split('%~%');
    return prepareParts(parts);
  }

  // fallback to % (openiti has mistakes)
  const parts = input.split('%');

  // this means its an invalid split
  if (parts.length > 1) {
    const p = parts[1].trim();
    if (p.startsWith('(') || p.startsWith(')')) {
      return [input];
    }
  }

  return prepareParts(parts);
}
