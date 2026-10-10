import { useState } from 'react';
import { env } from '@/config/site';
import { programs } from '@/content/programs';
import { useForm } from '@/hooks/useForm';
import { rules } from '@/lib/validators';
import { submit } from '@/services/apiClient';
import { Button } from '@/components/ui/Button';
import { CheckField, SelectField, TextField } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';

const schema = {
  name: [rules.required('Please tell us your name'), rules.minLength(2)],
  phone: [rules.required('We need a number to call you back'), rules.phone()],
  email: [rules.email()],
  consent: [rules.required('Please allow us to contact you')],
};

const interestOptions = [
  { group: 'Programmes', options: programs.map((p) => ({ value: p.slug, label: `${p.title} — ${p.fullTitle}` })) },
  {
    group: 'Other',
    options: [
      { value: 'hospital', label: 'Hospital / appointment' },
      { value: 'visit', label: 'Campus visit' },
      { value: 'other', label: 'Something else' },
    ],
  },
];

export function DemoNote() {
  if (!env.demoMode) return null;
  return (
    <p className="form-note">
      <Icon name="info" />
      Preview mode: submissions are saved in this browser only until the website's form API is connected.
    </p>
  );
}

/** Lead-capture form ("Communication"). Used in the drawer, contact page and chat hand-off. */
export function EnquiryForm({ topic = '', defaultInterest = '', onDone }) {
  const [reference, setReference] = useState('');
  const form = useForm(
    { name: '', phone: '', email: '', interest: defaultInterest, message: topic, preferredTime: 'any', consent: false },
    schema,
  );

  if (form.status === 'success') {
    return (
      <div className="success-panel" role="status">
        <span className="success-panel__icon">
          <Icon name="check" />
        </span>
        <h3>Thank you, {form.values.name.split(' ')[0]}!</h3>
        <p className="muted">An admissions counsellor will call you within one working day.</p>
        <p>
          Your reference: <span className="reference">{reference}</span>
        </p>
        {onDone && (
          <Button variant="outline" onClick={onDone}>
            Close
          </Button>
        )}
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(async (values) => {
        const res = await submit('enquiries', values, { referencePrefix: 'ENQ' });
        setReference(res.reference);
      })}
      className="form-grid"
    >
      <TextField label="Full name" required autoComplete="name" {...form.bind('name')} />
      <TextField label="Phone" required type="tel" inputMode="tel" autoComplete="tel" hint="We'll call or WhatsApp you" {...form.bind('phone')} />
      <TextField label="Email" type="email" autoComplete="email" {...form.bind('email')} />
      <SelectField label="Interested in" placeholder="Choose a programme or topic" options={interestOptions} {...form.bind('interest')} />
      <SelectField
        label="Best time to call"
        className="span-2"
        options={[
          { value: 'any', label: 'Any time (9 am – 5 pm)' },
          { value: 'morning', label: 'Morning (9 am – 12 pm)' },
          { value: 'afternoon', label: 'Afternoon (2 pm – 5 pm)' },
        ]}
        {...form.bind('preferredTime')}
      />
      <TextField as="textarea" label="Your question" className="span-2" rows={4} maxLength={1000} {...form.bind('message')} />
      <CheckField
        className="span-2"
        label="I agree to be contacted by Kanachur Islamic Education Trust about my enquiry."
        {...form.bind('consent')}
      />
      {form.serverError && <p className="alert alert--error span-2">{form.serverError}</p>}
      <div className="span-2" style={{ display: 'grid', gap: 12 }}>
        <Button type="submit" variant="gold" size="lg" block loading={form.status === 'pending'} icon="send">
          Send enquiry
        </Button>
        <DemoNote />
      </div>
    </form>
  );
}
