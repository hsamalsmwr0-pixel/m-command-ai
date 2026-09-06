import { useEffect, useState } from 'react';

type TaskPriority = 'منخفضة' | 'متوسطة' | 'عالية';
type TaskStatus = 'قيد التنفيذ' | 'مكتملة';

type Task = {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
};

const STORAGE_KEY = 'm-command-tasks';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);

      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch {
      return [];
    }
  });

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] =
    useState<TaskPriority>('متوسطة');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title: cleanTitle,
      description: description.trim(),
      priority,
      status: 'قيد التنفيذ',
    };

    setTasks((currentTasks) => [
      ...currentTasks,
      newTask,
    ]);

    setTitle('');
    setDescription('');
    setPriority('متوسطة');
    setShowForm(false);
  };

  const deleteTask = (id: number) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  };

  const toggleTaskStatus = (id: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status:
                task.status === 'مكتملة'
                  ? 'قيد التنفيذ'
                  : 'مكتملة',
            }
          : task
      )
    );
  };

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <span className="eyebrow">TASKS</span>

          <h1>المهام</h1>

          <p>
            إدارة ومتابعة مهامك اليومية.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'إلغاء' : '+ مهمة جديدة'}
        </button>
      </section>

      {showForm && (
        <section className="panel task-form">
          <h2>إضافة مهمة جديدة</h2>

          <div className="form-group">
            <label htmlFor="task-title">
              اسم المهمة
            </label>

            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="مثال: دراسة التسويق الرقمي"
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description">
              وصف المهمة
            </label>

            <textarea
              id="task-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="اكتب وصفًا مختصرًا للمهمة..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-priority">
              الأولوية
            </label>

            <select
              id="task-priority"
              value={priority}
              onChange={(event) =>
                setPriority(
                  event.target.value as TaskPriority
                )
              }
            >
              <option value="منخفضة">منخفضة</option>
              <option value="متوسطة">متوسطة</option>
              <option value="عالية">عالية</option>
            </select>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={addTask}
          >
            حفظ المهمة
          </button>
        </section>
      )}

      {tasks.length === 0 ? (
        <section className="empty-state">
          <div className="empty-icon">✓</div>

          <h2>لا توجد مهام حتى الآن</h2>

          <p>
            أضف أول مهمة لك وابدأ بتنظيم يومك من مركز القيادة.
          </p>
        </section>
      ) : (
        <section className="tasks-grid">
          {tasks.map((task) => (
            <article
              className={`task-card ${
                task.status === 'مكتملة'
                  ? 'task-completed'
                  : ''
              }`}
              key={task.id}
            >
              <div className="task-card-header">
                <div>
                  <span className="task-status">
                    {task.status}
                  </span>

                  <h2>{task.title}</h2>
                </div>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`حذف المهمة ${task.title}`}
                >
                  حذف
                </button>
              </div>

              {task.description && (
                <p className="task-description">
                  {task.description}
                </p>
              )}

              <div className="task-meta">
                <span>الأولوية</span>

                <strong>
                  {task.priority}
                </strong>
              </div>

              <button
                type="button"
                className="task-action-button"
                onClick={() =>
                  toggleTaskStatus(task.id)
                }
              >
                {task.status === 'مكتملة'
                  ? 'إعادة المهمة'
                  : '✓ إكمال المهمة'}
              </button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
            }
