import * as t from './utils/tags';
import {
  Age,
  Date as DateStructure,
  Document,
  Hemistich,
  Hukm,
  Isnad,
  Matn,
  NamedEntity,
  OpenTagAuto,
  OpenTagUser,
  PageNumber,
  Paragraph,
  Line,
  RouteDist,
  RouteFrom,
  RouteTowa,
  Verse,
  Milestone,
  SectionHeader,
  Editorial,
  Appendix,
  Paratext,
  DictionaryUnit,
  BioOrEvent,
  DoxographicalItem,
  MorphologicalPattern,
  TextPart,
  AdministrativeRegion,
  RouteOrDistance,
  Riwayat,
  SimpleMetadataField,
} from './utils/structures';
import { chunkAndPage, replaceChapterHeadings } from './utils/sanitizer';
import { rsplit } from './utils/functions';

const PAGE_PATTERN_GROUPED = new RegExp(`${t.PAGE}([^P]+)P(\\d+[AB]?)`);
const MILESTONE_PATTERN = /Milestone300|ms[A-Z]?\d+/;
const HEADER_PATTERN_GROUPED = /### (\|+)/;
const OPEN_TAG_CUSTOM_PATTERN_GROUPED =
  /@([^@]+?)@([^_@]+?)_([^_@]+?)(_([^_@]+?))?@/;
const OPEN_TAG_AUTO_PATTERN_GROUPED =
  /@([A-Z]{3})@([A-Z]{3,})@([A-Za-z]+)@(-@([0tf][ftalmr])@)?/;

const YEAR_PATTERN = [
  new RegExp(`${t.YEAR_AGE}\\d{1,4}`),
  new RegExp(`${t.YEAR_DEATH}\\d{1,4}`),
  new RegExp(`${t.YEAR_BIRTH}\\d{1,4}`),
  new RegExp(`${t.YEAR_OTHER}\\d{1,4}`),
];
const TOP_PATTERN = [
  new RegExp(`${t.TOP_FULL}\\d{1,2}`),
  new RegExp(`${t.TOP}\\d{1,2}`),
];
const PER_PATTERN = [
  new RegExp(`${t.PER_FULL}\\d{1,2}`),
  new RegExp(`${t.PER}\\d{1,2}`),
];
const SOC_PATTERN = [
  new RegExp(`${t.SOC_FULL}\\d{1,2}`),
  new RegExp(`${t.SOC}\\d{1,2}`),
];
const NAMED_ENTITIES_PATTERN = [
  ...YEAR_PATTERN,
  ...TOP_PATTERN,
  ...PER_PATTERN,
  new RegExp(`${t.SRC}\\d{1,2}`),
  ...SOC_PATTERN,
];

export function parseTags(s: string): string {
  return s; // Placeholder
}

export function removePhraseLvTags(s: string): string {
  let textOnly = s;
  t.PHRASE_LV_TAGS.forEach((tag) => {
    textOnly = textOnly.replace(tag, '');
  });
  NAMED_ENTITIES_PATTERN.forEach((tag) => {
    textOnly = textOnly.replace(tag, '');
  });
  textOnly = textOnly.replace(OPEN_TAG_CUSTOM_PATTERN_GROUPED, '');
  textOnly = textOnly.replace(OPEN_TAG_AUTO_PATTERN_GROUPED, '');
  textOnly = textOnly.replace(PAGE_PATTERN_GROUPED, '');
  return textOnly;
}

