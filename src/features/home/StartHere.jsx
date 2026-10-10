import { Link } from 'react-router-dom';
import { audiences, quickLinkCatalog } from '@/content/audiences';
import { usePreferences } from '@/context/PreferencesContext';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';

/**
 * "Who are you?" → a mosaic of shortcuts made for that visitor.
 * Choosing a persona re-flows the mosaic with a staggered animation, and the
 * choice also personalises the hero and the chat assistant.
 */
export function StartHere() {
  const { audienceId, audience, chooseAudience } = usePreferences();
  const tiles = audience.quickLinks.map((key) => ({ key, ...quickLinkCatalog[key] }));

  return (
    <section className="section start has-dots" id="start" aria-labelledby="start-title">
      <div className="container">
        <SectionHeader
          index="01"
          id="start-title"
          eyebrow="Start here"
          title="Tell us who you are — we'll show you the *way*."
          align="center"
        />

        <div className="persona" role="radiogroup" aria-label="I am a">
          {Object.entries(audiences).map(([id, a]) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={audienceId === id}
              className="persona__card"
              onClick={() => chooseAudience(id)}
            >
              <span className="persona__icon">
                <Icon name={a.icon} />
              </span>
              <span className="persona__text">
                <strong>{a.label}</strong>
                <small>{a.hint}</small>
              </span>
              <span className="persona__check" aria-hidden="true">
                <Icon name="check" size={14} />
              </span>
            </button>
          ))}
        </div>

        {/* key forces a re-mount so the tiles animate in for each persona */}
        <ul className="bento" key={audienceId} aria-label={`Shortcuts for ${audience.label.toLowerCase()}s`}>
          {tiles.map((t, i) => (
            <li key={t.key} className={`bento__item bento__item--${i + 1}`} style={{ '--i': i }}>
              <Link to={t.to} className="bento__link">
                <img src={t.image} alt="" loading="lazy" />
                <span className="bento__shade" />
                <span className="bento__icon">
                  <Icon name={t.icon} size={22} />
                </span>
                <span className="bento__body">
                  <strong>{t.title}</strong>
                  <small>{i === 0 ? audience.heroLead : t.text}</small>
                </span>
                <span className="bento__go" aria-hidden="true">
                  <Icon name="arrow-up-right" size={20} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
