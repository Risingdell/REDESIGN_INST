import { useState } from 'react';
import { news } from '@/content/news';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { EmptyState } from '@/components/ui/misc';
import { NewsCard } from '@/features/home/sections';
import { NewsletterForm } from '@/features/newsletter/NewsletterForm';
import '@/features/home/home.css';
import './pages.css';

const filters = [
  ['all', 'All'],
  ['news', 'News'],
  ['event', 'Events'],
];

export default function NewsPage() {
  const [type, setType] = useState('all');
  useDocumentMeta({ title: 'News & events', description: 'Latest news, achievements and events from Kanachur institutions.' });
  const items = [...news].sort((a, b) => b.date.localeCompare(a.date)).filter((n) => type === 'all' || n.type === type);

  return (
    <>
      <PageHero
        compact
        eyebrow="News & events"
        title="Stories from *our campus*."
        lead="Achievements, celebrations and announcements from across the Trust."
        image="/images/graduation-day-2024.webp"
        crumbs={[{ label: 'News & events' }]}
      />
      <section className="section" style={{ paddingTop: "var(--section-head-gap)" }}>
        <div className="container">
          <div className="results-meta">
            <div className="cluster" role="group" aria-label="Filter">
              {filters.map(([id, label]) => (
                <button key={id} type="button" className="chip" aria-pressed={type === id} onClick={() => setType(id)}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ minWidth: 280 }}>
              <NewsletterForm />
            </div>
          </div>
          {items.length ? (
            <div className="grid grid--3">
              {items.map((n, i) => (
                <Reveal key={n.slug} delay={(i % 3) * 70}>
                  <NewsCard item={n} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState icon="megaphone" title="Nothing here yet — check back soon." />
          )}
        </div>
      </section>
    </>
  );
}
