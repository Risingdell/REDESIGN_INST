import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getProgram, levels } from '@/content/programs';
import { getInstitution } from '@/content/institutions';
import { feeSchedule } from '@/content/fees';
import { formatINR } from '@/lib/format';
import { usePreferences } from '@/context/PreferencesContext';
import { Modal } from '@/components/ui/Modal';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

const rows = [
  { label: 'Full title', get: (p) => p.fullTitle },
  { label: 'Level', get: (p) => levels[p.level] },
  { label: 'Institution', get: (p) => getInstitution(p.institution)?.name },
  { label: 'Duration', get: (p) => p.duration },
  { label: 'Admission route', get: (p) => p.entrance },
  { label: 'Eligibility', get: (p) => p.eligibility },
  {
    label: 'Indicative tuition / year',
    get: (p) => {
      const t = feeSchedule.tuition[p.slug];
      return t ? `${formatINR(t.government)} – ${formatINR(t.management)}` : '—';
    },
  },
  { label: 'Career paths', get: (p) => p.careers.join(', ') },
];

export function CompareTable({ slugs }) {
  const items = slugs.map(getProgram).filter(Boolean);
  return (
    <div className="compare-table-wrap">
      <table className="compare-table">
        <thead>
          <tr>
            <th scope="col">
              <span className="visually-hidden">Attribute</span>
            </th>
            {items.map((p) => (
              <th key={p.slug} scope="col">
                {p.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {items.map((p) => (
                <td key={p.slug}>{row.get(p)}</td>
              ))}
            </tr>
          ))}
          <tr>
            <th scope="row">
              <span className="visually-hidden">Actions</span>
            </th>
            {items.map((p) => (
              <td key={p.slug}>
                <Link to={`/admissions/apply?program=${p.slug}`} className="btn btn--gold btn--sm">
                  Apply
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      {feeSchedule.isIllustrative && (
        <p className="form-note" style={{ marginTop: 16 }}>
          <Icon name="info" />
          Fee figures are illustrative placeholders until the official schedule is published.
        </p>
      )}
    </div>
  );
}

/** Sticky bar listing programmes picked for comparison. */
export function CompareTray({ forceOpen = false }) {
  const { compare, toggleCompare, clearCompare, maxCompare } = usePreferences();
  const [open, setOpen] = useState(forceOpen);
  if (!compare.length) return null;

  return (
    <>
      <div className="compare-tray" role="region" aria-label="Programmes to compare">
        <div className="container compare-tray__inner">
          <span className="compare-tray__count">
            <Icon name="scale" size={18} /> Compare ({compare.length}/{maxCompare})
          </span>
          <ul>
            {compare.map((slug) => (
              <li key={slug}>
                {getProgram(slug)?.title}
                <button type="button" onClick={() => toggleCompare(slug)} aria-label={`Remove ${getProgram(slug)?.title}`}>
                  <Icon name="x" size={14} />
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn--ghost btn--sm compare-tray__clear" onClick={clearCompare}>
            Clear
          </button>
          <Button variant="gold" size="sm" onClick={() => setOpen(true)} disabled={compare.length < 2} icon="arrow-right">
            {compare.length < 2 ? 'Pick one more' : 'Compare now'}
          </Button>
        </div>
      </div>
      <Modal open={open && compare.length > 0} onClose={() => setOpen(false)} title="Compare programmes" width="980px">
        <CompareTable slugs={compare} />
      </Modal>
    </>
  );
}
