import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { site } from '@/config/site';
import { institutions } from '@/content/institutions';
import { programs, programsByInstitution, levels } from '@/content/programs';
import { departments, hospitalStats } from '@/content/hospital';
import { news } from '@/content/news';
import { mission, vision } from '@/content/about';
import { createSearchIndex, search } from '@/lib/fuzzySearch';
import { dateParts } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Counter } from '@/components/ui/Counter';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';

/* ---------- Why Kanachur ---------- */
export function WhyKanachur() {
  return (
    <section className="section why">
      <div className="container why__grid">
        <Reveal className="why__media">
          <img className="why__img why__img--main" src="/images/campus-hospital-sky.webp" alt="Kanachur Hospital & Research Centre" loading="lazy" />
          <img className="why__img why__img--small" src="/images/clinician-stethoscope.webp" alt="" loading="lazy" />
          <div className="why__badge">
            <strong>1st</strong>
            <span>Rank in MBBS, Karnataka (RGUHS)</span>
          </div>
        </Reveal>
        <div>
          <SectionHeader
            eyebrow="Why choose Kanachur"
            title="Tackling the challenges of delivering *quality* health care."
            lead="We uphold the highest ethical standards and pursue excellence in medical education, healthcare and research — with a teaching hospital on the same campus as every classroom."
          />
          <ul className="why__points">
            {[
              ['stethoscope', 'Clinical learning from day one', 'Students train alongside practising clinicians in our multi-speciality hospital.'],
              ['graduation', 'University rank holders', 'Our students are among the top performers in RGUHS examinations.'],
              ['building', 'Seven institutions, one campus', 'Medicine, nursing, physiotherapy, allied health, Ayurveda and pharmacy.'],
            ].map(([icon, title, text], i) => (
              <Reveal as="li" key={title} delay={i * 90}>
                <span className="why__icon">
                  <Icon name={icon} />
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </span>
              </Reveal>
            ))}
          </ul>
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
      </div>
    </section>
  );
}

