import React from 'react';
import { useForm } from 'react-hook-form';
import { CreateTemplateRequest } from '@/types/template';

interface TemplateFormProps {
  onSubmit: (data: CreateTemplateRequest) => Promise<void>;
  loading?: boolean;
  initialData?: Partial<CreateTemplateRequest>;
}

const categories = ['General', 'Finance', 'Game', 'System'];
const statuses = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

export const TemplateForm: React.FC<TemplateFormProps> = ({ 
  onSubmit, 
  loading = false,
  initialData 
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateTemplateRequest>({
    defaultValues: initialData
  });

  const handleFormSubmit = async (data: CreateTemplateRequest) => {
    try {
      await onSubmit(data);
      if (!initialData) {
        reset(); // Only reset if creating new (not editing)
      }
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  return (
    <div className="card-pastel p-6 mb-8 animate-fade-in">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ชื่อรายการ (Name) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            placeholder="ใส่ชื่อรายการ"
            className="input-pastel"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            คำอธิบาย (Description)
          </label>
          <input
            type="text"
            {...register('description')}
            placeholder="คำอธิบายสั้นๆ"
            className="input-pastel"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            หมวดหมู่ (Category) <span className="text-red-500">*</span>
          </label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="input-pastel"
          >
            <option value="">เลือกหมวดหมู่</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            สถานะ (Status) <span className="text-red-500">*</span>
          </label>
          <select
            {...register('status', { required: 'Status is required' })}
            className="input-pastel"
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
          {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            โน้ตเพิ่มเติม (Notes)
          </label>
          <textarea
            {...register('notes')}
            className="input-pastel resize-none h-24"
            placeholder="รายละเอียดเพิ่มเติม"
          />
        </div>

        <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-pastel-primary disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                กำลังบันทึก...
              </div>
            ) : (
              'บันทึก'
            )}
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="btn-pastel-secondary order-1 sm:order-2"
          >
            ล้าง
          </button>
        </div>
      </form>
    </div>
  );
};