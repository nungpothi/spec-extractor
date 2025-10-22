import { createBrowserRouter, Navigate } from 'react-router-dom';
import { HomePage, SummaryPage, SpecDetailPage } from './pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/summary',
    element: <SummaryPage />,
  },
  {
    path: '/spec/:id',
    element: <SpecDetailPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);