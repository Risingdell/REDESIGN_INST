import { Link } from 'react-router-dom';
import { site } from '@/config/site';
import { institutions } from '@/content/institutions';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { NewsletterForm } from '@/features/newsletter/NewsletterForm';
import './Footer.css';

const explore = [
  { label: 'Admissions', to: '/admissions' },
  { label: 'Apply online', to: '/admissions/apply' },
  { label: 'Programmes', to: '/programs' },
  { label: 'Hospital & appointments', to: '/hospital' },
  { label: 'Campus life & tour', to: '/campus-life' },
  { label: 'News & events', to: '/news' },
  { label: 'Current students', to: '/students' },
  { label: 'Alumni', to: '/alumni' },
  { label: 'About the Trust', to: '/about' },
  { label: 'Contact & directions', to: '/contact' },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__cta">
        <div className="container footer__cta-inner">
          <div>
            <span className="eyebrow">Your journey starts here</span>
            <h2>
              Ready to join the <em>Kanachur</em> family?
            </h2>
          </div>
          <div className="cluster">
            <Button to="/admissions/apply" variant="gold" size="lg" icon="arrow-right">
              Apply now
            </Button>
            <Button to="/contact#visit" variant="ghost-light" size="lg" iconLeft="calendar">
              Book a campus visit
            </Button>
          </div>
        </div>
      </div>

      <div className="container footer__grid">
        <div className="footer__about">
          <Link to="/" className="footer__brand">
            <img src="/images/logo.webp" alt="" width="64" height="64" loading="lazy" />
            <span>
              <strong>Kanachur</strong>
              <small>Islamic Education Trust (R)</small>
            </span>
          </Link>
          <p>
            Delivering high-quality, holistic medical education and compassionate healthcare, and encouraging innovative
            thinking in research and development.
          </p>
          <ul className="footer__social" aria-label="Social media">
            {site.social.map((s) => (
              <li key={s.id}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <Icon name={s.id} size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Explore">
          <h3>Explore</h3>
          <ul className="footer__links">
            {explore.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Institutions">
          <h3>Institutions</h3>
          <ul className="footer__links">
            {institutions.map((i) => (
              <li key={i.slug}>
                <Link to={`/institutions/${i.slug}`}>{i.name.replace('Kanachur ', '')}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__contact">
          <h3>Get in touch</h3>
          <address>
            <Icon name="map-pin" size={18} />
            <span>
              {site.address.lines.map((l) => (
                <span key={l}>
                  {l}
                  <br />
                </span>
              ))}
            </span>
          </address>
          <a href={site.contact.main.href}>
            <Icon name="phone" size={18} /> {site.contact.main.label}
          </a>
          <a href={site.contact.appointment.href}>
            <Icon name="calendar" size={18} /> Appointments {site.contact.appointment.label}
          </a>
          <a href={`mailto:${site.contact.deanEmail}`}>
            <Icon name="mail" size={18} /> {site.contact.deanEmail}
          </a>
          <div className="footer__newsletter">
            <p>Newsletter — admissions dates, events and news, once a month.</p>
            <NewsletterForm compact />
          </div>
        </div>
      </div>

      <div className="footer__partners container">
        <span>Connected with</span>
        {site.partners.map((p) => (
          <a key={p.label} href={p.href} target="_blank" rel="noopener noreferrer">
            {p.label} <Icon name="external" size={14} />
          </a>
        ))}
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <ul>
            <li>
              <a href={site.legal.privacy} target="_blank" rel="noopener noreferrer">
                Privacy policy
              </a>
            </li>
            <li>
              <a href={site.legal.terms} target="_blank" rel="noopener noreferrer">
                Terms
              </a>
            </li>
            <li>
              Designed by{' '}
              <a href="https://www.parrophins.com" target="_blank" rel="noopener noreferrer" className="footer__credit">
                ParroPhins
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
