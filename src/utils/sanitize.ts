const openTagPatterns = [
  /@[A-Z]{3}@[A-Z]{3,}@[A-Za-z]+@(?:-@[0tf][ftalmr0]@)?/g,
  /@[^@]+?@[^_@]+?_[^_@]+?(?:_[^_@]+?)?@/g,
];

const patternsToRemove = [
  'Milestone300',
  'AUTO|CHECK',
  '@Y[BDYA](\\d+)',
  '@S(\\d+)',
  '@SOC(\\d+)',
  '@P(\\d+)',
  '@PER(\\d+)',
  '@SRC(\\d+)',
  '#\\$#FROM|#\\$#TOWA|#\\$#DIST|#\\$#PROV|#\\$#TYPE|#\\$#STTL|#\\$#REGX|#\\$#REG',
  '@HUKM@|@MATN@',
  'ms(\\d+)',
  '@QUR@(\\d+)',
  '@HAD(\\d+)',
  '@T(\\d+)',
  '@TOP(\\d+)',
  '\\$RWY\\$',
]
  .map((pattern) => new RegExp(pattern, 'g'))
  .concat(openTagPatterns);

/**
 * This function removes useless tags from the line
 *
 * @param {string} line
 * @returns {string}
 */
export function sanitizeLine(line: string): string {
  let result = line;

  patternsToRemove.forEach((pattern) => {
    result = result.replace(pattern, '');
  }, line);

  result = result.trim();

  // remove $ at the end of the line
  if (result.endsWith(' $')) {
    result = result.slice(0, -2);
  }

  return result.replace(/\s+/g, ' ');
}
