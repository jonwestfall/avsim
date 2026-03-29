import { useMemo, useState } from 'react';
import { rooms as initialRooms } from '../data/rooms';
import { keys as initialKeys, DEFAULT_PLAYER_KEYS as initialDefaultPlayerKeys } from '../data/keys';
import { missions as initialMissions } from '../data/missions';
import { flavorText as initialFlavorText } from '../data/flavorText';
import {
  downloadTextFile,
  flavorModuleText,
  keysModuleText,
  missionsModuleText,
  roomsModuleText
} from './fileGenerators';

const difficultyOptions = ['easy', 'normal', 'old_hand'];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function Section({ title, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function textInput(value) {
  return value ?? '';
}

export default function AdminPage() {
  const [rooms, setRooms] = useState(() => clone(initialRooms));
  const [keys, setKeys] = useState(() => clone(initialKeys));
  const [defaultPlayerKeys, setDefaultPlayerKeys] = useState(() => clone(initialDefaultPlayerKeys));
  const [missions, setMissions] = useState(() => clone(initialMissions));
  const [flavorText, setFlavorText] = useState(() => clone(initialFlavorText));

  const roomOptions = useMemo(
    () => rooms.map((room) => ({ id: room.id, name: room.name })),
    [rooms]
  );

  function updateRoom(index, field, value) {
    setRooms((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addRoom() {
    setRooms((prev) => [
      ...prev,
      {
        id: `room_${prev.length + 1}`,
        name: 'New Room',
        area: 'Replace Area',
        locked: true,
        requiredKeyId: '',
        travelMinutes: 8
      }
    ]);
  }

  function removeRoom(index) {
    setRooms((prev) => prev.filter((_, i) => i !== index));
  }

  function updateKey(index, field, value) {
    setKeys((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function toggleKeyRoom(index, roomId) {
    setKeys((prev) => {
      const next = [...prev];
      const entry = next[index];
      if (entry.opens === 'all') return next;
      const opens = new Set(entry.opens || []);
      if (opens.has(roomId)) {
        opens.delete(roomId);
      } else {
        opens.add(roomId);
      }
      next[index] = { ...entry, opens: [...opens] };
      return next;
    });
  }

  function addKey() {
    setKeys((prev) => [
      ...prev,
      {
        id: `key_${prev.length + 1}`,
        name: 'New Key',
        opens: [],
        rarity: 'common'
      }
    ]);
  }

  function removeKey(index) {
    setKeys((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleDefaultPlayerKey(keyId) {
    setDefaultPlayerKeys((prev) => {
      if (prev.includes(keyId)) return prev.filter((id) => id !== keyId);
      return [...prev, keyId];
    });
  }

  function updateMission(index, field, value) {
    setMissions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function toggleMissionDifficulty(index, level) {
    setMissions((prev) => {
      const next = [...prev];
      const diff = new Set(next[index].difficulty || []);
      if (diff.has(level)) diff.delete(level);
      else diff.add(level);
      next[index] = { ...next[index], difficulty: [...diff] };
      return next;
    });
  }

  function addMission() {
    setMissions((prev) => [
      ...prev,
      {
        id: `mission_${prev.length + 1}`,
        category: 'deliver_tv_cart',
        type: 'delivery',
        title: 'New Mission',
        equipmentId: 'tv_cart',
        roomId: roomOptions[0]?.id || '',
        requiredKeyId: keys[0]?.id || '',
        points: 100,
        pickupAfterMinutes: 30,
        difficulty: ['easy', 'normal']
      }
    ]);
  }

  function removeMission(index) {
    setMissions((prev) => prev.filter((_, i) => i !== index));
  }

  function addCheckpoint(index) {
    setMissions((prev) => {
      const next = [...prev];
      const mission = next[index];
      const checkpoints = [...(mission.checkpoints || [])];
      checkpoints.push({
        id: `checkpoint_${checkpoints.length + 1}`,
        label: 'New Checkpoint',
        at: '18:00',
        points: 100
      });
      next[index] = { ...mission, checkpoints };
      return next;
    });
  }

  function updateCheckpoint(missionIndex, checkpointIndex, field, value) {
    setMissions((prev) => {
      const next = [...prev];
      const mission = next[missionIndex];
      const checkpoints = [...(mission.checkpoints || [])];
      checkpoints[checkpointIndex] = { ...checkpoints[checkpointIndex], [field]: value };
      next[missionIndex] = { ...mission, checkpoints };
      return next;
    });
  }

  function removeCheckpoint(missionIndex, checkpointIndex) {
    setMissions((prev) => {
      const next = [...prev];
      const mission = next[missionIndex];
      next[missionIndex] = {
        ...mission,
        checkpoints: (mission.checkpoints || []).filter((_, i) => i !== checkpointIndex)
      };
      return next;
    });
  }

  function updateFlavorCategory(category, idx, value) {
    setFlavorText((prev) => {
      const next = { ...prev };
      next[category] = [...next[category]];
      next[category][idx] = value;
      return next;
    });
  }

  function addFlavorLine(category) {
    setFlavorText((prev) => ({ ...prev, [category]: [...prev[category], 'New line'] }));
  }

  function removeFlavorLine(category, idx) {
    setFlavorText((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== idx)
    }));
  }

  return (
    <div className="admin-wrap">
      <header className="panel">
        <h1>AV Simulator Admin Editor</h1>
        <p className="muted">
          Edit published game data with forms, then download updated JS files for your repository.
        </p>
        <div className="admin-toolbar">
          <button onClick={() => downloadTextFile('rooms.js', roomsModuleText(rooms))}>Download rooms.js</button>
          <button onClick={() => downloadTextFile('keys.js', keysModuleText(keys, defaultPlayerKeys))}>
            Download keys.js
          </button>
          <button onClick={() => downloadTextFile('missions.js', missionsModuleText(missions))}>
            Download missions.js
          </button>
          <button onClick={() => downloadTextFile('flavorText.js', flavorModuleText(flavorText))}>
            Download flavorText.js
          </button>
          <a href="../" className="admin-link-btn">
            Back To Game
          </a>
        </div>
      </header>

      <Section title="Rooms Editor">
        <button onClick={addRoom}>Add Room</button>
        {rooms.map((room, index) => (
          <article className="editor-card" key={`${room.id}-${index}`}>
            <div className="editor-grid">
              <label>
                Room ID
                <input value={textInput(room.id)} onChange={(e) => updateRoom(index, 'id', e.target.value)} />
              </label>
              <label>
                Room Name
                <input value={textInput(room.name)} onChange={(e) => updateRoom(index, 'name', e.target.value)} />
              </label>
              <label>
                Area
                <input value={textInput(room.area)} onChange={(e) => updateRoom(index, 'area', e.target.value)} />
              </label>
              <label>
                Travel Minutes
                <input
                  type="number"
                  min="1"
                  value={room.travelMinutes ?? 8}
                  onChange={(e) => updateRoom(index, 'travelMinutes', Number(e.target.value))}
                />
              </label>
              <label className="checkbox-line">
                <input
                  type="checkbox"
                  checked={Boolean(room.locked)}
                  onChange={(e) => updateRoom(index, 'locked', e.target.checked)}
                />
                Locked
              </label>
              <label>
                Required Key ID
                <select
                  value={room.requiredKeyId ?? ''}
                  onChange={(e) => updateRoom(index, 'requiredKeyId', e.target.value || null)}
                >
                  <option value="">None</option>
                  {keys.map((key) => (
                    <option key={key.id} value={key.id}>
                      {key.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button className="danger-btn" onClick={() => removeRoom(index)}>
              Remove Room
            </button>
          </article>
        ))}
      </Section>

      <Section title="Keys Editor">
        <button onClick={addKey}>Add Key</button>
        <p className="muted">Toggle room access per key. Set "opens all" for master keys.</p>
        {keys.map((key, index) => (
          <article className="editor-card" key={`${key.id}-${index}`}>
            <div className="editor-grid">
              <label>
                Key ID
                <input value={textInput(key.id)} onChange={(e) => updateKey(index, 'id', e.target.value)} />
              </label>
              <label>
                Key Name
                <input value={textInput(key.name)} onChange={(e) => updateKey(index, 'name', e.target.value)} />
              </label>
              <label>
                Rarity
                <select value={key.rarity ?? 'common'} onChange={(e) => updateKey(index, 'rarity', e.target.value)}>
                  <option value="common">common</option>
                  <option value="uncommon">uncommon</option>
                  <option value="rare">rare</option>
                </select>
              </label>
              <label className="checkbox-line">
                <input
                  type="checkbox"
                  checked={key.opens === 'all'}
                  onChange={(e) => updateKey(index, 'opens', e.target.checked ? 'all' : [])}
                />
                Opens all rooms
              </label>
              <label className="checkbox-line">
                <input
                  type="checkbox"
                  checked={defaultPlayerKeys.includes(key.id)}
                  onChange={() => toggleDefaultPlayerKey(key.id)}
                />
                On default player key ring
              </label>
            </div>
            {key.opens !== 'all' ? (
              <div className="chips-grid">
                {roomOptions.map((room) => (
                  <label key={room.id} className="chip-toggle">
                    <input
                      type="checkbox"
                      checked={(key.opens || []).includes(room.id)}
                      onChange={() => toggleKeyRoom(index, room.id)}
                    />
                    {room.name}
                  </label>
                ))}
              </div>
            ) : null}
            <button className="danger-btn" onClick={() => removeKey(index)}>
              Remove Key
            </button>
          </article>
        ))}
      </Section>

      <Section title="Missions Editor">
        <button onClick={addMission}>Add Mission</button>
        {missions.map((mission, index) => (
          <article className="editor-card" key={`${mission.id}-${index}`}>
            <div className="editor-grid">
              <label>
                Mission ID
                <input value={textInput(mission.id)} onChange={(e) => updateMission(index, 'id', e.target.value)} />
              </label>
              <label>
                Title
                <input value={textInput(mission.title)} onChange={(e) => updateMission(index, 'title', e.target.value)} />
              </label>
              <label>
                Category
                <input
                  value={textInput(mission.category)}
                  onChange={(e) => updateMission(index, 'category', e.target.value)}
                />
              </label>
              <label>
                Type
                <select value={mission.type} onChange={(e) => updateMission(index, 'type', e.target.value)}>
                  <option value="delivery">delivery</option>
                  <option value="basketball_chain">basketball_chain</option>
                </select>
              </label>
              <label>
                Equipment
                <input
                  value={textInput(mission.equipmentId)}
                  onChange={(e) => updateMission(index, 'equipmentId', e.target.value)}
                />
              </label>
              <label>
                Destination Room ID
                <select value={mission.roomId || ''} onChange={(e) => updateMission(index, 'roomId', e.target.value)}>
                  {roomOptions.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} ({room.id})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Required Key ID
                <select
                  value={mission.requiredKeyId || ''}
                  onChange={(e) => updateMission(index, 'requiredKeyId', e.target.value)}
                >
                  {keys.map((key) => (
                    <option key={key.id} value={key.id}>
                      {key.name} ({key.id})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Points
                <input
                  type="number"
                  min="0"
                  value={mission.points ?? 0}
                  onChange={(e) => updateMission(index, 'points', Number(e.target.value))}
                />
              </label>
              <label>
                Pickup After Minutes
                <input
                  type="number"
                  min="0"
                  value={mission.pickupAfterMinutes ?? 0}
                  onChange={(e) => updateMission(index, 'pickupAfterMinutes', Number(e.target.value))}
                />
              </label>
            </div>

            <div className="chips-grid">
              {difficultyOptions.map((level) => (
                <label key={level} className="chip-toggle">
                  <input
                    type="checkbox"
                    checked={(mission.difficulty || []).includes(level)}
                    onChange={() => toggleMissionDifficulty(index, level)}
                  />
                  {level}
                </label>
              ))}
            </div>

            {mission.type === 'basketball_chain' ? (
              <div className="sub-editor">
                <h3>Basketball Checkpoints</h3>
                <button onClick={() => addCheckpoint(index)}>Add Checkpoint</button>
                {(mission.checkpoints || []).map((checkpoint, cpIndex) => (
                  <div key={`${checkpoint.id}-${cpIndex}`} className="editor-grid compact">
                    <label>
                      Checkpoint ID
                      <input
                        value={textInput(checkpoint.id)}
                        onChange={(e) => updateCheckpoint(index, cpIndex, 'id', e.target.value)}
                      />
                    </label>
                    <label>
                      Label
                      <input
                        value={textInput(checkpoint.label)}
                        onChange={(e) => updateCheckpoint(index, cpIndex, 'label', e.target.value)}
                      />
                    </label>
                    <label>
                      At (24h HH:MM)
                      <input
                        value={textInput(checkpoint.at)}
                        onChange={(e) => updateCheckpoint(index, cpIndex, 'at', e.target.value)}
                      />
                    </label>
                    <label>
                      Points
                      <input
                        type="number"
                        min="0"
                        value={checkpoint.points ?? 0}
                        onChange={(e) => updateCheckpoint(index, cpIndex, 'points', Number(e.target.value))}
                      />
                    </label>
                    <button className="danger-btn" onClick={() => removeCheckpoint(index, cpIndex)}>
                      Remove Checkpoint
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <button className="danger-btn" onClick={() => removeMission(index)}>
              Remove Mission
            </button>
          </article>
        ))}
      </Section>

      <Section title="Flavor Text Editor">
        {Object.entries(flavorText).map(([category, lines]) => (
          <article className="editor-card" key={category}>
            <h3>{category}</h3>
            <button onClick={() => addFlavorLine(category)}>Add Line</button>
            {lines.map((line, idx) => (
              <div key={`${category}-${idx}`} className="line-row">
                <input value={line} onChange={(e) => updateFlavorCategory(category, idx, e.target.value)} />
                <button className="danger-btn" onClick={() => removeFlavorLine(category, idx)}>
                  Remove
                </button>
              </div>
            ))}
          </article>
        ))}
      </Section>
    </div>
  );
}
