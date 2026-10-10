/**
 * ⚠ ILLUSTRATIVE FIGURES ONLY — replace with the official fee schedule before launch.
 *
 * These numbers exist so the fee estimator can be designed, built and tested.
 * They are NOT Kanachur's real fees. The UI always shows a disclaimer while
 * `isIllustrative` is true; set it to false once real figures are entered.
 */
export const feeSchedule = {
  isIllustrative: true,
  currency: 'INR',
  academicYear: '2026–27',

  // Annual tuition per programme, keyed by programme slug and quota.
  tuition: {
    mbbs: { government: 150000, management: 1200000 },
    'md-ms': { government: 200000, management: 1500000 },
    bpt: { government: 60000, management: 120000 },
    mpt: { government: 90000, management: 160000 },
    'bsc-nursing': { government: 60000, management: 110000 },
    'bsc-ahs': { government: 45000, management: 90000 },
    bams: { government: 80000, management: 300000 },
    bpharm: { government: 60000, management: 110000 },
    dpharm: { government: 40000, management: 70000 },
    'puc-science': { government: 30000, management: 45000 },
  },

  quotas: [
    { id: 'government', label: 'Government / counselling quota' },
    { id: 'management', label: 'Management quota' },
  ],

  // Yearly add-ons.
  hostel: [
    { id: 'none', label: 'No hostel', amount: 0 },
    { id: 'shared', label: 'Shared room (3-sharing)', amount: 85000 },
    { id: 'twin', label: 'Twin-sharing room', amount: 110000 },
  ],
  transport: [
    { id: 'none', label: 'No transport', amount: 0 },
    { id: 'city', label: 'College bus — Mangaluru city', amount: 18000 },
    { id: 'outer', label: 'College bus — outer routes', amount: 26000 },
  ],

  // One-time charges added to the first year.
  oneTime: [
    { id: 'admission', label: 'Admission & registration', amount: 15000 },
    { id: 'caution', label: 'Refundable caution deposit', amount: 10000 },
  ],

  // Percentage concessions applied to tuition only.
  scholarships: [
    { id: 'none', label: 'No scholarship', percent: 0 },
    { id: 'merit', label: 'Merit scholarship (top scorers)', percent: 10 },
    { id: 'need', label: 'Need-based support', percent: 15 },
  ],

  applicationFee: 1000,
};
