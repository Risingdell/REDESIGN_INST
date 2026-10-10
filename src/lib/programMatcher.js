/**
 * Scores programmes against the "Find your fit" quiz answers.
 * Pure function so it is unit-testable and reusable (e.g. by the assistant).
 *
 * answers = { interest: stream id, stage: level id, neet: 'yes' | 'no' | 'unsure' }
 */

const needsNeet = (p) => /NEET/i.test(p.entrance);

export function matchPrograms(programs, answers, { limit = 3 } = {}) {
  const { interest, stage, neet } = answers;
  const max = 6; // interest 3 + stage 2 + entrance fit 1

  const scored = programs.map((p) => {
    let score = 0;
    const reasons = [];

    if (stage === 'school') {
      // Class 10 leavers: pre-university is the only right next step.
      if (p.level === 'school') {
        score = max;
        reasons.push('The right next step after Class 10');
      }
      return { program: p, score, reasons };
    }
    if (p.level === 'school') return { program: p, score: 0, reasons };
    // Postgraduate study needs a degree first — never suggest it after Class 12.
    if (stage === 'ug' && p.level === 'pg') return { program: p, score: 0, reasons };

    if (p.stream === interest) {
      score += 3;
      reasons.push('Matches what excites you');
    }
    if (p.level === stage) {
      score += 2;
      reasons.push(stage === 'pg' ? 'Builds on your degree' : 'Fits where you are now');
    } else if (stage === 'ug' && p.level === 'diploma') {
      score += 1; // a diploma is a reasonable alternative after Class 12
    }

    if (needsNeet(p)) {
      if (neet === 'yes') {
        score += 1;
        reasons.push('Uses your NEET score');
      } else if (neet === 'no') {
        score -= 3; // not eligible without NEET
      }
    } else {
      score += 1;
      if (neet !== 'yes') reasons.push('No NEET needed');
    }

    return { program: p, score, reasons };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => ({ ...s, percent: Math.max(20, Math.min(99, Math.round((s.score / max) * 100))) }));
}
