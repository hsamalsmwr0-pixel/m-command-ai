import '../styles.css';
import { Link } from 'react-router-dom';

const modules = [
  {
    icon: '🎯',
    title: 'الأهداف',
    text: 'خطط أهدافك وتابع تقدمك.',
    path: '/goals',
  },
  {
    icon: '✓',
    title: 'المهام',
    text: 'نظّم أولوياتك اليومية.',
    path: '/tasks',
  },
  {
    icon: '🚀',
    title: 'المشاريع',
    text: 'أدر مشاريعك من مكان واحد.',
    path: '/projects',
  },
  {
    icon: '📝',
    title: 'الملاحظات',
    text: 'احفظ أفكارك ومعلوماتك.',
    path: '/notes',
  },
  {
    icon: '📚',
    title: 'التعلّم',
    text: 'تابع مسارك التعليمي.',
    path: '/learning',
  },
  {
    icon: '🤖',
    title: 'AI Assistant',
    text: 'مساعد ذكي يفهم بياناتك.',
    path: '/ai',
  },
];

export default function Dashboard() {
  return (
    <main className="dashboard">
      <section className="welcome">
        <div>
          <span className="eyebrow">COMMAND CENTER</span>

          <h1>مركز قيادتك الذكي</h1>

          <p>
            تحكم بأهدافك ومهامك ومشاريعك وتعلّمك من مساحة واحدة.
          </p>
        </div>

        <Link to="/ai" className="ai-button">
          🤖 اسأل M-Command AI
        </Link>
      </section>

      <section className="stats">
        <div className="stat-card">
          <span>🎯</span>
          <small>الأهداف النشطة</small>
          <strong>0</strong>
        </div>

        <div className="stat-card">
          <span>✓</span>
          <small>المهام اليوم</small>
          <strong>0</strong>
        </div>

        <div className="stat-card">
          <span>🚀</span>
          <small>المشاريع</small>
          <strong>0</strong>
        </div>

        <div className="stat-card">
          <span>📚</span>
          <small>مسارات التعلم</small>
          <strong>0</strong>
        </div>
      </section>

      <section>
        <div className="section-title">
          <h2>وحدات مركز القيادة</h2>
          <span>V1.0</span>
        </div>

        <div className="modules">
          {modules.map((module) => (
            <article
              className="module-card"
              key={module.title}
            >
              <div className="module-icon">
                {module.icon}
              </div>

              <h3>{module.title}</h3>

              <p>{module.text}</p>

              <Link
                to={module.path}
                className="open-button"
              >
                فتح الوحدة →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
