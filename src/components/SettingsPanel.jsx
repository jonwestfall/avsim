const DIFFICULTY_OPTIONS = [
  { id: 'easy', label: 'Easy', note: 'Shows required keys on mission cards.' },
  { id: 'normal', label: 'Normal', note: 'Default shift length and penalties.' },
  { id: 'old_hand', label: 'Old Hand', note: 'Longer shifts, tougher penalties, less guidance.' }
];

export default function SettingsPanel({ settings, onUpdate, onBack }) {
  return (
    <section className="panel">
      <h2>Settings</h2>
      <div className="setting-block">
        <h3>Difficulty</h3>
        {DIFFICULTY_OPTIONS.map((option) => (
          <label key={option.id} className="radio-row">
            <input
              type="radio"
              name="difficulty"
              checked={settings.difficulty === option.id}
              onChange={() => onUpdate({ difficulty: option.id })}
            />
            <span>
              <strong>{option.label}</strong> - {option.note}
            </span>
          </label>
        ))}
      </div>

      <div className="setting-block">
        <label className="radio-row">
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(event) => onUpdate({ soundEnabled: event.target.checked })}
          />
          <span>Enable sound effects (key jingle, cart roll, unlock sounds)</span>
        </label>
      </div>

      <button onClick={onBack}>Back</button>
    </section>
  );
}
