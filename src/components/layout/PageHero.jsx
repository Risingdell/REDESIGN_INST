import { renderAccent } from '@/components/ui/SectionHeader';
import { Breadcrumbs } from '@/components/ui/misc';
import './PageHero.css';

/** Inner-page hero: photo, gradient, breadcrumbs, title, lead and optional actions. */
export function PageHero({ title, lead, eyebrow, image = '/images/campus-hospital-front.webp', crumbs = [], children, compact }) {
  return (
    <section className={`page-hero${compact ? ' page-hero--compact' : ''}`}>
      <img className="page-hero__bg" src={image} alt="" fetchpriority="high" />
      <div className="page-hero__shade" />
      <div className="container page-hero__inner">
        {crumbs.length > 0 && <Breadcrumbs items={crumbs} />}
        {eyebrow && <span className="eyebrow page-hero__eyebrow">{eyebrow}</span>}
        <h1>{renderAccent(title)}</h1>
        {lead && <p className="page-hero__lead">{lead}</p>}
        {children && <div className="page-hero__actions">{children}</div>}
      </div>
    </section>
  );
}
