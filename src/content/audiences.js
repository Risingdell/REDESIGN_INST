/**
 * Personalisation profiles. Picking an audience changes the hero message,
 * the primary call to action and the order of the quick-access cards.
 */
export const audiences = {
  prospective: {
    label: 'Prospective student',
    icon: 'graduation',
    hint: 'Courses, fees & applying',
    heroEyebrow: 'Admissions 2026–27 open',
    heroLead: 'Seven institutions and a 24×7 teaching hospital — find the programme that fits you.',
    primary: { label: 'Apply now', to: '/admissions/apply' },
    secondary: { label: 'Find a programme', to: '/programs' },
    quickLinks: ['programs', 'apply', 'fees', 'tour'],
  },
  parent: {
    label: 'Parent',
    icon: 'shield',
    hint: 'Fees, safety & visits',
    heroEyebrow: 'For parents & guardians',
    heroLead: 'Fees, safety, hostels and outcomes — everything you need to decide with confidence.',
    primary: { label: 'Estimate fees', to: '/admissions#fees' },
    secondary: { label: 'Book a campus visit', to: '/contact#visit' },
    quickLinks: ['fees', 'visit', 'tour', 'programs'],
  },
  student: {
    label: 'Current student',
    icon: 'book',
    hint: 'Notices, portals & help',
    heroEyebrow: 'Welcome back',
    heroLead: 'Notices, calendars, portals and the newsletter — all in one place.',
    primary: { label: 'Student hub', to: '/students' },
    secondary: { label: 'News & events', to: '/news' },
    quickLinks: ['students', 'news', 'hospital', 'tour'],
  },
  alumni: {
    label: 'Alumni',
    icon: 'heart',
    hint: 'Reconnect & give back',
    heroEyebrow: 'Once Kanachur, always Kanachur',
    heroLead: 'Reconnect with classmates, share your story and stay part of the community.',
    primary: { label: 'Join the alumni network', to: '/alumni' },
    secondary: { label: 'Latest news', to: '/news' },
    quickLinks: ['alumni', 'news', 'tour', 'hospital'],
  },
};

export const defaultAudience = 'prospective';

// The cards that the quick-access strip can show, keyed for the lists above.
export const quickLinkCatalog = {
  programs: { title: 'Programmes', text: 'Filter, shortlist and compare', to: '/programs', icon: 'grid', image: '/images/campus-college-block.webp' },
  apply: { title: 'Apply online', text: 'Saves as you go', to: '/admissions/apply', icon: 'edit', image: '/images/campus-hospital-sky.webp' },
  fees: { title: 'Fee estimator', text: 'See your yearly cost', to: '/admissions#fees', icon: 'calculator', image: '/images/medical-tech.webp' },
  tour: { title: 'Virtual tour', text: 'Walk the campus online', to: '/campus-life#tour', icon: 'compass', image: '/images/campus-aerial.webp' },
  visit: { title: 'Campus visit', text: 'Book a guided visit', to: '/contact#visit', icon: 'calendar', image: '/images/campus-hospital-front.webp' },
  students: { title: 'Student hub', text: 'Notices & portals', to: '/students', icon: 'book', image: '/images/campus-college-block.webp' },
  news: { title: 'News & events', text: "What's happening", to: '/news', icon: 'megaphone', image: '/images/graduation-day-2024.webp' },
  hospital: { title: 'Hospital', text: 'Book an appointment', to: '/hospital', icon: 'stethoscope', image: '/images/clinician-stethoscope.webp' },
  alumni: { title: 'Alumni', text: 'Reconnect & give back', to: '/alumni', icon: 'users', image: '/images/campus-hospital-sky.webp' },
};
