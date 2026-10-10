import { env } from '@/config/site';
import { makeReference } from '@/lib/format';
import { track } from './analytics';

/**
 * Payment adapter. The UI only talks to these three functions, so the
 * gateway (Razorpay, PayU, CCAvenue…) can be swapped without UI changes.
 *
 * Production flow (requires the backend):
 *   1. createOrder → backend creates a gateway order with the secret key.
 *   2. The gateway's own hosted checkout collects payment details.
 *      Card/UPI details never touch this site.
 *   3. verifyPayment → backend verifies the gateway signature and marks the
 *      application as paid.
 *
 * Demo mode (no VITE_API_BASE_URL) simulates steps 1–3. No money moves and no
 * payment details are collected.
 */

export const isDemo = () => env.demoMode;

export async function createOrder({ amount, purpose, reference }) {
  track('begin_checkout', { value: amount, currency: 'INR', purpose });
  if (isDemo()) {
    return { orderId: makeReference('ORD'), amount, currency: 'INR', purpose, reference };
  }
  const res = await fetch(`${env.apiBaseUrl}/payments/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, purpose, reference }),
  });
  if (!res.ok) throw new Error('Could not start the payment. Please try again.');
  return res.json();
}

/** Demo stand-in for the gateway's hosted checkout. */
export function simulateGateway(order, method) {
  return new Promise((resolve) =>
    setTimeout(
      () => resolve({ orderId: order.orderId, paymentId: makeReference('PAY'), method, status: 'captured' }),
      1400,
    ),
  );
}

/**
 * Opens the payment step. In demo mode it simulates a successful gateway;
 * in live mode the gateway's hosted checkout must be wired in here.
 */
export function openGateway(order, method) {
  if (isDemo()) return simulateGateway(order, method);
  // TODO(integration): load the gateway's checkout script (e.g. Razorpay) and
  // resolve with { orderId, paymentId, signature } from its success callback.
  return Promise.reject(new Error('Online payment is not available yet. Please call the admissions office to pay.'));
}

export async function verifyPayment(result) {
  if (isDemo()) {
    track('purchase', { transaction_id: result.paymentId, currency: 'INR' });
    return { verified: true, ...result };
  }
  const res = await fetch(`${env.apiBaseUrl}/payments/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  });
  if (!res.ok) throw new Error('We could not confirm the payment. If money was debited it will be refunded automatically.');
  return res.json();
}
