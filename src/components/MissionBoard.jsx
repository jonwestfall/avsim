import MissionCard from './MissionCard';

export default function MissionBoard({
  missions,
  roomsById,
  equipmentById,
  keysById,
  easyMode,
  onAcceptMission,
  activeTask,
  pickupTasks,
  onStartPickup,
  onBasketballCheckpoint,
  onTryUnlock,
  selectedKeyId,
  basketballStatus,
  canEndShift,
  onEndShift
}) {
  return (
    <section className="panel clipboard-panel">
      <h2>AV Office Clipboard - Mission Board</h2>
      <div className="board-grid">
        {missions.map((mission) => {
          const roomName = roomsById[mission.roomId]?.name ?? mission.roomId;
          const equipmentName = mission.equipmentId ? equipmentById[mission.equipmentId]?.name : null;
          const keyName = keysById[mission.requiredKeyId]?.name ?? mission.requiredKeyId;
          const status =
            mission.id === activeTask?.refId
              ? 'active'
              : mission.completed
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
        <h3>Active Task</h3>
        {activeTask ? (
          <>
            <p>
              <strong>Type:</strong> {activeTask.kind}
            </p>
            <p>
              <strong>Status:</strong> {activeTask.statusLine}
            </p>
            {activeTask.requiresUnlock ? (
              <button onClick={() => onTryUnlock(selectedKeyId)} disabled={!selectedKeyId}>
                Try Selected Key
              </button>
            ) : null}
            {activeTask.kind === 'basketball' ? (
              <button onClick={onBasketballCheckpoint} disabled={!basketballStatus?.canAdvance}>
                {basketballStatus?.buttonLabel || 'Advance Checkpoint'}
              </button>
            ) : null}
          </>
        ) : (
          <p className="muted">No active task. Accept a mission or start a pickup.</p>
        )}
      </div>

      <div className="task-panel">
        <h3>Pending Pickups</h3>
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

      <div className="mission-actions">
        <button onClick={onEndShift} disabled={!canEndShift}>
          End Shift
        </button>
      </div>
    </section>
  );
}
