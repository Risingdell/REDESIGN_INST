import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { site } from '@/config/site';
import { useUI } from '@/context/UIContext';
import { Icon } from '@/components/ui/Icon';
import './FloatingActions.css';

const waLink = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Hello Kanachur, I would like some information.')}`;

/** Desktop: social rail + chat launcher + WhatsApp + back-to-top. Mobile: bottom action bar. */
export function FloatingActions() {
  const { toggleChat, chatOpen, openSearch } = useUI();
  const [showTop, setShowTop] = useState(false);
  const [nudge, setNudge] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener('scroll', onScroll, { passive: true });
    // Show the "Need help?" label once after a short delay, then shrink to the icon.
    const t1 = setTimeout(() => setNudge(true), 2500);
    const t2 = setTimeout(() => setNudge(false), 12000);
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <>
      <ul className="social-rail" aria-label="Follow Kanachur">
        {site.social.map((s) => (
          <li key={s.id}>
            <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
              <Icon name={s.id} size={16} />
            </a>
          </li>
        ))}
      </ul>

      <div className="floating-actions">
        <button
          type="button"
          className={`fab fab--top${showTop ? ' is-visible' : ''}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          tabIndex={showTop ? 0 : -1}
        >
          <Icon name="arrow-up" />
        </button>
        <a className="fab fab--whatsapp" href={waLink} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
          <Icon name="whatsapp" />
        </a>
        <button
          type="button"
          className={`fab fab--chat${nudge && !chatOpen ? ' is-expanded' : ''}`}
          onClick={toggleChat}
          aria-expanded={chatOpen}
          aria-label={chatOpen ? 'Close assistant' : 'Open Kanachur assistant'}
        >
          <span className="fab__label">Need help? Ask our assistant</span>
          <Icon name={chatOpen ? 'x' : 'chat'} />
          <span className="fab__dot" aria-hidden="true" />
        </button>
      </div>

      <nav className="mobile-bar" aria-label="Quick actions">
        <a href={site.contact.main.href}>
          <Icon name="phone" />
          Call
        </a>
        <button type="button" onClick={openSearch}>
          <Icon name="search" />
          Search
        </button>
        <Link to="/admissions/apply" className="mobile-bar__primary">
          <span>
            <Icon name="edit" />
          </span>
          Apply
        </Link>
        <a href={waLink} target="_blank" rel="noopener noreferrer">
          <Icon name="whatsapp" />
          WhatsApp
        </a>
        <button type="button" onClick={toggleChat} aria-expanded={chatOpen}>
          <Icon name="chat" />
          Ask
        </button>
      </nav>
    </>
  );
}
