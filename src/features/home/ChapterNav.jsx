import { useEffect, useRef } from 'react';
import { useActiveSection } from '@/hooks/useMotion';

const CHAPTERS = [
  { id: 'start', label: 'Start' },
  { id: 'institutions', label: 'Institutions' },
  { id: 'programmes', label: 'Programmes' },
  { id: 'hospital', label: 'Hospital' },
  { id: 'campus', label: 'Campus' },
  { id: 'stories', label: 'Stories' },
];
const IDS = CHAPTERS.map((c) => c.id);

/**
 * Sticky in-page chapter nav. It sits right after the hero, so it only
 * appears once the visitor scrolls past it, then sticks under the header.
 */
export function ChapterNav() {
  const active = useActiveSection(IDS);
  const listRef = useRef(null);
  const index = Math.max(0, IDS.indexOf(active));

  // Keep the active chapter visible when the row scrolls sideways on phones.
  useEffect(() => {
    listRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [active]);

  return (
    <nav className="chapters" aria-label="On this page">
      <div className="container chapters__inner">
        <span className="chapters__label">On this page</span>
        <ol className="chapters__list" ref={listRef}>
          {CHAPTERS.map((c, i) => (
            <li key={c.id}>
              <a href={`#${c.id}`} aria-current={c.id === active ? 'true' : undefined} className={i < index ? 'is-past' : ''}>
                <span className="chapters__num">{String(i + 1).padStart(2, '0')}</span>
                {c.label}
              </a>
            </li>
          ))}
        </ol>
        <span className="chapters__progress" aria-hidden="true">
          <span style={{ width: `${((index + 1) / CHAPTERS.length) * 100}%` }} />
        </span>
      </div>
    </nav>
  );
}
