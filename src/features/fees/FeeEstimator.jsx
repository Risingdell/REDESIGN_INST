import { useMemo, useState } from 'react';
import { feeSchedule } from '@/content/fees';
import { programs, getProgram } from '@/content/programs';
import { estimateFees } from '@/lib/feeCalculator';
import { formatINR } from '@/lib/format';
import { track } from '@/services/analytics';
import { useUI } from '@/context/UIContext';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import './FeeEstimator.css';

function OptionGroup({ legend, name, options, value, onChange, render }) {
  return (
    <fieldset className="fee__group">
      <legend>{legend}</legend>
      <div className="fee__options">
        {options.map((o) => (
          <label key={o.id} className={`fee__option${value === o.id ? ' is-checked' : ''}`}>
            <input type="radio" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} />
            <span>{o.label}</span>
            {render && <small>{render(o)}</small>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Interactive tuition calculator (the "fee calculator" interactive element). */
export function FeeEstimator({ defaultProgram = 'mbbs' }) {
  const { openEnquiry } = useUI();
  const [input, setInput] = useState({
    program: defaultProgram,
    quota: 'government',
    hostel: 'none',
    transport: 'none',
    scholarship: 'none',
  });
  const [view, setView] = useState('year'); // year | course
  const set = (key) => (value) => {
    setInput((s) => ({ ...s, [key]: value }));
    track('fee_estimate_change', { field: key, value });
  };

  const program = getProgram(input.program);
  const result = useMemo(
    () => estimateFees({ ...input, durationYears: program?.durationYears }, feeSchedule),
    [input, program],
  );

  const headline = view === 'year' ? result?.firstYear : result?.wholeCourse;

  return (
    <div className="fee">
      <div className="fee__controls">
        <div className="field">
          <label className="field__label" htmlFor="fee-program">
            Programme
          </label>
          <select id="fee-program" className="select" value={input.program} onChange={(e) => set('program')(e.target.value)}>
            {programs.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title} — {p.fullTitle}
              </option>
            ))}
          </select>
        </div>
        <OptionGroup legend="Admission quota" name="quota" options={feeSchedule.quotas} value={input.quota} onChange={set('quota')} />
        <OptionGroup
          legend="Hostel"
          name="hostel"
          options={feeSchedule.hostel}
          value={input.hostel}
          onChange={set('hostel')}
          render={(o) => (o.amount ? `${formatINR(o.amount)}/yr` : '')}
        />
        <OptionGroup
          legend="Transport"
          name="transport"
          options={feeSchedule.transport}
          value={input.transport}
          onChange={set('transport')}
          render={(o) => (o.amount ? `${formatINR(o.amount)}/yr` : '')}
        />
        <OptionGroup
          legend="Scholarship"
          name="scholarship"
          options={feeSchedule.scholarships}
          value={input.scholarship}
          onChange={set('scholarship')}
          render={(o) => (o.percent ? `−${o.percent}% tuition` : '')}
        />
      </div>

      <aside className="fee__summary" aria-live="polite">
        <div className="fee__toggle" role="tablist" aria-label="Show estimate for">
          <button type="button" role="tab" aria-selected={view === 'year'} onClick={() => setView('year')}>
            First year
          </button>
          <button type="button" role="tab" aria-selected={view === 'course'} onClick={() => setView('course')}>
            Whole course
          </button>
        </div>

        <p className="fee__label">{view === 'year' ? 'Estimated first-year cost' : `Estimated total · ${result?.billableYears} billable years`}</p>
        <p className="fee__total" key={headline}>
          {formatINR(headline)}
        </p>
        <p className="fee__sub">
          {program?.title} · {feeSchedule.quotas.find((q) => q.id === input.quota)?.label}
        </p>

        {result && (
          <ul className="fee__lines">
            {result.lines.map((l) => (
              <li key={l.label} className={l.amount < 0 ? 'is-discount' : ''}>
                <span>{l.label}</span>
                <span>{l.amount < 0 ? `−${formatINR(-l.amount)}` : formatINR(l.amount)}</span>
              </li>
            ))}
            <li className="fee__subtotal">
              <span>Per year</span>
              <span>{formatINR(result.perYear)}</span>
            </li>
            <li>
              <span>One-time (first year)</span>
              <span>{formatINR(result.oneTime)}</span>
            </li>
          </ul>
        )}

        {feeSchedule.isIllustrative && (
          <p className="fee__warning">
            <Icon name="alert" size={16} />
            Sample figures for preview only — not Kanachur's official fees. Confirm with the admissions office.
          </p>
        )}

        <div className="fee__actions">
          <Button to={`/admissions/apply?program=${input.program}`} variant="gold" block icon="arrow-right">
            Apply for {program?.title}
          </Button>
          <Button variant="ghost-light" block iconLeft="phone" onClick={() => openEnquiry(`Fee enquiry: ${program?.title}`)}>
            Talk to a fee counsellor
          </Button>
          <button type="button" className="fee__print" onClick={() => window.print()}>
            <Icon name="download" size={16} /> Print / save this estimate
          </button>
        </div>
      </aside>
    </div>
  );
}
