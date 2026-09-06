import { createBrowserRouter } from 'react-router-dom';

import AppLayout from './layouts/AppLayout';

import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Goals from './pages/Goals';
import Projects from './pages/Projects';
import Notes from './pages/Notes';
import Learning from './pages/Learning';
import AI from './pages/AI';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'tasks',
        element: <Tasks />,
      },
      {
        path: 'goals',
        element: <Goals />,
      },
      {
        path: 'projects',
        element: <Projects />,
      },
      {
        path: 'notes',
        element: <Notes />,
      },
      {
        path: 'learning',
        element: <Learning />,
      },
      {
        path: 'ai',
        element: <AI />,
      },
    ],
  },
]);

export default router;
