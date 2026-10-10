import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { programs, levels } from '@/content/programs';
import { institutions } from '@/content/institutions';
import { createSearchIndex, search } from '@/lib/fuzzySearch';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { usePreferences } from '@/context/PreferencesContext';
import { PageHero } from '@/components/layout/PageHero';
import { Icon } from '@/components/ui/Icon';
import { EmptyState } from '@/components/ui/misc';
import { Reveal } from '@/components/ui/Reveal';
import { ProgramCard } from '@/features/programs/ProgramCard';
import { CompareTray } from '@/features/programs/CompareTray';
import './pages.css';

const streams = [
  ['all', 'All'],
  ['medicine', 'Medicine'],
  ['nursing', 'Nursing'],
  ['physiotherapy', 'Physiotherapy'],
  ['allied', 'Allied health'],
  ['ayurveda', 'Ayurveda'],
  ['pharmacy', 'Pharmacy'],
  ['school', 'Pre-university'],
];

const index = createSearchIndex(
  programs.map((p) => ({ ...p, id: p.slug, name: `${p.title} ${p.fullTitle}`, inst: institutions.find((i) => i.slug === p.institution)?.name })),
  { name: 3, keywords: 2, inst: 1, eligibility: 1 },
);

/** Programme catalogue. Filters live in the URL, so any filtered view can be shared or bookmarked. */
export default function ProgramsPage() {
  const [params, setParams] = useSearchParams();
  const { shortlist } = usePreferences();
  const q = params.get('q') || '';
  const stream = params.get('stream') || 'all';
  const level = params.get('level') || 'all';
  const savedOnly = params.get('saved') === '1';

  useDocumentMeta({
    title: 'Programmes',
    description: 'Browse, filter, shortlist and compare programmes in medicine, nursing, physiotherapy, allied health, Ayurveda and pharmacy.',
  });

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'all' || value === '0') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    let list = q.trim() ? search(index, q, { limit: 50, minScore: 0.3 }) : programs;
    if (stream !== 'all') list = list.filter((p) => p.stream === stream);
    if (level !== 'all') list = list.filter((p) => p.level === level);
    if (savedOnly) list = list.filter((p) => shortlist.includes(p.slug));
    return list;
  }, [q, stream, level, savedOnly, shortlist]);

  const clear = () => setParams({}, { replace: true });

  return (
    <>
      <PageHero
        compact
        eyebrow="Programmes"
        title="Find the programme that *fits you*."
        lead="Filter by stream or level, save favourites and compare up to three side by side."
        image="/images/campus-college-block.webp"
        crumbs={[{ label: 'Programmes' }]}
      />

      <section className="section" style={{ paddingTop: "var(--section-head-gap)" }}>
        <div className="container">
          <div className="filters" role="search">
            <div className="filters__row">
              <label className="filters__search">
                <Icon name="search" size={20} />
                <span className="visually-hidden">Search programmes</span>
                <input type="search" value={q} placeholder="Search e.g. “doctor”, “physio”, “BSc”" onChange={(e) => update('q', e.target.value)} />
              </label>
              <label className="visually-hidden" htmlFor="level-filter">
                Level
              </label>
              <select id="level-filter" className="select" value={level} onChange={(e) => update('level', e.target.value)}>
                <option value="all">All levels</option>
                {Object.entries(levels).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
              <button type="button" className="chip" aria-pressed={savedOnly} onClick={() => update('saved', savedOnly ? '' : '1')}>
                <Icon name="bookmark" size={16} /> Shortlist ({shortlist.length})
              </button>
            </div>
            <div className="filters__row" role="group" aria-label="Stream">
              {streams.map(([id, label]) => (
                <button key={id} type="button" className="chip" aria-pressed={stream === id} onClick={() => update('stream', id)}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="results-meta" aria-live="polite">
            <span>
              {results.length} programme{results.length === 1 ? '' : 's'}
              {q && ` matching “${q}”`}
            </span>
            {(q || stream !== 'all' || level !== 'all' || savedOnly) && (
              <button type="button" className="btn btn--ghost btn--sm" onClick={clear}>
                Clear filters
              </button>
            )}
          </div>

          {results.length ? (
            <div className="grid grid--3">
              {results.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 60}>
                  <ProgramCard program={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState title={savedOnly ? 'Your shortlist is empty' : 'No programmes match these filters'}>
              <button type="button" className="btn btn--outline btn--sm" onClick={clear}>
                Show all programmes
              </button>
            </EmptyState>
          )}
        </div>
      </section>
      <CompareTray forceOpen={params.get('compare') === '1'} />
    </>
  );
}
