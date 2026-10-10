import { institutions } from './institutions';

/**
 * Information architecture. The live site's eight top-level menus are folded
 * into five audience-friendly buckets so every key page is ≤ 2 clicks away.
 */
export const primaryNav = [
  {
    label: 'Admissions',
    to: '/admissions',
    columns: [
      {
        title: 'Apply',
        links: [
          { label: 'Admissions overview', to: '/admissions', desc: 'Steps, dates and eligibility' },
          { label: 'Apply online', to: '/admissions/apply', desc: 'Saves as you go · ~10 minutes' },
          { label: 'Fee estimator', to: '/admissions#fees', desc: 'Your indicative yearly cost' },
        ],
      },
      {
        title: 'Plan',
        links: [
          { label: 'Find a programme', to: '/programs', desc: 'Filter and compare courses' },
          { label: 'Book a campus visit', to: '/contact#visit', desc: 'Pick a date and time' },
          { label: 'Admissions FAQs', to: '/admissions#faqs' },
        ],
      },
    ],
  },
  {
    label: 'Academics',
    to: '/programs',
    columns: [
      {
        title: 'Institutions',
        links: institutions.map((i) => ({ label: i.name, to: `/institutions/${i.slug}` })),
      },
      {
        title: 'Programmes',
        links: [
          { label: 'All programmes', to: '/programs' },
          { label: 'Undergraduate', to: '/programs?level=ug' },
          { label: 'Postgraduate', to: '/programs?level=pg' },
          { label: 'Compare programmes', to: '/programs?compare=1' },
        ],
      },
    ],
  },
  {
    label: 'Hospital',
    to: '/hospital',
    columns: [
      {
        title: 'Kanachur Hospital & Research Centre',
        links: [
          { label: 'Departments', to: '/hospital#departments' },
          { label: 'Book an appointment', to: '/hospital#book', desc: 'Choose a department and slot' },
          { label: '24×7 Emergency', href: 'tel:+918242888999', desc: '0824-2888999' },
        ],
      },
    ],
  },
  {
    label: 'Campus Life',
    to: '/campus-life',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'Virtual campus tour', to: '/campus-life#tour' },
          { label: 'Videos', to: '/campus-life#videos' },
          { label: 'News & events', to: '/news' },
          { label: 'Student stories', to: '/campus-life#stories' },
        ],
      },
    ],
  },
  {
    label: 'About',
    to: '/about',
    columns: [
      {
        title: 'The Trust',
        links: [
          { label: 'About Kanachur', to: '/about' },
          { label: 'Mission & vision', to: '/about#mission' },
          { label: 'Leadership', to: '/about#leadership' },
          { label: 'Contact & directions', to: '/contact' },
        ],
      },
    ],
  },
];

// Audience shortcuts in the utility bar (the "user buckets").
export const audienceNav = [
  { label: 'Prospective students', to: '/admissions' },
  { label: 'Parents', to: '/admissions#parents' },
  { label: 'Current students', to: '/students' },
  { label: 'Alumni', to: '/alumni' },
];
