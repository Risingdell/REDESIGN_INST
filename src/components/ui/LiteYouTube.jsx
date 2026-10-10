import { useState } from 'react';
import { Icon } from './Icon';
import { track } from '@/services/analytics';
import './LiteYouTube.css';

/**
 * Click-to-load YouTube embed. Shows only a thumbnail until the visitor
 * presses play, saving ~1 MB of player JavaScript per video on page load.
 */
export function LiteYouTube({ id, title, autoplay = false }) {
  const [active, setActive] = useState(autoplay);

  if (active) {
    return (
      <div className="lyt is-active">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="lyt"
      onClick={() => {
        setActive(true);
        track('video_start', { video_id: id, video_title: title });
      }}
      aria-label={`Play video: ${title}`}
    >
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" width="480" height="360" />
      <span className="lyt__play">
        <Icon name="play" />
      </span>
    </button>
  );
}