function parseLine(
  taggedIl: string,
  _index: number,
  obj: typeof Line = Line,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  firstToken: any | null = null
): Line | null {
  const il = taggedIl.replace(t.LINE, '');
  const textOnly = removePhraseLvTags(il);

  if (textOnly === '') {
    return null;
  }

  const line = new obj(il, textOnly);
  const tokens = il.split(
    new RegExp(
      `(${PAGE_PATTERN_GROUPED.source}|${MILESTONE_PATTERN.source}|${
        OPEN_TAG_AUTO_PATTERN_GROUPED.source
      }|${OPEN_TAG_CUSTOM_PATTERN_GROUPED.source}|${t.PHRASE_LV_TAGS.map(
        (tag) => `(${tag})`
      ).join('|')})`
    )
  );

  let includeWords = 0;

  if (firstToken) {
    line.addPart(new firstToken(''));
  }

  tokens.forEach((token) => {
    if (!token || token === '') return;

    const opentagMatch = token.match(OPEN_TAG_CUSTOM_PATTERN_GROUPED);
    const opentagAutoMatch = token.match(OPEN_TAG_AUTO_PATTERN_GROUPED);

    if (token.includes(t.PAGE)) {
      const m = PAGE_PATTERN_GROUPED.exec(token);
      if (m) line.addPart(new PageNumber(token, m[1], m[2]));
    } else if (MILESTONE_PATTERN.test(token)) {
      line.addPart(new Milestone(token));
    } else if (opentagMatch) {
      line.addPart(
        new OpenTagUser(
          token,
          opentagMatch[1],
          opentagMatch[2],
          opentagMatch[3],
          opentagMatch[5]
        )
      );
    } else if (opentagAutoMatch) {
      line.addPart(
        new OpenTagAuto(
          token,
          opentagAutoMatch[1],
          opentagAutoMatch[2],
          opentagAutoMatch[3],
          opentagAutoMatch[5]
        )
      );
    } else if (token.includes(t.HEMI)) {
      line.addPart(new Hemistich(token));
    } else if (token.includes(t.MATN)) {
      line.addPart(new Matn(token));
    } else if (token.includes(t.HUKM)) {
      line.addPart(new Hukm(token));
    } else if (token.includes(t.ROUTE_FROM)) {
      line.addPart(new RouteFrom(token));
    } else if (token.includes(t.ROUTE_TOWA)) {
      line.addPart(new RouteTowa(token));
    } else if (token.includes(t.ROUTE_DIST)) {
      line.addPart(new RouteDist(token));
    } else if (YEAR_PATTERN.some((pat) => pat.test(token))) {
      const type = token.startsWith(t.YEAR_BIRTH)
        ? 'birth'
        : token.startsWith(t.YEAR_DEATH)
        ? 'death'
        : 'other';
      line.addPart(
        new DateStructure(token, token.replace(t.YEAR_BIRTH, ''), type)
      );
    } else if (token.includes(t.YEAR_AGE)) {
      line.addPart(new Age(token, token.replace(t.YEAR_AGE, '')));
    } else if (NAMED_ENTITIES_PATTERN.some((pat) => pat.test(token))) {
      const val = token.replace(t.SOC, '');
      includeWords = parseInt(val[1]);
      line.addPart(
        new NamedEntity(token, parseInt(val[0]), includeWords, '', 'soc')
      );
    } else {
      if (includeWords > 0) {
        let rest = '';
        const words = token.split(' ');
        words.forEach((word, pos) => {
          if (pos < includeWords)
            line.parts[line.parts.length - 1].orig += word + ' ';
          else rest += word + ' ';
        });
        if (rest) line.addPart(new TextPart(rest));
        includeWords = 0;
      } else {
        line.addPart(new TextPart(token));
      }
    }
  });

  return line;
}

