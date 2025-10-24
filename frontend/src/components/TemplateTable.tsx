import React from 'react';
import { TemplateListItem } from '@/types/template';
import { Edit, Trash2, Calendar } from 'lucide-react';

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
    if (status === 'active') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
        Inactive
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      General: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      Finance: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      Game: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      System: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[category as keyof typeof colors] || colors.General}`}>
        {category}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="table-pastel">
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <div className="w-5 h-5 border-2 border-pastel-accent border-t-transparent rounded-full animate-spin"></div>
            <span>กำลังโหลดข้อมูล...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="table-pastel animate-slide-up">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-pastel-header dark:bg-gray-700">
            <tr>
              <th className="p-4 text-left font-medium text-gray-700 dark:text-gray-300">ID</th>
              <th className="p-4 text-left font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th className="p-4 text-left font-medium text-gray-700 dark:text-gray-300">Category</th>
              <th className="p-4 text-left font-medium text-gray-700 dark:text-gray-300">Status</th>
              <th className="p-4 text-left font-medium text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  Updated
                </div>
              </th>
              <th className="p-4 text-center font-medium text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {templates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      📄
                    </div>
                    <p className="font-medium">ไม่มีข้อมูล</p>
                    <p className="text-xs">เริ่มต้นสร้างรายการแรกของคุณ</p>
                  </div>
                </td>
              </tr>
            ) : (
              templates.map((template, index) => (
                <tr 
                  key={template.id} 
                  className="hover:bg-pastel-header/30 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-4 py-3">
                    <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {template.id.substring(0, 8)}...
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {template.name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getCategoryBadge(template.category)}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(template.status)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">
                    {formatDate(template.updated_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => onEdit(template.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors duration-200"
                        title="แก้ไข"
                      >
                        <Edit size={12} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => onDelete(template.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200"
                        title="ลบ"
                      >
                        <Trash2 size={12} />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};