import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { site } from '@/config/site';
import { audienceNav, primaryNav } from '@/content/navigation';
import { useUI } from '@/context/UIContext';
import { usePreferences } from '@/context/PreferencesContext';
import { Icon } from '@/components/ui/Icon';
import { Button, SmartLink } from '@/components/ui/Button';
import { MobileNav } from './MobileNav';
import './Header.css';

function Ticker() {
  const items = [...site.announcements, ...site.announcements];
  return (
    <div className="ticker" role="region" aria-label="Announcements">
      <span className="ticker__label">
        <Icon name="megaphone" size={14} /> Updates
      </span>
      <div className="ticker__track">
        <ul className="ticker__list">
          {items.map((a, i) => (
            <li key={i} aria-hidden={i >= site.announcements.length || undefined}>
              <SmartLink to={a.to} href={a.href} tabIndex={i >= site.announcements.length ? -1 : undefined}>
                {a.text}
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ThemeToggle({ className = 'icon-btn header__icon' }) {
  const { theme, setTheme } = usePreferences();
  const isDark =
    theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  return (
    <button
      type="button"
      className={className}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light theme' : 'Dark theme'}
    >
      <Icon name={isDark ? 'sun' : 'moon'} />
    </button>
  );
}

function MegaMenu({ item, id, onNavigate }) {
  return (
    <div className="mega" id={id} role="region" aria-label={`${item.label} menu`}>
      <div className="container mega__inner">
        <div className="mega__columns">
          {item.columns.map((col) => (
            <div key={col.title} className="mega__col">
              <p className="mega__title">{col.title}</p>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <SmartLink to={link.to} href={link.href} className="mega__link" onClick={onNavigate}>
                      <span>{link.label}</span>
                      {link.desc && <small>{link.desc}</small>}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <aside className="mega__feature">
          <img src="/images/campus-aerial.webp" alt="" loading="lazy" />
          <div>
            <span className="badge badge--gold badge--live">Admissions 2026–27</span>
            <p>Apply online in about 10 minutes — your progress saves automatically.</p>
            <Button to="/admissions/apply" variant="gold" size="sm" icon="arrow-right" onClick={onNavigate}>
              Start application
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function Header() {
  const { openSearch } = useUI();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef();
  const navRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      // Written straight to the DOM so scrolling never re-renders the header.
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on navigation, Escape and outside clicks.
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!openMenu) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpenMenu(null);
    const onClick = (e) => !navRef.current?.contains(e.target) && setOpenMenu(null);
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [openMenu]);

  const hoverOpen = (label) => {
    clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const hoverClose = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 180);
  };

  const solid = scrolled || openMenu;

  return (
    <>
      <div className={`site-top${scrolled ? ' is-scrolled' : ''}`}>
        <Ticker />
        <div className="utility">
          <div className="container utility__inner">
            <nav aria-label="Audience">
              <ul className="utility__audiences">
                {audienceNav.map((a) => (
                  <li key={a.label}>
                    <Link to={a.to}>{a.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="utility__contact">
              <a href={site.contact.emergency.href} className="utility__emergency">
                <Icon name="siren" size={15} /> 24×7 Emergency {site.contact.emergency.label}
              </a>
              <a href={site.contact.appointment.href}>
                <Icon name="phone" size={15} /> Appointments {site.contact.appointment.label}
              </a>
              <a href={`mailto:${site.contact.deanEmail}`}>
                <Icon name="mail" size={15} /> {site.contact.deanEmail}
              </a>
            </div>
          </div>
        </div>

        <header className={`header${solid ? ' is-solid' : ''}`} ref={navRef} onMouseLeave={hoverClose}>
          <div className="container header__inner">
            <Link to="/" className="brand" aria-label={`${site.name} — home`}>
              <img src="/images/logo.webp" alt="" width="52" height="52" />
              <span className="brand__text">
                <strong>Kanachur</strong>
                <small>Islamic Education Trust (R)</small>
              </span>
            </Link>

            <nav className="nav" aria-label="Main">
              <ul className="nav__list">
                {primaryNav.map((item) => {
                  const menuId = `mega-${item.label.replace(/\s+/g, '-').toLowerCase()}`;
                  const isOpen = openMenu === item.label;
                  return (
                    <li key={item.label} onMouseEnter={() => hoverOpen(item.label)}>
                      <div className="nav__item">
                        <NavLink to={item.to} className="nav__link">
                          {item.label}
                        </NavLink>
                        <button
                          type="button"
                          className="nav__toggle"
                          aria-expanded={isOpen}
                          aria-controls={menuId}
                          aria-label={`${isOpen ? 'Close' : 'Open'} ${item.label} menu`}
                          onClick={() => setOpenMenu(isOpen ? null : item.label)}
                        >
                          <Icon name="chevron-down" size={16} />
                        </button>
                      </div>
                      {isOpen && <MegaMenu item={item} id={menuId} onNavigate={() => setOpenMenu(null)} />}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="header__actions">
              <button type="button" className="search-trigger" onClick={openSearch} aria-label="Search the site (Ctrl+K)">
                <Icon name="search" size={18} />
                <span>Search</span>
                <kbd>Ctrl K</kbd>
              </button>
              <ThemeToggle />
              <Button to="/admissions/apply" variant="gold" size="sm" icon="arrow-right" className="header__apply">
                Apply now
              </Button>
              <button
                type="button"
                className="icon-btn header__icon header__menu"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <Icon name="menu" />
              </button>
            </div>
          </div>
          <span className="scroll-progress" ref={progressRef} aria-hidden="true" />
        </header>
      </div>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
