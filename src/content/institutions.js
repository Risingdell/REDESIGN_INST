/**
 * Institutions run by the Trust. Names and sub-site links come from the live
 * kanachurims.com navigation. `summary` copy is new and should be reviewed by
 * each institution before launch.
 */
export const institutions = [
  {
    slug: 'kims',
    code: 'KIMS',
    name: 'Kanachur Institute of Medical Sciences',
    shortName: 'Medical Sciences',
    stream: 'medicine',
    icon: 'stethoscope',
    image: '/images/campus-hospital-front.webp',
    summary:
      'Undergraduate and postgraduate medical education anchored in the Kanachur Hospital & Research Centre, with early clinical exposure across specialities.',
    highlights: ['Attached teaching hospital', 'UG & PG programmes', 'University rank holders'],
    website: 'https://kanachurims.com/KIMS/',
  },
  {
    slug: 'kcop',
    code: 'KCOP',
    name: 'Kanachur College of Physiotherapy',
    shortName: 'Physiotherapy',
    stream: 'physiotherapy',
    icon: 'activity',
    image: '/images/campus-college-block.webp',
    summary:
      'Bachelor and Master of Physiotherapy programmes with hands-on rehabilitation training in hospital and community settings.',
    highlights: ['BPT & MPT', 'Hospital-based clinical postings', 'Specialisations at PG level'],
    website: 'https://kanachurims.com/KCOP',
  },
  {
    slug: 'kcon',
    code: 'KCON',
    name: 'Kanachur College of Nursing Sciences',
    shortName: 'Nursing',
    stream: 'nursing',
    icon: 'heart',
    image: '/images/campus-hospital-sky.webp',
    summary:
      'Nursing education that pairs classroom learning with supervised ward experience in a multi-speciality teaching hospital.',
    highlights: ['Ward-based learning', 'Simulation & skills labs', 'Community health postings'],
    website: 'https://kanachurims.com/KCON',
  },
  {
    slug: 'kiahs',
    code: 'KIAHS',
    name: 'Kanachur Institute of Allied Health Sciences',
    shortName: 'Allied Health',
    stream: 'allied',
    icon: 'flask',
    image: '/images/medical-tech.webp',
    summary:
      'Programmes for the diagnostic, laboratory and technical roles that keep a modern hospital running.',
    highlights: ['Lab & imaging exposure', 'Industry-ready skills', 'Hospital internships'],
    website: 'https://kanachurims.com/KIAHS',
  },
  {
    slug: 'knamc',
    code: 'KNAMC',
    name: 'Kanachur Ayurveda Medical College',
    shortName: 'Ayurveda',
    stream: 'ayurveda',
    icon: 'leaf',
    image: '/images/campus-aerial.webp',
    summary:
      'Classical Ayurveda education with its own teaching hospital, herbal garden and integrative clinical practice.',
    highlights: ['BAMS programme', 'Teaching hospital', 'Herbal garden'],
    website: 'https://kanachurims.com/KNAMC',
  },
  {
    slug: 'pharmacy',
    code: 'KCP',
    name: 'Kanachur College of Pharmacy',
    shortName: 'Pharmacy',
    stream: 'pharmacy',
    icon: 'pill',
    image: '/images/clinician-stethoscope.webp',
    summary:
      'Pharmaceutical sciences with laboratory practice and hospital pharmacy exposure on a medical campus.',
    highlights: ['Modern pharmacy labs', 'Hospital pharmacy exposure', 'Research projects'],
    website: 'https://kanachurims.com/pharmacy',
  },
  {
    slug: 'puc',
    code: 'KPUC',
    name: 'Kanachur Pre-University College',
    shortName: 'Pre-University',
    stream: 'school',
    icon: 'book',
    image: '/images/campus-college-block.webp',
    summary: 'Pre-university education that prepares students for professional health-science entrance examinations.',
    highlights: ['Science stream', 'Entrance preparation', 'Mentoring'],
    website: null,
  },
  {
    slug: 'public-school',
    code: 'KPS',
    name: 'Kanachur Public School',
    shortName: 'Public School',
    stream: 'school',
    icon: 'school',
    image: '/images/campus-aerial.webp',
    summary: 'School education rooted in values, academics and co-curricular growth.',
    highlights: ['Values-based learning', 'Co-curricular activities', 'Dedicated website'],
    website: 'https://www.kanachur.org/',
  },
];

export const getInstitution = (slug) => institutions.find((i) => i.slug === slug);
