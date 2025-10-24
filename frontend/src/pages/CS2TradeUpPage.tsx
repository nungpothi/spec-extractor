import React, { useEffect, useState } from 'react';
import { useTradeupStore } from '@/stores/tradeupStore';
import { TradeupForm } from '@/components/TradeupForm';
import { TradeupResultsTable } from '@/components/TradeupResultsTable';
import { Alert } from '@/components/Alert';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { Navigation } from '@/components/Navigation';
import { TradeupCalculationRequest } from '@/types/tradeup';

export const CS2TradeUpPage: React.FC = () => {
  const {
    results,
    loading,
    error,
    calculateTradeup,
    clearError,
    clearResults
  } = useTradeupStore();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentKnifePrice, setCurrentKnifePrice] = useState<number | undefined>();

  const handleCalculateTradeup = async (data: TradeupCalculationRequest) => {
    try {
      clearResults();
      await calculateTradeup(data);
      setCurrentKnifePrice(data.knifePrice);
      setSuccessMessage('คำนวณต้นทุน Trade-Up สำเร็จ!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4 max-w-4xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2">
            🔪 CS2 Trade-Up คำนวณต้นทุน
          </h1>
          <DarkModeToggle />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
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

        {/* Info Section */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
            🎮 CS2 Trade-Up Calculator คืออะไร?
          </h2>
          <p className="text-purple-700 dark:text-purple-300 text-sm leading-relaxed">
            เครื่องมือคำนวณต้นทุนสำหรับระบบ Trade-Up ใน CS2 ช่วยให้คุณทราบว่าควรซื้อสกินแต่ละ Rarity 
            ในราคาสูงสุดเท่าไหร่ เพื่อให้ได้ Knife ในราคาที่คุ้มค่า โดยคำนวณจากอัตราการ Trade-Up 
            10:1 (10 ชิ้นของ Rarity ต่ำกว่า = 1 ชิ้นของ Rarity สูงกว่า)
          </p>
        </div>

        {/* Form */}
        <TradeupForm
          onSubmit={handleCalculateTradeup}
          loading={loading}
        />

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl lg:text-2xl font-semibold">📊 ผลการคำนวณ</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                {results.length} Rarity
              </span>
            </div>
            
            <TradeupResultsTable 
              results={results} 
              knifePrice={currentKnifePrice}
            />
          </div>
        )}

        {/* How it works */}
        <div className="mt-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            📝 วิธีการคำนวณ
          </h3>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex gap-3">
              <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded text-xs font-medium">
                Covert
              </span>
              <span>5 ชิ้น → 1 Knife (ราคา/ชิ้น = ราคา Knife ÷ 5)</span>
            </div>
            <div className="flex gap-3">
              <span className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 px-2 py-1 rounded text-xs font-medium">
                Classified
              </span>
              <span>50 ชิ้น → 5 Covert → 1 Knife (ราคา/ชิ้น = ราคา Knife ÷ 50)</span>
            </div>
            <div className="flex gap-3">
              <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 rounded text-xs font-medium">
                Restricted
              </span>
              <span>500 ชิ้น → 50 Classified → 5 Covert → 1 Knife</span>
            </div>
            <div className="flex gap-3">
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium">
                Mil-Spec
              </span>
              <span>5,000 ชิ้น → 500 Restricted → ... → 1 Knife</span>
            </div>
            <div className="flex gap-3">
              <span className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 px-2 py-1 rounded text-xs font-medium">
                Industrial
              </span>
              <span>50,000 ชิ้น → 5,000 Mil-Spec → ... → 1 Knife</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            CS2 Trade-Up Calculator - คำนวณต้นทุนสำหรับ Counter-Strike 2
          </p>
        </div>
      </div>
    </div>
  );
};