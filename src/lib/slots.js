/**
 * Booking-slot helpers shared by hospital appointments and campus visits.
 * Dates are handled as local "YYYY-MM-DD" strings to avoid timezone drift.
 */

const pad = (n) => String(n).padStart(2, '0');
export const toDateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Next `count` bookable days, skipping the given weekdays (0 = Sunday). */
export function upcomingDays(count = 14, { closedWeekdays = [0], from = new Date() } = {}) {
  const days = [];
  const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1);
  while (days.length < count) {
    if (!closedWeekdays.includes(cursor.getDay())) days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

/** Time slots "HH:MM" between start and end hours, every `step` minutes. */
export function timeSlots({ startHour = 9, endHour = 17, step = 30, lunch = [13, 14] } = {}) {
  const slots = [];
  for (let m = startHour * 60; m < endHour * 60; m += step) {
    const h = Math.floor(m / 60);
    if (lunch && h >= lunch[0] && h < lunch[1]) continue;
    slots.push(`${pad(h)}:${pad(m % 60)}`);
  }
  return slots;
}

/**
 * Deterministic "already booked" slots so the demo calendar looks realistic
 * without a backend. Replace with the API's availability response.
 */
export function demoUnavailable(dateKey, slots, seed = '') {
  let hash = 0;
  for (const ch of dateKey + seed) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return new Set(slots.filter((_, i) => ((hash >> i % 24) & 7) === 0));
}

export const formatSlot = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${((h + 11) % 12) + 1}:${pad(m)} ${suffix}`;
};
