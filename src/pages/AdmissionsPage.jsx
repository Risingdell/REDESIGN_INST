import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { faqs } from '@/content/faqs';
import { programs, levels } from '@/content/programs';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Accordion } from '@/components/ui/Accordion';
import { Button, SmartLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { FeeEstimator } from '@/features/fees/FeeEstimator';
import { useUI } from '@/context/UIContext';
import './pages.css';

const steps = [
  ['Choose your programme', 'Compare programmes, check eligibility and estimate your fees.'],
  ['Apply online', 'Complete the online form — it saves as you go, so you can finish later.'],
  ['Pay the application fee', 'Pay securely online and receive your application number instantly.'],
  ['Verification & counselling', 'We call you to verify original documents and guide you through counselling.'],
  ['Confirm your seat', 'Pay the first-year fee and join orientation.'],
];

const documents = [
  'Class 10 / SSLC marks card',
  'Class 12 / PUC marks card',
  'NEET-UG / NEET-PG scorecard (for MBBS, BAMS and MD/MS)',
  'Transfer certificate and conduct certificate',
  'Aadhaar or other government photo ID',
  'Passport-size photographs',
  'Caste / income certificate, if claiming a reserved seat or concession',
  'Migration certificate (for boards outside Karnataka)',
];

export default function AdmissionsPage() {
  const { openEnquiry } = useUI();
  useDocumentMeta({
    title: 'Admissions 2026–27',
    description: 'How to apply to Kanachur institutions — steps, eligibility, documents, fee estimator and FAQs.',
  });

  const admissionFaqs = faqs.filter((f) => ['Admissions', 'Fees', 'Campus life'].includes(f.topic));

  return (
    <>
      <PageHero
        eyebrow="Admissions 2026–27 open"
        title="Begin your journey in *healthcare*."
        lead="Everything you need to apply — clear steps, eligibility, documents and an instant fee estimate."
        image="/images/campus-hospital-sky.webp"
        crumbs={[{ label: 'Admissions' }]}
      >
        <Button to="/admissions/apply" variant="gold" size="lg" icon="arrow-right">
          Apply online
        </Button>
        <Button variant="ghost-light" size="lg" iconLeft="phone" onClick={() => openEnquiry('Admissions enquiry')}>
          Request a call-back
        </Button>
      </PageHero>

      <section className="section">
        <div className="container split">
          <div>
            <SectionHeader eyebrow="How to apply" title="Five simple *steps*." />
            <ol className="timeline">
              {steps.map(([title, text], i) => (
                <Reveal as="li" key={title} delay={i * 80}>
                  <span className="timeline__dot">{i + 1}</span>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </Reveal>
              ))}
            </ol>
          </div>
          <aside className="panel panel--sticky" id="parents">
            <span className="eyebrow">For parents & guardians</span>
            <h2 style={{ fontSize: '1.6rem', margin: '12px 0' }}>Questions parents ask most</h2>
            <ul className="info-list">
              {[
                ['shield', 'Safe campus', 'Separate hostels, wardens and campus security.'],
                ['stethoscope', '24×7 hospital on campus', 'Medical care is minutes away for every student.'],
                ['calculator', 'Transparent fees', 'Estimate yearly costs below and talk to a fee counsellor.'],
                ['users', 'Mentoring', 'Faculty mentors track each student’s progress.'],
              ].map(([icon, title, text]) => (
                <li key={title}>
                  <span className="icon-wrap">
                    <Icon name={icon} size={20} />
                  </span>
                  <span>
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="cluster" style={{ marginTop: 22 }}>
              <Button to="/contact#visit" variant="gold" iconLeft="calendar">
                Book a campus visit
              </Button>
              <Button to="/campus-life#tour" variant="outline">
                Virtual tour
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <section className="section section--tint" id="eligibility">
        <div className="container">
          <SectionHeader eyebrow="Eligibility at a glance" title="Who can *apply*?" lead="Detailed criteria are on each programme page." />
          <div className="grid grid--3">
            {programs.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 70}>
                <SmartLink to={`/programs/${p.slug}`} className="tile tile--link">
                  <span className="badge">{levels[p.level]}</span>
                  <h3>{p.title}</h3>
                  <p>{p.eligibility}</p>
                  <span className="tile__link">
                    {p.entrance} <Icon name="arrow-right" size={16} />
                  </span>
                </SmartLink>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="fees">
        <div className="container">
          <SectionHeader
            eyebrow="Fee estimator"
            title="Know your costs *upfront*."
            lead="Choose a programme and options to see an indicative first-year and whole-course cost."
          />
          <FeeEstimator />
        </div>
      </section>

      <section className="section section--tint" id="documents">
        <div className="container split">
          <div>
            <SectionHeader eyebrow="Document checklist" title="What to keep *ready*." lead="Bring originals and two photocopies of each to verification." />
            <ul className="checklist">
              {documents.map((d) => (
                <li key={d}>
                  <Icon name="check-circle" size={20} /> {d}
                </li>
              ))}
            </ul>
          </div>
          <div id="faqs">
            <SectionHeader eyebrow="FAQs" title="Admissions *questions*." />
            <Accordion
              defaultOpen={admissionFaqs[0]?.id}
              items={admissionFaqs.map((f) => ({
                id: f.id,
                title: f.q,
                content: (
                  <>
                    <p>{f.a}</p>
                    {f.to && (
                      <SmartLink to={f.to} className="tile__link">
                        Go there <Icon name="arrow-right" size={16} />
                      </SmartLink>
                    )}
                  </>
                ),
              }))}
            />
          </div>
        </div>
      </section>
    </>
  );
}