function _parser(text: string, strict = false): Document {
  const document = new Document(text);
  const ilines = text.split('\n');
  const magicValue = ilines[0].trim();

  if (strict && magicValue !== '######OpenITI#') {
    throw new Error(
      'This does not appear to be an OpenITI mARkdown document (strict mode)'
    );
  }

  document.setMagicValue(magicValue);

  ilines.forEach((il, i) => {
    if (il.startsWith(t.META)) {
      if (il === t.METAEND) return;
      const value = il.split(t.META, 2)[1].trim();
      document.setSimpleMetadataField(il, value);
    } else if (il.startsWith(t.PAGE)) {
      const pv = PAGE_PATTERN_GROUPED.exec(il);
      if (pv) document.addContent(new PageNumber(il, pv[1], pv[2]));
    } else if (il.startsWith(t.RWY)) {
      document.addContent(new Riwayat());
      const firstLine = parseLine(il.slice(7), i, Line, Isnad);
      if (firstLine) document.addContent(firstLine);
    } else if (il.startsWith(t.ROUTE_FROM)) {
      const content = parseLine(il, i, RouteOrDistance);
      if (content) document.addContent(content);
    } else if (new RegExp(`#~:([^:]+?):`).test(il)) {
      const m = il.match(/#~:([^:]+?):/);
      if (m) document.addContent(new MorphologicalPattern(il, m[1]));
    } else if (/^#($|[^#])/.test(il)) {
      if (il.includes(t.HEMI)) {
        const content = parseLine(il.slice(1), i, Verse);
        if (content) document.addContent(content);
      } else {
        document.addContent(new Paragraph());
        const firstLine = parseLine(il.slice(1), i);
        if (firstLine) document.addContent(firstLine);
      }
    } else if (il.startsWith(t.LINE)) {
      const content = parseLine(il, i);
      if (content) document.addContent(content);
    } else if (il.startsWith(t.EDITORIAL)) {
      document.addContent(new Editorial(il));
    } else if (il.startsWith(t.APPENDIX)) {
      document.addContent(new Appendix(il));
    } else if (il.startsWith(t.PARATEXT)) {
      document.addContent(new Paratext(il));
    } else if (il.startsWith(t.HEADER)) {
      const value = il.replace(HEADER_PATTERN_GROUPED, '');
      const headerLevel = il.match(HEADER_PATTERN_GROUPED)?.[1].length || 0;
      document.addContent(new SectionHeader(il, value, headerLevel));
    } else if (il.startsWith(t.DIC)) {
      const noTag = il.replace(new RegExp(t.DICTIONARIES.join('|')), '');
      const firstLine = parseLine(noTag, i);
      const dicType = il.includes(t.DIC_LEX)
        ? 'lex'
        : il.includes(t.DIC_NIS)
        ? 'nis'
        : 'top';
      document.addContent(new DictionaryUnit(il, dicType));
      if (firstLine) document.addContent(firstLine);
    } else if (il.startsWith(t.DOX)) {
      const noTag = il.replace(new RegExp(t.DOXOGRAPHICAL.join('|')), '');
      const firstLine = parseLine(noTag, i);
      const doxType = il.includes(t.DOX_SEC) ? 'sec' : 'pos';
      document.addContent(new DoxographicalItem(il, doxType));
      if (firstLine) document.addContent(firstLine);
    } else if (/^(### \$BIO_|### @|### \$)/.test(il)) {
      const noTag = il.replace(new RegExp(t.BIOS_EVENTS.join('|')), '');
      const firstLine = parseLine(noTag, i);
      const beType = il.includes(t.BIO_WOM)
        ? 'wom'
        : il.includes(t.BIO_REF)
        ? 'ref'
        : 'event';
      document.addContent(new BioOrEvent(il, beType));
      if (firstLine) document.addContent(firstLine);
    } else if (/^(\$PROV|\$REG)/.test(il)) {
      document.addContent(new AdministrativeRegion(il));
    }
  });

  return document;
}

export function parser(_text: string, strict = false) {
  const parsed = _parser(replaceChapterHeadings(_text), strict);
  const cleanedText = chunkAndPage(parsed.getCleanText());
  const metadata = parsed.simpleMetadata;

  let lines = cleanedText.split(/\r?\n/);

  if (lines.length > 0 && lines[0] === 'a11b00a11b000') {
    lines = lines.slice(1);
  }

  let lastVolNum: string | null = null;
  let lastPageNum = '0';
  let pageCount = 1;

  const pages = [];
  for (let _line of lines) {
    let chapters: string[] = [];
    if (
      !_line ||
      (!/^\s*$/.test(_line) && !/a11b\d{2}a11b\d{3,}/.test(_line))
    ) {
      _line = _line + 'a11b00a11b000';
    }

    const line = _line.trim();
    let [text, volNum, pageNum] = rsplit(line, 'a11b', 2);

    if (volNum === '00' && lastVolNum !== null) {
      volNum = lastVolNum;
    } else if (volNum === '00' && lastVolNum === null) {
      volNum = '01';
    } else {
      lastVolNum = volNum.replace(/^0+/, '');
    }

    if (pageNum === '000') {
      pageNum = (parseInt(lastPageNum) + 1).toString();
    }
    lastPageNum = pageNum;

    if (text.startsWith('</p><p>')) {
      text = text.slice('</p>'.length);
    }
    if (text.endsWith('</p><p>')) {
      text = text.slice(0, -'</p><p>'.length);
    }

    if (text.includes('h1')) {
      chapters =
        text
          .match(/<h1>(.*?)<\/h1>/gs)
          ?.map((match) => match.replace(/<\/?h1>/g, '')) || [];
    }

    const page_data = {
      volume: Number(volNum),
      page: Number(pageNum),
      text: text,
      chapterHeadings: chapters,
      order: pageCount,
    };

    pages.push(page_data);
    pageCount += 1;
  }

  return {
    pages,
    pageCount,
    metadata: metadata.reduce((acc, cur) => {
      if (cur instanceof SimpleMetadataField) {
        const { key, value } = cur.getKeyAndValue();
        if (key) {
          acc[key] = value;
        }
      }

      return acc;
    }, {} as Record<string, string>),
  };
}
