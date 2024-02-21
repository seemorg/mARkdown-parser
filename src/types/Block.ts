export type Block = (
  | {
      type:
        | 'title'
        | 'header-1'
        | 'header-2'
        | 'header-3'
        | 'header-4'
        | 'header-5'
        | 'paragraph'
        | 'blockquote'
        | 'category';
      content: string;
    }
  | {
      type: 'pageNumber';
      content: {
        volume: string;
        page: string;
      };
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
    | 'hukum';
};

export type BlockType = Block['type'];

export type BlockExtraContext = NonNullable<Block['extraContext']>;

export type TypedBlock<T extends BlockType> = Extract<Block, { type: T }>;
