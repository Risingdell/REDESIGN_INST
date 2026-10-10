import { env } from '@/config/site';

/**
 * Thin analytics wrapper (GA4). With no measurement ID it does nothing, so
 * development and demo builds never send data. Events are named after GA4's
 * recommended events where possible, which makes the audit reports
 * (top pages, drop-offs, form completions) available out of the box.
 */

let initialised = false;

export function initAnalytics() {
  if (initialised || !env.gaId || typeof window === 'undefined') return;
  initialised = true;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${env.gaId}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  // Page views are sent manually on route change (single-page app).
  window.gtag('config', env.gaId, { send_page_view: false, anonymize_ip: true });
}

export function track(event, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  }
}

export const trackPageView = (path, title) => track('page_view', { page_path: path, page_title: title });
