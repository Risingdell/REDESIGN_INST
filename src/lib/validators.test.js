import { describe, expect, it } from 'vitest';
import { rules, validate } from './validators';

describe('validators', () => {
  it('accepts Indian phone formats', () => {
    const phone = rules.phone();
    for (const ok of ['9876543210', '+91 98765 43210', '0824-2888999', '091 9876543210'.replace('091', '0')]) {
      expect(phone(ok)).toBeNull();
    }
    expect(phone('12345')).toMatch(/10-digit/);
  });

  it('validates emails', () => {
    expect(rules.email()('dean@kanachur.edu.in')).toBeNull();
    expect(rules.email()('dean@kanachur')).toMatch(/valid/);
  });

  it('stops at the first failing rule per field', () => {
    const errors = validate(
      { name: '', email: 'bad' },
      { name: [rules.required(), rules.minLength(2)], email: [rules.required(), rules.email()] },
    );
    expect(errors).toEqual({ name: 'This field is required', email: 'Enter a valid email address' });
  });

  it('treats an unticked consent box as missing', () => {
    expect(validate({ consent: false }, { consent: [rules.required('Please agree')] })).toEqual({ consent: 'Please agree' });
  });
});
