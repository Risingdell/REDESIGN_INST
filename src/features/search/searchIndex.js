import { createSearchIndex } from '@/lib/fuzzySearch';
import { programs, levels } from '@/content/programs';
import { institutions, getInstitution } from '@/content/institutions';
import { faqs } from '@/content/faqs';
import { news } from '@/content/news';
import { departments } from '@/content/hospital';

/** Static pages, so visitors can jump straight to a destination by name. */
const pages = [
  { title: 'Admissions', to: '/admissions', keywords: ['admission', 'join', 'eligibility', 'dates', 'apply'] },
  { title: 'Apply online', to: '/admissions/apply', keywords: ['apply', 'application', 'form', 'register'] },
  { title: 'Fee estimator', to: '/admissions#fees', keywords: ['fees', 'cost', 'calculator', 'tuition', 'scholarship'] },
  { title: 'All programmes', to: '/programs', keywords: ['courses', 'programmes', 'degrees', 'compare'] },
  { title: 'Hospital & appointments', to: '/hospital', keywords: ['hospital', 'appointment', 'doctor', 'opd', 'departments'] },
  { title: 'Virtual campus tour', to: '/campus-life#tour', keywords: ['tour', 'campus', '360', 'virtual', 'photos'] },
  { title: 'Book a campus visit', to: '/contact#visit', keywords: ['visit', 'book', 'campus', 'open day'] },
  { title: 'Contact & directions', to: '/contact', keywords: ['contact', 'phone', 'email', 'address', 'map'] },
  { title: 'Current students hub', to: '/students', keywords: ['students', 'notices', 'calendar', 'portal', 'results'] },
  { title: 'Alumni network', to: '/alumni', keywords: ['alumni', 'graduates', 'reunion', 'network'] },
  { title: 'About the Trust', to: '/about', keywords: ['about', 'history', 'mission', 'vision', 'leadership', 'chairman'] },
  { title: 'News & events', to: '/news', keywords: ['news', 'events', 'newsletter', 'announcements'] },
];

export const searchRecords = [
  ...programs.map((p) => ({
    id: `program-${p.slug}`,
    type: 'Programme',
    title: `${p.title} — ${p.fullTitle}`,
    subtitle: `${levels[p.level]} · ${p.duration} · ${getInstitution(p.institution)?.shortName}`,
    to: `/programs/${p.slug}`,
    keywords: [...p.keywords, p.entrance, p.stream],
    body: p.eligibility,
  })),
  ...institutions.map((i) => ({
    id: `inst-${i.slug}`,
    type: 'Institution',
    title: i.name,
    subtitle: i.highlights.join(' · '),
    to: `/institutions/${i.slug}`,
    keywords: [i.code, i.shortName, i.stream],
    body: i.summary,
  })),
  ...pages.map((p) => ({ id: `page-${p.to}`, type: 'Page', title: p.title, subtitle: 'Go to page', to: p.to, keywords: p.keywords, body: '' })),
  ...faqs.map((f) => ({ id: `faq-${f.id}`, type: 'FAQ', title: f.q, subtitle: f.a, to: f.to, href: f.href, keywords: f.keywords, body: f.a })),
  ...news.map((n) => ({ id: `news-${n.slug}`, type: 'News', title: n.title, subtitle: n.excerpt, to: `/news/${n.slug}`, keywords: n.tags, body: n.excerpt })),
  ...departments.map((d) => ({
    id: `dept-${d.slug}`,
    type: 'Hospital',
    title: `${d.name} department`,
    subtitle: d.summary,
    to: '/hospital#departments',
    keywords: [d.slug, 'hospital', 'department'],
    body: d.summary,
  })),
];

export const searchIndex = createSearchIndex(searchRecords, { title: 3, keywords: 2, body: 1 });

export const popularSearches = ['MBBS', 'Nursing', 'Fees', 'Hostel', 'Physiotherapy', 'Appointment'];
