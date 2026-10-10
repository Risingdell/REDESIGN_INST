import { useEffect, useRef, useState } from 'react';

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * Subtle 3D tilt that follows the cursor (desktop mouse only).
 * Writes CSS variables, so styling stays in CSS: transform uses --rx / --ry.
 */
export function useTilt(max = 6) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !finePointer()) return undefined;
    let frame;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`);
      });
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', reset);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', reset);
      cancelAnimationFrame(frame);
    };
  }, [max]);
  return ref;
}

/**
 * Gentle parallax: shifts the element up to `range` px as it crosses the
 * viewport. Writes --parallax (px) for CSS to use in a transform.
 */
export function useParallax(range = 20) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return undefined;
    let frame;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      // -1 when the element enters at the bottom → +1 when it leaves at the top.
      const progress = 1 - (r.top + r.height / 2) / (vh / 2);
      el.style.setProperty('--parallax', `${(Math.max(-1, Math.min(1, progress)) * -range).toFixed(1)}px`);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [range]);
  return ref;
}

/**
 * Which section the reader is in, for in-page navs: the last of `ids` whose
 * top has scrolled above `line` (fraction of the viewport). Based on scroll
 * position rather than visibility, so sections between chapters and jumps
 * past several chapters still resolve correctly.
 */
export function useActiveSection(ids, line = 0.4) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    let frame;
    const update = () => {
      const mark = window.innerHeight * line;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= mark) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ids, line]);
  return active;
}
