import { useCallback, useState } from 'react';
import { validate } from '@/lib/validators';

/**
 * Minimal form state: values, per-field errors shown after blur/submit, and
 * a submit wrapper with pending/success/error status.
 */
export function useForm(initialValues, schema = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | pending | success | error
  const [serverError, setServerError] = useState('');

  const setField = useCallback(
    (name, value) => {
      setValues((v) => {
        const next = { ...v, [name]: value };
        if (touched[name]) setErrors((e) => ({ ...e, [name]: validate(next, { [name]: schema[name] || [] })[name] }));
        return next;
      });
    },
    [schema, touched],
  );

  const bind = (name) => ({
    name,
    value: values[name] ?? '',
    error: touched[name] ? errors[name] : undefined,
    onChange: (e) => setField(name, e.target.type === 'checkbox' ? e.target.checked : e.target.value),
    onBlur: () => {
      setTouched((t) => ({ ...t, [name]: true }));
      setErrors((e) => ({ ...e, [name]: validate(values, { [name]: schema[name] || [] })[name] }));
    },
  });

  /** Validates `fields` (or the whole schema). Returns true when valid. */
  const check = (fields = Object.keys(schema)) => {
    const subset = Object.fromEntries(fields.map((f) => [f, schema[f] || []]));
    const found = validate(values, subset);
    setErrors((e) => ({ ...e, ...Object.fromEntries(fields.map((f) => [f, found[f]])) }));
    setTouched((t) => ({ ...t, ...Object.fromEntries(fields.map((f) => [f, true])) }));
    const firstInvalid = fields.find((f) => found[f]);
    if (firstInvalid) document.querySelector(`[name="${firstInvalid}"]`)?.focus();
    return !firstInvalid;
  };

  const handleSubmit = (action) => async (e) => {
    e?.preventDefault();
    if (!check()) return;
    setStatus('pending');
    setServerError('');
    try {
      await action(values);
      setStatus('success');
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setStatus('idle');
  };

  return { values, setValues, setField, bind, check, errors, status, serverError, handleSubmit, reset };
}
