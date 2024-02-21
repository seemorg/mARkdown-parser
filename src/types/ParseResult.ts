import { Block } from './Block';

export type ParseMetaData = Record<string, string>;

export type ParseResult = {
  metadata: ParseMetaData;
  content: Block[];
};
