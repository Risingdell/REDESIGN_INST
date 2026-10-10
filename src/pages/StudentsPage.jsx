import { site } from '@/config/site';
import { news } from '@/content/news';
import { faqs } from '@/content/faqs';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SmartLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Accordion } from '@/components/ui/Accordion';
import { formatDate } from '@/lib/format';
import './pages.css';

// TODO(trust): add the student ERP/LMS login URL and the academic calendar PDF when available.
const resources = [
  { icon: 'globe', title: 'RGUHS portal', text: 'University results, exam notifications and circulars.', href: 'https://www.rguhs.ac.in/' },
  { icon: 'megaphone', title: 'Notices & news', text: 'Latest announcements from your institution.', to: '/news' },
  { icon: 'download', title: 'Newsletter 2025', text: 'Highlights from across the campus (PDF).', href: site.partners[2].href },
  { icon: 'stethoscope', title: 'Student health', text: 'On-campus hospital — book an appointment.', to: '/hospital#book' },
  { icon: 'mail', title: 'Academic cell', text: site.contact.academicEmail, href: `mailto:${site.contact.academicEmail}` },
  { icon: 'chat', title: 'Ask the assistant', text: 'Quick answers to common questions, any time.', to: '/contact' },
];

export default function StudentsPage() {
  useDocumentMeta({ title: 'Current students', description: 'Portals, notices, newsletter, health services and contacts for current Kanachur students.' });
  const latest = [...news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  return (
    <>
      <PageHero
        compact
        eyebrow="Current students"
        title="Everything you need, *one place*."
        lead="Portals, notices, health services and contacts — designed for quick access on your phone."
        image="/images/campus-college-block.webp"
        crumbs={[{ label: 'Current students' }]}
      />
      <section className="section" style={{ paddingTop: "var(--section-head-gap)" }}>
        <div className="container grid grid--3 grid--dense">
          {resources.map((r) => (
            <SmartLink key={r.title} to={r.to} href={r.href} className="tile">
              <span className="tile__icon">
                <Icon name={r.icon} />
              </span>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
              <span className="tile__link">
                Open <Icon name={r.href ? 'external' : 'arrow-right'} size={16} />
              </span>
            </SmartLink>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div>
            <SectionHeader eyebrow="Notice board" title="Latest *updates*." />
            <ul className="info-list panel">
              {latest.map((n) => (
                <li key={n.slug}>
                  <span className="icon-wrap">
                    <Icon name={n.type === 'event' ? 'calendar' : 'megaphone'} size={20} />
                  </span>
                  <span>
                    <SmartLink to={`/news/${n.slug}`}>
                      <strong>{n.title}</strong>
                    </SmartLink>
                    <span>{formatDate(n.date)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeader eyebrow="Help" title="Student *FAQs*." />
            <Accordion items={faqs.filter((f) => ['Students', 'Campus life', 'Hospital'].includes(f.topic)).map((f) => ({ id: f.id, title: f.q, content: <p>{f.a}</p> }))} />
          </div>
        </div>
      </section>
    </>
  );
}
