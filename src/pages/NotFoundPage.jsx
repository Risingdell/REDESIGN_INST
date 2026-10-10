import { useUI } from '@/context/UIContext';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { Button } from '@/components/ui/Button';
import './pages.css';

export default function NotFoundPage() {
  const { openSearch } = useUI();
  useDocumentMeta({ title: 'Page not found' });
  return (
    <section className="not-found">
      <div style={{ display: 'grid', gap: 16, justifyItems: 'center', maxWidth: 560 }}>
        <h1>404</h1>
        <h2 style={{ fontSize: '1.8rem' }}>We couldn't find that page.</h2>
        <p className="muted">It may have moved in our new website. Try searching, or head to one of these:</p>
        <div className="cluster" style={{ justifyContent: 'center' }}>
          <Button variant="gold" iconLeft="search" onClick={openSearch}>
            Search the site
          </Button>
          <Button to="/" variant="outline">
            Home
          </Button>
          <Button to="/admissions" variant="outline">
            Admissions
          </Button>
          <Button to="/contact" variant="outline">
            Contact
          </Button>
        </div>
      </div>
    </section>
  );
}
