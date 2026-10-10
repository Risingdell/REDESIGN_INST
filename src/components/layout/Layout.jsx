import { lazy, Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useUI } from '@/context/UIContext';
import { useHotkey } from '@/hooks/useHotkey';
import { trackPageView } from '@/services/analytics';
import { Toasts } from '@/components/ui/misc';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingActions } from './FloatingActions';
import './Layout.css';

// Overlays are code-split: they cost nothing until first opened.
const SearchDialog = lazy(() => import('@/features/search/SearchDialog'));
const ChatWidget = lazy(() => import('@/features/chat/ChatWidget'));
const EnquiryDrawer = lazy(() => import('@/features/enquiry/EnquiryDrawer'));

/** Scrolls to #hash targets after navigation, otherwise to the top. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // Wait a tick for lazily loaded page content to render.
      const id = decodeURIComponent(hash.slice(1));
      let tries = 0;
      const attempt = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else if (tries++ < 20) setTimeout(attempt, 50);
      };
      attempt();
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  useEffect(() => {
    trackPageView(pathname + hash, document.title);
  }, [pathname, hash]);
  return null;
}

export function PageFallback() {
  return (
    <div className="page-fallback" role="status" aria-live="polite">
      <span className="spinner" />
      <span className="visually-hidden">Loading page…</span>
    </div>
  );
}

export function Layout() {
  const ui = useUI();
  useHotkey('mod+k', ui.openSearch);
  useHotkey('/', ui.openSearch);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollManager />
      <Header />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <FloatingActions />
      <Toasts />
      <Suspense fallback={null}>
        {ui.searchOpen && <SearchDialog />}
        {ui.chatOpen && <ChatWidget />}
        {ui.enquiry.open && <EnquiryDrawer />}
      </Suspense>
    </>
  );
}
