export default function MissionCard({
  mission,
  roomName,
  equipmentName,
  easyMode,
  keyName,
  status,
  onAccept
}) {
  return (
    <article className="mission-card">
      <h3>{mission.title}</h3>
      <p>
        <strong>Category:</strong> {mission.category.replaceAll('_', ' ')}
      </p>
      {equipmentName ? (
        <p>
          <strong>Equipment:</strong> {equipmentName}
        </p>
      ) : null}
      <p>
        <strong>Destination:</strong> {roomName}
      </p>
      {easyMode ? (
        <p>
          <strong>Required Key:</strong> {keyName}
        </p>
      ) : (
        <p className="muted">Required key hidden in Normal/Old Hand mode.</p>
      )}
      <p>
        <strong>Points:</strong> {mission.points}
      </p>
      <div className="mission-actions">
        {status === 'available' ? (
          <button onClick={() => onAccept(mission.id)}>Accept Mission</button>
        ) : (
          <span className={`badge ${status}`}>{status}</span>
        )}
      </div>
    </article>
  );
}
