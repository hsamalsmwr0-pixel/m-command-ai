import { useEffect, useState } from 'react';

type ProjectStatus =
  | 'قيد التنفيذ'
  | 'مكتمل'
  | 'متوقف';

type Project = {
  id: number;
  title: string;
  description: string;
  progress: number;
  status: ProjectStatus;
};

const STORAGE_KEY = 'm-command-projects';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const savedProjects =
        localStorage.getItem(STORAGE_KEY);

      return savedProjects
        ? JSON.parse(savedProjects)
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
      JSON.stringify(projects)
    );
  }, [projects]);

  const addProject = () => {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    const newProject: Project = {
      id: Date.now(),
      title: cleanTitle,
      description: description.trim(),
      progress,
      status:
        progress >= 100
          ? 'مكتمل'
          : 'قيد التنفيذ',
    };

    setProjects((currentProjects) => [
      ...currentProjects,
      newProject,
    ]);

    setTitle('');
    setDescription('');
    setProgress(0);
    setShowForm(false);
  };

  const deleteProject = (id: number) => {
    setProjects((currentProjects) =>
      currentProjects.filter(
        (project) => project.id !== id
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

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === id
          ? {
              ...project,
              progress: newProgress,
              status:
                newProgress >= 100
                  ? 'مكتمل'
                  : 'قيد التنفيذ',
            }
          : project
      )
    );
  };

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <span className="eyebrow">
            PROJECTS
          </span>

          <h1>المشاريع</h1>

          <p>
            إدارة مشاريعك ومتابعة مراحل التنفيذ.
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
            : '+ مشروع جديد'}
        </button>
      </section>

      {showForm && (
        <section className="panel project-form">
          <h2>إضافة مشروع جديد</h2>

          <div className="form-group">
            <label htmlFor="project-title">
              اسم المشروع
            </label>

            <input
              id="project-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="مثال: إطلاق متجر إلكتروني"
            />
          </div>

          <div className="form-group">
            <label htmlFor="project-description">
              وصف المشروع
            </label>

            <textarea
              id="project-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="اكتب وصفًا مختصرًا للمشروع..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="project-progress">
              نسبة التقدم: {progress}%
            </label>

            <input
              id="project-progress"
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
            onClick={addProject}
          >
            حفظ المشروع
          </button>
        </section>
      )}

      {projects.length === 0 ? (
        <section className="empty-state">
          <div className="empty-icon">
            🚀
          </div>

          <h2>
            لا توجد مشاريع حتى الآن
          </h2>

          <p>
            أضف أول مشروع وابدأ بمتابعة مراحل
            التنفيذ من مركز القيادة.
          </p>
        </section>
      ) : (
        <section className="projects-grid">
          {projects.map((project) => (
            <article
              className="project-card"
              key={project.id}
            >
              <div className="project-card-header">
                <div>
                  <span className="project-status">
                    {project.status}
                  </span>

                  <h2>
                    {project.title}
                  </h2>
                </div>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() =>
                    deleteProject(project.id)
                  }
                  aria-label={`حذف المشروع ${project.title}`}
                >
                  حذف
                </button>
              </div>

              {project.description && (
                <p className="project-description">
                  {project.description}
                </p>
              )}

              <div className="project-progress-info">
                <span>التقدم</span>

                <strong>
                  {project.progress}%
                </strong>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${project.progress}%`,
                  }}
                />
              </div>

              <input
                className="project-progress-slider"
                type="range"
                min="0"
                max="100"
                value={project.progress}
                onChange={(event) =>
                  updateProgress(
                    project.id,
                    Number(event.target.value)
                  )
                }
                aria-label={`تقدم المشروع ${project.title}`}
              />
            </article>
          ))}
        </section>
      )}
    </main>
  );
              }
