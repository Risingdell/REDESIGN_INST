/**
 * Inline SVG icon set (24×24, stroke-based). Inline icons avoid an extra
 * network request and inherit `currentColor`, so they theme automatically.
 */
const paths = {
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  'arrow-left': <path d="M19 12H5M11 6l-6 6 6 6" />,
  'arrow-up': <path d="M12 19V5M6 11l6-6 6 6" />,
  'arrow-up-right': <path d="M7 17 17 7M8 7h9v9" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-right': <path d="m9 6 6 6-6 6" />,
  'chevron-left': <path d="m15 6-6 6 6 6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  x: <path d="M18 6 6 18M6 6l12 12" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  stethoscope: (
    <>
      <path d="M6 3v6a5 5 0 0 0 10 0V3" />
      <path d="M11 14v2a5 5 0 0 0 10 0v-2" />
      <circle cx="21" cy="12" r="2" />
    </>
  ),
  heart: <path d="M12 20s-7.5-4.6-9.3-9.2C1.4 7.4 3.6 4 7 4c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8C19.5 15.4 12 20 12 20Z" />,
  activity: <path d="M3 12h4l3-8 4 16 3-8h4" />,
  flask: (
    <>
      <path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.3 21h11.4a2 2 0 0 0 1.8-2.5L14 9V3" />
      <path d="M7 15h10" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-9 6-14 15-15-1 9-6 15-15 15Z" />
      <path d="M5 19 13 11" />
    </>
  ),
  pill: (
    <>
      <rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-45 12 12)" />
      <path d="m9 9 6 6" />
    </>
  ),
  book: (
    <>
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" />
      <path d="M4 19a2 2 0 0 1 2-2h13" />
    </>
  ),
  school: (
    <>
      <path d="m2 9 10-5 10 5-10 5L2 9Z" />
      <path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
      <path d="m13 7 4 4" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="2.5" width="14" height="19" rx="2" />
      <path d="M8 6.5h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v3M8 18.5h4" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3 10v4h3l7 4V6L6 10H3Z" />
      <path d="M17 9a4 4 0 0 1 0 6M6 14l1 6h3l-1-5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a5.5 5.5 0 0 1 3.5 6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  play: <path d="M7 4.5v15l13-7.5-13-7.5Z" fill="currentColor" stroke="none" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 3 3 5-6" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3 2 20h20L12 3Z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" fill="currentColor" stroke="none" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />,
  bookmark: <path d="M6 3h12v18l-6-4-6 4V3Z" />,
  'bookmark-filled': <path d="M6 3h12v18l-6-4-6 4V3Z" fill="currentColor" />,
  scale: (
    <>
      <path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0L5 7ZM19 7l-3 7a3 3 0 0 0 6 0l-3-7Z" />
    </>
  ),
  download: <path d="M12 3v12M7 10l5 5 5-5M4 20h16" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  chat: <path d="M4 5h16v11H9l-5 4V5Z" />,
  send: <path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z" />,
  siren: (
    <>
      <path d="M6 18v-6a6 6 0 0 1 12 0v6" />
      <path d="M4 18h16v3H4zM12 2v2M4.2 5.2l1.4 1.4M19.8 5.2l-1.4 1.4" />
    </>
  ),
  bone: <path d="M8.5 7.5 16.5 15.5M6 4a2.5 2.5 0 0 0-1.8 4.3A2.5 2.5 0 1 0 8 11l5 5a2.5 2.5 0 1 0 2.7 3.8A2.5 2.5 0 1 0 20 16l-5-5a2.5 2.5 0 1 0-3.8-2.7A2.5 2.5 0 0 0 6 4Z" />,
  baby: (
    <>
      <circle cx="12" cy="10" r="6" />
      <path d="M9.5 10h.01M14.5 10h.01M10 13a3 3 0 0 0 4 0M8 19.5a8 8 0 0 0 8 0" />
    </>
  ),
  sparkle: <path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7Z" />,
  spark: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  shield: (
    <>
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  graduation: (
    <>
      <path d="m2 9 10-5 10 5-10 5L2 9Z" />
      <path d="M6 11v5c2 2 10 2 12 0v-5" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V5l8-3v19M12 9h8v12" />
      <path d="M8 8h.01M8 12h.01M8 16h.01M16 13h.01M16 17h.01M2 21h20" />
    </>
  ),
  filter: <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" />,
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  card: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M2.5 10h19M6 15h4" />
    </>
  ),
  bank: <path d="M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18" />,
  smartphone: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  home: <path d="M3 11 12 4l9 7M5 10v10h5v-6h4v6h5V10" />,
  quote: (
    <path
      d="M9.5 6C6.4 6.9 4.5 9.6 4.5 13v5h6v-6h-3c0-2.2 1.2-3.7 3-4.3L9.5 6Zm9 0c-3.1.9-5 3.6-5 7v5h6v-6h-3c0-2.2 1.2-3.7 3-4.3L18.5 6Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  maximize: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  whatsapp: (
    <path
      d="M12 2.5a9.4 9.4 0 0 0-8.1 14.2L2.5 21.5l4.9-1.3A9.4 9.4 0 1 0 12 2.5Zm5.4 13.2c-.2.6-1.3 1.2-1.8 1.3-.5 0-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.2Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  facebook: <path d="M14 8.5V7c0-.8.5-1.5 1.5-1.5H17V2.6c-.3 0-1.5-.1-2.8-.1-2.8 0-4.2 1.7-4.2 4.4v1.6H7.5V12H10v9.5h4V12h2.7l.4-3.5H14Z" fill="currentColor" stroke="none" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  twitter: <path d="M4 4l7.2 9.6L4.3 20h1.6l6-5.4 4.1 5.4H20l-7.5-10L19 4h-1.6l-5.6 5.1L8 4H4Z" fill="currentColor" stroke="none" />,
  youtube: (
    <>
      <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8Z" />
      <path d="m10 15 5.2-3L10 9v6Z" fill="currentColor" />
    </>
  ),
};

export function Icon({ name, size, className = '', title, ...rest }) {
  const content = paths[name];
  if (!content) return null;
  return (
    <svg
      className={`icon ${className}`.trim()}
      viewBox="0 0 24 24"
      width={size || 24}
      height={size || 24}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...rest}
    >
      {title && <title>{title}</title>}
      {content}
    </svg>
  );
}
