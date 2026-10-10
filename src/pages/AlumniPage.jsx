import { useState } from 'react';
import { programs } from '@/content/programs';
import { site } from '@/config/site';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useForm } from '@/hooks/useForm';
import { rules } from '@/lib/validators';
import { submit } from '@/services/apiClient';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SelectField, TextField, CheckField } from '@/components/ui/Field';
import { Testimonials } from '@/features/community/Testimonials';
import { ReviewForm } from '@/features/community/ReviewForm';
import { DemoNote } from '@/features/enquiry/EnquiryForm';
import './pages.css';

const schema = {
  name: [rules.required('Please enter your name')],
  email: [rules.required('Please enter your email'), rules.email()],
  program: [rules.required('Choose your programme')],
  year: [rules.required('Enter your graduation year'), rules.number({ min: 1990, max: new Date().getFullYear() })],
  consent: [rules.required('Please agree to be contacted')],
};

function AlumniRegister() {
  const [ref, setRef] = useState('');
  const form = useForm({ name: '', email: '', phone: '', program: '', year: '', city: '', mentor: false, consent: false }, schema);

  if (form.status === 'success') {
    return (
      <div className="success-panel" role="status">
        <span className="success-panel__icon">
          <Icon name="users" />
        </span>
        <h3>Welcome back to Kanachur!</h3>
        <p className="muted">You're on the alumni list — we'll keep you posted on reunions and events.</p>
        <span className="reference">{ref}</span>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="form-grid"
      onSubmit={form.handleSubmit(async (v) => {
        const res = await submit('alumni', v, { referencePrefix: 'ALM' });
        setRef(res.reference);
      })}
    >
      <TextField label="Full name" required autoComplete="name" {...form.bind('name')} />
      <TextField label="Email" type="email" required autoComplete="email" {...form.bind('email')} />
      <SelectField
        label="Programme"
        required
        placeholder="Select"
        options={programs.map((p) => ({ value: p.slug, label: p.title }))}
        {...form.bind('program')}
      />
      <TextField label="Graduation year" type="number" inputMode="numeric" required {...form.bind('year')} />
      <TextField label="Mobile (optional)" type="tel" {...form.bind('phone')} />
      <TextField label="City / country" {...form.bind('city')} />
      <CheckField className="span-2" label="I'd like to mentor current students." {...form.bind('mentor')} />
      <CheckField className="span-2" label="Keep me informed about alumni events and news." {...form.bind('consent')} />
      {form.serverError && <p className="alert alert--error span-2">{form.serverError}</p>}
      <div className="span-2" style={{ display: 'grid', gap: 12 }}>
        <Button type="submit" variant="gold" loading={form.status === 'pending'} icon="arrow-right">
          Join the alumni network
        </Button>
        <DemoNote />
      </div>
    </form>
  );
}

export default function AlumniPage() {
  useDocumentMeta({ title: 'Alumni', description: 'Reconnect with Kanachur — join the alumni network, mentor students and share your story.' });

  return (
    <>
      <PageHero
        compact
        eyebrow="Alumni"
        title="Once Kanachur, *always Kanachur*."
        lead="Reconnect with classmates, mentor the next generation and share your journey."
        image="/images/graduation-day-2024.webp"
        crumbs={[{ label: 'Alumni' }]}
      />
      <section className="section" style={{ paddingTop: "var(--section-head-gap)" }}>
        <div className="container split">
          <div className="panel">
            <SectionHeader eyebrow="Register" title="Join the *network*." />
            <AlumniRegister />
          </div>
          <div className="stack" style={{ '--stack': '20px' }}>
            {[
              ['users', 'Reunions & events', 'Batch reunions, CMEs and Graduation Day invitations.'],
              ['graduation', 'Mentor students', 'Guide current students on careers and postgraduate study.'],
              ['heart', 'Give back', 'Support scholarships and community health camps.'],
            ].map(([icon, title, text]) => (
              <div key={title} className="tile">
                <span className="tile__icon">
                  <Icon name={icon} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
            <div className="cluster">
              {site.social.slice(0, 3).map((s) => (
                <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" className="chip">
                  <Icon name={s.id} size={16} /> {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Alumni voices" title="Where Kanachur *took them*." />
          <Testimonials />
        </div>
      </section>
      <section className="section" id="share">
        <div className="container container--narrow">
          <div className="panel">
            <ReviewForm />
          </div>
        </div>
      </section>
    </>
  );
}
