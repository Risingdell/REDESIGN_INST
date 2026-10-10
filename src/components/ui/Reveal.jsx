import { useInView } from '@/hooks/useInView';
import { cx } from '@/lib/format';

/** Fades/slides children in the first time they scroll into view. */
export function Reveal({ as: Tag = 'div', delay = 0, className, style, children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag ref={ref} className={cx('reveal', inView && 'is-visible', className)} style={{ '--delay': `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}
