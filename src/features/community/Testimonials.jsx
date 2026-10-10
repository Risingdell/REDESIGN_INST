import { useEffect, useRef, useState } from 'react';
import { testimonials } from '@/content/community';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { Icon } from '@/components/ui/Icon';
import { Stars } from '@/components/ui/misc';
import './community.css';

/** Auto-advancing, swipeable testimonial carousel (pauses on hover/focus). */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const trackRef = useRef(null);

  useEffect(() => {
    if (paused || reduced) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6500);
    return () => clearInterval(t);
  }, [paused, reduced]);

  useEffect(() => {
    const el = trackRef.current;
    const card = el?.children[index];
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: reduced ? 'auto' : 'smooth' });
  }, [index, reduced]);

  // Keep the dots in sync when the visitor swipes manually.
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / (el.children[0]?.offsetWidth || 1));
    if (i !== index && i < testimonials.length) setIndex(i);
  };

  return (
    <div
      className="tm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Student testimonials"
    >
      <div className="tm__track" ref={trackRef} onScroll={onScroll}>
        {testimonials.map((t, i) => (
          <figure key={t.name} className="tm__card" aria-roledescription="slide" aria-label={`${i + 1} of ${testimonials.length}`}>
            <Icon name="quote" className="tm__quote" />
            <blockquote>{t.quote}</blockquote>
            <figcaption>
              <span className="tm__avatar" aria-hidden="true">
                {t.name[0]}
              </span>
              <span>
                <strong>{t.name}</strong>
                <small>{t.role}</small>
              </span>
              <Stars value={t.rating} />
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="tm__controls">
        <button type="button" className="icon-btn" onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)} aria-label="Previous testimonial">
          <Icon name="arrow-left" />
        </button>
        <div className="tm__dots">
          {testimonials.map((t, i) => (
            <button key={t.name} type="button" aria-label={`Show testimonial ${i + 1}`} aria-current={i === index} onClick={() => setIndex(i)} />
          ))}
        </div>
        <button type="button" className="icon-btn" onClick={() => setIndex((i) => (i + 1) % testimonials.length)} aria-label="Next testimonial">
          <Icon name="arrow-right" />
        </button>
      </div>
    </div>
  );
}
