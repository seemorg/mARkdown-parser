import { ContentItem } from './Block';
import { Chapter } from './Chapter';

export type ParseMetaData = Record<string, string>;

export type ParseResult = {
  metadata: ParseMetaData;
  content: ContentItem[];
  chapters: Chapter[];
};
