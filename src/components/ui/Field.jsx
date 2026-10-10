import { useId } from 'react';
import { cx } from '@/lib/format';
import { Icon } from './Icon';

/**
 * Labelled form controls with hint and error wiring (aria-describedby,
 * aria-invalid). Spread `form.bind('name')` from useForm into them.
 */
function FieldShell({ label, hint, error, required, className, children, id }) {
  return (
    <div className={cx('field', error && 'field--error', className)}>
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
          {required && (
            <span className="req" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {hint && !error && (
        <span className="field__hint" id={`${id}-hint`}>
          {hint}
        </span>
      )}
      {error && (
        <span className="field__error" id={`${id}-error`} role="alert">
          <Icon name="info" size={16} />
          {error}
        </span>
      )}
    </div>
  );
}

const describedBy = (id, hint, error) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

export function TextField({ label, hint, error, required, className, as = 'input', ...props }) {
  const id = useId();
  const Control = as;
  return (
    <FieldShell {...{ label, hint, error, required, className, id }}>
      <Control
        id={id}
        className={as === 'textarea' ? 'textarea' : 'input'}
        aria-invalid={error ? 'true' : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...props}
      />
    </FieldShell>
  );
}

export function SelectField({ label, hint, error, required, className, options, placeholder, ...props }) {
  const id = useId();
  return (
    <FieldShell {...{ label, hint, error, required, className, id }}>
      <select
        id={id}
        className="select"
        aria-invalid={error ? 'true' : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) =>
          o.group ? (
            <optgroup key={o.group} label={o.group}>
              {o.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </optgroup>
          ) : (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ),
        )}
      </select>
    </FieldShell>
  );
}

export function CheckField({ label, error, className, value, ...props }) {
  const id = useId();
  return (
    <div className={cx('field', error && 'field--error', className)}>
      <label className="check" htmlFor={id}>
        <input id={id} type="checkbox" checked={Boolean(value)} aria-invalid={error ? 'true' : undefined} {...props} />
        <span>{label}</span>
      </label>
      {error && (
        <span className="field__error" role="alert">
          <Icon name="info" size={16} />
          {error}
        </span>
      )}
    </div>
  );
}
