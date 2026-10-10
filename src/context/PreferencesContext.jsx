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
  const [theme, setTheme] = useLocalStorage('kiet:theme', 'system');
  const [shortlist, setShortlist] = useLocalStorage('kiet:shortlist', []);
  const [compare, setCompare] = useLocalStorage('kiet:compare', []);
  const [recent, setRecent] = useLocalStorage('kiet:recent', []);

  // Apply the theme to <html> so CSS tokens switch everywhere at once.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
  }, [theme]);

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
      theme,
      setTheme,
      shortlist,
      toggleShortlist,
      compare,
      toggleCompare,
      clearCompare: () => setCompare([]),
      maxCompare: MAX_COMPARE,
      recent,
      markViewed,
    }),
    [audienceId, chooseAudience, theme, setTheme, shortlist, toggleShortlist, compare, toggleCompare, setCompare, recent, markViewed],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used inside <PreferencesProvider>');
  return ctx;
}
