import { useEffect, useState } from 'react';

type GoalStatus = 'قيد التنفيذ' | 'مكتمل' | 'متوقف';

type Goal = {
  id: number;
  title: string;
  description: string;
  progress: number;
  status: GoalStatus;
};

const STORAGE_KEY = 'm-command-goals';

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const savedGoals = localStorage.getItem(STORAGE_KEY);

      return savedGoals ? JSON.parse(savedGoals) : [];
    } catch {
      return [];
    }
  });

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    const newGoal: Goal = {
      id: Date.now(),
      title: cleanTitle,
      description: description.trim(),
      progress,
      status: progress >= 100 ? 'مكتمل' : 'قيد التنفيذ',
    };

    setGoals((currentGoals) => [
      ...currentGoals,
      newGoal,
    ]);

    setTitle('');
    setDescription('');
    setProgress(0);
    setShowForm(false);
  };

  const deleteGoal = (id: number) => {
    setGoals((currentGoals) =>
      currentGoals.filter((goal) => goal.id !== id)
    );
  };

  const updateProgress = (id: number, value: number) => {
    const newProgress = Math.min(100, Math.max(0, value));

    setGoals((currentGoals) =>
      currentGoals.map((goal) => ({
        ...goal,
        progress: goal.id === id ? newProgress : goal.progress,
        status:
          goal.id === id
            ? newProgress >= 100
              ? 'مكتمل'
              : 'قيد التنفيذ'
            : goal.status,
      }))
    );
  };

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <span className="eyebrow">GOALS</span>

          <h1>الأهداف</h1>

          <p>
            تحديد أهدافك ومتابعة تقدمك.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'إلغاء' : '+ هدف جديد'}
        </button>
      </section>

      {showForm && (
        <section className="panel goal-form">
          <h2>إضافة هدف جديد</h2>

          <div className="form-group">
            <label htmlFor="goal-title">
              اسم الهدف
            </label>

            <input
              id="goal-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="مثال: تعلم التجارة الإلكترونية"
            />
          </div>

          <div className="form-group">
            <label htmlFor="goal-description">
              وصف الهدف
            </label>

            <textarea
              id="goal-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="اكتب وصفًا مختصرًا للهدف..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="goal-progress">
              نسبة التقدم: {progress}%
            </label>

            <input
              id="goal-progress"
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(event) =>
                setProgress(Number(event.target.value))
              }
            />
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={addGoal}
          >
            حفظ الهدف
          </button>
        </section>
      )}

      {goals.length === 0 ? (
        <section className="empty-state">
          <div className="empty-icon">🎯</div>

          <h2>لا توجد أهداف حتى الآن</h2>

          <p>
            أضف أول هدف لك وابدأ بمتابعة تقدمك من مركز القيادة.
          </p>
        </section>
      ) : (
        <section className="goals-grid">
          {goals.map((goal) => (
            <article
              className="goal-card"
              key={goal.id}
            >
              <div className="goal-card-header">
                <div>
                  <span className="goal-status">
                    {goal.status}
                  </span>

                  <h2>{goal.title}</h2>
                </div>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteGoal(goal.id)}
                  aria-label={`حذف الهدف ${goal.title}`}
                >
                  حذف
                </button>
              </div>

              {goal.description && (
                <p className="goal-description">
                  {goal.description}
                </p>
              )}

              <div className="goal-progress-info">
                <span>التقدم</span>
                <strong>{goal.progress}%</strong>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${goal.progress}%`,
                  }}
                />
              </div>

              <input
                className="goal-progress-slider"
                type="range"
                min="0"
                max="100"
                value={goal.progress}
                onChange={(event) =>
                  updateProgress(
                    goal.id,
                    Number(event.target.value)
                  )
                }
                aria-label={`تقدم الهدف ${goal.title}`}
              />
            </article>
          ))}
        </section>
      )}
    </main>
  );
            }
