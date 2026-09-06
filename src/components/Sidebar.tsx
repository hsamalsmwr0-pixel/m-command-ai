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
          <b>M-Command AI</b>
          <span>Command Center</span>
        </div>
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
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
