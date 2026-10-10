import { env } from '@/config/site';
import { makeReference } from '@/lib/format';
import { track } from './analytics';

/**
 * Single entry point for every form submission (enquiries, applications,
 * bookings, newsletter, reviews).
 *
 * - With VITE_API_BASE_URL set, it POSTs JSON to `${base}/${endpoint}`.
 * - Without it (demo mode), it simulates the request and keeps a copy in this
 *   browser's localStorage outbox, so forms are fully testable end to end.
 */

const OUTBOX_KEY = 'kiet:outbox';
const TIMEOUT_MS = 15000;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function saveToOutbox(entry) {
  try {
    const outbox = JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]');
    outbox.push(entry);
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(outbox.slice(-50)));
  } catch {
    // Storage may be unavailable (private mode); the demo still succeeds.
  }
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * @param {string} endpoint e.g. 'enquiries', 'applications', 'bookings'
 * @param {object} payload
 * @returns {Promise<{ok: true, reference: string, demo: boolean}>}
 */
export async function submit(endpoint, payload, { referencePrefix = 'KIET' } = {}) {
  track('form_submit', { form: endpoint });

  if (env.demoMode) {
    await wait(700);
    const reference = makeReference(referencePrefix);
    saveToOutbox({ endpoint, payload, reference, at: new Date().toISOString() });
    return { ok: true, reference, demo: true };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${env.apiBaseUrl.replace(/\/$/, '')}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) throw new ApiError(`Request failed (${res.status})`, res.status);
    const data = await res.json().catch(() => ({}));
    return { ok: true, reference: data.reference || makeReference(referencePrefix), demo: false };
  } catch (err) {
    track('form_error', { form: endpoint, message: err.message });
    if (err.name === 'AbortError') throw new ApiError('The server took too long to respond. Please try again.');
    throw err instanceof ApiError ? err : new ApiError('We could not reach the server. Check your connection and try again.');
  } finally {
    clearTimeout(timer);
  }
}
