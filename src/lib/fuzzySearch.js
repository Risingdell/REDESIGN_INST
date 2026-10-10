/**
 * Small, dependency-free, typo-tolerant search.
 *
 * - Normalises case and accents, splits into tokens.
 * - Expands common synonyms/abbreviations ("physio" → physiotherapy).
 * - Scores each query token against weighted fields: exact > prefix > substring > typo.
 * - Typos use optimal-string-alignment distance (handles swapped letters).
 */

const SYNONYMS = {
  doctor: ['mbbs', 'medicine', 'medical'],
  physio: ['physiotherapy', 'bpt', 'mpt'],
  nurse: ['nursing'],
  nurses: ['nursing'],
  pharma: ['pharmacy', 'bpharm', 'dpharm'],
  ayurvedic: ['ayurveda', 'bams'],
  lab: ['allied', 'laboratory'],
  fee: ['fees'],
  cost: ['fees'],
  hostel: ['accommodation'],
  pg: ['postgraduate'],
  ug: ['undergraduate'],
  appointment: ['appointment', 'opd'],
  ambulance: ['emergency'],
};

// Filler words that should not decide a match ("do I need NEET" is about NEET).
const STOPWORDS = new Set(
  'a an the do does did i im me my is are am was for of to in on at and or can could how what where when which who whom you your we our it its be need want please about there any with get tell know'.split(
    ' ',
  ),
);

export function normalize(text = '') {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[.'’]/g, '') // "B.Sc" → "bsc", "Kanachur's" → "kanachurs"
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function tokenize(text) {
  const n = normalize(text);
  return n ? n.split(' ') : [];
}

/** Optimal string alignment distance, bailing out once it exceeds `max`. */
export function editDistance(a, b, max = Infinity) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const rows = a.length + 1;
  const cols = b.length + 1;
  const d = Array.from({ length: rows }, (_, i) => {
    const row = new Array(cols).fill(0);
    row[0] = i;
    return row;
  });
  for (let j = 0; j < cols; j++) d[0][j] = j;

  for (let i = 1; i < rows; i++) {
    let rowMin = Infinity;
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
      rowMin = Math.min(rowMin, d[i][j]);
    }
    if (rowMin > max) return max + 1;
  }
  return d[rows - 1][cols - 1];
}

const allowedTypos = (len) => (len <= 2 ? 0 : len <= 5 ? 1 : len <= 9 ? 2 : 3);

/** How well one query token matches one document token, 0–1. */
export function tokenScore(q, t) {
  if (q === t) return 1;
  if (t.startsWith(q) && q.length >= 2) return 0.9 - Math.min(0.2, (t.length - q.length) * 0.02);
  if (q.length >= 3 && t.includes(q)) return 0.65;
  const max = allowedTypos(q.length);
  if (max === 0) return 0;
  // Compare against the same-length prefix too, so "physioth" ≈ "physiotherapy".
  const candidates = [t, t.slice(0, q.length)];
  let best = 0;
  for (const c of candidates) {
    const dist = editDistance(q, c, max);
    if (dist <= max) best = Math.max(best, (c === t ? 0.8 : 0.7) - dist * 0.12);
  }
  return best;
}

function expandQuery(tokens) {
  return tokens.map((tok) => [tok, ...(SYNONYMS[tok] || [])]);
}

/**
 * @param {Array<object>} records — anything with an `id`.
 * @param {Record<string, number>} fields — field name → weight. Values may be strings or string arrays.
 */
export function createSearchIndex(records, fields) {
  return records.map((record) => {
    const tokens = {};
    for (const field of Object.keys(fields)) {
      const value = record[field];
      const text = Array.isArray(value) ? value.join(' ') : value || '';
      tokens[field] = [...new Set(tokenize(text))];
    }
    return { record, tokens, fields };
  });
}

export function search(index, query, { limit = 10, minScore = 0.35 } = {}) {
  const allTokens = tokenize(query);
  if (!allTokens.length) return [];
  const meaningful = allTokens.filter((t) => !STOPWORDS.has(t));
  const qTokens = meaningful.length ? meaningful : allTokens;
  const groups = expandQuery(qTokens);
  const results = [];

  for (const entry of index) {
    let total = 0;
    let matched = 0;
    for (const variants of groups) {
      let best = 0;
      for (const [field, weight] of Object.entries(entry.fields)) {
        for (const t of entry.tokens[field]) {
          for (const v of variants) {
            const s = tokenScore(v, t) * weight;
            if (s > best) best = s;
          }
        }
      }
      if (best > 0) matched += 1;
      total += best;
    }
    if (!matched) continue;
    const maxWeight = Math.max(...Object.values(entry.fields));
    // Normalise to 0–1, penalising queries where some words matched nothing.
    const score = (total / (groups.length * maxWeight)) * (matched / groups.length);
    if (score >= minScore) results.push({ ...entry.record, score });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
