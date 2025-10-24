import React from 'react';
import { TradeupResultItem } from '@/types/tradeup';
import { TrendingUp, Package, DollarSign } from 'lucide-react';

interface TradeupResultsTableProps {
  results: TradeupResultItem[];
  knifePrice?: number;
}

export const TradeupResultsTable: React.FC<TradeupResultsTableProps> = ({ 
  results, 
  knifePrice 
}) => {
  const getRarityColor = (rarity: string) => {
    if (rarity.includes('Covert')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (rarity.includes('Classified')) return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
    if (rarity.includes('Restricted')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    if (rarity.includes('Mil-Spec')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (rarity.includes('Industrial')) return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('th-TH', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    });
  };

  const formatCount = (count: number) => {
    return count.toLocaleString('th-TH');
  };

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 animate-slide-up">
      {knifePrice && (
        <div className="flex items-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-300">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <span>เป้าหมาย: Knife ราคา {formatPrice(knifePrice)} บาท</span>
        </div>
      )}
      
      <div className="table-pastel">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-indigo-100 dark:bg-gray-700">
              <tr>
                <th className="p-4 text-left font-medium text-gray-700 dark:text-gray-300">
                  เริ่มซื้อที่ Rarity
                </th>
                <th className="p-4 text-right font-medium text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-end gap-1">
                    <Package size={14} />
                    จำนวนชิ้นเพื่อ Knife 1 เล่ม
                  </div>
                </th>
                <th className="p-4 text-right font-medium text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-end gap-1">
                    <DollarSign size={14} />
                    ราคา/ชิ้นสูงสุด (บาท)
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((result, index) => (
                <tr 
                  key={result.rarity} 
                  className="hover:bg-indigo-50/30 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRarityColor(result.rarity)}`}>
                      {result.rarity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono text-gray-900 dark:text-gray-100">
                      {formatCount(result.count)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                      ฿{formatPrice(result.maxPrice)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>💡 คำแนะนำ:</strong> ตารางนี้แสดงราคาสูงสุดต่อชิ้นที่คุณควรซื้อ หากต้องการให้ต้นทุนรวมไม่เกินราคา Knife ที่กำหนด
        </p>
      </div>
    </div>
  );
};