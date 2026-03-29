export default function KeyRing({ keys, selectedKeyId, onSelectKey, locked = false }) {
  return (
    <section className="panel">
      <h2>Key Ring</h2>
      <p className="muted">Choose a key when you hit a locked door.</p>
      <div className="key-grid">
        {keys.map((key) => (
          <button
            key={key.id}
            className={`key-btn ${selectedKeyId === key.id ? 'active' : ''}`}
            onClick={() => onSelectKey?.(key.id)}
            disabled={locked}
          >
            <span className="key-head" />
            <span>{key.name}</span>
            <small>{key.rarity}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
