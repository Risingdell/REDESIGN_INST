import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { programs, levels } from '@/content/programs';
import { getInstitution } from '@/content/institutions';
import { matchPrograms } from '@/lib/programMatcher';
import { createSearchIndex, search } from '@/lib/fuzzySearch';
import { track } from '@/services/analytics';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';

const QUESTIONS = [
  {
    id: 'interest',
    title: 'What excites you most?',
    options: [
      { value: 'medicine', icon: 'stethoscope', label: 'Diagnosing & treating patients' },
      { value: 'nursing', icon: 'heart', label: 'Caring for patients every day' },
      { value: 'physiotherapy', icon: 'activity', label: 'Helping people move & recover' },
      { value: 'allied', icon: 'flask', label: 'Labs, imaging & technology' },
      { value: 'ayurveda', icon: 'leaf', label: 'Natural & holistic healing' },
      { value: 'pharmacy', icon: 'pill', label: 'Medicines & how they work' },
    ],
  },
  {
    id: 'stage',
    title: 'Where are you right now?',
    options: [
      { value: 'school', icon: 'book', label: 'Just finished Class 10' },
      { value: 'ug', icon: 'graduation', label: 'In or after Class 12' },
      { value: 'pg', icon: 'school', label: 'I have a degree — want to specialise' },
    ],
  },
  {
    id: 'neet',
    title: 'Have you taken (or will you take) NEET?',
    options: [
      { value: 'yes', icon: 'check-circle', label: 'Yes' },
      { value: 'no', icon: 'x', label: 'No' },
      { value: 'unsure', icon: 'info', label: 'Not sure yet' },
    ],
  },
];

