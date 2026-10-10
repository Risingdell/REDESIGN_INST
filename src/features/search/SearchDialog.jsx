import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { search } from '@/lib/fuzzySearch';
import { useUI } from '@/context/UIContext';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { track } from '@/services/analytics';
import { Icon } from '@/components/ui/Icon';
import { searchIndex, popularSearches } from './searchIndex';
import './SearchDialog.css';

const TYPE_ICON = { Programme: 'graduation', Institution: 'building', Page: 'arrow-up-right', FAQ: 'info', News: 'megaphone', Hospital: 'stethoscope' };

/** Highlights the query words inside a result title. */
function Highlight({ text, query }) {
  const words = query.trim().split(/\s+/).filter((w) => w.length > 1);
  if (!words.length) return text;
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'i');
  // split() with a capture group puts the matches at the odd indices.
  return String(text)
    .split(re)
    .map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part));
}

/** Command-palette style site search (Ctrl/⌘ K or "/"). Typo-tolerant, keyboard-first. */
export default function SearchDialog() {
  const { closeSearch } = useUI();
  const navigate = useNavigate();
  const ref = useFocusTrap(true, closeSearch);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useLocalStorage('kiet:recent-searches', []);
  const listRef = useRef(null);

  const results = useMemo(() => search(searchIndex, query, { limit: 12 }), [query]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (!query.trim()) return undefined;
    const t = setTimeout(() => track('search', { search_term: query, results: results.length }), 800);
    return () => clearTimeout(t);
  }, [query, results.length]);

  const go = (item) => {
    setRecent((list) => [query.trim(), ...list.filter((q) => q !== query.trim())].filter(Boolean).slice(0, 5));
    closeSearch();
    if (item.href) window.location.href = item.href;
    else navigate(item.to);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const suggestions = recent.length ? recent : popularSearches;

  return (
    <div className="search" role="presentation">
      <div className="search__backdrop" onClick={closeSearch} />
      <div ref={ref} className="search__panel" role="dialog" aria-modal="true" aria-label="Search the site">
        <div className="search__bar">
          <Icon name="search" />
          <input
            data-autofocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search programmes, fees, departments, FAQs…"
            aria-label="Search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `search-opt-${active}` : undefined}
            autoComplete="off"
            spellCheck="false"
          />
          <button type="button" className="search__esc" onClick={closeSearch}>
            Esc
          </button>
        </div>

        <div className="search__body">
          {!query.trim() && (
            <div className="search__empty">
              <p className="search__label">{recent.length ? 'Recent searches' : 'Popular searches'}</p>
              <div className="cluster">
                {suggestions.map((s) => (
                  <button key={s} type="button" className="chip" onClick={() => setQuery(s)}>
                    {recent.length ? <Icon name="clock" size={14} /> : <Icon name="search" size={14} />} {s}
                  </button>
                ))}
              </div>
              <p className="search__tip">
                Tip: typos are fine — try “<button type="button" onClick={() => setQuery('phisiotherapy')}>phisiotherapy</button>”.
              </p>
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="search__none">
              <Icon name="search" size={32} />
              <p>
                No results for “<strong>{query}</strong>”.
              </p>
              <p className="muted">Try a programme name, a department, or a question like “hostel fees”.</p>
            </div>
          )}

          {results.length > 0 && (
            <ul id="search-results" ref={listRef} role="listbox" className="search__results" aria-label="Search results">
              {results.map((r, i) => (
                <li
                  key={r.id}
                  id={`search-opt-${i}`}
                  role="option"
                  aria-selected={i === active}
                  data-index={i}
                  className={i === active ? 'is-active' : ''}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r)}
                >
                  <span className="search__icon">
                    <Icon name={TYPE_ICON[r.type] || 'arrow-up-right'} size={18} />
                  </span>
                  <span className="search__text">
                    <strong>
                      <Highlight text={r.title} query={query} />
                    </strong>
                    {r.subtitle && <small>{r.subtitle}</small>}
                  </span>
                  <span className="search__type">{r.type}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="search__footer">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> to navigate
          </span>
          <span>
            <kbd>Enter</kbd> to open
          </span>
          <span>
            <kbd>Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
