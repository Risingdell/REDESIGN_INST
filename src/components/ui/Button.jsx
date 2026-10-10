import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { cx } from '@/lib/format';

/**
 * One button for every case: renders a router <Link> for internal `to`,
 * an <a> for external `href`, or a <button>.
 */
export const Button = forwardRef(function Button(
  { variant = 'primary', size, block, icon, iconLeft, loading, to, href, className, children, ...rest },
  ref,
) {
  const classes = cx(
    'btn',
    variant !== 'primary' && `btn--${variant}`,
    size && `btn--${size}`,
    block && 'btn--block',
    className,
  );
  const content = (
    <>
      {loading ? <span className="spinner" aria-hidden="true" /> : iconLeft && <Icon name={iconLeft} />}
      <span>{children}</span>
      {icon && !loading && <Icon name={icon} className="icon--trail" />}
    </>
  );

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a ref={ref} href={href} className={classes} {...(external && { target: '_blank', rel: 'noopener noreferrer' })} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button ref={ref} type="button" className={classes} disabled={loading || rest.disabled} aria-busy={loading || undefined} {...rest}>
      {content}
    </button>
  );
});

/** Link that works for both internal routes and external/tel/mailto targets. */
export function SmartLink({ to, href, children, ...rest }) {
  if (to) {
    return (
      <Link to={to} {...rest}>
        {children}
      </Link>
    );
  }
  const external = /^https?:/.test(href || '');
  return (
    <a href={href} {...(external && { target: '_blank', rel: 'noopener noreferrer' })} {...rest}>
      {children}
    </a>
  );
}
