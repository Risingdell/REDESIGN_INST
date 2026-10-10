import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';

// Describes campus life using only facilities named on the current site.
const STEPS = [
  {
    time: 'Morning',
    icon: 'book',
    title: 'Learn from the experts',
    text: 'Lectures and laboratory sessions in the college blocks, led by experienced faculty.',
    image: '/images/campus-college-block.webp',
  },
  {
    time: 'Midday',
    icon: 'stethoscope',
    title: 'Into the wards',
    text: 'Clinical postings at Kanachur Hospital & Research Centre, learning alongside practising clinicians.',
    image: '/images/campus-hospital-front.webp',
  },
  {
    time: 'Afternoon',
    icon: 'flask',
    title: 'Practise the skills',
    text: 'Skills labs, practicals and quiet study in the library — turning theory into confidence.',
    image: '/images/clinician-stethoscope.webp',
  },
  {
    time: 'Evening',
    icon: 'leaf',
    title: 'Life on campus',
    text: 'Green open spaces, hostels and events at the Conference Drome — a campus that feels like home.',
    image: '/images/campus-aerial.webp',
  },
];

/**
 * Sticky scroll-story: the photo stays pinned while four steps scroll past;
 * whichever step is centred in the viewport swaps the photo.
 */
export function DayStory() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.index));
        });
      },
      { rootMargin: '-48% 0px -48% 0px' },
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section story" aria-labelledby="story-title">
      <div className="container">
        <SectionHeader index="06" id="story-title" eyebrow="A day at Kanachur" title="From lecture hall to *bedside*." />
        <div className="story__grid">
          <div className="story__visual" aria-hidden="true">
            <div className="story__frame">
              {STEPS.map((s, i) => (
                <img key={s.image} src={s.image} alt="" loading="lazy" className={i === active ? 'is-active' : ''} />
              ))}
              <span className="story__time">{STEPS[active].time}</span>
              <span className="story__dots">
                {STEPS.map((s, i) => (
                  <span key={s.time} className={i === active ? 'is-active' : ''} />
                ))}
              </span>
            </div>
          </div>
          <ol className="story__steps">
            {STEPS.map((s, i) => (
              <li
                key={s.time}
                ref={(el) => (stepRefs.current[i] = el)}
                data-index={i}
                className={`story__step${i === active ? ' is-active' : ''}`}
              >
                <img className="story__inline" src={s.image} alt="" loading="lazy" />
                <span className="story__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="story__label">
                  <Icon name={s.icon} size={16} /> {s.time}
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
