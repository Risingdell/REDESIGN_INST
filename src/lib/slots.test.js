import { describe, expect, it } from 'vitest';
import { formatSlot, timeSlots, upcomingDays } from './slots';
import { buildICS } from './calendar';

describe('booking slots', () => {
  it('skips closed weekdays', () => {
    const days = upcomingDays(10, { from: new Date(2026, 9, 10) });
    expect(days).toHaveLength(10);
    expect(days.every((d) => d.getDay() !== 0)).toBe(true);
  });

  it('skips the lunch hour', () => {
    const slots = timeSlots({ startHour: 12, endHour: 15, step: 30 });
    expect(slots).toEqual(['12:00', '12:30', '14:00', '14:30']);
  });

  it('formats 12-hour times', () => {
    expect(formatSlot('09:30')).toBe('9:30 AM');
    expect(formatSlot('12:00')).toBe('12:00 PM');
    expect(formatSlot('14:00')).toBe('2:00 PM');
  });
});

describe('calendar export', () => {
  it('builds a valid VEVENT with escaped text', () => {
    const ics = buildICS({ title: 'Campus visit, Kanachur', start: '2026-10-12T10:00:00Z', durationMinutes: 90 });
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('DTSTART:20261012T100000Z');
    expect(ics).toContain('DTEND:20261012T113000Z');
    expect(ics).toContain('SUMMARY:Campus visit\\, Kanachur');
  });
});
