import './styles.css';
import Dashboard from './pages/Dashboard';
import AppLayout from './layouts/AppLayout';

export default function App() {
  return (
    <div className="app">
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </div>
  );
}
