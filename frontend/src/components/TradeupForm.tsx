import React from 'react';
import { useForm } from 'react-hook-form';
import { TradeupCalculationRequest } from '@/types/tradeup';

interface TradeupFormProps {
  onSubmit: (data: TradeupCalculationRequest) => Promise<void>;
  loading?: boolean;
}

export const TradeupForm: React.FC<TradeupFormProps> = ({ 
  onSubmit, 
  loading = false 
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<TradeupCalculationRequest>();

  const handleFormSubmit = async (data: TradeupCalculationRequest) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  return (
    <div className="card-pastel p-6 mb-8 animate-fade-in">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ราคา Knife (ปลายทาง บาท) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            {...register('knifePrice', { 
              required: 'กรุณาใส่ราคา Knife',
              min: { value: 0.01, message: 'ราคาต้องมากกว่า 0' },
              max: { value: 1000000, message: 'ราคาต้องไม่เกิน 1,000,000 บาท' }
            })}
            placeholder="1700"
            className="input-pastel"
          />
          {errors.knifePrice && (
            <p className="text-red-500 text-sm mt-1">{errors.knifePrice.message}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ใส่ราคา Knife ที่ต้องการ เพื่อคำนวณต้นทุนสูงสุดของสกินในแต่ละ Rarity
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-pastel-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                กำลังคำนวณ...
              </div>
            ) : (
              '🧮 คำนวณ'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};