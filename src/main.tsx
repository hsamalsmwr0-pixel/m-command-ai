import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  return (
    <main className="app">
      <section className="hero">
        <span className="badge">M-COMMAND AI</span>

        <h1>مركز القيادة الذكي</h1>

        <p>
          نظام واحد لإدارة أهدافك، مهامك، مشاريعك، تعلمك وقراراتك
          بمساعدة الذكاء الاصطناعي.
        </p>

        <button>ابدأ مركز القيادة</button>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
