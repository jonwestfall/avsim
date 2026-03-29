const BUTTONS = [
  { id: 'start', label: 'Start Shift' },
  { id: 'missions', label: 'Mission Board' },
  { id: 'keys', label: 'Key Ring' },
  { id: 'scores', label: 'High Scores / Best Times' },
  { id: 'about', label: 'About' },
  { id: 'settings', label: 'Settings' }
];

export default function MainMenu({ onSelect, shiftPreview }) {
  return (
    <section className="panel menu-panel">
      <h2>Main Menu</h2>
      <p className="muted">Shift of the Day: {shiftPreview}</p>
      <div className="menu-grid">
        {BUTTONS.map((button) => (
          <button key={button.id} onClick={() => onSelect(button.id)} className="menu-btn">
            {button.label}
          </button>
        ))}
      </div>
    </section>
  );
}
