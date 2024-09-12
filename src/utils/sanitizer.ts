// Regular expression replace function
function regReplace(
  text: string,
  replacements: { [key: string]: string }
): string {
  for (const [pattern, replacement] of Object.entries(replacements)) {
    const regex = new RegExp(pattern, 'gm');
    text = text.replace(regex, replacement);
  }
  return text;
}

// Preprocessing to preserve structural elements before a cleaner
export function replaceChapterHeadings(text: string): string {
  text = text.replace(/###\s*\|+\s*(.*?)(?=P|$)/gm, '~~<h1>$1</h1>');
  text = text.replace(/PageVPP/gm, 'PageV01P');
  text = text.replace(/PageV(\D)/gm, 'PageV01P000$1');
  text = text.replace(/#\d{1,}#/gm, '');
  text = text.replace(/(PageV\d+P) (\d+)/gm, '$1$2');
  text = text.replace(/\n (PageV\d+P\d+)/gm, '\n$1');
  text = text.replace(/^# (?!PageV\d+P\d+)(.*)/gm, '~~<p>$1');
  text = text.replace(/PageV(\d+)P(\d+)/gm, '~~a11b$1a11b$2');

  return text;
}

// List of replacements for leftover annotations and extraneous characters not removed by the cleaner
const replacements = {
  '\\n': ' ',
  'CHECK|AUTO|=|¬|_|^</p>|@\\D{,2}@|@\\D{1,}\\d{1,}\\s': '',
  '(a11b\\d{2}a11b\\d{3})': '\\1\\n',
  '\\n+': '\\n',
  '[ ]+': ' ',
  '<p>': '</p><p>',
  '<p><h1>': '<h1>',
  '</h1></p>': '</h1>',
  '(?<!</p>)(?=(a11b\\d{2}a11b\\d{3}))': '</p>',
  '^': '<p>',
  '<p><p>': '<p>',
  '<p> <p>': '<p>',
  '(?<=.)<h1>': '</p><h1>',
  '</h1>(?!(,\\d+|<p>))': '</h1><p>',
  '<p> </p>': '',
  '<p></p>': '',
  '\\n<p> $': '',
  '-+NO PAGE NO-+': 'a11b00a11b000',
};

// Chunk texts that have no pages into 1800 character segments and paginate
export function chunkAndPage(inputText: string): string {
  const cleanText = regReplace(inputText, replacements);

  if (cleanText.match(/a11b\d{2}a11b\d{3,}/)) {
    return cleanText;
  }

  const pattern = /(<\/p>|<p>.*?<\/p>|<h1>.*?<\/h1>)/gs;

  const chunks: string[] = [];
  let currentChunk = '';
  let currentLength = 0;

  let match;
  while ((match = pattern.exec(cleanText)) !== null) {
    const part = match[0];
    const contentLength = part.replace(/<[^>]+>/g, '').length;

    if (currentLength + contentLength <= 1800) {
      currentChunk += part;
      currentLength += contentLength;
    } else {
      chunks.push(currentChunk);
      currentChunk = part;
      currentLength = contentLength;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks
    .map((chunk, i) =>
      i === 0
        ? `${chunk}a11b01a11b001\n`
        : `${chunk}a11b01a11b${String(i + 1).padStart(3, '0')}\n`
    )
    .join('');
}
