import React from 'react';
import { TemplateListItem } from '@/types/template';
import { Edit, Trash2 } from 'lucide-react';

interface TemplateTableProps {
  templates: TemplateListItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const TemplateTable: React.FC<TemplateTableProps> = ({ 
  templates, 
  onEdit, 
  onDelete, 
  loading = false 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    if (status === 'active') {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    return `${baseClasses} bg-red-100 text-red-800`;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Updated</th>
            <th className="p-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {templates.length === 0 ? (
            <tr>
              <td colSpan={6} className="border p-4 text-center text-gray-500">
                ไม่มีข้อมูล
              </td>
            </tr>
          ) : (
            templates.map((template) => (
              <tr key={template.id} className="hover:bg-gray-50">
                <td className="border p-2 font-mono text-xs">
                  {template.id.substring(0, 8)}...
                </td>
                <td className="border p-2 font-medium">{template.name}</td>
                <td className="border p-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {template.category}
                  </span>
                </td>
                <td className="border p-2">
                  <span className={getStatusBadge(template.status)}>
                    {template.status}
                  </span>
                </td>
                <td className="border p-2 text-xs text-gray-600">
                  {formatDate(template.updated_at)}
                </td>
                <td className="border p-2">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => onEdit(template.id)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="แก้ไข"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(template.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="ลบ"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};