import { useState } from 'react';
import { useForm } from '@/hooks/useForm';
import { rules } from '@/lib/validators';
import { submit } from '@/services/apiClient';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { SelectField, TextField } from '@/components/ui/Field';
import { DemoNote } from '@/features/enquiry/EnquiryForm';

const schema = {
  name: [rules.required('Please add your name')],
  relation: [rules.required('Tell us how you know Kanachur')],
  story: [rules.required('Share a few words'), rules.minLength(30, 'Please write at least 30 characters')],
};

/** "Community": alumni/students/patients share stories, moderated before publishing. */
export function ReviewForm({ heading = 'Share your Kanachur story' }) {
  const [rating, setRating] = useState(5);
  const form = useForm({ name: '', relation: '', batch: '', story: '' }, schema);

  if (form.status === 'success') {
    return (
      <div className="success-panel" role="status">
        <span className="success-panel__icon">
          <Icon name="heart" />
        </span>
        <h3>Thank you for sharing!</h3>
        <p className="muted">Our team reviews every story before it appears on the website.</p>
      </div>
    );
  }

  return (
    <form noValidate className="form-grid" onSubmit={form.handleSubmit((v) => submit('stories', { ...v, rating }))}>
      <h3 className="span-2">{heading}</h3>
      <TextField label="Your name" required autoComplete="name" {...form.bind('name')} />
      <SelectField
        label="I am a…"
        required
        placeholder="Select"
        options={[
          { value: 'alumni', label: 'Graduate / alumnus' },
          { value: 'student', label: 'Current student' },
          { value: 'parent', label: 'Parent' },
          { value: 'patient', label: 'Patient or family' },
        ]}
        {...form.bind('relation')}
      />
      <TextField label="Programme & batch (optional)" placeholder="e.g. MBBS 2018" {...form.bind('batch')} />
      <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="field__label">Your rating</legend>
        <div className="rating-input">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" aria-label={`${n} star${n > 1 ? 's' : ''}`} aria-pressed={rating === n} onClick={() => setRating(n)}>
              <Icon name="star" style={{ opacity: n <= rating ? 1 : 0.25 }} />
            </button>
          ))}
        </div>
      </fieldset>
      <TextField as="textarea" rows={5} className="span-2" label="Your story" required maxLength={1200} {...form.bind('story')} />
      {form.serverError && <p className="alert alert--error span-2">{form.serverError}</p>}
      <div className="span-2" style={{ display: 'grid', gap: 12 }}>
        <Button type="submit" variant="gold" loading={form.status === 'pending'} iconLeft="send">
          Submit for review
        </Button>
        <DemoNote />
      </div>
    </form>
  );
}
