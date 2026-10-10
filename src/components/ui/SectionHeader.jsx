import { cx } from '@/lib/format';
import { Reveal } from './Reveal';

/**
 * Section heading. Wrap the accent word in `*asterisks*` to render it in the
 * italic display face: title="Where medicine meets *compassion*".
 */
export function renderAccent(text) {
  return String(text)
    .split(/(\*[^*]+\*)/)
    .map((part, i) => (part.startsWith('*') && part.endsWith('*') ? <em key={i}>{part.slice(1, -1)}</em> : part));
}

export function SectionHeader({ eyebrow, title, lead, align = 'left', as: Tag = 'h2', actions, className, id }) {
  return (
    <Reveal className={cx('section-header', align === 'center' && 'section-header--center', actions && 'section-header--split', className)}>
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <Tag id={id}>{renderAccent(title)}</Tag>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {actions}
    </Reveal>
  );
}
