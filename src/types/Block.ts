import { Page } from './Page';

export type Block = (
  | {
      type: 'header';
      level: number;
      content: string;
    }
  | {
      type: 'title' | 'paragraph' | 'blockquote' | 'category';
      content: string;
    }
  | {
      type: 'verse';
      content: string[]; // each array item is a hemistich
    }
  | {
      type: 'year_of_birth' | 'year_of_death' | 'year' | 'age';
      content: number; // in Hijri
    }
) & {
  extraContext?:
    | 'man_biography'
    | 'woman_biography'
    | 'cross_reference_biography'
    | 'names_list'
    | 'historical_events'
    | 'historical_events_batch'
    | 'riwaya'
    | 'hukum'
    | 'dictionary_nis'
    | 'dictionary_top'
    | 'dictionary_lex'
    | 'dictionary_bib'
    | 'editorial'
    | 'appendix'
    | 'paratext'
    | 'dox'
    | 'dox_pos'
    | 'dox_sec';
};

export type BlockType = Block['type'];

export type BlockExtraContext = NonNullable<Block['extraContext']>;

export type TypedBlock<T extends BlockType> = Extract<Block, { type: T }>;

export type ContentItem = Partial<Page> & { blocks: Block[] };
