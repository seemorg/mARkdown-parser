import { Block } from '../types';

/**
 * This function splits the paragraph string by block quotes,
 * and returns an array of blocks, where each block is either
 * a paragraph or a block quote.
 *
 * @param {string} paragraph
 * @returns {Block[]}
 */
export function splitParagraphByBlockQuotes(paragraph: string): Block[] {
  // This regex matches the content before and after block quotes,
  // as well as the content within block quotes.
  // It captures the content of block quotes without including the markers.
  const regex = /@QB@(.*?)@QE@/gs;

  // Split the input string while keeping the content of block quotes.
  // We use 'split' to get the parts outside the block quotes,
  // and the capturing group in the regex to keep the block quotes content.
  const parts = paragraph.split(regex);

  // Initialize an array to hold the processed segments.
  const segments: Block[] = [];

  // Keep track of the current index in the original split result,
  // because we need to alternate between adding non-block-quote content
  // and block-quote content to the segments array.
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]?.trim();
    const isBlockQuote = i === 1;

    // If the part is not empty, add it to the segments array.
    // This step also effectively filters out any empty strings
    // that might result from leading or trailing block quote markers,
    // or from two consecutive block quote markers.
    if (part && part !== '') {
      segments.push({
        type: isBlockQuote ? 'blockquote' : 'paragraph',
        content: part,
      });
    }
  }

  return segments;
}
