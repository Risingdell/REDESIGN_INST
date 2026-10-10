import { useState } from 'react';
import { formatINR } from '@/lib/format';
import { createOrder, isDemo, openGateway, verifyPayment } from '@/services/paymentService';
import { Modal } from '@/components/ui/Modal';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import './PaymentDialog.css';

const METHODS = [
  { id: 'upi', label: 'UPI', hint: 'GPay, PhonePe, Paytm, BHIM', icon: 'smartphone' },
  { id: 'card', label: 'Debit / credit card', hint: 'Visa, Mastercard, RuPay', icon: 'card' },
  { id: 'netbanking', label: 'Net banking', hint: 'All major Indian banks', icon: 'bank' },
];

/**
 * Checkout step. Collects only the payment *method*; the gateway's hosted
 * page handles payment details, so no card or bank data touches this site.
 */
export function PaymentDialog({ open, onClose, amount, purpose, reference, payer, onPaid }) {
  const [method, setMethod] = useState('upi');
  const [state, setState] = useState('idle'); // idle | processing | error
  const [error, setError] = useState('');

  const pay = async () => {
    setState('processing');
    setError('');
    try {
      const order = await createOrder({ amount, purpose, reference });
      const result = await openGateway(order, method);
      const verified = await verifyPayment(result);
      setState('idle');
      onPaid({ ...verified, amount, method });
    } catch (err) {
      setError(err.message || 'Payment could not be completed.');
      setState('error');
    }
  };

  return (
    <Modal open={open} onClose={state === 'processing' ? () => {} : onClose} title="Secure checkout" width="520px">
      <div className="pay">
        <div className="pay__summary">
          <div>
            <span className="muted">{purpose}</span>
            <strong>{formatINR(amount)}</strong>
          </div>
          <dl>
            <div>
              <dt>Applicant</dt>
              <dd>{payer}</dd>
            </div>
            <div>
              <dt>Application ref.</dt>
              <dd>{reference}</dd>
            </div>
          </dl>
        </div>

        {isDemo() && (
          <p className="pay__demo">
            <Icon name="info" size={16} /> Preview checkout — no money will be charged.
          </p>
        )}

        <fieldset className="pay__methods" disabled={state === 'processing'}>
          <legend>Pay with</legend>
          {METHODS.map((m) => (
            <label key={m.id} className={`pay__method${method === m.id ? ' is-checked' : ''}`}>
              <input type="radio" name="pay-method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} />
              <Icon name={m.icon} />
              <span>
                <strong>{m.label}</strong>
                <small>{m.hint}</small>
              </span>
            </label>
          ))}
        </fieldset>

        {error && (
          <p className="alert alert--error" role="alert">
            {error}
          </p>
        )}

        <Button variant="gold" size="lg" block loading={state === 'processing'} iconLeft={state === 'processing' ? undefined : 'lock'} onClick={pay}>
          {state === 'processing' ? 'Processing payment…' : `Pay ${formatINR(amount)} securely`}
        </Button>
        <p className="pay__secure">
          <Icon name="shield" size={16} /> Payments are processed by a PCI-DSS compliant gateway. You'll get a receipt by email.
        </p>
      </div>
    </Modal>
  );
}
