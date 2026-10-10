const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export const formatINR = (amount) => inr.format(amount || 0);

export const formatDate = (iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  new Date(iso).toLocaleDateString('en-IN', opts);

export const dateParts = (iso) => {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString('en-IN', { day: '2-digit' }),
    month: d.toLocaleDateString('en-IN', { month: 'short' }),
    year: d.getFullYear(),
  };
};

/** Human reference numbers for submissions, e.g. KIET-APP-7K3F9Q. */
export const makeReference = (prefix = 'KIET') =>
  `${prefix}-${Date.now().toString(36).slice(-3).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

export const cx = (...classes) => classes.filter(Boolean).join(' ');
