/**
 * Organisation-wide facts used across the UI. Everything here comes from the
 * current kanachurims.com site; values marked TODO need confirming by the Trust.
 */
export const site = {
  name: 'Kanachur Islamic Education Trust (R)',
  shortName: 'Kanachur',
  tagline: 'Med-Ed & Healthcare Excellence',
  legacyUrl: 'https://kanachurims.com',

  contact: {
    main: { label: '0824-2888999', href: 'tel:+918242888999' },
    appointment: { label: '0824 2888000', href: 'tel:+918242888000' },
    mobile: { label: '+91 70229 58282', href: 'tel:+917022958282' },
    emergency: { label: '0824-2888999', href: 'tel:+918242888999' },
    deanEmail: 'dean@kanachur.edu.in',
    academicEmail: 'academiccell@kanachur.edu.in',
    // TODO(trust): confirm this number is on WhatsApp. The live site's WhatsApp link has no number.
    whatsapp: '917022958282',
    hours: 'Hospital open 24 hours · Offices Mon–Sat, 9:00–17:00',
  },

  address: {
    lines: ['Kanachur Islamic Education Trust', 'Mangalore University Road', 'Natekal, Mangaluru 575018', 'Karnataka, India'],
    mapsUrl: 'https://maps.google.com/?q=Kanachur+Institute+of+Medical+Sciences+Natekal',
    mapEmbed:
      'https://maps.google.com/maps?q=Kanachur%20Institute%20of%20Medical%20Sciences%20Natekal&t=&z=14&ie=UTF8&iwloc=&output=embed',
  },

  social: [
    { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/kanachurhospital.official/' },
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/kanachurhospital_official/' },
    { id: 'twitter', label: 'X (Twitter)', href: 'https://twitter.com/Kanachur_Hsptl' },
    { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/results?search_query=Kanachur' },
  ],

  // External systems the site links out to (the "Connection" layer).
  partners: [
    { label: 'Rajiv Gandhi University of Health Sciences', href: 'https://www.rguhs.ac.in/' },
    { label: 'Kanachur Public School', href: 'https://www.kanachur.org/' },
    { label: 'Newsletter 2025 (PDF)', href: 'https://kanachurims.com/Files/newsletter/NEWSLETTER%202025_compressed.pdf' },
  ],

  legal: {
    privacy: 'https://kanachurims.com/privacy.php',
    terms: 'https://kanachurims.com/terms.php',
  },

  announcements: [
    { text: 'Admissions open for the 2026–27 academic year', to: '/admissions' },
    { text: 'Graduation Day held on 20 April 2024 — congratulations, graduates!', to: '/news/graduation-day-2024' },
    { text: '24×7 Emergency: 0824-2888999', href: 'tel:+918242888999' },
    { text: 'Newsletter 2025 is out — read the highlights', to: '/news/newsletter-2025' },
  ],

  thoughtOfTheDay:
    'A good physician treats the disease; the great physician treats the patient who has the disease.',
};

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  gaId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
  get demoMode() {
    return !this.apiBaseUrl;
  },
};
