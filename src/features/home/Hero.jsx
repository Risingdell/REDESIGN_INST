import { useEffect, useState } from 'react';
import { usePreferences } from '@/context/PreferencesContext';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { LiteYouTube } from '@/components/ui/LiteYouTube';

const slides = [
  { image: '/images/campus-hospital-front.webp', caption: 'Kanachur Hospital & Research Centre' },
  { image: '/images/campus-aerial.webp', caption: 'Our campus, Natekal' },
  { image: '/images/campus-college-block.webp', caption: 'College block & grounds' },
  { image: '/images/campus-hospital-sky.webp', caption: 'Teaching hospital' },
];

/**
 * First screen: one message, two actions, one story — nothing else competes
 * for attention. Personalisation lives in the "Start here" section below.
 */
export function Hero() {
  const { audience } = usePreferences();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [video, setVideo] = useState(false);

  useEffect(() => {
    if (reduced) return undefined;
    const t = setInterval(() => setActive((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [reduced]);

  return (
    <section className="hero" aria-label="Welcome">
      <div className="hero__slides" aria-hidden="true">
        {slides.map((s, i) => (
          <img
            key={s.image}
            src={s.image}
            alt=""
            className={i === active ? 'is-active' : ''}
            fetchpriority={i === 0 ? 'high' : 'low'}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
      </div>
      <div className="hero__shade" />

      <div className="container hero__content">
        <span className="hero__eyebrow" key={audience.heroEyebrow}>
          <span className="badge badge--gold badge--live">{audience.heroEyebrow}</span>
        </span>
        <h1 className="hero__title">
          Where medicine meets <em>compassion</em>.
        </h1>
        <p className="hero__lead" key={audience.heroLead}>
          {audience.heroLead}
        </p>
        <div className="hero__actions">
          <Button to={audience.primary.to} variant="gold" size="lg" icon="arrow-right">
            {audience.primary.label}
          </Button>
          <Button to={audience.secondary.to} variant="ghost-light" size="lg">
            {audience.secondary.label}
          </Button>
          <button type="button" className="hero__play" onClick={() => setVideo(true)}>
            <span>
              <Icon name="play" size={18} />
            </span>
            Watch our story
          </button>
        </div>
      </div>

      <div className="container hero__meta">
        <p className="hero__caption">
          <Icon name="map-pin" size={16} /> {slides[active].caption}
        </p>
        <a href="#start" className="hero__scroll" aria-label="Scroll to explore">
          <span className="hero__mouse" aria-hidden="true">
            <span />
          </span>
          Explore
        </a>
        <div className="hero__dots" role="tablist" aria-label="Background photos">
          {slides.map((s, i) => (
            <button key={s.image} type="button" role="tab" aria-selected={i === active} aria-label={s.caption} onClick={() => setActive(i)} />
          ))}
        </div>
      </div>

      <Modal open={video} onClose={() => setVideo(false)} title="Audax Achiever — the story of our founder" width="960px">
        <LiteYouTube id="86rvvaUf298" title="Audax Achiever — A Life Story of Dr. U. K. Monu Kanachur" autoplay />
      </Modal>
    </section>
  );
}
