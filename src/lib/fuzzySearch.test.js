import { describe, expect, it } from 'vitest';
import { editDistance, normalize, search, tokenScore } from './fuzzySearch';
import { searchIndex } from '@/features/search/searchIndex';

const top = (q) => search(searchIndex, q, { limit: 3 })[0];

describe('normalize', () => {
  it('lowercases, strips punctuation and accents', () => {
    expect(normalize('B.Sc Nursing')).toBe('bsc nursing');
    expect(normalize('Café — Kanachur’s')).toBe('cafe kanachurs');
  });
});

describe('editDistance', () => {
  it('counts swaps as a single edit', () => {
    expect(editDistance('nusring', 'nursing')).toBe(1);
  });
  it('stops early past the max', () => {
    expect(editDistance('abc', 'xyzxyz', 1)).toBeGreaterThan(1);
  });
});

describe('tokenScore', () => {
  it('ranks exact > prefix > typo', () => {
    expect(tokenScore('mbbs', 'mbbs')).toBe(1);
    expect(tokenScore('physio', 'physiotherapy')).toBeGreaterThan(tokenScore('phisio', 'physiotherapy'));
    expect(tokenScore('xy', 'mbbs')).toBe(0);
  });
});

describe('site search', () => {
  it('finds programmes by exact name', () => {
    expect(top('MBBS').id).toBe('program-mbbs');
  });

  it('tolerates typos', () => {
    expect(top('phisiotherapy').id).toMatch(/bpt|mpt|kcop/);
    expect(top('nursng').id).toMatch(/nursing|kcon/);
    expect(top('ayurvedha').id).toMatch(/bams|knamc/);
  });

  it('understands synonyms and intent', () => {
    expect(top('doctor').id).toMatch(/mbbs|appointment|kims/);
    expect(top('hostel fees')).toBeTruthy();
    expect(top('ambulance').id).toBe('faq-emergency');
  });

  it('returns nothing for gibberish', () => {
    expect(search(searchIndex, 'zzqxv')).toEqual([]);
  });
});
