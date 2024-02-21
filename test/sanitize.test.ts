import { describe, expect, it } from 'vitest';
import { sanitizeLine } from '../src/utils/sanitize';

describe('sanitize', () => {
  it('should remove Milestone300', () => {
    expect(sanitizeLine('Milestone300')).toBe('');
  });

  it('should remove @YB, @YD, @YY, @YA', () => {
    expect(sanitizeLine('Hello @YB123 @YD456 @YY789 @YA012 World')).toBe(
      'Hello World'
    );
  });

  it('should remove @S and @SOC', () => {
    expect(sanitizeLine('Hello @S12 @SOC22 World')).toBe('Hello World');
  });

  it('should remove @P and @PER', () => {
    expect(sanitizeLine('Hello @P02 @PER15 World')).toBe('Hello World');
  });

  it('should remove @SRC', () => {
    expect(sanitizeLine('Hello @SRC123 World')).toBe('Hello World');
  });

  it('should remove #$#FROM, #$#TOWA, #$#DIST, #$#PROV, #$#REG, #$#REGX, #$#STTL ', () => {
    expect(
      sanitizeLine(
        'Hello #$#FROM #$#TOWA #$#DIST #$#PROV #$#REG #$#REGX #$#STTL World'
      )
    ).toBe('Hello World');
  });

  it('should remove @HUKM@ and @MATN@', () => {
    expect(sanitizeLine('Hello @HUKM@ @MATN@ World')).toBe('Hello World');
  });

  it('should remove msxx', () => {
    expect(sanitizeLine('Hello ms12 World')).toBe('Hello World');
  });
});
