import { Link } from 'react-router-dom';
import { institutions } from '@/content/institutions';
import { programsByInstitution } from '@/content/programs';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { PageHero } from '@/components/layout/PageHero';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import './pages.css';

export default function InstitutionsPage() {
  useDocumentMeta({
    title: 'Our institutions',
    description: 'Institutions of the Kanachur Islamic Education Trust — medical sciences, physiotherapy, nursing, allied health, Ayurveda, pharmacy and schools.',
  });

  return (
    <>
      <PageHero
        compact
        eyebrow="Our institutions"
        title="One campus, *many paths* into healthcare."
        lead="Each institution shares the campus, the teaching hospital and the Trust's commitment to ethical, compassionate education."
        image="/images/campus-aerial.webp"
        crumbs={[{ label: 'Institutions' }]}
      />
      <section className="section">
        <div className="container grid grid--2">
          {institutions.map((inst, i) => {
            const count = programsByInstitution(inst.slug).length;
            return (
              <Reveal key={inst.slug} delay={(i % 2) * 80}>
                <article className="card card--hover" style={{ position: 'relative', height: '100%' }}>
                  <div className="card__media">
                    <img src={inst.image} alt="" loading="lazy" />
                  </div>
                  <div className="card__body" style={{ display: 'grid', gap: 10 }}>
                    <div className="cluster">
                      <span className="badge">{inst.code}</span>
                      {count > 0 && (
                        <span className="badge badge--gold">
                          {count} programme{count > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <h2 style={{ fontSize: '1.35rem' }}>
                      <Link to={`/institutions/${inst.slug}`} className="stretched-link">
                        {inst.name}
                      </Link>
                    </h2>
                    <p className="muted">{inst.summary}</p>
                    <span className="tile__link">
                      Explore <Icon name="arrow-right" size={16} />
                    </span>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
