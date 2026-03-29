import { toClock } from '../game/logic';

export default function ShiftHUD({ shift }) {
  if (!shift) {
    return (
      <section className="panel hud-panel">
        <h2>Shift HUD</h2>
        <p className="muted">No active shift. Choose Start Shift from the menu.</p>
      </section>
    );
  }

  return (
    <section className="panel hud-panel">
      <h2>Shift HUD</h2>
      <div className="hud-grid">
        <div>
          <strong>Difficulty:</strong> {shift.difficultyLabel}
        </div>
        <div>
          <strong>Clock:</strong> {toClock(shift.currentMinute)}
        </div>
        <div>
          <strong>Score:</strong> {shift.score}
        </div>
        <div>
          <strong>Combo:</strong> x{shift.combo}
        </div>
        <div>
          <strong>Mistakes:</strong> {shift.mistakes}
        </div>
        <div>
          <strong>Completed:</strong> {shift.completedMissionIds.length}
        </div>
      </div>
    </section>
  );
}
