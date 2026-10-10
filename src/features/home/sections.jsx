import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { site } from '@/config/site';
import { institutions } from '@/content/institutions';
import { programsByInstitution } from '@/content/programs';
import { departments, hospitalStats } from '@/content/hospital';
import { news } from '@/content/news';
import { mission, vision } from '@/content/about';
import { dateParts } from '@/lib/format';
import { useParallax, useTilt } from '@/hooks/useMotion';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Counter } from '@/components/ui/Counter';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';

/* ---------- Why Kanachur (split: collage + text) ---------- */
export function WhyKanachur() {
  const parallax = useParallax(20);
  return (
    <section className="section why">
      <div className="container why__grid">
        <Reveal className="why__media glow glow--gold">
          <img className="why__img why__img--main" src="/images/campus-hospital-sky.webp" alt="Kanachur Hospital & Research Centre" loading="lazy" />
          <div className="why__img-wrap" ref={parallax}>
            <img className="why__img why__img--small" src="/images/clinician-stethoscope.webp" alt="" loading="lazy" />
          </div>
          <div className="why__badge">
            <strong>1st</strong>
            <span>Rank in MBBS, Karnataka (RGUHS)</span>
          </div>
        </Reveal>
        <div>
          <SectionHeader
            index="02"
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
        </div>
      </div>
    </section>
  );
}

/* ---------- By the numbers (centred statement, outline numbers) ---------- */
export function StatsStrip() {
  return (
    <section className="section numbers has-dots" aria-labelledby="numbers-title">
      <div className="container">
        <Reveal className="numbers__head">
          <span className="eyebrow">By the numbers</span>
          <h2 id="numbers-title">
            A teaching hospital at the heart of <em>every</em> programme.
          </h2>
        </Reveal>
        <dl className="numbers__grid">
          {hospitalStats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="numbers__item">
              <dd>
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
              <dt>{s.label}</dt>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ---------- Institutions (horizontal rail, snap + drag) ---------- */
function RailCard({ inst }) {
  const tilt = useTilt(5);
  const count = programsByInstitution(inst.slug).length;
  return (
    <li className="rail__item">
      <Link to={`/institutions/${inst.slug}`} className="rail__card tilt" ref={tilt} draggable="false">
        <img src={inst.image} alt="" loading="lazy" draggable="false" />
        <span className="rail__shade" />
        <span className="rail__top">
          <span className="badge badge--gold">{inst.code}</span>
          {count > 0 && (
            <span className="rail__count">
              {count} programme{count > 1 ? 's' : ''}
            </span>
          )}
        </span>
        <span className="rail__panel">
          <span className="rail__icon">
            <Icon name={inst.icon} size={20} />
          </span>
          <strong>{inst.name}</strong>
          <small>{inst.summary}</small>
          <span className="rail__more">
            Explore <Icon name="arrow-right" size={16} />
          </span>
        </span>
      </Link>
    </li>
  );
}

export function InstitutionsRail() {
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const drag = useRef({ active: false, moved: false, x: 0, left: 0 });

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    const card = el?.querySelector('.rail__item');
    if (el && card) el.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: 'smooth' });
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  // Mouse drag-to-scroll on desktop (touch already swipes natively).
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') return;
    drag.current = { active: true, moved: false, x: e.clientX, left: trackRef.current.scrollLeft };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) {
      d.moved = true;
      trackRef.current.classList.add('is-dragging');
    }
    trackRef.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    drag.current.active = false;
    trackRef.current?.classList.remove('is-dragging');
  };
  // Swallow the click that ends a drag so it doesn't open a card.
  const onClickCapture = (e) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  useEffect(() => {
    window.addEventListener('pointerup', endDrag);
    return () => window.removeEventListener('pointerup', endDrag);
  }, []);

  return (
    <section className="section rail-section" id="institutions" aria-labelledby="inst-title">
      <div className="container">
        <SectionHeader
          index="03"
          id="inst-title"
          eyebrow="Our institutions"
          title="Pillars of knowledge, learning and *progress*."
          lead="Swipe through our institutions — each shares the campus and the teaching hospital."
          actions={
            <div className="rail__controls">
              <button type="button" className="icon-btn" onClick={() => scrollByCard(-1)} aria-label="Previous institutions">
                <Icon name="arrow-left" />
              </button>
              <button type="button" className="icon-btn" onClick={() => scrollByCard(1)} aria-label="Next institutions">
                <Icon name="arrow-right" />
              </button>
            </div>
          }
        />
      </div>
      <ul
        className="rail"
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClickCapture={onClickCapture}
        aria-label="Institutions"
      >
        {institutions.map((inst) => (
          <RailCard key={inst.slug} inst={inst} />
        ))}
      </ul>
      <div className="container rail__footer">
        <div className="rail__progress" aria-hidden="true">
          <span style={{ width: `${Math.max(12, progress * 100)}%` }} />
        </div>
        <Link to="/institutions" className="btn btn--ghost btn--sm">
          All institutions <Icon name="arrow-right" size={16} />
        </Link>
      </div>
    </section>
  );
}

/* ---------- Hospital (white; hover-reveal cards) ---------- */
export function HospitalSection() {
  return (
    <section className="section hospital glow" id="hospital" aria-labelledby="hospital-title">
      <div className="container">
        <SectionHeader
          index="05"
          id="hospital-title"
          eyebrow="Kanachur Hospital & Research Centre"
          title="Excellence in care, *compassion* in service."
          lead="A multi-speciality teaching hospital open 24 hours — where our students learn and our community heals."
          actions={
            <div className="cluster">
              <Button to="/hospital#book" variant="gold" iconLeft="calendar">
                Book appointment
              </Button>
              <Button to="/hospital" variant="outline" icon="arrow-right">
                All departments
              </Button>
            </div>
          }
        />
        <div className="hospital__grid">
          {departments
            .filter((d) => d.slug !== 'emergency')
            .map((d, i) => (
              <Reveal key={d.slug} delay={i * 60}>
                <Link to="/hospital#departments" className="dept-card">
                  <span className="dept-card__icon">
                    <Icon name={d.icon} />
                  </span>
                  <strong>{d.name}</strong>
                  <span className="dept-card__reveal">
                    <small>{d.summary}</small>
                    <span className="dept-card__more">
                      Book a visit <Icon name="arrow-right" size={14} />
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          <Reveal delay={320}>
            <div className="dept-card dept-card--emergency">
              <span className="badge badge--accent badge--live">24×7 Emergency</span>
              <strong>In an emergency, call now</strong>
              <a href={site.contact.emergency.href} className="dept-card__phone">
                <Icon name="phone" /> {site.contact.emergency.label}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Admissions journey (centred steps) ---------- */
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
        <SectionHeader index="07" id="journey-title" eyebrow="Admissions 2026–27" title="Four steps to your *seat*." align="center" />
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
    <section className="section" aria-labelledby="news-title">
      <div className="container">
        <SectionHeader
          index="09"
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

/* ---------- Mission & vision (white cards) ---------- */
export function MissionVision() {
  return (
    <section className="section mission" id="mission" aria-labelledby="mission-title">
      <div className="container mission__grid">
        <Reveal className="mission__card mission__card--mission">
          <span className="mission__mark" aria-hidden="true">
            <Icon name="quote" />
          </span>
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
