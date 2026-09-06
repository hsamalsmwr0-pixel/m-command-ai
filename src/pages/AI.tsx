import '../styles.css';

export default function AI() {
  return (
    <main className="page">
      <section className="ai-page">
        <div className="ai-header">
          <div>
            <span className="eyebrow">M-COMMAND AI</span>

            <h1>مساعدك الذكي</h1>

            <p>
              استخدم الذكاء الاصطناعي لتحليل أهدافك ومهامك ومشاريعك
              وتنظيم عملك من مكان واحد.
            </p>
          </div>

          <div className="ai-status">
            <span className="status-dot"></span>
            AI جاهز
          </div>
        </div>

        <section className="ai-chat-card">
          <div className="ai-chat-header">
            <div className="ai-avatar">🤖</div>

            <div>
              <strong>M-Command AI</strong>
              <span>مساعد مركز القيادة</span>
            </div>
          </div>

          <div className="ai-empty-state">
            <div className="ai-large-icon">🤖</div>

            <h2>كيف يمكنني مساعدتك؟</h2>

            <p>
              ابدأ بسؤال عن أهدافك أو مهامك أو مشاريعك أو خطتك اليومية.
            </p>
          </div>

          <div className="ai-input-area">
            <input
              type="text"
              placeholder="اكتب سؤالك لـ M-Command AI..."
            />

            <button type="button">
              إرسال
            </button>
          </div>
        </section>

        <section className="ai-tools">
          <div className="section-title">
            <h2>أدوات الذكاء الاصطناعي</h2>
            <span>V1.1</span>
          </div>

          <div className="ai-tools-grid">
            <article className="ai-tool-card">
              <span>🎯</span>
              <h3>تحليل الأهداف</h3>
              <p>
                تحليل أهدافك وتحويلها إلى خطوات عملية.
              </p>
            </article>

            <article className="ai-tool-card">
              <span>✓</span>
              <h3>تنظيم المهام</h3>
              <p>
                ترتيب المهام وتحديد الأولويات.
              </p>
            </article>

            <article className="ai-tool-card">
              <span>🚀</span>
              <h3>تحليل المشاريع</h3>
              <p>
                فهم حالة المشروع وتحديد الخطوات القادمة.
              </p>
            </article>

            <article className="ai-tool-card">
              <span>📋</span>
              <h3>توليد خطة</h3>
              <p>
                إنشاء خطة عملية بناءً على هدفك.
              </p>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}