function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const done = step >= QUESTIONS.length;
  const results = useMemo(() => (done ? matchPrograms(programs, answers) : []), [done, answers]);

  const answer = (qid, value) => {
    const next = { ...answers, [qid]: value };
    setAnswers(next);
    // Class 10 leavers don't need the NEET question.
    const skipNeet = qid === 'stage' && value === 'school';
    const nextStep = skipNeet ? QUESTIONS.length : step + 1;
    setStep(nextStep);
    if (nextStep >= QUESTIONS.length) track('fit_quiz_complete', next);
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
  };

  const progress = Math.min(100, Math.round((step / QUESTIONS.length) * 100));

  return (
    <div className="quiz">
      <div className="quiz__bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Quiz progress">
        <span style={{ width: `${progress}%` }} />
      </div>

      {!done && (
        <div className="quiz__step" key={step}>
          <div className="quiz__head">
            <span className="quiz__count">
              Question {step + 1} of {QUESTIONS.length}
            </span>
            {step > 0 && (
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setStep(step - 1)}>
                <Icon name="arrow-left" size={16} /> Back
              </button>
            )}
          </div>
          <h3 className="quiz__q">{QUESTIONS[step].title}</h3>
          <div className={`quiz__options quiz__options--${QUESTIONS[step].options.length}`}>
            {QUESTIONS[step].options.map((o, i) => (
              <button
                key={o.value}
                type="button"
                className={`quiz__opt${answers[QUESTIONS[step].id] === o.value ? ' is-picked' : ''}`}
                style={{ '--i': i }}
                onClick={() => answer(QUESTIONS[step].id, o.value)}
              >
                <span className="quiz__opt-icon">
                  <Icon name={o.icon} />
                </span>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {done && (
        <div className="quiz__results" aria-live="polite">
          <div className="quiz__head">
            <span className="quiz__count">Your best matches</span>
            <button type="button" className="btn btn--ghost btn--sm" onClick={restart}>
              <Icon name="edit" size={16} /> Retake
            </button>
          </div>
          {results.length === 0 ? (
            <p className="muted">No exact match — browse all programmes or talk to a counsellor.</p>
          ) : (
            <ol className="match">
              {results.map((m, i) => (
                <li key={m.program.slug} className={`match__item${i === 0 ? ' is-best' : ''}`} style={{ '--i': i, '--p': m.percent }}>
                  <span className="match__ring" aria-label={`${m.percent}% match`}>
                    <strong>{m.percent}%</strong>
                  </span>
                  <span className="match__body">
                    {i === 0 && <span className="badge badge--gold">Best match</span>}
                    <strong>
                      {m.program.title} <small>· {levels[m.program.level]}</small>
                    </strong>
                    <small>{getInstitution(m.program.institution)?.name}</small>
                    <span className="match__why">
                      {m.reasons.slice(0, 2).map((r) => (
                        <span key={r}>
                          <Icon name="check" size={14} /> {r}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="match__actions">
                    <Link to={`/programs/${m.program.slug}`} className="btn btn--outline btn--sm">
                      Details
                    </Link>
                    <Link to={`/admissions/apply?program=${m.program.slug}`} className="btn btn--gold btn--sm">
                      Apply
                    </Link>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}

const programIndex = createSearchIndex(
  programs.map((p) => ({ ...p, id: p.slug, name: `${p.title} ${p.fullTitle}` })),
  { name: 3, keywords: 2, eligibility: 1 },
);

function QuickSearch() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const results = useMemo(() => (q.trim() ? search(programIndex, q, { limit: 5 }) : []), [q]);
  return (
    <div className="qsearch">
      <form
        className="finder__search"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`/programs?q=${encodeURIComponent(q)}`);
        }}
      >
        <Icon name="search" />
        <label htmlFor="fit-q" className="visually-hidden">
          Search programmes
        </label>
        <input id="fit-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a course or career — e.g. physio" autoComplete="off" />
        <button type="submit" className="btn btn--gold btn--sm">
          Go
        </button>
      </form>
      <div className="cluster" style={{ marginTop: 14 }}>
        {['Doctor', 'Nursing', 'Physio', 'Ayurveda', 'Pharmacy'].map((c) => (
          <button key={c} type="button" className="chip" onClick={() => setQ(c)} aria-pressed={q === c}>
            {c}
          </button>
        ))}
      </div>
      <ul className="qsearch__list" aria-live="polite">
        {results.map((p) => (
          <li key={p.slug}>
            <Link to={`/programs/${p.slug}`} className="finder__item">
              <span className="finder__abbr">{p.title.replace(/[^A-Z]/g, '').slice(0, 3) || p.title.slice(0, 2)}</span>
              <span className="finder__text">
                <strong>{p.title}</strong>
                <small>
                  {levels[p.level]} · {p.duration}
                </small>
              </span>
              <Icon name="arrow-right" size={18} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** "Find your fit": a 3-tap quiz (default) or a typo-tolerant search. */
export function FitFinder() {
  const [mode, setMode] = useState('quiz');
  return (
    <section className="section fit" aria-labelledby="fit-title">
      <div className="container fit__grid">
        <div className="fit__intro">
          <SectionHeader
            id="fit-title"
            eyebrow="Find your fit"
            title="Not sure what to study? *Three taps.*"
            lead="Answer three quick questions and we'll match you with the programmes that suit you best."
          />
          <div className="fit__stats">
            <span>
              <strong>{programs.length}</strong> programmes
            </span>
            <span>
              <strong>7</strong> institutions
            </span>
            <span>
              <strong>30s</strong> to your match
            </span>
          </div>
          <Button to="/programs" variant="outline" icon="arrow-right">
            Browse all programmes
          </Button>
        </div>

        <div className="fit__card">
          <div className="fit__tabs" role="tablist" aria-label="How do you want to find a programme?">
            <button type="button" role="tab" aria-selected={mode === 'quiz'} onClick={() => setMode('quiz')}>
              <Icon name="sparkle" size={16} /> Take the quiz
            </button>
            <button type="button" role="tab" aria-selected={mode === 'search'} onClick={() => setMode('search')}>
              <Icon name="search" size={16} /> Search by name
            </button>
          </div>
          {mode === 'quiz' ? <Quiz /> : <QuickSearch />}
        </div>
      </div>
    </section>
  );
}
