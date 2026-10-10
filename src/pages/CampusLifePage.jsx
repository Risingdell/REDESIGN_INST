import { useState } from 'react';
import { videos } from '@/content/community';
import { site } from '@/config/site';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { LiteYouTube } from '@/components/ui/LiteYouTube';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { VirtualTour } from '@/features/tour/VirtualTour';
import { Testimonials } from '@/features/community/Testimonials';
import './pages.css';

const facilities = [
  ['stethoscope', 'Teaching hospital', 'Multi-speciality hospital on campus for clinical training.'],
  ['flask', 'Laboratories', 'Skills, anatomy, pharmacy and diagnostic labs.'],
  ['book', 'Library', 'Medical journals, e-resources and quiet study spaces.'],
  ['home', 'Hostels', 'Separate hostels with wardens and dining.'],
  ['users', 'Conference Drome', 'A modern venue for conferences, CMEs and events.'],
  ['leaf', 'Green campus', 'Landscaped grounds and a herbal garden.'],
];

export default function CampusLifePage() {
  useDocumentMeta({
    title: 'Campus life & virtual tour',
    description: 'Take a virtual tour of the Kanachur campus, watch campus videos and hear from our students.',
  });
  const tags = ['All', ...new Set(videos.map((v) => v.tag))];
  const [tag, setTag] = useState('All');
  const shown = tag === 'All' ? videos : videos.filter((v) => v.tag === tag);

  return (
    <>
      <PageHero
        eyebrow="Campus life"
        title="A campus built for *learning and healing*."
        lead="Explore the campus online, watch our films and see what student life is like."
        image="/images/campus-aerial.webp"
        crumbs={[{ label: 'Campus life' }]}
      >
        <Button href="#tour" variant="gold" size="lg" iconLeft="compass">
          Start the virtual tour
        </Button>
      </PageHero>

      <section className="section" id="tour">
        <div className="container">
          <SectionHeader eyebrow="Virtual campus tour" title="Step *inside*." lead="Use the arrows or your keyboard to move between stops; tap a glowing point for details." />
          <VirtualTour />
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <SectionHeader eyebrow="Facilities" title="Everything you need, *on campus*." />
          <div className="grid grid--3 grid--dense">
            {facilities.map(([icon, title, text], i) => (
              <Reveal key={title} delay={(i % 3) * 70}>
                <div className="tile" style={{ height: '100%' }}>
                  <span className="tile__icon">
                    <Icon name={icon} />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="videos">
        <div className="container">
          <SectionHeader
            eyebrow="Watch"
            title="Kanachur on *film*."
            actions={
              <div className="cluster" role="group" aria-label="Filter videos">
                {tags.map((t) => (
                  <button key={t} type="button" className="chip" aria-pressed={tag === t} onClick={() => setTag(t)}>
                    {t}
                  </button>
                ))}
              </div>
            }
          />
          <div className="grid grid--3">
            {shown.map((v) => (
              <figure key={v.id} style={{ margin: 0, display: 'grid', gap: 10 }}>
                <LiteYouTube id={v.id} title={v.title} />
                <figcaption style={{ fontWeight: 700 }}>{v.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint" id="stories">
        <div className="container">
          <SectionHeader
            eyebrow="Student stories"
            title="In their *own words*."
            actions={
              <div className="cluster">
                {site.social.slice(0, 3).map((s) => (
                  <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" className="chip">
                    <Icon name={s.id} size={16} /> Follow on {s.label}
                  </a>
                ))}
              </div>
            }
          />
          <Testimonials />
        </div>
      </section>
    </>
  );
}
