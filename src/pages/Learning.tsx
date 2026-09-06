import { useEffect, useState } from 'react';

type LearningStatus =
  | 'قيد التعلم'
  | 'مكتمل';

type LearningItem = {
  id: number;
  title: string;
  description: string;
  progress: number;
  status: LearningStatus;
};

const STORAGE_KEY = 'm-command-learning';

export default function Learning() {
  const [items, setItems] = useState<LearningItem[]>(() => {
    try {
      const savedItems =
        localStorage.getItem(STORAGE_KEY);

      return savedItems
        ? JSON.parse(savedItems)
        : [];
    } catch {
      return [];
    }
  });

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items)
    );
  }, [items]);

  const addLearningItem = () => {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    const newItem: LearningItem = {
      id: Date.now(),
      title: cleanTitle,
      description: description.trim(),
      progress,
      status:
        progress >= 100
          ? 'مكتمل'
          : 'قيد التعلم',
    };

    setItems((currentItems) => [
      ...currentItems,
      newItem,
    ]);

    setTitle('');
    setDescription('');
    setProgress(0);
    setShowForm(false);
  };

  const deleteLearningItem = (id: number) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== id
      )
    );
  };

  const updateProgress = (
    id: number,
    value: number
  ) => {
    const newProgress = Math.min(
      100,
      Math.max(0, value)
    );

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              progress: newProgress,
              status:
                newProgress >= 100
                  ? 'مكتمل'
                  : 'قيد التعلم',
            }
          : item
      )
    );
  };

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <span className="eyebrow">
            LEARNING
          </span>

          <h1>التعلم</h1>

          <p>
            متابعة التعلم والمهارات والمعرفة.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          {showForm
            ? 'إلغاء'
            : '+ مجال تعلم جديد'}
        </button>
      </section>

      {showForm && (
        <section className="panel learning-form">
          <h2>إضافة مجال تعلم جديد</h2>

          <div className="form-group">
            <label htmlFor="learning-title">
              اسم المجال
            </label>

            <input
              id="learning-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="مثال: الذكاء الاصطناعي"
            />
          </div>

          <div className="form-group">
            <label htmlFor="learning-description">
              وصف المجال
            </label>

            <textarea
              id="learning-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="اكتب ما تريد تعلمه..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="learning-progress">
              نسبة التقدم: {progress}%
            </label>

            <input
              id="learning-progress"
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(event) =>
                setProgress(
                  Number(event.target.value)
                )
              }
            />
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={addLearningItem}
          >
            حفظ مجال التعلم
          </button>
        </section>
      )}

      {items.length === 0 ? (
        <section className="empty-state">
          <div className="empty-icon">
            📚
          </div>

          <h2>
            لا توجد مجالات تعلم حتى الآن
          </h2>

          <p>
            أضف أول مجال تعلم وابدأ بمتابعة
            تطورك من مركز القيادة.
          </p>
        </section>
      ) : (
        <section className="learning-grid">
          {items.map((item) => (
            <article
              className="learning-card"
              key={item.id}
            >
              <div className="learning-card-header">
                <div>
                  <span className="learning-status">
                    {item.status}
                  </span>

                  <h2>
                    {item.title}
                  </h2>
                </div>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() =>
                    deleteLearningItem(item.id)
                  }
                  aria-label={`حذف مجال التعلم ${item.title}`}
                >
                  حذف
                </button>
              </div>

              {item.description && (
                <p className="learning-description">
                  {item.description}
                </p>
              )}

              <div className="learning-progress-info">
                <span>التقدم</span>

                <strong>
                  {item.progress}%
                </strong>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${item.progress}%`,
                  }}
                />
              </div>

              <input
                className="learning-progress-slider"
                type="range"
                min="0"
                max="100"
                value={item.progress}
                onChange={(event) =>
                  updateProgress(
                    item.id,
                    Number(event.target.value)
                  )
                }
                aria-label={`تقدم مجال التعلم ${item.title}`}
              />
            </article>
          ))}
        </section>
      )}
    </main>
  );
            }
