import React, { useEffect, useState } from 'react';
import { useTemplateStore } from '@/stores/templateStore';
import { TemplateForm } from '@/components/TemplateForm';
import { TemplateTable } from '@/components/TemplateTable';
import { Alert } from '@/components/Alert';
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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Template Management</h1>

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

      <TemplateForm
        onSubmit={handleCreateTemplate}
        loading={loading}
      />

      <div>
        <h2 className="text-xl font-semibold mb-2">รายการทั้งหมด</h2>
        <TemplateTable
          templates={templates}
          onEdit={handleEditTemplate}
          onDelete={handleDeleteTemplate}
          loading={loading}
        />
      </div>
    </div>
  );
};