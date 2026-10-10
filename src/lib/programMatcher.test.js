import { describe, expect, it } from 'vitest';
import { matchPrograms } from './programMatcher';
import { programs } from '@/content/programs';

const top = (answers) => matchPrograms(programs, answers).map((m) => m.program.slug);

describe('matchPrograms', () => {
  it('recommends MBBS to a NEET-taking medicine aspirant', () => {
    expect(top({ interest: 'medicine', stage: 'ug', neet: 'yes' })[0]).toBe('mbbs');
  });

  it('never recommends NEET programmes to someone without NEET', () => {
    const slugs = top({ interest: 'medicine', stage: 'ug', neet: 'no' });
    expect(slugs).not.toContain('mbbs');
    expect(slugs).not.toContain('bams');
  });

  it('routes graduates to postgraduate programmes', () => {
    expect(top({ interest: 'physiotherapy', stage: 'pg', neet: 'no' })[0]).toBe('mpt');
  });

  it('never suggests postgraduate programmes after Class 12', () => {
    const slugs = top({ interest: 'physiotherapy', stage: 'ug', neet: 'no' });
    expect(slugs[0]).toBe('bpt');
    expect(slugs).not.toContain('mpt');
    expect(slugs).not.toContain('md-ms');
  });

  it('sends Class 10 leavers to pre-university', () => {
    expect(top({ interest: 'nursing', stage: 'school', neet: 'unsure' })).toEqual(['puc-science']);
  });

  it('gives a percentage for every result', () => {
    for (const m of matchPrograms(programs, { interest: 'pharmacy', stage: 'ug', neet: 'unsure' })) {
      expect(m.percent).toBeGreaterThan(0);
      expect(m.percent).toBeLessThan(100);
    }
  });
});
