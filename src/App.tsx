import './styles.css';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div>
          <strong>M-Command AI</strong>
          <span>AI Personal Command Center</span>
        </div>

        <div className="status">
          <span className="status-dot" />
          النظام جاهز
        </div>
      </header>

      <Dashboard />
    </div>
  );
}
