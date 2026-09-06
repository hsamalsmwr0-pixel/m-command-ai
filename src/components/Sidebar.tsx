import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const items = [
    { path: '/', icon: '⌂', label: 'لوحة التحكم' },
    { path: '/goals', icon: '🎯', label: 'الأهداف' },
    { path: '/tasks', icon: '✓', label: 'المهام' },
    { path: '/projects', icon: '🚀', label: 'المشاريع' },
    { path: '/notes', icon: '📝', label: 'الملاحظات' },
    { path: '/learning', icon: '📚', label: 'التعلّم' },
    { path: '/ai', icon: '🤖', label: 'M-Command AI' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <strong>M</strong>

        <div>
          <b>M-COMMAND</b>
          <span>AI COMMAND CENTER</span>
        </div>
      </div>

      <div className="sidebar-section-label">
        COMMAND CENTER
      </div>

      <nav>
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <span>{item.icon}</span>

            <div className="sidebar-item-content">
              <strong>{item.label}</strong>
            </div>

            <div className="sidebar-item-arrow">
              ›
            </div>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-system">
        <div className="sidebar-system-title">
          <span className="sidebar-system-dot"></span>
          SYSTEM ONLINE
        </div>

        <div className="sidebar-system-text">
          M-Command AI • V1.1
        </div>
      </div>
    </aside>
  );
}
