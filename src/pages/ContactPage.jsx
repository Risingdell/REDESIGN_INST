import { site } from '@/config/site';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { EnquiryForm } from '@/features/enquiry/EnquiryForm';
import { SlotBooking } from '@/features/booking/SlotBooking';
import './pages.css';

const channels = [
  { icon: 'siren', title: '24×7 Emergency', value: site.contact.emergency.label, href: site.contact.emergency.href, tone: 'accent' },
  { icon: 'calendar', title: 'Appointments', value: site.contact.appointment.label, href: site.contact.appointment.href },
  { icon: 'phone', title: 'Mobile', value: site.contact.mobile.label, href: site.contact.mobile.href },
  { icon: 'mail', title: 'Dean’s office', value: site.contact.deanEmail, href: `mailto:${site.contact.deanEmail}` },
  { icon: 'graduation', title: 'Academic cell', value: site.contact.academicEmail, href: `mailto:${site.contact.academicEmail}` },
  { icon: 'whatsapp', title: 'WhatsApp', value: 'Chat with us', href: `https://wa.me/${site.contact.whatsapp}` },
];

export default function ContactPage() {
  useDocumentMeta({
    title: 'Contact & directions',
    description: 'Phone, email, WhatsApp and directions to the Kanachur campus, Natekal, Mangaluru. Book a campus visit online.',
  });

  return (
    <>
      <PageHero
        compact
        eyebrow="Contact"
        title="We're here to *help*."
        lead="Call, message, email or visit — whichever suits you best."
        image="/images/campus-hospital-sky.webp"
        crumbs={[{ label: 'Contact' }]}
      />

      <section className="section" style={{ paddingTop: "var(--section-head-gap)" }}>
        <div className="container grid grid--3 grid--dense">
          {channels.map((c) => (
            <a key={c.title} href={c.href} className="tile" {...(c.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}>
              <span className="tile__icon" style={c.tone === 'accent' ? { background: 'var(--accent-soft)', color: 'var(--accent)' } : undefined}>
                <Icon name={c.icon} />
              </span>
              <h3>{c.title}</h3>
              <p style={{ fontWeight: 700, overflowWrap: 'anywhere' }}>{c.value}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section section--tint">
        <div className="container split">
          <div className="panel">
            <SectionHeader eyebrow="Send an enquiry" title="Ask us *anything*." lead="We reply within one working day." />
            <EnquiryForm />
          </div>
          <div className="stack" style={{ '--stack': '18px' }}>
            <iframe className="map-embed" title="Map: Kanachur campus, Natekal" src={site.address.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            <div className="panel">
              <ul className="info-list">
                <li>
                  <span className="icon-wrap">
                    <Icon name="map-pin" size={20} />
                  </span>
                  <span>
                    <strong>Address</strong>
                    <span>{site.address.lines.join(', ')}</span>
                  </span>
                </li>
                <li>
                  <span className="icon-wrap">
                    <Icon name="clock" size={20} />
                  </span>
                  <span>
                    <strong>Hours</strong>
                    <span>{site.contact.hours}</span>
                  </span>
                </li>
              </ul>
              <div style={{ marginTop: 18 }}>
                <Button href={site.address.mapsUrl} variant="outline" iconLeft="map-pin">
                  Open in Google Maps
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="visit">
        <div className="container container--narrow">
          <div className="panel">
            <SectionHeader
              eyebrow="Campus visit"
              title="See Kanachur *in person*."
              lead="Guided visits run Monday to Saturday. Pick a slot and we'll show you classrooms, labs, hostels and the hospital."
            />
            <SlotBooking kind="visit" />
          </div>
        </div>
      </section>
    </>
  );
}
