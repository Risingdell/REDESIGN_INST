import { useEffect, useRef } from 'react';

const isTyping = (el) => el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));

/**
 * Global keyboard shortcut. `combo` examples: 'mod+k' (Ctrl on Windows, ⌘ on Mac), '/'.
 * Single-key shortcuts are ignored while the user is typing in a field.
 */
export function useHotkey(combo, handler) {
  const saved = useRef(handler);
  saved.current = handler;

  useEffect(() => {
    const parts = combo.toLowerCase().split('+');
    const key = parts.pop();
    const needsMod = parts.includes('mod');

    const onKeyDown = (e) => {
      if (e.key.toLowerCase() !== key) return;
      if (needsMod && !(e.ctrlKey || e.metaKey)) return;
      if (!needsMod && (e.ctrlKey || e.metaKey || e.altKey || isTyping(document.activeElement))) return;
      e.preventDefault();
      saved.current(e);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [combo]);
}
