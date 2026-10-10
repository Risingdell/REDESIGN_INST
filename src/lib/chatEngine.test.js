import { describe, expect, it } from 'vitest';
import { reply } from './chatEngine';
import { searchIndex } from '@/features/search/searchIndex';

describe('chat assistant', () => {
  it('greets', () => {
    expect(reply('hello', searchIndex).suggestions.length).toBeGreaterThan(0);
  });

  it('answers FAQs from site content', () => {
    const r = reply('do i need neet for mbbs?', searchIndex);
    expect(r.text).toMatch(/NEET-UG/);
    expect(r.links[0]).toBeTruthy();
  });

  it('answers with typos', () => {
    expect(reply('hostal accomodation', searchIndex).text).toMatch(/hostel/i);
  });

  it('hands off to a human on request', () => {
    expect(reply('can I talk to someone', searchIndex).handoff).toBe(true);
  });

  it('falls back gracefully', () => {
    expect(reply('qwxzv plorf', searchIndex).handoff).toBe(true);
  });
});
