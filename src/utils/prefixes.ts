// @see https://maximromanov.github.io/mARkdown/#-biographies-and-events
const biosAndEvents = [
  {
    prefix: '### $BIO_NLI$',
    context: 'names_list',
  },
  {
    prefix: '### $BIO_REF$',
    context: 'cross_reference_biography',
  },
  {
    prefix: '### $BIO_WOM$',
    context: 'woman_biography',
  },
  {
    prefix: '### $BIO_MAN$',
    context: 'man_biography',
  },
  {
    prefix: '### $CHR_RAW$',
    context: 'historical_events_batch',
  },
  {
    prefix: '### $CHR_EVE$',
    context: 'historical_events',
  },
  {
    prefix: '### $$$$',
    context: 'names_list',
  },
  {
    prefix: '### $$$',
    context: 'cross_reference_biography',
  },
  {
    prefix: '### $$',
    context: 'woman_biography',
  },
  {
    prefix: '### $',
    context: 'man_biography',
  },
  {
    prefix: '### @ RAW',
    context: 'historical_events_batch',
  },
  {
    prefix: '### @',
    context: 'historical_events',
  },
];

const dictionaries = [
  {
    prefix: '### $DIC_NIS$',
    context: 'dictionary_nis',
  },
  {
    prefix: '### $DIC_TOP$',
    context: 'dictionary_top',
  },
  {
    prefix: '### $DIC_LEX$',
    context: 'dictionary_lex',
  },
  {
    prefix: '### $DIC_BIB$',
    context: 'dictionary_bib',
  },
];

const dox = [
  {
    prefix: '### $DOX_POS$',
    context: 'dox_pos',
  },
  {
    prefix: '### $DOX_SEC$',
    context: 'dox_sec',
  },
  {
    prefix: '### $DOX_',
    context: 'dox',
  },
];

const other = [
  {
    prefix: '### |EDITOR|',
    context: 'editorial',
  },
  {
    prefix: '### |APPENDIX|',
    context: 'appendix',
  },
  {
    prefix: '### |PARATEXT|',
    context: 'paratext',
  },
];

export const prefixes = [...dictionaries, ...other, ...dox, ...biosAndEvents];
