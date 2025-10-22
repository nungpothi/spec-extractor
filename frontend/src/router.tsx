import { createBrowserRouter, Navigate } from 'react-router-dom';
import { HomePage, SummaryPage, SpecDetailPage, LoginPage, RegisterPage, WelcomePage, UserPage, RequirementPage } from './pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/welcome',
    element: <WelcomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
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
    path: '/user',
    element: <UserPage />,
  },
  {
    path: '/requirement',
    element: <RequirementPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);