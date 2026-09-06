export default function Sidebar() {
  const items = [
    { icon: '⌂', label: 'لوحة التحكم' },
    { icon: '🎯', label: 'الأهداف' },
    { icon: '✓', label: 'المهام' },
    { icon: '🚀', label: 'المشاريع' },
    { icon: '📝', label: 'الملاحظات' },
    { icon: '📚', label: 'التعلّم' },
    { icon: '🤖', label: 'M-Command AI' },
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
        {items.map((item, index) => (
          <button
            key={item.label}
            className={`sidebar-item ${index === 0 ? 'active' : ''}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
