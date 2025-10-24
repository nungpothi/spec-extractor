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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-2 gap-4 border p-4 rounded bg-gray-50 mb-6">
      <div>
        <label className="block text-sm font-medium mb-1">
          ชื่อรายการ (Name) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('name', { required: 'Name is required' })}
          placeholder="ใส่ชื่อรายการ"
          className="border rounded w-full p-2"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">คำอธิบาย (Description)</label>
        <input
          type="text"
          {...register('description')}
          placeholder="คำอธิบายสั้นๆ"
          className="border rounded w-full p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          หมวดหมู่ (Category) <span className="text-red-500">*</span>
        </label>
        <select
          {...register('category', { required: 'Category is required' })}
          className="border rounded w-full p-2"
        >
          <option value="">เลือกหมวดหมู่</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          สถานะ (Status) <span className="text-red-500">*</span>
        </label>
        <select
          {...register('status', { required: 'Status is required' })}
          className="border rounded w-full p-2"
        >
          {statuses.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium mb-1">โน้ตเพิ่มเติม (Notes)</label>
        <textarea
          {...register('notes')}
          className="border rounded w-full p-2 h-24"
          placeholder="รายละเอียดเพิ่มเติม"
        />
      </div>

      <div className="col-span-2 flex justify-end space-x-2 mt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>
        <button
          type="button"
          onClick={() => reset()}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          ล้าง
        </button>
      </div>
    </form>
  );
};