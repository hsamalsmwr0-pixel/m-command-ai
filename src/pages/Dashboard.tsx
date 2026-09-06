import '../styles.css';

const modules = [
  {
    icon: '🎯',
    title: 'الأهداف',
    text: 'خطط أهدافك وتابع تقدمك.',
  },
  {
    icon: '✓',
    title: 'المهام',
    text: 'نظّم أولوياتك اليومية.',
  },
  {
    icon: '🚀',
    title: 'المشاريع',
    text: 'أدر مشاريعك من مكان واحد.',
  },
  {
    icon: '📝',
    title: 'الملاحظات',
    text: 'احفظ أفكارك ومعلوماتك.',
  },
  {
    icon: '📚',
    title: 'التعلّم',
    text: 'تابع مسارك التعليمي.',
  },
  {
    icon: '🤖',
    title: 'AI Assistant',
    text: 'مساعد ذكي يفهم بياناتك.',
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

        <button className="ai-button">
          🤖 اسأل M-Command AI
        </button>
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

              <button className="open-button">
                فتح الوحدة →
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
