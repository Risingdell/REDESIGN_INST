/**
 * News & events. Only items that are evidenced on the live site are included;
 * the admin/CMS layer adds the rest. Dates are ISO strings.
 */
export const news = [
  {
    slug: 'graduation-day-2024',
    type: 'event',
    title: 'Graduation Day 2024',
    date: '2024-04-20',
    time: '10:00',
    location: 'Kanachur campus, Natekal',
    image: '/images/graduation-day-2024.webp',
    excerpt:
      'Graduates across medicine, nursing, physiotherapy and allied health sciences were felicitated, along with university rank holders.',
    body: [
      'The Trust celebrated Graduation Day on 20 April 2024, honouring graduates from its medical, nursing, physiotherapy and allied health institutions.',
      'Top performers in the Rajiv Gandhi University of Health Sciences examinations — including a first rank in MBBS in Karnataka — were recognised during the ceremony.',
    ],
    tags: ['Celebration', 'Achievements'],
  },
  {
    slug: 'rguhs-rank-holders',
    type: 'news',
    title: 'Top performers in RGUHS examinations',
    date: '2024-04-01',
    image: '/images/campus-hospital-front.webp',
    excerpt:
      'Students from Kanachur institutions secured top ranks in the Rajiv Gandhi University of Health Sciences examinations, including 1st rank in MBBS in Karnataka.',
    body: [
      'Students across our medical, physiotherapy, nursing and allied health colleges were among the top performers in the Rajiv Gandhi University of Health Sciences examinations.',
      'The results include a first rank in MBBS in Karnataka, reflecting the dedication of students and faculty alike.',
    ],
    tags: ['Achievements', 'Academics'],
  },
  {
    slug: 'newsletter-2025',
    type: 'news',
    title: 'Kanachur Newsletter 2025',
    date: '2025-01-15',
    image: '/images/campus-aerial.webp',
    excerpt: 'Highlights from across our institutions and the hospital — academics, events, outreach and achievements.',
    body: ['The 2025 edition of the Kanachur newsletter is available to read and download as a PDF.'],
    attachment: {
      label: 'Download the newsletter (PDF)',
      href: 'https://kanachurims.com/Files/newsletter/NEWSLETTER%202025_compressed.pdf',
    },
    tags: ['Newsletter'],
  },
];

export const getNews = (slug) => news.find((n) => n.slug === slug);
