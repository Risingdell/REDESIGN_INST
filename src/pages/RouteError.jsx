import { useRouteError } from 'react-router-dom';
import { site } from '@/config/site';

/**
 * Last-resort error screen. Rendered outside the layout, so it uses plain
 * links and inline layout only.
 */
export function RouteError() {
  const error = useRouteError();
  // A failed chunk download (e.g. after a new deploy) is fixed by reloading.
  const isChunkError = /Failed to fetch dynamically imported module|Importing a module script failed/i.test(
    error?.message || '',
  );

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ maxWidth: 520, display: 'grid', gap: 16, justifyItems: 'center' }}>
        <img src="/images/logo.webp" alt="" width="72" height="72" />
        <h1 style={{ fontSize: '1.8rem' }}>{isChunkError ? 'A new version is available' : 'Something went wrong'}</h1>
        <p className="muted">
          {isChunkError
            ? 'The site was updated while you were browsing. Reload to get the latest version.'
            : `Please try again. If it keeps happening, call us on ${site.contact.main.label}.`}
        </p>
        <div className="cluster" style={{ justifyContent: 'center' }}>
          <button type="button" className="btn" onClick={() => window.location.reload()}>
            Reload page
          </button>
          <a className="btn btn--outline" href="/">
            Go to home page
          </a>
        </div>
      </div>
    </div>
  );
}
