import { describe, expect, it } from 'vitest';
import { estimateFees } from './feeCalculator';

const schedule = {
  tuition: { bpt: { government: 60000, management: 120000 } },
  hostel: [
    { id: 'none', amount: 0 },
    { id: 'shared', amount: 85000 },
  ],
  transport: [
    { id: 'none', amount: 0 },
    { id: 'city', amount: 18000 },
  ],
  oneTime: [{ id: 'admission', amount: 15000 }],
  scholarships: [
    { id: 'none', percent: 0 },
    { id: 'merit', percent: 10 },
  ],
};

const base = { program: 'bpt', quota: 'management', hostel: 'none', transport: 'none', scholarship: 'none', durationYears: 4.5 };

describe('estimateFees', () => {
  it('returns null for unknown programmes', () => {
    expect(estimateFees({ ...base, program: 'nope' }, schedule)).toBeNull();
  });

  it('adds one-time charges to the first year only', () => {
    const r = estimateFees(base, schedule);
    expect(r.perYear).toBe(120000);
    expect(r.firstYear).toBe(135000);
    // 4.5 years → 4 billable years (internship carries no tuition)
    expect(r.billableYears).toBe(4);
    expect(r.wholeCourse).toBe(135000 + 120000 * 3);
  });

  it('applies scholarships to tuition only', () => {
    const r = estimateFees({ ...base, scholarship: 'merit', hostel: 'shared', transport: 'city' }, schedule);
    expect(r.scholarship).toBe(12000);
    expect(r.perYear).toBe(120000 - 12000 + 85000 + 18000);
    expect(r.lines.map((l) => l.label)).toEqual(['Tuition', 'Scholarship (10%)', 'Hostel', 'Transport']);
  });
});
