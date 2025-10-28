import { createBrowserRouter, Navigate } from 'react-router-dom';
import { HomePage, PromptSummaryPage, SpecDetailPage, LoginPage, RegisterPage, WelcomePage, UserPage, RequirementPage, WebhookPage, QuotationPage } from './pages';
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
        <PromptSummaryPage />
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
    path: '/webhook',
    element: (
      <ProtectedRoute>
        <WebhookPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/quotations',
    element: (
      <ProtectedRoute>
        <QuotationPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
