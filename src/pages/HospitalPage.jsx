import { useState } from 'react';
import { site } from '@/config/site';
import { departments, hospitalStats } from '@/content/hospital';
import { faqs } from '@/content/faqs';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { PageHero } from '@/components/layout/PageHero';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Counter } from '@/components/ui/Counter';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Accordion } from '@/components/ui/Accordion';
import { SlotBooking } from '@/features/booking/SlotBooking';
import '@/features/home/home.css';
import './pages.css';

export default function HospitalPage() {
  const [dept, setDept] = useState('');
  useDocumentMeta({
    title: 'Kanachur Hospital & Research Centre',
    description: '24×7 multi-speciality teaching hospital in Mangaluru. Book an appointment online or call 0824 2888000.',
  });

  const pick = (slug) => {
    setDept(slug);
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <PageHero
        eyebrow="Kanachur Hospital & Research Centre"
        title="Committed to *trusted* health care."
        lead="A multi-speciality teaching hospital, open 24 hours, serving Mangaluru and beyond."
        image="/images/campus-hospital-front.webp"
        crumbs={[{ label: 'Hospital' }]}
      >
        <Button href="#book" variant="gold" size="lg" iconLeft="calendar">
          Book an appointment
        </Button>
        <Button href={site.contact.emergency.href} variant="accent" size="lg" iconLeft="siren">
          Emergency {site.contact.emergency.label}
        </Button>
      </PageHero>

      <section className="section">
        <div className="container">
          <dl className="stats" style={{ marginTop: 0, borderTop: 0, paddingTop: 0 }}>
            {hospitalStats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>
                  <Counter value={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section" id="departments">
        <div className="container">
          <SectionHeader eyebrow="Departments" title="Specialist care, *under one roof*." lead="Choose a department to book directly." />
          <div className="grid grid--3 grid--dense">
            {departments.map((d, i) => (
              <Reveal key={d.slug} delay={(i % 3) * 70}>
                <div className="tile" style={{ height: '100%' }}>
                  <span className="tile__icon">
                    <Icon name={d.icon} />
                  </span>
                  <h3>{d.name}</h3>
                  <p>{d.summary}</p>
                  {d.slug !== 'emergency' ? (
                    <button type="button" className="btn btn--ghost btn--sm" style={{ justifySelf: 'start' }} onClick={() => pick(d.slug)}>
                      Book {d.name} <Icon name="arrow-right" size={16} />
                    </button>
                  ) : (
                    <a href={site.contact.emergency.href} className="tile__link">
                      Call {site.contact.emergency.label} <Icon name="phone" size={16} />
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="book">
        <div className="container split">
          <div className="panel">
            <SectionHeader eyebrow="Online booking" title="Book an *appointment*." lead="Pick a department, date and time — we'll confirm by SMS." />
            <SlotBooking
              key={dept}
              kind="appointment"
              defaultDepartment={dept}
              departments={departments.filter((d) => d.slug !== 'emergency')}
            />
          </div>
          <div className="stack" style={{ '--stack': '20px' }}>
            <div className="dept-card dept-card--emergency">
              <span className="badge badge--accent badge--live">24×7 emergency</span>
              <strong>In an emergency, don't book — call.</strong>
              <a href={site.contact.emergency.href} className="dept-card__phone">
                <Icon name="phone" /> {site.contact.emergency.label}
              </a>
            </div>
            <ul className="info-list panel">
              <li>
                <span className="icon-wrap">
                  <Icon name="phone" size={20} />
                </span>
                <span>
                  <strong>Appointments by phone</strong>
                  <span>
                    <a href={site.contact.appointment.href}>{site.contact.appointment.label}</a> ·{' '}
                    <a href={site.contact.mobile.href}>{site.contact.mobile.label}</a>
                  </span>
                </span>
              </li>
              <li>
                <span className="icon-wrap">
                  <Icon name="clock" size={20} />
                </span>
                <span>
                  <strong>Hours</strong>
                  <span>{site.contact.hours}</span>
                </span>
              </li>
              <li>
                <span className="icon-wrap">
                  <Icon name="map-pin" size={20} />
                </span>
                <span>
                  <strong>Location</strong>
                  <span>{site.address.lines.slice(1).join(', ')}</span>
                </span>
              </li>
            </ul>
            <Accordion
              items={faqs
                .filter((f) => f.topic === 'Hospital')
                .map((f) => ({ id: f.id, title: f.q, content: <p>{f.a}</p> }))}
            />
          </div>
        </div>
      </section>
    </>
  );
}
