/**
 * Pure fee estimation. Kept separate from the UI so it can be unit-tested and
 * reused (e.g. by the chat assistant or a future server-side quote).
 */

const findAmount = (list, id, key = 'amount') => list.find((item) => item.id === id)?.[key] ?? 0;

/**
 * @param {object} input
 * @param {string} input.program     programme slug
 * @param {string} input.quota       'government' | 'management'
 * @param {string} input.hostel      hostel option id
 * @param {string} input.transport   transport option id
 * @param {string} input.scholarship scholarship option id
 * @param {number} input.durationYears programme length (internship years carry no tuition)
 * @param {object} schedule          see content/fees.js
 */
export function estimateFees(input, schedule) {
  const tuitionRow = schedule.tuition[input.program];
  if (!tuitionRow) return null;

  const tuition = tuitionRow[input.quota] ?? 0;
  const percent = findAmount(schedule.scholarships, input.scholarship, 'percent');
  const scholarship = Math.round((tuition * percent) / 100);
  const hostel = findAmount(schedule.hostel, input.hostel);
  const transport = findAmount(schedule.transport, input.transport);
  const oneTime = schedule.oneTime.reduce((sum, item) => sum + item.amount, 0);

  const perYear = tuition - scholarship + hostel + transport;
  const firstYear = perYear + oneTime;
  // Half-years in the catalogue are internships, which are not charged tuition here.
  const billableYears = Math.max(1, Math.floor(input.durationYears || 1));
  const wholeCourse = firstYear + perYear * (billableYears - 1);

  return {
    tuition,
    scholarship,
    hostel,
    transport,
    oneTime,
    perYear,
    firstYear,
    billableYears,
    wholeCourse,
    lines: [
      { label: 'Tuition', amount: tuition },
      ...(scholarship ? [{ label: `Scholarship (${percent}%)`, amount: -scholarship }] : []),
      ...(hostel ? [{ label: 'Hostel', amount: hostel }] : []),
      ...(transport ? [{ label: 'Transport', amount: transport }] : []),
    ],
  };
}
