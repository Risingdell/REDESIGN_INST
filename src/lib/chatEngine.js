import { search } from './fuzzySearch';

/**
 * Rule-based assistant. It answers from the same content as the site search,
 * so answers never drift from the pages. Swap `reply` for an LLM-backed API
 * later without touching the chat UI — the response shape stays the same.
 *
 * Response shape: { text, links: [{label, to?, href?}], suggestions: string[], handoff?: boolean }
 */

const GREETING = /^(hi|hello|hey|salaam|salam|assalamu|good (morning|afternoon|evening)|namaste)\b/i;
const THANKS = /\b(thanks|thank you|thx|shukriya)\b/i;
const HUMAN = /\b(human|person|agent|someone|talk to|speak to|call me|counsellor|counselor)\b/i;

export const starterSuggestions = ['How do I apply?', 'Fees & scholarships', 'Is NEET required?', 'Book an appointment'];

export function reply(message, index) {
  const text = String(message || '').trim();
  if (!text) return null;

  if (GREETING.test(text)) {
    return {
      text: 'Hello! I can help with admissions, programmes, fees, hospital appointments and campus visits. What would you like to know?',
      links: [],
      suggestions: starterSuggestions,
    };
  }

  if (THANKS.test(text)) {
    return { text: "You're welcome! Anything else I can help with?", links: [], suggestions: starterSuggestions.slice(0, 2) };
  }

  if (HUMAN.test(text)) {
    return {
      text: 'Happy to connect you with our team. You can call, message us on WhatsApp, or leave your details and an admissions counsellor will call you back.',
      links: [],
      suggestions: [],
      handoff: true,
    };
  }

  const results = search(index, text, { limit: 4, minScore: 0.3 });
  if (!results.length) {
    return {
      text: "I couldn't find an exact answer to that. Try rephrasing, or talk to our team directly — they reply during office hours.",
      links: [{ label: 'Browse all programmes', to: '/programs' }],
      suggestions: starterSuggestions,
      handoff: true,
    };
  }

  // Conversational questions are usually answered best by an FAQ, so prefer one
  // whenever it scores close to the top hit.
  const faq = results.find((r) => r.type === 'FAQ' && r.score >= results[0].score * 0.75);
  const best = faq || results[0];
  const rest = results.filter((r) => r !== best);
  const answer =
    best.type === 'FAQ' ? best.body : [best.title, best.subtitle, best.body].filter(Boolean).join('. ').replace(/\.\./g, '.');
  return {
    text: answer,
    links: [
      { label: best.type === 'FAQ' ? 'Read more' : `Open ${best.type.toLowerCase()}`, to: best.to, href: best.href },
      ...rest.slice(0, 2).map((r) => ({ label: r.title, to: r.to, href: r.href })),
    ].filter((l) => l.to || l.href),
    suggestions: [],
  };
}
