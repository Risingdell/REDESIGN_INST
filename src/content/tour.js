/**
 * Virtual campus tour. Each stop is a photo with hotspots positioned in
 * percentages so they stay put at any screen size.
 */
export const tourStops = [
  {
    id: 'hospital',
    title: 'Kanachur Hospital & Research Centre',
    image: '/images/campus-hospital-front.webp',
    description:
      'The teaching hospital at the heart of campus — where students across every programme train alongside practising clinicians.',
    hotspots: [
      { x: 62, y: 40, label: 'Main hospital block', text: 'Outpatient departments, wards and critical care.' },
      { x: 80, y: 66, label: 'Main entrance', text: '24×7 emergency entrance and patient reception.' },
      { x: 20, y: 62, label: 'Campus transport', text: 'College buses connect campus to Mangaluru city routes.' },
    ],
  },
  {
    id: 'aerial',
    title: 'Campus from above',
    image: '/images/campus-aerial.webp',
    description: 'Academic blocks set among green hills on Mangalore University Road, Natekal.',
    hotspots: [
      { x: 45, y: 35, label: 'Academic block', text: 'Lecture halls, labs and faculty rooms.' },
      { x: 78, y: 70, label: 'Green campus', text: 'Open spaces and landscaped grounds for students.' },
    ],
  },
  {
    id: 'college',
    title: 'College block & grounds',
    image: '/images/campus-college-block.webp',
    description: 'Classrooms, skills labs and the student courtyard.',
    hotspots: [
      { x: 40, y: 38, label: 'Classrooms', text: 'Smart classrooms for theory sessions.' },
      { x: 88, y: 70, label: 'Bus bay', text: 'Pick-up and drop for day scholars.' },
      { x: 18, y: 80, label: 'Courtyard', text: 'Where students meet between classes.' },
    ],
  },
  {
    id: 'clinical',
    title: 'Clinical skills',
    image: '/images/clinician-stethoscope.webp',
    description: 'Hands-on clinical training from the early years of every programme.',
    hotspots: [{ x: 50, y: 50, label: 'Bedside learning', text: 'Supervised clinical postings in hospital wards.' }],
  },
];
