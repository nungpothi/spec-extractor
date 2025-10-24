import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TemplateManagementPage } from '@/pages/TemplateManagementPage';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/templates" replace />} />
        <Route path="/templates" element={<TemplateManagementPage />} />
        <Route path="*" element={<Navigate to="/templates" replace />} />
      </Routes>
    </BrowserRouter>
  );
};