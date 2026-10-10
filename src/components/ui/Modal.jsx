import { useId } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { cx } from '@/lib/format';
import { Icon } from './Icon';

/** Accessible dialog: focus trap, Escape to close, scroll lock, labelled title. */
export function Modal({ open, onClose, title, children, width, variant, className, hideHeader = false }) {
  const ref = useFocusTrap(open, onClose);
  const titleId = useId();
  if (!open) return null;

  return createPortal(
    <div className={cx('modal', variant && `modal--${variant}`, className)} role="presentation">
      <div className="modal__backdrop" onClick={onClose} />
      <div
        ref={ref}
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={width ? { '--modal-w': width } : undefined}
      >
        {hideHeader ? (
          <h2 id={titleId} className="visually-hidden">
            {title}
          </h2>
        ) : (
          <div className="modal__header">
            <h2 id={titleId}>{title}</h2>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close dialog">
              <Icon name="x" />
            </button>
          </div>
        )}
        <div className="modal__body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
