export default function KeyRing({
  keys,
  selectedKeyId,
  onSelectKey,
  locked = false,
  title = 'Key Ring',
  description = 'Choose a key when you hit a locked door.'
}) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <p className="muted">{description}</p>
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
