import { useEffect, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useMediaQuery';

/** Counts up to `value` once visible. Screen readers get the final number immediately. */
export function Counter({ value, suffix = '', duration = 1600 }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduced) {
      setDisplay(value);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - p) ** 4;
      setDisplay(Math.round(value * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref}>
      <span aria-hidden="true">
        {display.toLocaleString('en-IN')}
        {suffix}
      </span>
      <span className="visually-hidden">
        {value.toLocaleString('en-IN')}
        {suffix}
      </span>
    </span>
  );
}
