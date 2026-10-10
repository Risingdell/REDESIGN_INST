import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { programs, getProgram, levels } from '@/content/programs';
import { getInstitution } from '@/content/institutions';
import { feeSchedule } from '@/content/fees';
import { useForm } from '@/hooks/useForm';
import { rules } from '@/lib/validators';
import { formatINR, makeReference } from '@/lib/format';
import { submit } from '@/services/apiClient';
import { track } from '@/services/analytics';
import { useUI } from '@/context/UIContext';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { CheckField, SelectField, TextField } from '@/components/ui/Field';
import { PaymentDialog } from '@/features/checkout/PaymentDialog';
import { DemoNote } from '@/features/enquiry/EnquiryForm';
import './ApplyWizard.css';

const DRAFT_KEY = 'kiet:apply-draft';

const DOCUMENTS = [
  { id: 'doc10', label: 'Class 10 / SSLC marks card' },
  { id: 'doc12', label: 'Class 12 / PUC marks card' },
  { id: 'docEntrance', label: 'Entrance scorecard (NEET / CET), if applicable' },
  { id: 'docTc', label: 'Transfer & conduct certificates' },
  { id: 'docId', label: 'Aadhaar or other photo ID' },
  { id: 'docPhoto', label: 'Recent passport-size photographs' },
];

const STEPS = [
  { id: 'programme', title: 'Programme', icon: 'graduation', fields: ['program', 'quota'] },
  { id: 'personal', title: 'Personal details', icon: 'user', fields: ['fullName', 'dob', 'gender', 'phone', 'email', 'city', 'guardianName', 'guardianPhone'] },
  { id: 'academics', title: 'Academics', icon: 'book', fields: ['board', 'percent12', 'yearPassed', 'entranceScore'] },
  { id: 'documents', title: 'Documents', icon: 'check-circle', fields: ['docsReady'] },
  { id: 'review', title: 'Review & pay', icon: 'card', fields: ['declaration'] },
];

const needsEntrance = (slug) => /NEET/.test(getProgram(slug)?.entrance || '');

const schema = {
  program: [rules.required('Choose the programme you are applying for')],
  quota: [rules.required('Choose a quota')],
  fullName: [rules.required('Enter your full name as on your marks card'), rules.minLength(3)],
  dob: [rules.required('Enter your date of birth'), rules.pastDate()],
  gender: [rules.required('Select an option')],
  phone: [rules.required('Enter your mobile number'), rules.phone()],
  email: [rules.required('Enter your email'), rules.email()],
  city: [rules.required('Enter your city / town')],
  guardianName: [rules.required("Enter a parent or guardian's name")],
  guardianPhone: [rules.required("Enter a parent or guardian's number"), rules.phone()],
  board: [rules.required('Select your board')],
  percent12: [rules.required('Enter your percentage'), rules.number({ min: 0, max: 100 })],
  yearPassed: [rules.required('Enter the year'), rules.number({ min: 2000, max: new Date().getFullYear() + 1 })],
  entranceScore: [
    (v, all) => (needsEntrance(all.program) && !v ? 'This programme needs a NEET score' : null),
    rules.number({ min: 0, max: 800 }, 'Enter a valid score'),
  ],
  docsReady: [(v) => (Array.isArray(v) && v.length >= 4 ? null : 'Tick at least the four core documents you have ready')],
  declaration: [rules.required('Please confirm the declaration')],
};

const initialValues = {
  program: '',
  quota: 'government',
  fullName: '',
  dob: '',
  gender: '',
  phone: '',
  email: '',
  city: '',
  guardianName: '',
  guardianPhone: '',
  board: '',
  percent12: '',
  yearPassed: '',
  entranceScore: '',
  docsReady: [],
  declaration: false,
};

const loadDraft = () => {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
  } catch {
    return null;
  }
};

function ReviewRow({ label, value }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value || '—'}</dd>
    </div>
  );
}

