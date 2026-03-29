export default function ShiftSummary({ summary, onBackToMenu }) {
  if (!summary) return null;

  return (
    <section className="panel">
      <h2>Shift Summary</h2>
      <p>{summary.flavor}</p>
      <ul className="plain-list">
        <li>
          <strong>Total Missions Completed:</strong> {summary.totalMissionsCompleted}
        </li>
        <li>
          <strong>Total Time:</strong> {summary.totalTimeText}
        </li>
        <li>
          <strong>Mistakes:</strong> {summary.mistakes}
        </li>
        <li>
          <strong>Final Score:</strong> {summary.finalScore}
        </li>
      </ul>
      <button onClick={onBackToMenu}>Return to Main Menu</button>
    </section>
  );
}
