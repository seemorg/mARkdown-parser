export const META = '#META#';
export const METAEND = '#META#Header#End#';
export const PAGE = 'PageV';
export const HEMI = '%~%';
export const LINE = '~~';
export const MILESTONE = 'Milestone300';
export const HEADER = '### |';
export const EDITORIAL = '### |EDITOR|';
export const APPENDIX = '### |APPENDIX|';
export const PARATEXT = '### |PARATEXT|';
export const DIC = '### $DIC_';
export const DIC_NIS = '### $DIC_NIS$';
export const DIC_TOP = '### $DIC_TOP$';
export const DIC_LEX = '### $DIC_LEX$';
export const DIC_BIB = '### $DIC_BIB$';
export const BIO = '### $BIO_';
export const BIO_MAN = '### $';
export const BIO_MAN_FULL = '### $BIO_MAN$';
export const BIO_WOM = '### $$';
export const BIO_WOM_FULL = '### $BIO_WOM$';
export const BIO_REF = '### $$$';
export const BIO_REF_FULL = '### $BIO_REF$';
export const LIST_NAMES = '### $$$$';
export const LIST_NAMES_FULL = '### $BIO_NLI$';
export const EVENT = '### @';
export const EVENT_FULL = '### $CHR_EVE$';
export const LIST_EVENTS = '### @ RAW';
export const LIST_EVENTS_FULL = '### $CHR_RAW$';
export const DOX = '### $DOX_';
export const DOX_POS = '### $DOX_POS$';
export const DOX_SEC = '### $DOX_SEC$';
export const YEAR_BIRTH = '@YB';
export const YEAR_DEATH = '@YD';
export const YEAR_OTHER = '@YY';
export const YEAR_AGE = '@YA';
export const TOP = '@T';
export const TOP_FULL = '@TOP';
export const PER = '@P';
export const PER_FULL = '@PER';
export const SRC = '@SRC';
export const SOC = '@S';
export const SOC_FULL = '@SOC';
export const PROV = '#$#PROV';
export const GEO_TYPE = '#$#TYPE';
export const REG = '#$#REG';
export const STTL = '#$#STTL';
export const ROUTE_FROM = '#$#FROM';
export const ROUTE_TOWA = '#$#TOWA';
export const ROUTE_DIST = '#$#DIST';
export const RWY = '# $RWY$';
export const MATN = '@MATN@';
export const HUKM = '@HUKM@';

// GROUPS
export const DICTIONARIES = [DIC_NIS, DIC_TOP, DIC_LEX, DIC_BIB];
export const BIOS_EVENTS = [
  LIST_NAMES_FULL,
  LIST_NAMES,
  BIO_WOM_FULL,
  BIO_MAN_FULL,
  BIO_REF_FULL,
  LIST_EVENTS,
  EVENT,
  BIO_REF,
  BIO_WOM,
  BIO_MAN,
  EVENT_FULL,
  LIST_EVENTS_FULL,
];
export const DOXOGRAPHICAL = [DOX_POS, DOX_SEC];
export const NAMED_ENTITIES = [
  YEAR_BIRTH,
  YEAR_DEATH,
  YEAR_OTHER,
  YEAR_AGE,
  TOP,
  TOP_FULL,
  PER,
  PER_FULL,
  SRC,
  SOC,
  SOC_FULL,
];
export const RWY_PARTS = [MATN, HUKM];
export const ROUTE_PARTS = [ROUTE_FROM, ROUTE_TOWA, ROUTE_DIST];
export const PHRASE_LV_TAGS = [HEMI, ...RWY_PARTS, ...ROUTE_PARTS];
