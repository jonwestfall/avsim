import { useMemo, useState } from 'react';
import AppShell from './components/AppShell';
import MainMenu from './components/MainMenu';
import MissionBoard from './components/MissionBoard';
import KeyRing from './components/KeyRing';
import SchoolMap from './components/SchoolMap';
import ShiftHUD from './components/ShiftHUD';
import ShiftSummary from './components/ShiftSummary';
import SettingsPanel from './components/SettingsPanel';
import ModalPopup from './components/ModalPopup';
import { keys, DEFAULT_PLAYER_KEYS } from './data/keys';
import { rooms } from './data/rooms';
import { equipment } from './data/equipment';
import { flavorText, pickRandom } from './data/flavorText';
import {
  START_OF_SHIFT_MINUTE,
  comboBonus,
  parseClock,
  scorePenaltyWrongKey,
  shiftOfTheDay,
  speedBonus,
  toClock,
  wrongKeyPenaltyMinutes
} from './game/logic';
import { loadJson, saveJson, storageKeys } from './game/storage';
import { playSound } from './game/audio';

const DEFAULT_SETTINGS = {
  difficulty: 'normal',
  soundEnabled: true
};

const DEFAULT_BESTS = {
  bestShiftScore: 0,
  fastestBasketballMinutes: null
};

const DEFAULT_PROGRESS = {
  completedByMissionId: {}
};

function getDifficultyLabel(id) {
  if (id === 'easy') return 'Easy';
  if (id === 'old_hand') return 'Old Hand';
  return 'Normal';
}

function byId(list) {
  return list.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
}

