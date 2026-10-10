/**
 * Tiny declarative validation. A schema maps field → list of rules; each rule
 * returns an error message or null.
 */

export const rules = {
  required:
    (message = 'This field is required') =>
    (v) =>
      v === undefined || v === null || String(v).trim() === '' || v === false ? message : null,

  email:
    (message = 'Enter a valid email address') =>
    (v) =>
      !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()) ? null : message,

  // Indian mobile/landline: 10 digits, optional +91 / 0 prefix, spaces and dashes allowed.
  phone:
    (message = 'Enter a valid 10-digit phone number') =>
    (v) => {
      if (!v) return null;
      const digits = String(v).replace(/[\s-]/g, '').replace(/^(\+91|91|0)/, '');
      return /^\d{10}$/.test(digits) ? null : message;
    },

  minLength:
    (n, message = `Must be at least ${n} characters`) =>
    (v) =>
      !v || String(v).trim().length >= n ? null : message,

  number:
    ({ min = -Infinity, max = Infinity } = {}, message) =>
    (v) => {
      if (v === '' || v === undefined || v === null) return null;
      const num = Number(v);
      if (Number.isNaN(num)) return message || 'Enter a number';
      if (num < min || num > max) return message || `Enter a value between ${min} and ${max}`;
      return null;
    },

  pastDate:
    (message = 'Enter a date in the past') =>
    (v) =>
      !v || new Date(v) < new Date() ? null : message,
};

/** @returns {Record<string,string>} errors keyed by field (empty object when valid). */
export function validate(values, schema) {
  const errors = {};
  for (const [field, fieldRules] of Object.entries(schema)) {
    for (const rule of fieldRules) {
      const error = rule(values[field], values);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  }
  return errors;
}
