import { mission, vision, values, leadership } from '@/content/about';
import { institutions } from '@/content/institutions';
import { hospitalStats } from '@/content/hospital';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { Counter } from '@/components/ui/Counter';
import { LiteYouTube } from '@/components/ui/LiteYouTube';
import { Button } from '@/components/ui/Button';
import '@/features/home/home.css';
import './pages.css';

export default function AboutPage() {
  useDocumentMeta({
    title: 'About the Trust',
    description: 'The mission, vision and values of the Kanachur Islamic Education Trust (R), Mangaluru.',
  });

  return (
    <>
      <PageHero
        eyebrow="About Kanachur"
        title="Education in service of *humanity*."
        lead="Kanachur Islamic Education Trust (R) brings together medical education, healthcare and research on one campus in Mangaluru."
        image="/images/campus-hospital-front.webp"
        crumbs={[{ label: 'About' }]}
      />

      <section className="section">
        <div className="container split">
          <div>
            <SectionHeader
              eyebrow="Who we are"
              title="A trust built on *ethics and care*."
              lead="Kanachur Institute of Medical Sciences stands as an architectural landmark — and behind its buildings is a commitment to holistic, high-quality medical education and innovative research."
            />
            <p className="prose">
              Today the Trust runs {institutions.length} institutions — from a medical college and teaching hospital to colleges of nursing,
              physiotherapy, allied health, Ayurveda and pharmacy, a pre-university college and a public school.
            </p>
            <dl className="stats">
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
          <Reveal>
            <LiteYouTube id="86rvvaUf298" title="Audax Achiever — A Life Story of Dr. U. K. Monu Kanachur" />
            <p className="muted" style={{ marginTop: 10, fontSize: 'var(--fs-sm)' }}>
              Audax Achiever — the life story of our founder, Dr. U. K. Monu Kanachur.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--tint mission" id="mission">
        <div className="container mission__grid">
          <div className="mission__card mission__card--mission">
            <span className="eyebrow">Our mission</span>
            <h2>{mission.heading}</h2>
            <p>{mission.body}</p>
          </div>
          <div className="mission__card mission__card--vision">
            <span className="eyebrow">Our vision</span>
            <p className="mission__vision">{vision}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Our values" title="What *guides* us." align="center" />
          <div className="grid grid--4 grid--dense">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="tile" style={{ height: '100%' }}>
                  <span className="tile__icon">
                    <Icon name={v.icon} />
                  </span>
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint" id="leadership">
        <div className="container">
          <SectionHeader eyebrow="Leadership" title="The people *behind* Kanachur." />
          <div className="grid grid--3">
            {leadership.map((l) => (
              <div key={l.name} className="tile">
                <span className="tile__icon">
                  <Icon name="user" />
                </span>
                <h3>{l.name}</h3>
                <p>{l.role}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28 }}>
            <Button to="/contact" variant="outline" icon="arrow-right">
              Contact the Trust office
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
