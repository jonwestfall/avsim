export default function SchoolMap({ mapAreas, roomsById, currentRoomId, onTravel, disabled }) {
  return (
    <section className="panel">
      <h2>School Map / Room List</h2>
      <p className="muted">Mouse-only friendly: click a room to travel there.</p>
      <div className="map-columns">
        {mapAreas.map((area) => (
          <div key={area.id} className="map-area">
            <h3>{area.label}</h3>
            {area.roomIds.map((roomId) => {
              const room = roomsById[roomId];
              if (!room) return null;

              return (
                <button
                  key={room.id}
                  className={`room-btn ${currentRoomId === room.id ? 'current' : ''}`}
                  onClick={() => onTravel(room.id)}
                  disabled={disabled}
                >
                  {room.name}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
