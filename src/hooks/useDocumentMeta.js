import { useEffect } from 'react';
import { site } from '@/config/site';

const setMeta = (selector, attr, value) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const [, name, key] = selector.match(/\[(name|property)="([^"]+)"\]/);
    el.setAttribute(name, key);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

/** Per-page <title>, description and Open Graph tags for SEO and link previews. */
export function useDocumentMeta({ title, description }) {
  useEffect(() => {
    const full = title ? `${title} · ${site.shortName}` : `${site.name} — ${site.tagline}`;
    document.title = full;
    setMeta('meta[property="og:title"]', 'content', full);
    if (description) {
      setMeta('meta[name="description"]', 'content', description);
      setMeta('meta[property="og:description"]', 'content', description);
    }
  }, [title, description]);
}
