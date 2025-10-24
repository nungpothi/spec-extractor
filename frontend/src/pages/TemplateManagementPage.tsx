import React, { useEffect, useState } from 'react';
import { useTemplateStore } from '@/stores/templateStore';
import { TemplateForm } from '@/components/TemplateForm';
import { TemplateTable } from '@/components/TemplateTable';
import { Alert } from '@/components/Alert';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { Navigation } from '@/components/Navigation';
import { CreateTemplateRequest } from '@/types/template';

export const TemplateManagementPage: React.FC = () => {
  const {
    templates,
    loading,
    error,
    fetchTemplates,
    createTemplate,
    deleteTemplate,
    clearError
  } = useTemplateStore();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleCreateTemplate = async (data: CreateTemplateRequest) => {
    try {
      await createTemplate(data);
      setSuccessMessage('เพิ่มรายการสำเร็จ');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleEditTemplate = (id: string) => {
    // Navigate to edit page or open edit modal
    console.log('Edit template:', id);
    // For now, just log - you can implement navigation or modal
  };

  const handleDeleteTemplate = async (id: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบรายการนี้?')) {
      try {
        await deleteTemplate(id);
        setSuccessMessage('ลบรายการสำเร็จ');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        // Error is handled by the store
      }
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-500 bg-pastel-light dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4 max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2">
            🌸 Template Management
          </h1>
          <DarkModeToggle />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Alerts */}
        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
          />
        )}

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={clearError}
          />
        )}

        {/* Form */}
        <TemplateForm
          onSubmit={handleCreateTemplate}
          loading={loading}
        />

        {/* Table Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl lg:text-2xl font-semibold">📋 รายการทั้งหมด</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pastel-accent/20 text-pastel-accent dark:bg-gray-700 dark:text-gray-300">
              {templates.length} รายการ
            </span>
          </div>
          
          <TemplateTable
            templates={templates}
            onEdit={handleEditTemplate}
            onDelete={handleDeleteTemplate}
            loading={loading}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Template Management System - Enhanced with Pastel Theme & Dark Mode
          </p>
        </div>
      </div>
    </div>
  );
};