function normalizeId(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

function toAreaId(label) {
  return `area_${label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}`;
}

function buildMapAreasFromRooms(roomList) {
  const grouped = new Map();
  roomList.forEach((room) => {
    const label = (room.area || 'Unassigned').trim() || 'Unassigned';
    if (!grouped.has(label)) grouped.set(label, []);
    grouped.get(label).push(room.id);
  });

  return Array.from(grouped.entries()).map(([label, roomIds]) => ({
    id: toAreaId(label),
    label,
    roomIds
  }));
}

function makeShift(settings, dateText) {
  const chosen = shiftOfTheDay(dateText, settings.difficulty);

  return {
    startedAtMinute: START_OF_SHIFT_MINUTE,
    currentMinute: START_OF_SHIFT_MINUTE,
    currentRoomId: 'av_office',
    score: 0,
    mistakes: 0,
    combo: 0,
    completedMissionIds: [],
    missionStates: chosen.map((m) => ({ ...m, accepted: false, completed: false })),
    pickupTasks: [],
    activeTask: null,
    difficulty: settings.difficulty,
    difficultyLabel: getDifficultyLabel(settings.difficulty),
    basketballStartedAt: null,
    basketballFinishedAt: null,
    hasTrivMasterKey: false,
    trivAskUsed: false,
    lastMessage: 'Clock in. Clipboard secured. Key ring ready.'
  };
}

function minutesToText(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
}

export default function App() {
  const [view, setView] = useState('menu');
  const [settings, setSettings] = useState(() => loadJson(storageKeys.settings, DEFAULT_SETTINGS));
  const [bests, setBests] = useState(() => loadJson(storageKeys.bests, DEFAULT_BESTS));
  const [progress, setProgress] = useState(() => loadJson(storageKeys.progress, DEFAULT_PROGRESS));
  const [shift, setShift] = useState(null);
  const [selectedKeyId, setSelectedKeyId] = useState(DEFAULT_PLAYER_KEYS[0]);
  const [summary, setSummary] = useState(null);
  const [popup, setPopup] = useState(null);

  const keysById = useMemo(() => byId(keys), []);
  const roomsById = useMemo(() => byId(rooms), []);
  const equipmentById = useMemo(() => byId(equipment), []);
  const mapAreas = useMemo(() => buildMapAreasFromRooms(rooms), []);
  const currentShiftKeyIds = useMemo(() => {
    const keyIds = [...DEFAULT_PLAYER_KEYS];
    if (shift?.hasTrivMasterKey && !keyIds.includes('master')) {
      keyIds.push('master');
    }
    return keyIds;
  }, [shift]);
  const currentShiftKeys = useMemo(
    () => keys.filter((key) => currentShiftKeyIds.includes(key.id)),
    [currentShiftKeyIds]
  );

  const todayText = new Date().toISOString().slice(0, 10);
  const todayShiftPreview = shiftOfTheDay(todayText, settings.difficulty)
    .map((m) => m.category.replaceAll('_', ' '))
    .join(' | ');

  const easyMode = settings.difficulty === 'easy';

  const activeTaskDetails = useMemo(() => {
    if (!shift?.activeTask) return null;
    const task = shift.activeTask;

    if (task.kind === 'mission') {
      const mission = shift.missionStates.find((m) => m.id === task.refId);
      if (!mission) return null;

      return {
        kind: 'mission',
        refId: mission.id,
        requiresUnlock: task.stage === 'unlock',
        statusLine:
          task.stage === 'travel'
            ? `Travel to ${roomsById[mission.roomId]?.name}`
            : `Unlock ${roomsById[mission.roomId]?.name}`
      };
    }

    if (task.kind === 'pickup') {
      const pickup = shift.pickupTasks.find((p) => p.id === task.refId);
      if (!pickup) return null;
      return {
        kind: 'pickup',
        refId: pickup.id,
        requiresUnlock: task.stage === 'unlock',
        statusLine:
          task.stage === 'travel'
            ? `Travel for pickup at ${roomsById[pickup.roomId]?.name}`
            : `Unlock for pickup at ${roomsById[pickup.roomId]?.name}`
      };
    }

    if (task.kind === 'basketball') {
      const mission = shift.missionStates.find((m) => m.id === task.refId);
      if (!mission) return null;
      const checkpoint = mission.checkpoints?.[task.checkpointIndex];
      return {
        kind: 'basketball',
        refId: mission.id,
        requiresUnlock: task.stage === 'unlock',
        statusLine:
          task.stage === 'travel'
            ? `Travel to ${roomsById[mission.roomId]?.name}`
            : task.stage === 'unlock'
            ? 'Unlock the gym to start filming shift'
            : checkpoint
            ? `Checkpoint: ${checkpoint.label} at ${checkpoint.at}`
            : 'All checkpoints complete'
      };
    }

    return null;
  }, [shift, roomsById]);

  const basketballStatus = useMemo(() => {
    if (!shift?.activeTask || shift.activeTask.kind !== 'basketball') return null;
    const mission = shift.missionStates.find((m) => m.id === shift.activeTask.refId);
    if (!mission) return null;
    const checkpoint = mission.checkpoints?.[shift.activeTask.checkpointIndex];
    if (!checkpoint) return { canAdvance: false, buttonLabel: 'Done' };

    const checkpointMinute = parseClock(checkpoint.at);
    const canAdvance = shift.activeTask.stage === 'checkpoint';
    const needsWait = shift.currentMinute < checkpointMinute;

    return {
      canAdvance,
      buttonLabel: needsWait
        ? `Wait until ${checkpoint.at} and Record`
        : `Record ${checkpoint.label}`
    };
  }, [shift]);

  function updateSettings(partial) {
    const next = { ...settings, ...partial };
    setSettings(next);
    saveJson(storageKeys.settings, next);
  }

  function startShift() {
    const created = makeShift(settings, todayText);
    setShift(created);
    setSummary(null);
    setView('missions');
  }

  function adjustShift(mutator) {
    setShift((prev) => {
      if (!prev) return prev;
      return mutator(prev);
    });
  }

  function acceptMission(missionId) {
    adjustShift((prev) => {
      if (!prev || prev.activeTask) return prev;
      const mission = prev.missionStates.find((m) => m.id === missionId);
      if (!mission || mission.completed || mission.accepted) return prev;

      mission.accepted = true;
      const nextMinute = prev.currentMinute + 1;

      if (mission.type === 'basketball_chain') {
        return {
          ...prev,
          currentMinute: nextMinute,
          activeTask: { kind: 'basketball', refId: missionId, stage: 'travel', checkpointIndex: 0 },
          basketballStartedAt: nextMinute,
          lastMessage: 'Basketball filming shift accepted. Head to the gym.'
        };
      }

      return {
        ...prev,
        currentMinute: nextMinute,
        activeTask: { kind: 'mission', refId: missionId, stage: 'travel' },
        lastMessage: `Mission accepted: ${mission.title}`
      };
    });
  }

  function completeMission(mission, elapsedMinutes) {
    const base = mission.points;
    const bonus = speedBonus(base, elapsedMinutes);

    adjustShift((prev) => {
      if (!prev) return prev;

      const missionState = prev.missionStates.find((m) => m.id === mission.id);
      if (!missionState) return prev;
      missionState.completed = true;

      const nextCombo = prev.combo + 1;
      const comboPoints = comboBonus(nextCombo);
      const gained = base + bonus + comboPoints;

      const nextPickups = [...prev.pickupTasks];
      if (mission.pickupAfterMinutes) {
        const pickupId = `${mission.id}:pickup`;
        nextPickups.push({
          id: pickupId,
          missionId: mission.id,
          roomId: mission.roomId,
          requiredKeyId: mission.requiredKeyId,
          readyAtMinute: prev.currentMinute + mission.pickupAfterMinutes,
          title: `Pickup: ${mission.title}`
        });
      }

      const nextProgress = {
        ...progress,
        completedByMissionId: {
          ...progress.completedByMissionId,
          [mission.id]: (progress.completedByMissionId[mission.id] || 0) + 1
        }
      };
      setProgress(nextProgress);
      saveJson(storageKeys.progress, nextProgress);

      setPopup({
        title: 'Mission Complete',
        body: `${pickRandom(flavorText.missionComplete)} (+${gained} points)`
      });

      return {
        ...prev,
        score: prev.score + gained,
        combo: nextCombo,
        completedMissionIds: [...prev.completedMissionIds, mission.id],
        pickupTasks: nextPickups,
        activeTask: null,
        lastMessage: pickRandom(flavorText.successUnlock)
      };
    });

    playSound('cart_roll', settings.soundEnabled);
  }

  function completePickup(pickup) {
    adjustShift((prev) => {
      if (!prev) return prev;
      const nextCombo = prev.combo + 1;
      const gained = 80 + comboBonus(nextCombo);
      setPopup({ title: 'Pickup Complete', body: `${pickRandom(flavorText.pickupComplete)} (+${gained} points)` });

      return {
        ...prev,
        score: prev.score + gained,
        combo: nextCombo,
        pickupTasks: prev.pickupTasks.filter((p) => p.id !== pickup.id),
        activeTask: null,
        lastMessage: 'Pickup returned to AV Office inventory.'
      };
    });
  }

  function handleTravel(roomId) {
    if (!shift || !shift.activeTask) return;

    const room = roomsById[roomId];
    if (!room) return;

    playSound('cart_roll', settings.soundEnabled);

    adjustShift((prev) => {
      if (!prev || !prev.activeTask) return prev;

      const active = prev.activeTask;
      const travelCost = room.travelMinutes ?? 8;
      const nowMinute = prev.currentMinute + travelCost;

      let targetRoomId = null;
      let targetKeyId = null;

      if (active.kind === 'mission') {
        const mission = prev.missionStates.find((m) => m.id === active.refId);
        if (!mission) return prev;
        targetRoomId = mission.roomId;
        targetKeyId = mission.requiredKeyId;
      } else if (active.kind === 'pickup') {
        const pickup = prev.pickupTasks.find((p) => p.id === active.refId);
        if (!pickup) return prev;
        targetRoomId = pickup.roomId;
        targetKeyId = pickup.requiredKeyId;
      } else if (active.kind === 'basketball') {
        const mission = prev.missionStates.find((m) => m.id === active.refId);
        if (!mission) return prev;
        targetRoomId = mission.roomId;
        targetKeyId = mission.requiredKeyId;
      }

      if (roomId !== targetRoomId) {
        return {
          ...prev,
          currentMinute: nowMinute,
          currentRoomId: roomId,
          combo: 0,
          lastMessage: `Wrong turn. You reached ${room.name} instead.`
        };
      }

      if (room.locked || targetKeyId) {
        return {
          ...prev,
          currentMinute: nowMinute,
          currentRoomId: roomId,
          activeTask: { ...active, stage: 'unlock' },
          lastMessage: `${room.name} is locked. Pick a key.`
        };
      }

      return {
        ...prev,
        currentMinute: nowMinute,
        currentRoomId: roomId,
        activeTask: { ...active, stage: 'checkpoint' }
      };
    });
  }

  function keyCanOpenRoom(keyId, roomId, requiredKeyId, activeShift = shift) {
    if (activeShift?.hasTrivMasterKey) return true;

    if (normalizeId(keyId) && normalizeId(keyId) === normalizeId(requiredKeyId)) {
      return true;
    }

    const key = keysById[keyId];
    if (!key) return false;
    if (key.opens === 'all') return true;
    const normalizedRoomId = normalizeId(roomId);
    return (key.opens || []).some((openRoomId) => normalizeId(openRoomId) === normalizedRoomId);
  }

  function tryUnlock(keyId) {
    if (!shift || !shift.activeTask || !keyId) return;

    adjustShift((prev) => {
      if (!prev || !prev.activeTask) return prev;
      const active = prev.activeTask;
      let targetRoomId;
      let targetRequiredKeyId;
      let mission;
      let pickup;

      if (active.kind === 'mission') {
        mission = prev.missionStates.find((m) => m.id === active.refId);
        if (!mission) return prev;
        targetRoomId = mission.roomId;
        targetRequiredKeyId = mission.requiredKeyId;
      }
      if (active.kind === 'pickup') {
        pickup = prev.pickupTasks.find((p) => p.id === active.refId);
        if (!pickup) return prev;
        targetRoomId = pickup.roomId;
        targetRequiredKeyId = pickup.requiredKeyId;
      }
      if (active.kind === 'basketball') {
        mission = prev.missionStates.find((m) => m.id === active.refId);
        if (!mission) return prev;
        targetRoomId = mission.roomId;
        targetRequiredKeyId = mission.requiredKeyId;
      }

      const ok = keyCanOpenRoom(keyId, targetRoomId, targetRequiredKeyId, prev);

      if (!ok) {
        playSound('unlock_fail', settings.soundEnabled);
        return {
          ...prev,
          mistakes: prev.mistakes + 1,
          combo: 0,
          score: Math.max(0, prev.score - scorePenaltyWrongKey(prev.difficulty)),
          currentMinute: prev.currentMinute + wrongKeyPenaltyMinutes(prev.difficulty),
          lastMessage: pickRandom(flavorText.wrongKey)
        };
      }

      playSound('unlock_ok', settings.soundEnabled);

      if (active.kind === 'mission') {
        const elapsed = prev.currentMinute - START_OF_SHIFT_MINUTE;
        setTimeout(() => completeMission(mission, elapsed), 0);
      }

      if (active.kind === 'pickup') {
        setTimeout(() => completePickup(pickup), 0);
      }

      if (active.kind === 'basketball') {
        return {
          ...prev,
          currentMinute: prev.currentMinute + 2,
          activeTask: { ...active, stage: 'checkpoint' },
          lastMessage: 'Gym unlocked. Set up camera platform and tripod.'
        };
      }

      return {
        ...prev,
        currentMinute: prev.currentMinute + 2
      };
    });

    playSound('key_jingle', settings.soundEnabled);
  }

  function askTrivFor2A() {
    if (!shift) {
      setPopup({
        title: 'No Active Shift',
        body: 'Start a shift first, then ask Triv for 2A.'
      });
      return;
    }

    if (shift.trivAskUsed) {
      setPopup({
        title: 'Triv Is Out',
        body: 'You already asked Triv once this shift.'
      });
      return;
    }

    const success = Math.random() < 0.5;

    adjustShift((prev) => {
      if (!prev) return prev;
      if (prev.trivAskUsed) return prev;

      return {
        ...prev,
        trivAskUsed: true,
        hasTrivMasterKey: success,
        lastMessage: success
          ? 'Triv came through. You now have Master Key access for the rest of this shift.'
          : 'Triv checked 2A and shrugged. No master key today.'
      };
    });

    if (success) {
      setSelectedKeyId('master');
      playSound('unlock_ok', settings.soundEnabled);
      setPopup({
        title: 'Triv Delivered',
        body: '50/50 roll succeeded. Master Key unlocked for the rest of your current shift.'
      });
      return;
    }

    playSound('unlock_fail', settings.soundEnabled);
    setPopup({
      title: 'No Luck',
      body: 'Triv could not get you 2A this time. Keep working with your current ring.'
    });
  }

  function startPickup(pickupId) {
    adjustShift((prev) => {
      if (!prev || prev.activeTask) return prev;
      const pickup = prev.pickupTasks.find((p) => p.id === pickupId);
      if (!pickup || prev.currentMinute < pickup.readyAtMinute) return prev;

      return {
        ...prev,
        activeTask: { kind: 'pickup', refId: pickupId, stage: 'travel' },
        lastMessage: `Pickup task started: ${pickup.title}`
      };
    });
  }

  function advanceBasketballCheckpoint() {
    adjustShift((prev) => {
      if (!prev || prev.activeTask?.kind !== 'basketball') return prev;
      const mission = prev.missionStates.find((m) => m.id === prev.activeTask.refId);
      if (!mission) return prev;

      const checkpoint = mission.checkpoints?.[prev.activeTask.checkpointIndex];
      if (!checkpoint) return prev;

      const checkpointMinute = parseClock(checkpoint.at);
      const adjustedMinute = Math.max(prev.currentMinute, checkpointMinute);
      const nextScore = prev.score + checkpoint.points;
      const nextIndex = prev.activeTask.checkpointIndex + 1;

      if (nextIndex >= mission.checkpoints.length) {
        mission.completed = true;

        return {
          ...prev,
          currentMinute: adjustedMinute,
          score: nextScore,
          completedMissionIds: [...prev.completedMissionIds, mission.id],
          activeTask: null,
          basketballFinishedAt: adjustedMinute,
          combo: prev.combo + 1,
          lastMessage: 'Basketball filming shift complete. Pack up and return tapes.'
        };
      }

      return {
        ...prev,
        currentMinute: adjustedMinute,
        score: nextScore,
        activeTask: { ...prev.activeTask, checkpointIndex: nextIndex, stage: 'checkpoint' },
        lastMessage: `${checkpoint.label} recorded. Keep rolling.`
      };
    });
  }

  function endShift() {
    if (!shift) return;

    const totalMinutes = shift.currentMinute - shift.startedAtMinute;
    const flavor = pickRandom(flavorText.shiftSummary);

    const basketballMission = shift.missionStates.find((m) => m.category === 'basketball_filming_shift');
    const basketballWasCompleted = basketballMission?.completed;

    let fastestBasketballMinutes = bests.fastestBasketballMinutes;
    if (basketballWasCompleted && shift.basketballStartedAt != null && shift.basketballFinishedAt != null) {
      const duration = shift.basketballFinishedAt - shift.basketballStartedAt;
      if (fastestBasketballMinutes == null || duration < fastestBasketballMinutes) {
        fastestBasketballMinutes = duration;
      }
    }

    const nextBests = {
      bestShiftScore: Math.max(bests.bestShiftScore, shift.score),
      fastestBasketballMinutes
    };

    setBests(nextBests);
    saveJson(storageKeys.bests, nextBests);

    setSummary({
      totalMissionsCompleted: shift.completedMissionIds.length,
      totalTimeText: minutesToText(totalMinutes),
      mistakes: shift.mistakes,
      finalScore: shift.score,
      flavor
    });

    setView('summary');
    setShift(null);
  }

  const canEndShift = Boolean(shift) && !shift.activeTask;
  const pickupTasksReady = shift
    ? shift.pickupTasks.filter((p) => shift.currentMinute >= p.readyAtMinute)
    : [];

  const showMissionBoard = view === 'missions';

  return (
    <AppShell>
      <ShiftHUD shift={shift} />

      {view === 'menu' ? (
        <MainMenu
          onSelect={(selected) => {
            if (selected === 'start') {
              startShift();
              return;
            }
            setView(selected);
          }}
          shiftPreview={todayShiftPreview}
        />
      ) : null}

      {showMissionBoard ? (
        <>
          <MissionBoard
            missions={shift?.missionStates ?? []}
            roomsById={roomsById}
            equipmentById={equipmentById}
            keysById={keysById}
            easyMode={easyMode}
            onAcceptMission={acceptMission}
            pickupTasks={pickupTasksReady}
            onStartPickup={startPickup}
          />

          <SchoolMap
            mapAreas={mapAreas}
            roomsById={roomsById}
            currentRoomId={shift?.currentRoomId}
            onTravel={handleTravel}
            disabled={!shift?.activeTask}
            title="Step 2: Pick Location"
            description="Choose where to travel for the task you accepted."
          />

          <KeyRing
            keys={currentShiftKeys}
            selectedKeyId={selectedKeyId}
            onSelectKey={setSelectedKeyId}
            locked={false}
            title="Step 3: Pick Key"
            description="Choose the key you want ready before delivering."
          />

          <section className="panel">
            <h2>Step 4: Deliver</h2>
            {activeTaskDetails ? (
              <>
                <p>
                  <strong>Task:</strong> {activeTaskDetails.kind}
                </p>
                <p>
                  <strong>Status:</strong> {activeTaskDetails.statusLine}
                </p>
                {activeTaskDetails.requiresUnlock ? (
                  <button onClick={() => tryUnlock(selectedKeyId)} disabled={!selectedKeyId}>
                    Deliver Using Selected Key
                  </button>
                ) : null}
                {activeTaskDetails.kind === 'basketball' ? (
                  <button onClick={advanceBasketballCheckpoint} disabled={!basketballStatus?.canAdvance}>
                    {basketballStatus?.buttonLabel || 'Advance Checkpoint'}
                  </button>
                ) : null}
              </>
            ) : (
              <p className="muted">No active task. Complete Step 1 first.</p>
            )}
            <div className="task-panel">
              <h3>Shift Status</h3>
              <p>{shift?.lastMessage ?? pickRandom(flavorText.idleMessages)}</p>
              <button onClick={endShift} disabled={!canEndShift}>
                End Shift
              </button>
            </div>
            <button onClick={() => setView('menu')}>Back to Main Menu</button>
          </section>
        </>
      ) : null}

      {view === 'keys' ? (
        <>
          <KeyRing
            keys={currentShiftKeys}
            selectedKeyId={selectedKeyId}
            onSelectKey={setSelectedKeyId}
            locked={false}
          />
          <section className="panel">
            <h3>Ask Triv for 2A</h3>
            <p className="muted">
              50% chance to unlock Master Key access for the rest of the current shift.
            </p>
            <button onClick={askTrivFor2A} disabled={!shift || shift?.trivAskUsed}>
              Ask Triv for 2A
            </button>
            {shift ? (
              <p className="muted">
                {shift.trivAskUsed
                  ? shift.hasTrivMasterKey
                    ? 'Triv already helped you this shift. Master Key is active.'
                    : 'Triv already tried this shift. No Master Key this time.'
                  : 'You have not asked Triv yet this shift.'}
              </p>
            ) : (
              <p className="muted">Start a shift to use this option.</p>
            )}
            <p className="muted">
              In Easy mode, mission cards show required keys. In Normal/Old Hand, you have to remember.
            </p>
            <button onClick={() => setView('menu')}>Back</button>
          </section>
        </>
      ) : null}

      {view === 'scores' ? (
        <section className="panel">
          <h2>High Scores / Best Times</h2>
          <ul className="plain-list">
            <li>
              <strong>Best Shift Score:</strong> {bests.bestShiftScore}
            </li>
            <li>
              <strong>Fastest Basketball Filming Shift:</strong>{' '}
              {bests.fastestBasketballMinutes == null
                ? 'No record yet'
                : `${bests.fastestBasketballMinutes} in-game minutes`}
            </li>
          </ul>
          <button onClick={() => setView('menu')}>Back</button>
        </section>
      ) : null}

      {view === 'about' ? (
        <section className="panel">
          <h2>About</h2>
          <p>
            AV Simulator is a lightweight single-page React game about moving aging equipment through the halls
            and unlocking rooms with the right key ring instincts.
          </p>
          <p className="muted">No backend. No login. Pure local browser gameplay with localStorage persistence.</p>
          <button onClick={() => setView('menu')}>Back</button>
        </section>
      ) : null}

      {view === 'settings' ? (
        <SettingsPanel settings={settings} onUpdate={updateSettings} onBack={() => setView('menu')} />
      ) : null}

      {view === 'summary' ? <ShiftSummary summary={summary} onBackToMenu={() => setView('menu')} /> : null}

      <ModalPopup popup={popup} onClose={() => setPopup(null)} />

      <footer className="footer-note">
        <small>
          {shift ? `In-game time: ${toClock(shift.currentMinute)}` : `Shift starts at ${toClock(START_OF_SHIFT_MINUTE)}`}
        </small>
      </footer>
    </AppShell>
  );
}
