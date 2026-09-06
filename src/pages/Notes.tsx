import { useEffect, useState } from 'react';

type Note = {
  id: number;
  title: string;
  content: string;
};

const STORAGE_KEY = 'm-command-notes';

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const savedNotes = localStorage.getItem(STORAGE_KEY);

      return savedNotes ? JSON.parse(savedNotes) : [];
    } catch {
      return [];
    }
  });

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle || !cleanContent) {
      return;
    }

    const newNote: Note = {
      id: Date.now(),
      title: cleanTitle,
      content: cleanContent,
    };

    setNotes((currentNotes) => [
      ...currentNotes,
      newNote,
    ]);

    setTitle('');
    setContent('');
    setShowForm(false);
  };

  const deleteNote = (id: number) => {
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== id)
    );
  };

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <span className="eyebrow">NOTES</span>

          <h1>الملاحظات</h1>

          <p>
            مكان لحفظ وتنظيم ملاحظاتك.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'إلغاء' : '+ ملاحظة جديدة'}
        </button>
      </section>

      {showForm && (
        <section className="panel note-form">
          <h2>إضافة ملاحظة جديدة</h2>

          <div className="form-group">
            <label htmlFor="note-title">
              عنوان الملاحظة
            </label>

            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="مثال: أفكار لمشروع جديد"
            />
          </div>

          <div className="form-group">
            <label htmlFor="note-content">
              محتوى الملاحظة
            </label>

            <textarea
              id="note-content"
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              placeholder="اكتب ملاحظتك هنا..."
              rows={7}
            />
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={addNote}
          >
            حفظ الملاحظة
          </button>
        </section>
      )}

      {notes.length === 0 ? (
        <section className="empty-state">
          <div className="empty-icon">📝</div>

          <h2>لا توجد ملاحظات حتى الآن</h2>

          <p>
            أضف أول ملاحظة واحفظ أفكارك داخل مركز القيادة.
          </p>
        </section>
      ) : (
        <section className="notes-grid">
          {notes.map((note) => (
            <article
              className="note-card"
              key={note.id}
            >
              <div className="note-card-header">
                <h2>{note.title}</h2>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteNote(note.id)}
                  aria-label={`حذف الملاحظة ${note.title}`}
                >
                  حذف
                </button>
              </div>

              <p className="note-content">
                {note.content}
              </p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
                }
