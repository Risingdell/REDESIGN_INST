import { useParams } from 'react-router-dom';
import { getNews, news } from '@/content/news';
import { site } from '@/config/site';
import { formatDate } from '@/lib/format';
import { downloadICS } from '@/lib/calendar';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useUI } from '@/context/UIContext';
import { PageHero } from '@/components/layout/PageHero';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { NewsCard } from '@/features/home/sections';
import NotFoundPage from './NotFoundPage';
import '@/features/home/home.css';
import './pages.css';

export default function NewsDetailPage() {
  const { slug } = useParams();
  const item = getNews(slug);
  const { toast } = useUI();
  useDocumentMeta({ title: item?.title || 'Not found', description: item?.excerpt });
  if (!item) return <NotFoundPage />;

  const isUpcoming = item.type === 'event' && new Date(item.date) >= new Date(new Date().toDateString());
  const more = news.filter((n) => n.slug !== slug).slice(0, 3);

  const share = async () => {
    const data = { title: item.title, text: item.excerpt, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast('Link copied to clipboard');
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <>
      <PageHero compact eyebrow={item.type === 'event' ? 'Event' : 'News'} title={item.title} image={item.image} crumbs={[{ label: 'News & events', to: '/news' }, { label: item.title }]} />
      <section className="section" style={{ paddingTop: "var(--section-head-gap)" }}>
        <div className="container container--narrow article">
          <div className="article__meta">
            <span>
              <Icon name="calendar" size={16} /> {formatDate(item.date, { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            {item.location && (
              <span>
                <Icon name="map-pin" size={16} /> {item.location}
              </span>
            )}
            {item.tags.map((t) => (
              <span key={t} className="badge">
                {t}
              </span>
            ))}
          </div>
          <img className="article__cover" src={item.image} alt="" />
          <div className="prose">
            {item.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="cluster">
            {item.attachment && (
              <Button href={item.attachment.href} variant="gold" iconLeft="download">
                {item.attachment.label}
              </Button>
            )}
            {isUpcoming && (
              <Button
                variant="outline"
                iconLeft="calendar"
                onClick={() =>
                  downloadICS({
                    title: item.title,
                    start: `${item.date}T${item.time || '10:00'}:00`,
                    durationMinutes: 180,
                    location: item.location || site.address.lines.join(', '),
                    description: item.excerpt,
                  })
                }
              >
                Add to calendar
              </Button>
            )}
            <Button variant="outline" iconLeft="send" onClick={share}>
              Share
            </Button>
          </div>
        </div>
      </section>
      {more.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeader eyebrow="Keep reading" title="More *news*." />
            <div className="grid grid--3">
              {more.map((n) => (
                <NewsCard key={n.slug} item={n} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
