const patternsToRemove = [
  'Milestone300',
  '@Y[BDYA](\\d+)',
  '@S(\\d+)',
  '@SOC(\\d+)',
  '@P(\\d+)',
  '@PER(\\d+)',
  '@SRC(\\d+)',
  '#\\$#FROM|#\\$#TOWA|#\\$#DIST|#\\$#PROV|#\\$#TYPE|#\\$#STTL|#\\$#REGX|#\\$#REG',
  '@HUKM@|@MATN@',
  'ms(\\d+)',
];

/**
 * This function removes useless tags from the line
 *
 * @param {string} line
 * @returns {string}
 */
export function sanitizeLine(line: string): string {
  let result = line;

  patternsToRemove.forEach((pattern) => {
    result = result.replace(new RegExp(pattern, 'g'), '');
  }, line);

  return result.replace(/\s+/g, ' ').trim();

  // return line
  //   .replaceAll('Milestone300', '')
  //   .replace(
  //     // remove @YB, @YD, @YY, @YA
  //     /@Y[BDYA](\d+)/g,
  //     ''
  //   )
  //   .replace(
  //     // remove @Sxx
  //     /@S(\d+)/g,
  //     ''
  //   )
  //   .replace(
  //     // remove @SOCxx
  //     /@SOC(\d+)/g,
  //     ''
  //   )
  //   .replace(
  //     // remove @Pxx
  //     /@P(\d+)/g,
  //     ''
  //   )
  //   .replace(
  //     // remove @PERxx
  //     /@PER(\d+)/g,
  //     ''
  //   )
  //   .replace(
  //     // remove @SRCxx
  //     /@SRC(\d+)/g,
  //     ''
  //   )
  //   .replace(
  //     // remove #$#FROM  #$#TOWA  #$#DIST in the same regex
  //     /#\$#FROM|#\$#TOWA|#\$#DIST/g,
  //     ''
  //   )
  //   .replace(
  //     // remove @HUKM@ or @MATN@
  //     /@HUKM@|@MATN@/g,
  //     ''
  //   )
  //   .replace(/ms(\d+)/g, '');
}
