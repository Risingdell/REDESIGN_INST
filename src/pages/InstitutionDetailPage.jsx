import { useParams } from 'react-router-dom';
import { getInstitution, institutions } from '@/content/institutions';
import { programsByInstitution } from '@/content/programs';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useUI } from '@/context/UIContext';
import { PageHero } from '@/components/layout/PageHero';
import { Button, SmartLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProgramCard } from '@/features/programs/ProgramCard';
import { CompareTray } from '@/features/programs/CompareTray';
import NotFoundPage from './NotFoundPage';
import './pages.css';

export default function InstitutionDetailPage() {
  const { slug } = useParams();
  const inst = getInstitution(slug);
  const { openEnquiry } = useUI();

  useDocumentMeta({
    title: inst ? inst.name : 'Institution not found',
    description: inst?.summary,
  });

  if (!inst) return <NotFoundPage />;
  const list = programsByInstitution(inst.slug);
  const others = institutions.filter((i) => i.slug !== inst.slug).slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow={inst.code}
        title={inst.name}
        lead={inst.summary}
        image={inst.image}
        crumbs={[{ label: 'Institutions', to: '/institutions' }, { label: inst.shortName }]}
      >
        {list.length > 0 && (
          <Button to={`/admissions/apply?program=${list[0].slug}`} variant="gold" size="lg" icon="arrow-right">
            Apply now
          </Button>
        )}
        {inst.website && (
          <Button href={inst.website} variant="ghost-light" size="lg" icon="external">
            Institution website
          </Button>
        )}
      </PageHero>

      <section className="section">
        <div className="container split">
          <div>
            <SectionHeader eyebrow="Highlights" title={`Why study at *${inst.shortName}*?`} />
            <div className="grid grid--3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              {inst.highlights.map((h) => (
                <div key={h} className="tile">
                  <span className="tile__icon">
                    <Icon name="check-circle" />
                  </span>
                  <h3>{h}</h3>
                </div>
              ))}
            </div>
          </div>
          <aside className="panel panel--sticky">
            <span className="eyebrow">Talk to us</span>
            <p style={{ margin: '12px 0 18px', color: 'var(--text-2)' }}>Questions about {inst.shortName}? Our admissions team is here to help.</p>
            <div style={{ display: 'grid', gap: 10 }}>
              <Button variant="gold" block iconLeft="phone" onClick={() => openEnquiry(`Enquiry about ${inst.name}`)}>
                Request a call-back
              </Button>
              <Button to="/contact#visit" variant="outline" block iconLeft="calendar">
                Visit the campus
              </Button>
            </div>
          </aside>
        </div>
      </section>

      {list.length > 0 && (
        <section className="section section--tint">
          <div className="container">
            <SectionHeader eyebrow="Programmes" title="What you can *study* here." />
            <div className="grid grid--3">
              {list.map((p) => (
                <ProgramCard key={p.slug} program={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Explore more" title="Other *institutions*." />
          <div className="grid grid--4">
            {others.map((o) => (
              <SmartLink key={o.slug} to={`/institutions/${o.slug}`} className="tile">
                <span className="tile__icon">
                  <Icon name={o.icon} />
                </span>
                <h3>{o.name}</h3>
                <span className="tile__link">
                  Explore <Icon name="arrow-right" size={16} />
                </span>
              </SmartLink>
            ))}
          </div>
        </div>
      </section>
      <CompareTray />
    </>
  );
}
