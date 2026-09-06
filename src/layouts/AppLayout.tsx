import Sidebar from '../components/Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        {children}
      </div>
    </div>
  );
}
