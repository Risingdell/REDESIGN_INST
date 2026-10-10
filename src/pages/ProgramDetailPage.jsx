import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProgram, levels, programs } from '@/content/programs';
import { getInstitution } from '@/content/institutions';
import { feeSchedule } from '@/content/fees';
import { formatINR } from '@/lib/format';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { usePreferences } from '@/context/PreferencesContext';
import { useUI } from '@/context/UIContext';
import { PageHero } from '@/components/layout/PageHero';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProgramCard } from '@/features/programs/ProgramCard';
import { CompareTray } from '@/features/programs/CompareTray';
import NotFoundPage from './NotFoundPage';
import './pages.css';

export default function ProgramDetailPage() {
  const { slug } = useParams();
  const program = getProgram(slug);
  const { markViewed, shortlist, toggleShortlist } = usePreferences();
  const { openEnquiry } = useUI();
  const institution = program && getInstitution(program.institution);

  useDocumentMeta({
    title: program ? `${program.title} — ${program.fullTitle}` : 'Programme not found',
    description: program ? `${program.fullTitle} at ${institution?.name}. ${program.eligibility}` : undefined,
  });

  useEffect(() => {
    if (program) markViewed(program.slug);
  }, [program, markViewed]);

  if (!program) return <NotFoundPage />;

  const saved = shortlist.includes(program.slug);
  const tuition = feeSchedule.tuition[program.slug];
  const related = programs.filter((p) => p.slug !== program.slug && (p.stream === program.stream || p.level === program.level)).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={`${levels[program.level]} · ${institution?.shortName}`}
        title={`${program.title}`}
        lead={program.fullTitle}
        image={institution?.image}
        crumbs={[{ label: 'Programmes', to: '/programs' }, { label: program.title }]}
      >
        <Button to={`/admissions/apply?program=${program.slug}`} variant="gold" size="lg" icon="arrow-right">
          Apply for {program.title}
        </Button>
        <Button variant="ghost-light" size="lg" iconLeft={saved ? 'bookmark-filled' : 'bookmark'} onClick={() => toggleShortlist(program.slug)} aria-pressed={saved}>
          {saved ? 'Saved' : 'Save to shortlist'}
        </Button>
      </PageHero>

      <section className="section">
        <div className="container split">
          <div className="stack" style={{ '--stack': '28px' }}>
            <dl className="facts">
              <div>
                <dt>
                  <Icon name="clock" size={14} /> Duration
                </dt>
                <dd>{program.duration}</dd>
              </div>
              <div>
                <dt>
                  <Icon name="check-circle" size={14} /> Admission
                </dt>
                <dd>{program.entrance}</dd>
              </div>
              <div>
                <dt>
                  <Icon name="graduation" size={14} /> Level
                </dt>
                <dd>{levels[program.level]}</dd>
              </div>
              <div>
                <dt>
                  <Icon name="building" size={14} /> Institution
                </dt>
                <dd>
                  <Link to={`/institutions/${institution.slug}`}>{institution.name}</Link>
                </dd>
              </div>
            </dl>

            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: 12 }}>Eligibility</h2>
              <p className="prose">{program.eligibility}</p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: 12 }}>Where it can take you</h2>
              <ul className="checklist">
                {program.careers.map((c) => (
                  <li key={c}>
                    <Icon name="check-circle" size={20} /> {c}
                  </li>
                ))}
              </ul>
            </div>

            {program.needsReview && (
              <p className="review-flag">
                <Icon name="info" size={18} />
                Intake, detailed curriculum and university affiliation details will be published by the admissions office. Contact us for the latest information.
              </p>
            )}
          </div>

          <aside className="panel panel--sticky">
            <span className="eyebrow">At a glance</span>
            {tuition && (
              <div style={{ margin: '14px 0 18px' }}>
                <p className="muted" style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>
                  Indicative tuition per year
                </p>
                <p style={{ fontSize: '1.7rem', fontWeight: 800 }}>
                  {formatINR(tuition.government)} – {formatINR(tuition.management)}
                </p>
                {feeSchedule.isIllustrative && <p className="muted" style={{ fontSize: 'var(--fs-xs)' }}>Sample figures — official fees to be confirmed.</p>}
              </div>
            )}
            <div style={{ display: 'grid', gap: 10 }}>
              <Button to={`/admissions/apply?program=${program.slug}`} variant="gold" block icon="arrow-right">
                Apply now
              </Button>
              <Button to="/admissions#fees" variant="outline" block iconLeft="calculator">
                Estimate total cost
              </Button>
              <Button variant="ghost" block iconLeft="phone" onClick={() => openEnquiry(`Enquiry about ${program.title}`)}>
                Ask a counsellor
              </Button>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--tint">
          <div className="container">
            <SectionHeader eyebrow="You may also like" title="Related *programmes*." />
            <div className="grid grid--3">
              {related.map((p) => (
                <ProgramCard key={p.slug} program={p} />
              ))}
            </div>
          </div>
        </section>
      )}
      <CompareTray />
    </>
  );
}