export function ApplyWizard() {
  const [params] = useSearchParams();
  const { toast } = useUI();
  const draft = useMemo(loadDraft, []);
  const [step, setStep] = useState(draft?.step ?? 0);
  const [reference] = useState(() => draft?.reference || makeReference('APP'));
  const [payOpen, setPayOpen] = useState(false);
  const [done, setDone] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const form = useForm(
    { ...initialValues, ...(draft?.values || {}), ...(params.get('program') && { program: params.get('program') }) },
    schema,
  );
  const { values } = form;
  const program = getProgram(values.program);

  // Autosave so applicants can leave and come back.
  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ values, step, reference, savedAt: Date.now() }));
      } catch {
        /* noop */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [values, step, reference, done]);

  useEffect(() => {
    track('application_step', { step: STEPS[step].id });
    document.getElementById('apply-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  const next = () => {
    if (form.check(STEPS[step].fields)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const toggleDoc = (id) =>
    form.setField('docsReady', values.docsReady.includes(id) ? values.docsReady.filter((d) => d !== id) : [...values.docsReady, id]);

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    form.reset();
    form.setValues(initialValues); // reset() alone would restore the draft the form started from
    setStep(0);
    toast('Draft cleared — starting fresh.');
  };

  const onPaid = async (payment) => {
    setPayOpen(false);
    setSubmitting(true);
    setSubmitError('');
    try {
      await submit('applications', { ...values, reference, payment }, { referencePrefix: 'APP' });
      localStorage.removeItem(DRAFT_KEY);
      setDone({ payment });
      track('application_complete', { program: values.program });
    } catch (err) {
      setSubmitError(`${err.message} Your payment reference is ${payment.paymentId} — keep it safe.`);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="apply__done card" id="apply-top">
        <div className="success-panel">
          <span className="success-panel__icon">
            <Icon name="check" />
          </span>
          <h2>Application submitted!</h2>
          <p className="lead">
            Thank you, {values.fullName.split(' ')[0]}. Your application for <strong>{program?.title}</strong> has been received.
          </p>
          <p>
            Application number: <span className="reference">{reference}</span>
          </p>
          <p className="muted">
            Payment {done.payment.paymentId} · {formatINR(done.payment.amount)}
          </p>
        </div>
        <ol className="apply__next">
          <li>
            <strong>Confirmation</strong>
            <span>You'll receive an email and SMS with your application number.</span>
          </li>
          <li>
            <strong>Document verification</strong>
            <span>Our admissions team will call you to schedule verification of originals.</span>
          </li>
          <li>
            <strong>Counselling & admission</strong>
            <span>Attend counselling (or the state / national process for NEET programmes) and confirm your seat.</span>
          </li>
        </ol>
        <div className="cluster" style={{ justifyContent: 'center' }}>
          <Button variant="outline" iconLeft="download" onClick={() => window.print()}>
            Print acknowledgement
          </Button>
          <Button to="/contact#visit" variant="gold" iconLeft="calendar">
            Book a campus visit
          </Button>
        </div>
      </div>
    );
  }

  const current = STEPS[step];
  const progress = Math.round((step / (STEPS.length - 1)) * 100);

  return (
    <div className="apply" id="apply-top">
      <aside className="apply__aside">
        <div className="apply__progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Application progress">
          <span style={{ width: `${progress}%` }} />
        </div>
        <ol className="apply__steps">
          {STEPS.map((s, i) => (
            <li key={s.id} className={i === step ? 'is-current' : i < step ? 'is-done' : ''}>
              <button type="button" onClick={() => i < step && setStep(i)} disabled={i > step} aria-current={i === step ? 'step' : undefined}>
                <span className="apply__step-icon">
                  <Icon name={i < step ? 'check' : s.icon} size={18} />
                </span>
                <span>
                  <small>Step {i + 1}</small>
                  {s.title}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div className="apply__saved">
          <Icon name="check-circle" size={16} /> Progress saves automatically on this device.
          {draft && (
            <button type="button" onClick={discardDraft}>
              Start over
            </button>
          )}
        </div>
        {program && (
          <div className="apply__picked">
            <span className="badge">{levels[program.level]}</span>
            <strong>{program.title}</strong>
            <span>{getInstitution(program.institution)?.name}</span>
          </div>
        )}
      </aside>

      <form
        className="apply__panel card"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (step < STEPS.length - 1) next();
          else if (form.check(STEPS[step].fields)) setPayOpen(true);
        }}
      >
        <header className="apply__head">
          <span className="eyebrow">
            Step {step + 1} of {STEPS.length}
          </span>
          <h2>{current.title}</h2>
        </header>

        {current.id === 'programme' && (
          <div className="form-grid">
            <SelectField
              className="span-2"
              label="Programme"
              required
              placeholder="Select a programme"
              options={Object.entries(levels).map(([lvl, label]) => ({
                group: label,
                options: programs.filter((p) => p.level === lvl).map((p) => ({ value: p.slug, label: `${p.title} — ${p.fullTitle}` })),
              })).filter((g) => g.options.length)}
              {...form.bind('program')}
            />
            <SelectField
              label="Quota"
              required
              options={feeSchedule.quotas.map((q) => ({ value: q.id, label: q.label }))}
              {...form.bind('quota')}
            />
            <TextField label="Academic year" value={feeSchedule.academicYear} readOnly hint="Admissions currently open" />
            {program && (
              <div className="apply__info span-2">
                <Icon name="info" />
                <div>
                  <strong>Eligibility:</strong> {program.eligibility}
                  <br />
                  <strong>Admission route:</strong> {program.entrance} · <strong>Duration:</strong> {program.duration}
                </div>
              </div>
            )}
          </div>
        )}

        {current.id === 'personal' && (
          <div className="form-grid">
            <TextField className="span-2" label="Full name (as on marks card)" required autoComplete="name" {...form.bind('fullName')} />
            <TextField label="Date of birth" type="date" required autoComplete="bday" {...form.bind('dob')} />
            <SelectField
              label="Gender"
              required
              placeholder="Select"
              options={[
                { value: 'female', label: 'Female' },
                { value: 'male', label: 'Male' },
                { value: 'other', label: 'Prefer not to say' },
              ]}
              {...form.bind('gender')}
            />
            <TextField label="Mobile number" type="tel" inputMode="tel" required autoComplete="tel" {...form.bind('phone')} />
            <TextField label="Email" type="email" required autoComplete="email" {...form.bind('email')} />
            <TextField className="span-2" label="City / town" required autoComplete="address-level2" {...form.bind('city')} />
            <TextField label="Parent / guardian name" required {...form.bind('guardianName')} />
            <TextField label="Parent / guardian mobile" type="tel" inputMode="tel" required {...form.bind('guardianPhone')} />
          </div>
        )}

        {current.id === 'academics' && (
          <div className="form-grid">
            <SelectField
              label="Class 12 board"
              required
              placeholder="Select board"
              options={['Karnataka PUC', 'CBSE', 'ICSE / ISC', 'Kerala HSE', 'Other state board', 'Other'].map((b) => ({ value: b, label: b }))}
              {...form.bind('board')}
            />
            <TextField label="Year of passing" type="number" inputMode="numeric" required {...form.bind('yearPassed')} />
            <TextField
              label="Class 12 percentage (PCB / relevant subjects)"
              type="number"
              inputMode="decimal"
              step="0.01"
              required
              hint="Enter 0–100"
              {...form.bind('percent12')}
            />
            <TextField
              label={needsEntrance(values.program) ? 'NEET score' : 'Entrance score (if any)'}
              type="number"
              inputMode="numeric"
              required={needsEntrance(values.program)}
              hint={needsEntrance(values.program) ? 'Required for this programme' : 'Optional'}
              {...form.bind('entranceScore')}
            />
          </div>
        )}

        {current.id === 'documents' && (
          <div className="apply__docs">
            <p className="muted">
              Tick the documents you have ready. You'll show the originals during verification — nothing needs to be uploaded now.
            </p>
            <ul>
              {DOCUMENTS.map((d) => (
                <li key={d.id}>
                  <label className={`apply__doc${values.docsReady.includes(d.id) ? ' is-checked' : ''}`}>
                    <input type="checkbox" name="docsReady" checked={values.docsReady.includes(d.id)} onChange={() => toggleDoc(d.id)} />
                    <span>{d.label}</span>
                    <Icon name="check" size={18} />
                  </label>
                </li>
              ))}
            </ul>
            {form.errors.docsReady && (
              <p className="field__error" role="alert">
                <Icon name="info" size={16} /> {form.errors.docsReady}
              </p>
            )}
          </div>
        )}

        {current.id === 'review' && (
          <div className="apply__review">
            {[
              {
                title: 'Programme',
                to: 0,
                rows: [
                  ['Programme', program && `${program.title} — ${program.fullTitle}`],
                  ['Quota', feeSchedule.quotas.find((q) => q.id === values.quota)?.label],
                ],
              },
              {
                title: 'Personal details',
                to: 1,
                rows: [
                  ['Name', values.fullName],
                  ['Date of birth', values.dob],
                  ['Mobile', values.phone],
                  ['Email', values.email],
                  ['City', values.city],
                  ['Guardian', `${values.guardianName} · ${values.guardianPhone}`],
                ],
              },
              {
                title: 'Academics',
                to: 2,
                rows: [
                  ['Board', values.board],
                  ['Class 12', values.percent12 && `${values.percent12}% (${values.yearPassed})`],
                  ['Entrance score', values.entranceScore],
                ],
              },
            ].map((section) => (
              <section key={section.title} className="apply__review-block">
                <header>
                  <h3>{section.title}</h3>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => setStep(section.to)}>
                    Edit
                  </button>
                </header>
                <dl>
                  {section.rows.map(([label, value]) => (
                    <ReviewRow key={label} label={label} value={value} />
                  ))}
                </dl>
              </section>
            ))}

            <div className="apply__fee">
              <div>
                <span className="muted">Application fee</span>
                <strong>{formatINR(feeSchedule.applicationFee)}</strong>
              </div>
              <span className="badge badge--gold">Non-refundable</span>
            </div>

            <CheckField
              label="I declare that the information given is true and complete. I understand admission is subject to verification of original documents and the rules of the university and regulator."
              {...form.bind('declaration')}
            />
            {submitError && <p className="alert alert--error">{submitError}</p>}
          </div>
        )}

        <footer className="apply__nav">
          {step > 0 ? (
            <Button variant="outline" iconLeft="arrow-left" onClick={back}>
              Back
            </Button>
          ) : (
            <Link to="/admissions" className="btn btn--ghost">
              Admissions info
            </Link>
          )}
          <Button type="submit" variant="gold" size="lg" icon={step < STEPS.length - 1 ? 'arrow-right' : 'lock'} loading={submitting}>
            {step < STEPS.length - 1 ? `Continue to ${STEPS[step + 1].title.toLowerCase()}` : `Pay ${formatINR(feeSchedule.applicationFee)} & submit`}
          </Button>
        </footer>
        <DemoNote />
      </form>

      <PaymentDialog
        open={payOpen}
        onClose={() => setPayOpen(false)}
        amount={feeSchedule.applicationFee}
        purpose={`Application fee · ${program?.title || ''}`}
        reference={reference}
        payer={values.fullName}
        onPaid={onPaid}
      />
    </div>
  );
}
