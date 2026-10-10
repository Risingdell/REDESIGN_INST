import { Link } from 'react-router-dom';
import { levels } from '@/content/programs';
import { getInstitution } from '@/content/institutions';
import { usePreferences } from '@/context/PreferencesContext';
import { useUI } from '@/context/UIContext';
import { Icon } from '@/components/ui/Icon';
import './programs.css';

export function ProgramCard({ program }) {
  const { shortlist, toggleShortlist, compare, toggleCompare, maxCompare } = usePreferences();
  const { toast } = useUI();
  const institution = getInstitution(program.institution);
  const saved = shortlist.includes(program.slug);
  const comparing = compare.includes(program.slug);

  const onCompare = () => {
    if (!toggleCompare(program.slug)) toast(`You can compare up to ${maxCompare} programmes at a time.`, { tone: 'error' });
  };

  return (
    <article className="pcard card card--hover">
      <div className="pcard__top">
        <span className="badge">{levels[program.level]}</span>
        <button
          type="button"
          className={`pcard__save${saved ? ' is-saved' : ''}`}
          onClick={() => {
            toggleShortlist(program.slug);
            toast(saved ? `${program.title} removed from your shortlist` : `${program.title} added to your shortlist`);
          }}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${program.title} from shortlist` : `Save ${program.title} to shortlist`}
        >
          <Icon name={saved ? 'bookmark-filled' : 'bookmark'} size={20} />
        </button>
      </div>
      <h3 className="pcard__title">
        <Link to={`/programs/${program.slug}`} className="pcard__link">
          {program.title}
        </Link>
      </h3>
      <p className="pcard__full">{program.fullTitle}</p>
      <dl className="pcard__facts">
        <div>
          <dt>
            <Icon name="clock" size={16} /> Duration
          </dt>
          <dd>{program.duration}</dd>
        </div>
        <div>
          <dt>
            <Icon name="check-circle" size={16} /> Admission
          </dt>
          <dd>{program.entrance}</dd>
        </div>
        <div>
          <dt>
            <Icon name="building" size={16} /> Institution
          </dt>
          <dd>{institution?.shortName}</dd>
        </div>
      </dl>
      <div className="pcard__actions">
        <label className="pcard__compare">
          <input type="checkbox" checked={comparing} onChange={onCompare} />
          Compare
        </label>
        <span className="pcard__more" aria-hidden="true">
          Details <Icon name="arrow-right" size={16} />
        </span>
      </div>
    </article>
  );
}
