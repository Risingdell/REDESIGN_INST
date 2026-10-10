import { useMemo, useState } from 'react';
import { site } from '@/config/site';
import { useForm } from '@/hooks/useForm';
import { rules } from '@/lib/validators';
import { demoUnavailable, formatSlot, timeSlots, toDateKey, upcomingDays } from '@/lib/slots';
import { downloadICS } from '@/lib/calendar';
import { submit } from '@/services/apiClient';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { CheckField, SelectField, TextField } from '@/components/ui/Field';
import { DemoNote } from '@/features/enquiry/EnquiryForm';
import './SlotBooking.css';

const baseSchema = {
  name: [rules.required('Please enter your name'), rules.minLength(2)],
  phone: [rules.required('Please enter a phone number'), rules.phone()],
  email: [rules.email()],
  consent: [rules.required('Please confirm the details are correct')],
};

/**
 * Generic slot booking (the "Commerce: bookings" layer).
 * kind="visit"       → guided campus visit
 * kind="appointment" → hospital OPD appointment, requires a department
 */
export function SlotBooking({ kind = 'visit', departments = [], defaultDepartment = '' }) {
  const isAppointment = kind === 'appointment';
  const days = useMemo(() => upcomingDays(14, { closedWeekdays: [0] }), []);
  const slots = useMemo(
    () => timeSlots(isAppointment ? { startHour: 9, endHour: 17, step: 20 } : { startHour: 10, endHour: 16, step: 60 }),
    [isAppointment],
  );
  const [dateKey, setDateKey] = useState(toDateKey(days[0]));
  const [slot, setSlot] = useState('');
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState(null);
  const unavailable = useMemo(() => demoUnavailable(dateKey, slots, kind), [dateKey, slots, kind]);

  const schema = isAppointment ? { ...baseSchema, department: [rules.required('Choose a department')] } : baseSchema;
  const form = useForm(
    { name: '', phone: '', email: '', department: defaultDepartment, visitors: '2', notes: '', consent: false },
    schema,
  );

  const selectedDate = days.find((d) => toDateKey(d) === dateKey);
  const prettyDate = selectedDate?.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  const title = isAppointment ? 'Hospital appointment' : 'Guided campus visit';

  if (booking) {
    const start = new Date(`${booking.dateKey}T${booking.slot}:00`);
    return (
      <div className="success-panel booking__done" role="status">
        <span className="success-panel__icon">
          <Icon name="check" />
        </span>
        <h3>{isAppointment ? 'Appointment requested' : 'Visit booked'}!</h3>
        <p className="muted">
          {prettyDate} at {formatSlot(booking.slot)}
          {booking.department ? ` · ${departments.find((d) => d.slug === booking.department)?.name}` : ''}
        </p>
        <p>
          Reference: <span className="reference">{booking.reference}</span>
        </p>
        <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
          We'll send a confirmation by SMS. Need to change it? Call {site.contact.appointment.label}.
        </p>
        <div className="cluster" style={{ justifyContent: 'center' }}>
          <Button
            variant="outline"
            iconLeft="calendar"
            onClick={() =>
              downloadICS(
                {
                  title: `${title} — Kanachur`,
                  start,
                  durationMinutes: isAppointment ? 20 : 60,
                  description: `Reference ${booking.reference}. Call ${site.contact.appointment.label} to reschedule.`,
                  location: site.address.lines.join(', '),
                  uid: `${booking.reference}@kanachurims.com`,
                },
                `kanachur-${kind}.ics`,
              )
            }
          >
            Add to calendar
          </Button>
          <Button href={site.address.mapsUrl} variant="ghost" iconLeft="map-pin">
            Get directions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking">
      <ol className="booking__steps" aria-label="Booking steps">
        <li className={step >= 1 ? 'is-done' : ''} aria-current={step === 1 ? 'step' : undefined}>
          <span>1</span> Date & time
        </li>
        <li className={step >= 2 ? 'is-done' : ''} aria-current={step === 2 ? 'step' : undefined}>
          <span>2</span> Your details
        </li>
      </ol>

      {step === 1 && (
        <div className="booking__picker">
          {isAppointment && (
            <SelectField
              label="Department"
              required
              placeholder="Choose a department"
              options={departments.map((d) => ({ value: d.slug, label: d.name }))}
              {...form.bind('department')}
            />
          )}

          <fieldset className="booking__fieldset">
            <legend>Choose a date</legend>
            <div className="booking__days">
              {days.map((d) => {
                const key = toDateKey(d);
                return (
                  <button
                    key={key}
                    type="button"
                    className={`booking__day${key === dateKey ? ' is-selected' : ''}`}
                    aria-pressed={key === dateKey}
                    onClick={() => {
                      setDateKey(key);
                      setSlot('');
                    }}
                  >
                    <small>{d.toLocaleDateString('en-IN', { weekday: 'short' })}</small>
                    <strong>{d.getDate()}</strong>
                    <small>{d.toLocaleDateString('en-IN', { month: 'short' })}</small>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="booking__fieldset">
            <legend>
              Available times · <span className="muted">{prettyDate}</span>
            </legend>
            <div className="booking__slots">
              {slots.map((s) => {
                const taken = unavailable.has(s);
                return (
                  <button
                    key={s}
                    type="button"
                    className={`booking__slot${slot === s ? ' is-selected' : ''}`}
                    disabled={taken}
                    aria-pressed={slot === s}
                    onClick={() => setSlot(s)}
                  >
                    {formatSlot(s)}
                    {taken && <span className="visually-hidden"> (booked)</span>}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <Button
            variant="gold"
            size="lg"
            block
            icon="arrow-right"
            disabled={!slot}
            onClick={() => {
              if (isAppointment && !form.check(['department'])) return;
              setStep(2);
            }}
          >
            {slot ? `Continue with ${formatSlot(slot)}` : 'Pick a time to continue'}
          </Button>
        </div>
      )}

      {step === 2 && (
        <form
          noValidate
          className="form-grid"
          onSubmit={form.handleSubmit(async (values) => {
            const res = await submit(isAppointment ? 'appointments' : 'visits', { ...values, date: dateKey, slot }, {
              referencePrefix: isAppointment ? 'APT' : 'VST',
            });
            setBooking({ ...values, dateKey, slot, reference: res.reference });
          })}
        >
          <div className="booking__summary span-2">
            <Icon name="calendar" />
            <div>
              <strong>{prettyDate}</strong>
              <span>
                {formatSlot(slot)}
                {isAppointment && form.values.department && ` · ${departments.find((d) => d.slug === form.values.department)?.name}`}
              </span>
            </div>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setStep(1)}>
              Change
            </button>
          </div>
          <TextField label={isAppointment ? "Patient's full name" : 'Your name'} required autoComplete="name" {...form.bind('name')} />
          <TextField label="Mobile number" required type="tel" inputMode="tel" autoComplete="tel" {...form.bind('phone')} />
          <TextField label="Email" type="email" autoComplete="email" hint="For the confirmation" {...form.bind('email')} />
          {!isAppointment ? (
            <SelectField
              label="Number of visitors"
              options={['1', '2', '3', '4', '5+'].map((v) => ({ value: v, label: v }))}
              {...form.bind('visitors')}
            />
          ) : (
            <div />
          )}
          <TextField
            as="textarea"
            rows={3}
            className="span-2"
            label={isAppointment ? 'Symptoms or reason for visit (optional)' : 'What would you like to see? (optional)'}
            {...form.bind('notes')}
          />
          <CheckField className="span-2" label="I confirm these details are correct and agree to be contacted about this booking." {...form.bind('consent')} />
          {form.serverError && <p className="alert alert--error span-2">{form.serverError}</p>}
          <div className="span-2" style={{ display: 'grid', gap: 12 }}>
            <Button type="submit" variant="gold" size="lg" block loading={form.status === 'pending'} iconLeft="check">
              Confirm {isAppointment ? 'appointment' : 'visit'}
            </Button>
            {isAppointment && (
              <p className="form-note">
                <Icon name="alert" />
                Not for emergencies. In an emergency call {site.contact.emergency.label} immediately.
              </p>
            )}
            <DemoNote />
          </div>
        </form>
      )}
    </div>
  );
}
