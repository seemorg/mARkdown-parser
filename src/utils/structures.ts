// structures.ts

export type LiteralType<T extends string> = T;

export class MagicValue {
  orig: string;
  value: string;

  constructor(orig: string) {
    this.orig = orig;
    this.value = '######OpenITI#';
  }

  toString(): string {
    return this.value;
  }
}

export class SimpleMetadataField {
  orig: string;
  value: string;

  constructor(orig: string, value: string) {
    this.orig = orig;
    this.value = value;
  }

  getKeyAndValue(): { key: string; value: string } {
    const [key, v] = this.value.split('\t::');

    // remove NNN. from the beginning of the key
    const finalKey = key.replace(/^[0-9]+./, '');
    const finalValue = v.trim();

    return { key: finalKey, value: finalValue };
  }

  toString(): string {
    return this.value;
  }
}

export class LinePart {
  orig: string;

  constructor(orig: string) {
    this.orig = orig;
  }

  toString(): string {
    return this.orig;
  }
}

export class TextPart extends LinePart {
  text: string;

  constructor(orig: string) {
    super(orig);
    this.text = orig;
  }

  toString(): string {
    return this.text;
  }
}

export class Date extends LinePart {
  value: string;
  dateType: LiteralType<'birth' | 'death' | 'age' | 'other'>;

  constructor(
    orig: string,
    value: string,
    dateType: 'birth' | 'death' | 'age' | 'other'
  ) {
    super(orig);
    this.value = value;
    this.dateType = dateType;
  }

  toString(): string {
    return this.orig;
  }
}

export class Age extends LinePart {
  value: string;

  constructor(orig: string, value: string) {
    super(orig);
    this.value = value;
  }

  toString(): string {
    return this.orig;
  }
}

export class NamedEntity extends LinePart {
  text: string;
  prefix: number;
  extent: number;
  neType: LiteralType<'top' | 'per' | 'soc' | 'src'>;

  constructor(
    orig: string,
    prefix: number,
    extent: number,
    text: string,
    neType: 'top' | 'per' | 'soc' | 'src'
  ) {
    super(orig);
    this.text = text;
    this.prefix = prefix;
    this.extent = extent;
    this.neType = neType;
  }

  toString(): string {
    return this.text;
  }
}

export class OpenTagUser extends LinePart {
  user: string;
  tType: string;
  tSubtype: string;
  tSubsubtype: string;

  constructor(
    orig: string,
    user: string,
    tType: string,
    tSubtype: string,
    tSubsubtype: string
  ) {
    super(orig);
    this.user = user;
    this.tType = tType;
    this.tSubtype = tSubtype;
    this.tSubsubtype = tSubsubtype;
  }

  toString(): string {
    return this.orig;
  }
}

export class OpenTagAuto extends LinePart {
  resp: string;
  tType: string;
  category: string;
  review: string;

  constructor(
    orig: string,
    resp: string,
    tType: string,
    category: string,
    review: string
  ) {
    super(orig);
    this.resp = resp;
    this.tType = tType;
    this.category = category;
    this.review = review;
  }

  toString(): string {
    return this.orig;
  }
}

export class Milestone extends LinePart {
  toString(): string {
    return '';
  }
}

export class Isnad extends LinePart {}

export class Matn extends LinePart {}

export class Hukm extends LinePart {}

export class Line {
  orig: string;
  textOnly: string;
  parts: LinePart[];

  constructor(orig: string, textOnly: string, parts: LinePart[] = []) {
    this.orig = orig;
    this.textOnly = textOnly;
    this.parts = parts;
  }

  addPart(part: LinePart): void {
    this.parts.push(part);
  }

  toString(): string {
    return this.parts.map((p) => p.toString()).join('');
  }
}

export class PageNumber extends LinePart {
  page: string;
  volume: string;

  constructor(orig: string, vol: string, page: string) {
    super(orig);
    this.volume = vol;
    this.page = page;
  }

  toString(): string {
    return `Vol. ${this.volume}, p. ${this.page}`;
  }
}

export class Content {
  orig: string;

  constructor(orig: string) {
    this.orig = orig;
  }

  toString(): string {
    return this.orig;
  }
}

export class Verse extends Line {}

export class Hemistich extends LinePart {}

export class Paragraph extends Content {
  constructor(orig = '#') {
    super(orig);
  }

  toString(): string {
    return '';
  }
}

export class SectionHeader extends Content {
  value: string;
  level: number;

  constructor(orig: string, value: string, level: number) {
    super(orig);
    this.value = value;
    this.level = level;
  }

  toString(): string {
    return this.value;
  }
}

export class Editorial extends Content {
  toString(): string {
    return '';
  }
}

export class Appendix extends Content {
  toString(): string {
    return '';
  }
}

export class Paratext extends Content {
  toString(): string {
    return '';
  }
}

export class DictionaryUnit extends Content {
  dicType: LiteralType<'nis' | 'top' | 'lex' | 'bib'>;

  constructor(orig: string, dicType: 'nis' | 'top' | 'lex' | 'bib') {
    super(orig);
    this.dicType = dicType;
  }

  toString(): string {
    return '';
  }
}

export class BioOrEvent extends Content {
  beType: LiteralType<'man' | 'wom' | 'ref' | 'names' | 'event' | 'events'>;

  constructor(
    orig: string,
    beType: 'man' | 'wom' | 'ref' | 'names' | 'event' | 'events'
  ) {
    super(orig);
    this.beType = beType;
  }

  toString(): string {
    return '';
  }
}

export class DoxographicalItem extends Content {
  doxType: LiteralType<'pos' | 'sec'>;

  constructor(orig: string, doxType: 'pos' | 'sec') {
    super(orig);
    this.doxType = doxType;
  }

  toString(): string {
    return this.orig;
  }
}

export class MorphologicalPattern extends Content {
  category: string;

  constructor(orig: string, category: string) {
    super(orig);
    this.category = category;
  }

  toString(): string {
    return '';
  }
}

export class AdministrativeRegion extends Content {
  toString(): string {
    return '';
  }
}

export class RouteOrDistance extends Line {}

export class RouteFrom extends LinePart {}

export class RouteTowa extends LinePart {}

export class RouteDist extends LinePart {}

export class Riwayat extends Paragraph {}

export class Document {
  origText: string;
  simpleMetadata: (MagicValue | SimpleMetadataField)[];
  content: Content[];

  constructor(text: string) {
    this.origText = text;
    this.simpleMetadata = [];
    this.content = [];
  }

  setMagicValue(orig: string): void {
    this.simpleMetadata.push(new MagicValue(orig));
  }

  setSimpleMetadataField(orig: string, value: string): void {
    this.simpleMetadata.push(new SimpleMetadataField(orig, value));
  }

  addContent(content: Content): void {
    this.content.push(content);
  }

  getCleanText(includeMetadata = false): string {
    let text = '';
    if (includeMetadata) {
      text += 'Metadata:\n';
      text +=
        this.simpleMetadata.map((md) => md.toString()).join('\n') + '\n\n';
    }
    text += this.content.map((c) => c.toString()).join('\n');
    return text;
  }

  toString(): string {
    return this.origText;
  }
}
