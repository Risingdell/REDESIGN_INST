import { useCallback, useEffect, useRef, useState } from 'react';
import { tourStops } from '@/content/tour';
import { track } from '@/services/analytics';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import './VirtualTour.css';

/**
 * Interactive campus tour: photo stops with hotspots, thumbnails, keyboard
 * arrows and fullscreen. Stops live in content/tour.js, so staff can add
 * 360° photos or new locations without touching this component.
 */
export function VirtualTour({ compact = false }) {
  const [index, setIndex] = useState(0);
  const [spot, setSpot] = useState(null);
  const stageRef = useRef(null);
  const stop = tourStops[index];

  const go = useCallback((next) => {
    setIndex((i) => (next + tourStops.length) % tourStops.length);
    setSpot(null);
  }, []);

  useEffect(() => {
    track('tour_view', { stop: stop.id });
  }, [stop.id]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') go(index + 1);
    if (e.key === 'ArrowLeft') go(index - 1);
  };

  const fullscreen = () => {
    const el = stageRef.current;
    if (document.fullscreenElement) document.exitFullscreen();
    else el?.requestFullscreen?.();
  };

  return (
    <div className={`tour${compact ? ' tour--compact' : ''}`}>
      <div
        className="tour__stage"
        ref={stageRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        role="region"
        aria-roledescription="virtual tour"
        aria-label={`Stop ${index + 1} of ${tourStops.length}: ${stop.title}. Use left and right arrow keys to move between stops.`}
      >
        {tourStops.map((s, i) => (
          <img
            key={s.id}
            src={s.image}
            alt={i === index ? s.title : ''}
            className={`tour__img${i === index ? ' is-active' : ''}`}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
        <div className="tour__shade" />

        {stop.hotspots.map((h, i) => (
          <button
            key={`${stop.id}-${i}`}
            type="button"
            className={`tour__spot${spot === i ? ' is-open' : ''}`}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            onClick={() => setSpot(spot === i ? null : i)}
            aria-expanded={spot === i}
            aria-label={h.label}
          >
            <span className="tour__pulse" aria-hidden="true" />
            <Icon name="plus" size={16} />
          </button>
        ))}

        {spot !== null && stop.hotspots[spot] && (
          <div
            className="tour__popover"
            style={{
              left: `${Math.min(70, Math.max(4, stop.hotspots[spot].x - 12))}%`,
              top: `${Math.min(70, stop.hotspots[spot].y + 7)}%`,
            }}
            role="status"
          >
            <strong>{stop.hotspots[spot].label}</strong>
            <p>{stop.hotspots[spot].text}</p>
          </div>
        )}

        <div className="tour__caption">
          <span className="tour__count">
            {String(index + 1).padStart(2, '0')} / {String(tourStops.length).padStart(2, '0')}
          </span>
          <h3>{stop.title}</h3>
          {!compact && <p>{stop.description}</p>}
        </div>

        <div className="tour__controls">
          <button type="button" onClick={() => go(index - 1)} aria-label="Previous stop">
            <Icon name="arrow-left" />
          </button>
          <button type="button" onClick={() => go(index + 1)} aria-label="Next stop">
            <Icon name="arrow-right" />
          </button>
          <button type="button" onClick={fullscreen} aria-label="Toggle fullscreen">
            <Icon name="maximize" />
          </button>
        </div>
      </div>

      <div className="tour__thumbs" role="tablist" aria-label="Tour stops">
        {tourStops.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            className={i === index ? 'is-active' : ''}
            onClick={() => go(i)}
          >
            <img src={s.image} alt="" loading="lazy" />
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      {compact && (
        <div className="tour__cta">
          <Button to="/campus-life#tour" variant="outline" icon="arrow-right">
            Open the full tour
          </Button>
          <Button to="/contact#visit" variant="gold" iconLeft="calendar">
            Book an in-person visit
          </Button>
        </div>
      )}
    </div>
  );
}
