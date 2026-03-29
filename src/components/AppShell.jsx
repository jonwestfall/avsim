export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <header className="title-strip">
        <h1>AV Simulator</h1>
        <p>Because somebody has to haul the TV cart.</p>
      </header>
      <main>{children}</main>
    </div>
  );
}
