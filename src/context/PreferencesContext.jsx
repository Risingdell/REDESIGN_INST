import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { audiences, defaultAudience } from '@/content/audiences';
import { track } from '@/services/analytics';

/**
 * Everything the site remembers about a visitor (the "Customisation" layer).
 * Stored only in their own browser — nothing is sent to a server.
 */
const PreferencesContext = createContext(null);

const MAX_COMPARE = 3;
const MAX_RECENT = 6;

export function PreferencesProvider({ children }) {
  const [audienceId, setAudienceId] = useLocalStorage('kiet:audience', null);
  const [shortlist, setShortlist] = useLocalStorage('kiet:shortlist', []);
  const [compare, setCompare] = useLocalStorage('kiet:compare', []);
  const [recent, setRecent] = useLocalStorage('kiet:recent', []);

  // White is the only theme (client requirement). Clear the old setting and
  // attribute left by earlier versions of the site that had a dark mode.
  useEffect(() => {
    document.documentElement.removeAttribute('data-theme');
    try {
      localStorage.removeItem('kiet:theme');
    } catch {
      /* storage unavailable */
    }
  }, []);

  const chooseAudience = useCallback(
    (id) => {
      setAudienceId(id);
      track('select_audience', { audience: id });
    },
    [setAudienceId],
  );

  const toggleShortlist = useCallback(
    (slug) => setShortlist((list) => (list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug])),
    [setShortlist],
  );

  /** Returns false when the compare tray is already full. */
  const toggleCompare = useCallback(
    (slug) => {
      if (compare.includes(slug)) {
        setCompare((list) => list.filter((s) => s !== slug));
        return true;
      }
      if (compare.length >= MAX_COMPARE) return false;
      setCompare((list) => (list.includes(slug) ? list : [...list, slug]));
      return true;
    },
    [compare, setCompare],
  );

  const markViewed = useCallback(
    (slug) => setRecent((list) => [slug, ...list.filter((s) => s !== slug)].slice(0, MAX_RECENT)),
    [setRecent],
  );

  const value = useMemo(
    () => ({
      audienceId: audienceId || defaultAudience,
      hasChosenAudience: Boolean(audienceId),
      audience: audiences[audienceId] || audiences[defaultAudience],
      chooseAudience,
      shortlist,
      toggleShortlist,
      compare,
      toggleCompare,
      clearCompare: () => setCompare([]),
      maxCompare: MAX_COMPARE,
      recent,
      markViewed,
    }),
    [audienceId, chooseAudience, shortlist, toggleShortlist, compare, toggleCompare, setCompare, recent, markViewed],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used inside <PreferencesProvider>');
  return ctx;
}
