import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

/** Global UI surfaces that any component can open: search, chat, enquiry drawer, toasts. */
const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [enquiry, setEnquiry] = useState({ open: false, topic: '' });
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const dismissToast = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const toast = useCallback(
    (message, { tone = 'info', duration = 4000 } = {}) => {
      const id = nextId.current++;
      setToasts((list) => [...list.slice(-2), { id, message, tone }]);
      if (duration) setTimeout(() => dismissToast(id), duration);
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({
      searchOpen,
      openSearch: () => setSearchOpen(true),
      closeSearch: () => setSearchOpen(false),
      chatOpen,
      openChat: () => setChatOpen(true),
      closeChat: () => setChatOpen(false),
      toggleChat: () => setChatOpen((o) => !o),
      enquiry,
      openEnquiry: (topic = '') => setEnquiry({ open: true, topic }),
      closeEnquiry: () => setEnquiry((e) => ({ ...e, open: false })),
      toasts,
      toast,
      dismissToast,
    }),
    [searchOpen, chatOpen, enquiry, toasts, toast, dismissToast],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>');
  return ctx;
}
