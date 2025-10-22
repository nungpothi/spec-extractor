import { createBrowserRouter, Navigate } from 'react-router-dom';
import { HomePage, SummaryPage, SpecDetailPage, LoginPage, RegisterPage, WelcomePage, UserPage, RequirementPage } from './pages';
import { ProtectedRoute } from './components';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RequirementPage />,
  },
  {
    path: '/preview',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <HomePage />
      </ProtectedRoute>
    ),
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
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <SummaryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/spec/:id',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <SpecDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/user',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <UserPage />
      </ProtectedRoute>
    ),
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