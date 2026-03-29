import MissionCard from './MissionCard';

export default function MissionBoard({
  missions,
  roomsById,
  equipmentById,
  keysById,
  easyMode,
  onAcceptMission,
  pickupTasks,
  onStartPickup
}) {
  return (
    <section className="panel clipboard-panel">
      <h2>Step 1: Pick Task (AV Office Clipboard)</h2>
      <div className="board-grid">
        {missions.map((mission) => {
          const roomName = roomsById[mission.roomId]?.name ?? mission.roomId;
          const equipmentName = mission.equipmentId ? equipmentById[mission.equipmentId]?.name : null;
          const keyName = keysById[mission.requiredKeyId]?.name ?? mission.requiredKeyId;
          const status =
            mission.completed
              ? 'completed'
              : mission.accepted
              ? 'accepted'
              : 'available';

          return (
            <MissionCard
              key={mission.id}
              mission={mission}
              roomName={roomName}
              equipmentName={equipmentName}
              easyMode={easyMode}
              keyName={keyName}
              status={status}
              onAccept={onAcceptMission}
            />
          );
        })}
      </div>

      <div className="task-panel">
        <h3>Pickup Queue</h3>
        {pickupTasks.length === 0 ? (
          <p className="muted">No pickup tasks waiting.</p>
        ) : (
          pickupTasks.map((pickup) => (
            <div key={pickup.id} className="pickup-row">
              <span>
                {pickup.title} ({roomsById[pickup.roomId]?.name})
              </span>
              <button onClick={() => onStartPickup(pickup.id)} disabled={Boolean(activeTask)}>
                Start Pickup
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
