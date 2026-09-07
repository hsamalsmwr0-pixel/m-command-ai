import { useState } from 'react';
import '../styles.css';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type Goal = {
  id: number;
  title: string;
  description: string;
  progress: number;
  status: 'قيد التنفيذ' | 'مكتمل' | 'متوقف';
};

type Task = {
  id: number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
};

type Project = {
  id: number;
  title: string;
  description: string;
  progress: number;
  status: 'قيد التنفيذ' | 'مكتمل' | 'متوقف';
};

type Note = {
  id: number;
  title: string;
  content: string;
};

export default function AI() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const getGoals = (): Goal[] => {
    try {
      const savedGoals = localStorage.getItem(
        'm-command-goals'
      );

      if (!savedGoals) {
        return [];
      }

      const parsedGoals = JSON.parse(savedGoals);

      return Array.isArray(parsedGoals)
        ? parsedGoals
        : [];
    } catch {
      return [];
    }
  };

  const getTasks = (): Task[] => {
    try {
      const savedTasks = localStorage.getItem(
        'm-command-tasks'
      );

      if (!savedTasks) {
        return [];
      }

      const parsedTasks = JSON.parse(savedTasks);

      return Array.isArray(parsedTasks)
        ? parsedTasks
        : [];
    } catch {
      return [];
    }
  };

  const getProjects = (): Project[] => {
    try {
      const savedProjects = localStorage.getItem(
        'm-command-projects'
      );

      if (!savedProjects) {
        return [];
      }

      const parsedProjects =
        JSON.parse(savedProjects);

      return Array.isArray(parsedProjects)
        ? parsedProjects
        : [];
    } catch {
      return [];
    }
  };

  const getNotes = (): Note[] => {
    try {
      const savedNotes = localStorage.getItem(
        'm-command-notes'
      );

      if (!savedNotes) {
        return [];
      }

      const parsedNotes = JSON.parse(savedNotes);

      return Array.isArray(parsedNotes)
        ? parsedNotes
        : [];
    } catch {
      return [];
    }
  };

  const sendMessage = async () => {
    const message = input.trim();

    if (!message || loading) {
      return;
    }

    const goals = getGoals();
    const tasks = getTasks();
    const projects = getProjects();
    const notes = getNotes();

    const previousMessages = messages;

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: message,
      },
    ]);

    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: previousMessages,
          goals,
          tasks,
          projects,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.'
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            data.message ||
            'لم أتمكن من الحصول على إجابة.',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'حدث خطأ أثناء الاتصال بـ M-Command AI. حاول مرة أخرى.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <main className="page">
      <section className="ai-page">
        <div className="ai-header">
          <div>
            <span className="eyebrow">
              M-COMMAND AI
            </span>

            <h1>مساعدك الذكي</h1>

            <p>
              استخدم الذكاء الاصطناعي لتحليل أهدافك
              ومهامك ومشاريعك وملاحظاتك وتنظيم عملك من مكان واحد.
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
            {messages.length === 0 ? (
              <>
                <div className="ai-large-icon">
                  🤖
                </div>

                <h2>كيف يمكنني مساعدتك؟</h2>

                <p>
                  ابدأ بسؤال عن أهدافك أو مهامك أو
                  مشاريعك أو ملاحظاتك أو خطتك اليومية.
                </p>
              </>
            ) : (
              <div className="ai-messages">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`ai-message ${
                      message.role === 'user'
                        ? 'ai-message-user'
                        : 'ai-message-assistant'
                    }`}
                  >
                    <strong>
                      {message.role === 'user'
                        ? 'أنت'
                        : 'M-Command AI'}
                    </strong>

                    <p>{message.content}</p>
                  </div>
                ))}

                {loading && (
                  <div className="ai-message ai-message-assistant">
                    <strong>
                      M-Command AI
                    </strong>

                    <p>
                      جاري تجهيز الإجابة...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="ai-input-area">
            <input
              type="text"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="اكتب سؤالك لـ M-Command AI..."
              disabled={loading}
            />

            <button
              type="button"
              onClick={sendMessage}
              disabled={
                loading || !input.trim()
              }
            >
              {loading ? 'جاري...' : 'إرسال'}
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
