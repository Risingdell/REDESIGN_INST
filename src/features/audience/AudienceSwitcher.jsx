import { audiences } from '@/content/audiences';
import { usePreferences } from '@/context/PreferencesContext';
import './AudienceSwitcher.css';

/** "I am a…" segmented control. Choice persists and reshapes the home page. */
export function AudienceSwitcher({ tone = 'light' }) {
  const { audienceId, chooseAudience } = usePreferences();
  return (
    <div className={`aud aud--${tone}`} role="radiogroup" aria-label="Personalise this site — I am a">
      <span className="aud__label">I am a</span>
      <div className="aud__options">
        {Object.entries(audiences).map(([id, a]) => (
          <button key={id} type="button" role="radio" aria-checked={audienceId === id} className="aud__option" onClick={() => chooseAudience(id)}>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
