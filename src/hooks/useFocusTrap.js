import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps keyboard focus inside a dialog while it is open, closes on Escape,
 * locks page scroll, and returns focus to the trigger when it closes.
 */
export function useFocusTrap(active, onEscape) {
  const ref = useRef(null);
  const escRef = useRef(onEscape);
  escRef.current = onEscape;

  useEffect(() => {
    if (!active) return undefined;
    const previouslyFocused = document.activeElement;
    const node = ref.current;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const first = node?.querySelector('[data-autofocus]') || node?.querySelector(FOCUSABLE);
    requestAnimationFrame(() => first?.focus());

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        escRef.current?.();
        return;
      }
      if (e.key !== 'Tab' || !node) return;
      const items = [...node.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [active]);

  return ref;
}
