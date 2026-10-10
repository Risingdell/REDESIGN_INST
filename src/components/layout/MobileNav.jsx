import { useState } from 'react';
import { Link } from 'react-router-dom';
import { primaryNav, audienceNav } from '@/content/navigation';
import { site } from '@/config/site';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { Icon } from '@/components/ui/Icon';
import { Button, SmartLink } from '@/components/ui/Button';
import { ThemeToggle } from './Header';
import './MobileNav.css';

/** Full-height drawer navigation for phones and tablets. */
export function MobileNav({ open, onClose }) {
  const ref = useFocusTrap(open, onClose);
  const [expanded, setExpanded] = useState(null);
  if (!open) return null;

  return (
    <div className="mnav" role="presentation">
      <div className="mnav__backdrop" onClick={onClose} />
      <div ref={ref} className="mnav__panel" role="dialog" aria-modal="true" aria-label="Site menu">
        <div className="mnav__top">
          <Link to="/" className="mnav__brand" onClick={onClose}>
            <img src="/images/logo.webp" alt="" width="40" height="40" />
            Kanachur
          </Link>
          <ThemeToggle className="icon-btn" />
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close menu">
            <Icon name="x" />
          </button>
        </div>

        <nav aria-label="Main">
          <ul className="mnav__list">
            {primaryNav.map((item) => {
              const isOpen = expanded === item.label;
              return (
                <li key={item.label}>
                  <div className="mnav__row">
                    <Link to={item.to} onClick={onClose}>
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      className="mnav__expand"
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? 'Hide' : 'Show'} ${item.label} links`}
                      onClick={() => setExpanded(isOpen ? null : item.label)}
                    >
                      <Icon name="chevron-down" size={18} />
                    </button>
                  </div>
                  {isOpen && (
                    <ul className="mnav__sub">
                      {item.columns.flatMap((c) => c.links).map((link) => (
                        <li key={link.label}>
                          <SmartLink to={link.to} href={link.href} onClick={onClose}>
                            {link.label}
                          </SmartLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="mnav__label">I am a…</p>
        <div className="cluster">
          {audienceNav.map((a) => (
            <Link key={a.label} to={a.to} className="chip" onClick={onClose}>
              {a.label}
            </Link>
          ))}
        </div>

        <div className="mnav__cta">
          <Button to="/admissions/apply" variant="gold" block icon="arrow-right" onClick={onClose}>
            Apply now
          </Button>
          <Button href={site.contact.emergency.href} variant="accent" block iconLeft="siren">
            24×7 Emergency
          </Button>
          <Button href={site.contact.appointment.href} variant="outline" block iconLeft="phone">
            Appointments {site.contact.appointment.label}
          </Button>
        </div>
      </div>
    </div>
  );
}
