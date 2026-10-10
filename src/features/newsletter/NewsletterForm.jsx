import { useId } from 'react';
import { useForm } from '@/hooks/useForm';
import { rules } from '@/lib/validators';
import { submit } from '@/services/apiClient';
import { Icon } from '@/components/ui/Icon';
import './NewsletterForm.css';

const schema = { email: [rules.required('Enter your email'), rules.email()] };

export function NewsletterForm({ compact = false }) {
  const form = useForm({ email: '' }, schema);
  const field = form.bind('email');
  const id = useId();

  if (form.status === 'success') {
    return (
      <p className="newsletter__done" role="status">
        <Icon name="check-circle" size={18} /> You're subscribed. Watch your inbox for the next issue.
      </p>
    );
  }

  return (
    <form className={`newsletter${compact ? ' newsletter--compact' : ''}`} onSubmit={form.handleSubmit((v) => submit('newsletter', v))} noValidate>
      <label htmlFor={id} className="visually-hidden">
        Email address
      </label>
      <div className="newsletter__row">
        <input
          id={id}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="input"
          aria-invalid={field.error ? 'true' : undefined}
          aria-describedby={field.error ? `${id}-error` : undefined}
          name={field.name}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
        />
        <button type="submit" className="btn btn--gold" disabled={form.status === 'pending'} aria-label="Subscribe">
          {form.status === 'pending' ? <span className="spinner" /> : <Icon name="send" />}
        </button>
      </div>
      {field.error && (
        <span id={`${id}-error`} className="field__error" role="alert">
          {field.error}
        </span>
      )}
      {form.serverError && <span className="field__error">{form.serverError}</span>}
    </form>
  );
}