/* ---------- Institutions explorer ---------- */
export function InstitutionsExplorer() {
  const [active, setActive] = useState(institutions[0].slug);
  const inst = institutions.find((i) => i.slug === active);
  const instPrograms = programsByInstitution(active);

  return (
    <section className="section section--tint" aria-labelledby="inst-title">
      <div className="container">
        <SectionHeader
          id="inst-title"
          eyebrow="Our institutions"
          title="Pillars of knowledge, learning and *progress*."
          lead="Explore each institution — its programmes, strengths and how to apply."
          actions={
            <Button to="/institutions" variant="outline" icon="arrow-right">
              All institutions
            </Button>
          }
        />
        <div className="explorer">
          <div className="explorer__tabs" role="tablist" aria-label="Institutions" aria-orientation="vertical">
            {institutions.map((i) => (
              <button
                key={i.slug}
                type="button"
                role="tab"
                id={`tab-${i.slug}`}
                aria-selected={i.slug === active}
                aria-controls="explorer-panel"
                onClick={() => setActive(i.slug)}
                onKeyDown={(e) => {
                  const idx = institutions.findIndex((x) => x.slug === active);
                  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') setActive(institutions[(idx + 1) % institutions.length].slug);
                  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') setActive(institutions[(idx - 1 + institutions.length) % institutions.length].slug);
                }}
                tabIndex={i.slug === active ? 0 : -1}
              >
                <span className="explorer__tab-icon">
                  <Icon name={i.icon} size={18} />
                </span>
                <span>
                  <small>{i.code}</small>
                  {i.shortName}
                </span>
                <Icon name="chevron-right" size={18} className="explorer__chev" />
              </button>
            ))}
          </div>

          <article className="explorer__panel" id="explorer-panel" role="tabpanel" aria-labelledby={`tab-${inst.slug}`} key={inst.slug}>
            <div className="explorer__media">
              <img src={inst.image} alt="" loading="lazy" />
              <span className="badge badge--gold">{inst.code}</span>
            </div>
            <div className="explorer__body">
              <h3>{inst.name}</h3>
              <p>{inst.summary}</p>
              <ul className="explorer__highlights">
                {inst.highlights.map((h) => (
                  <li key={h}>
                    <Icon name="check-circle" size={18} /> {h}
                  </li>
                ))}
              </ul>
              {instPrograms.length > 0 && (
                <div className="explorer__programs">
                  <span className="muted">Programmes:</span>
                  {instPrograms.map((p) => (
                    <Link key={p.slug} to={`/programs/${p.slug}`} className="chip">
                      {p.title}
                    </Link>
                  ))}
                </div>
              )}
              <div className="cluster">
                <Button to={`/institutions/${inst.slug}`} icon="arrow-right">
                  Explore {inst.shortName}
                </Button>
                {inst.website && (
                  <Button href={inst.website} variant="ghost" icon="external">
                    Visit website
                  </Button>
                )}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ---------- Instant programme finder ---------- */
const programIndex = createSearchIndex(
  programs.map((p) => ({ ...p, id: p.slug, name: `${p.title} ${p.fullTitle}` })),
  { name: 3, keywords: 2, eligibility: 1 },
);

export function ProgramFinderTeaser() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const results = useMemo(() => (q.trim() ? search(programIndex, q, { limit: 4 }) : programs.slice(0, 4)), [q]);

  return (
    <section className="section finder" aria-labelledby="finder-title">
      <div className="container finder__grid">
        <div>
          <SectionHeader
            id="finder-title"
            eyebrow="Find your programme"
            title="What do you want to *become*?"
            lead="Type a career, subject or degree — spelling mistakes are fine."
          />
          <form
            className="finder__search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/programs?q=${encodeURIComponent(q)}`);
            }}
          >
            <Icon name="search" />
            <label htmlFor="finder-q" className="visually-hidden">
              Search programmes
            </label>
            <input id="finder-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. doctor, physio, nursing, pharmacy" autoComplete="off" />
            <button type="submit" className="btn btn--gold btn--sm">
              Search
            </button>
          </form>
          <div className="cluster finder__chips">
            {['Doctor', 'Physiotherapy', 'Nursing', 'Ayurveda', 'Pharmacy', 'Lab technology'].map((c) => (
              <button key={c} type="button" className="chip" onClick={() => setQ(c)} aria-pressed={q === c}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <ul className="finder__results" aria-live="polite">
          {results.length === 0 && <li className="finder__none">No match yet — try “medicine” or “nursing”.</li>}
          {results.map((p) => (
            <li key={p.slug}>
              <Link to={`/programs/${p.slug}`} className="finder__item">
                <span className="finder__abbr">{p.title.replace(/[^A-Z]/g, '').slice(0, 3) || p.title.slice(0, 2)}</span>
                <span className="finder__text">
                  <strong>{p.title}</strong>
                  <small>
                    {levels[p.level]} · {p.duration}
                  </small>
                </span>
                <Icon name="arrow-right" size={18} />
              </Link>
            </li>
          ))}
          <li>
            <Link to="/programs" className="finder__all">
              Browse & compare all {programs.length} programmes <Icon name="arrow-right" size={16} />
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

/* ---------- Hospital band ---------- */
export function HospitalBand() {
  return (
    <section className="section section--dark hospital-band" aria-labelledby="hospital-title">
      <div className="container">
        <SectionHeader
          id="hospital-title"
          eyebrow="Kanachur Hospital & Research Centre"
          title="Excellence in care, *compassion* in service."
          lead="A multi-speciality teaching hospital open 24 hours — where our students learn and our community heals."
          actions={
            <div className="cluster">
              <Button to="/hospital#book" variant="gold" iconLeft="calendar">
                Book appointment
              </Button>
              <Button to="/hospital" variant="ghost-light" icon="arrow-right">
                All departments
              </Button>
            </div>
          }
        />
        <div className="hospital-band__grid">
          {departments.map((d, i) => (
            <Reveal key={d.slug} delay={i * 60} className="dept">
              <span className="dept__icon">
                <Icon name={d.icon} />
              </span>
              <h3>{d.name}</h3>
              <p>{d.summary}</p>
            </Reveal>
          ))}
          <Reveal className="dept dept--emergency" delay={360}>
            <span className="badge badge--accent badge--live">24×7</span>
            <h3>Emergency?</h3>
            <p>Call our emergency line right away.</p>
            <a href={site.contact.emergency.href} className="dept__phone">
              <Icon name="phone" /> {site.contact.emergency.label}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Admissions journey ---------- */
export function AdmissionsJourney() {
  const steps = [
    { icon: 'search', title: 'Explore', text: 'Find and compare programmes, check eligibility and estimate fees.', to: '/programs' },
    { icon: 'edit', title: 'Apply online', text: 'A 10-minute application that saves as you go.', to: '/admissions/apply' },
    { icon: 'card', title: 'Pay & submit', text: 'Pay the application fee securely online and get your number instantly.', to: '/admissions/apply' },
    { icon: 'graduation', title: 'Verify & join', text: 'Document verification, counselling and confirmation of your seat.', to: '/admissions#documents' },
  ];
  return (
    <section className="section journey" aria-labelledby="journey-title">
      <div className="container">
        <SectionHeader id="journey-title" eyebrow="Admissions 2026–27" title="Four steps to your *seat*." align="center" />
        <ol className="journey__steps">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 100}>
              <Link to={s.to} className="journey__step">
                <span className="journey__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="journey__icon">
                  <Icon name={s.icon} />
                </span>
                <strong>{s.title}</strong>
                <small>{s.text}</small>
              </Link>
            </Reveal>
          ))}
        </ol>
        <div className="journey__cta">
          <Button to="/admissions/apply" variant="gold" size="lg" icon="arrow-right">
            Start your application
          </Button>
          <Button to="/admissions#fees" variant="outline" size="lg" iconLeft="calculator">
            Estimate your fees
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ---------- News ---------- */
export function NewsCard({ item }) {
  const d = dateParts(item.date);
  return (
    <article className="news-card card card--hover">
      <div className="card__media">
        <img src={item.image} alt="" loading="lazy" />
        <time dateTime={item.date} className="news-card__date">
          <strong>{d.day}</strong>
          <span>
            {d.month} {d.year}
          </span>
        </time>
      </div>
      <div className="card__body news-card__body">
        <span className={`badge${item.type === 'event' ? ' badge--gold' : ''}`}>{item.type === 'event' ? 'Event' : 'News'}</span>
        <h3>
          <Link to={`/news/${item.slug}`} className="news-card__link">
            {item.title}
          </Link>
        </h3>
        <p>{item.excerpt}</p>
        <span className="news-card__more">
          Read more <Icon name="arrow-right" size={16} />
        </span>
      </div>
    </article>
  );
}

export function NewsSection() {
  const latest = [...news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  return (
    <section className="section section--tint" aria-labelledby="news-title">
      <div className="container">
        <SectionHeader
          id="news-title"
          eyebrow="News & events"
          title="What's happening at *Kanachur*."
          actions={
            <Button to="/news" variant="outline" icon="arrow-right">
              All news & events
            </Button>
          }
        />
        <div className="grid grid--3">
          {latest.map((n, i) => (
            <Reveal key={n.slug} delay={i * 80}>
              <NewsCard item={n} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Mission & vision ---------- */
export function MissionVision() {
  return (
    <section className="section mission" id="mission" aria-labelledby="mission-title">
      <div className="container mission__grid">
        <Reveal className="mission__card mission__card--mission">
          <span className="eyebrow">Our mission</span>
          <h2 id="mission-title">{mission.heading}</h2>
          <p>{mission.body}</p>
        </Reveal>
        <Reveal className="mission__card mission__card--vision" delay={120}>
          <span className="eyebrow">Our vision</span>
          <p className="mission__vision">{vision}</p>
          <Button to="/about" variant="ghost" icon="arrow-right">
            More about the Trust
          </Button>
        </Reveal>
      </div>
      <div className="container">
        <Reveal className="thought">
          <Icon name="quote" className="thought__icon" />
          <div>
            <span className="eyebrow">Thought for the day</span>
            <p>{site.thoughtOfTheDay}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
