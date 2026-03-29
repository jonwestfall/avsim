import logo from '../logo.png';

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <header className="title-strip">
        <div className="title-brand">
          <img className="school-logo" src={logo} alt="School logo" />
          <div>
            <h1>AV Simulator</h1>
            <p>Because somebody has to haul the TV cart.</p>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
