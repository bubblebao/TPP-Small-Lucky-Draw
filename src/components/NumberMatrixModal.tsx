import React, { useState } from 'react';
import { X, Search, AlertTriangle, Layers, CheckCircle2, RotateCcw } from 'lucide-react';

interface NumberMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalNumbers: number;
  remainingPool: number[];
  drawnNumbers: number[];
  onToggleNumber: (num: number, currentStatus: 'IN_POOL' | 'DRAWN') => void;
}

export const NumberMatrixModal: React.FC<NumberMatrixModalProps> = ({
  isOpen,
  onClose,
  totalNumbers,
  remainingPool,
  drawnNumbers,
  onToggleNumber,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'REMAINING' | 'DRAWN'>('ALL');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const poolSet = new Set(remainingPool);
  const allNumbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);

  const filteredNumbers = allNumbers.filter((num) => {
    const isInPool = poolSet.has(num);

    if (filter === 'REMAINING' && !isInPool) return false;
    if (filter === 'DRAWN' && isInPool) return false;

    if (search.trim()) {
      return num.toString().includes(search.trim());
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border-2 border-gray-200 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b-2 border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#FFF5EB] via-white to-[#E8F8F5]">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-2xl bg-[#E8F8F5] text-[#117A65] border-2 border-[#A3E4D7] shadow-sm">
              <Layers size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#2C3E50] flex items-center gap-2">
                ผังตรวจสอบและจัดการเลขรางวัล (1–{totalNumbers})
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                คลิกที่หมายเลขเพื่อ "ดึงกลับเข้าโถสุ่ม" หรือ "บังคับกำหนดว่าออกแล้ว" ได้ทันที
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="p-6 pb-3 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
          {/* Tabs */}
          <div className="flex items-center space-x-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 w-full sm:w-auto">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                filter === 'ALL'
                  ? 'bg-white text-[#2C3E50] shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              ทั้งหมด ({totalNumbers})
            </button>
            <button
              onClick={() => setFilter('REMAINING')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                filter === 'REMAINING'
                  ? 'bg-[#117A65] text-white shadow-sm'
                  : 'text-[#117A65] hover:text-[#0E6655]'
              }`}
            >
              <CheckCircle2 size={13} />
              อยู่ในโถ ({remainingPool.length})
            </button>
            <button
              onClick={() => setFilter('DRAWN')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                filter === 'DRAWN'
                  ? 'bg-[#E07A5F] text-white shadow-sm'
                  : 'text-[#E07A5F] hover:text-[#C76046]'
              }`}
            >
              <RotateCcw size={13} />
              ออกแล้ว ({drawnNumbers.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาเลข..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-white border-2 border-gray-200 rounded-2xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#698A9A]"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 py-2.5 bg-white flex flex-wrap items-center gap-6 text-xs text-gray-600 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-[#E8F8F5] border-2 border-[#A3E4D7] text-[#117A65] flex items-center justify-center text-[10px] font-black">✓</div>
            <span className="font-medium">สีเขียวมิ้นท์ = ยังไม่ออก (คลิกเพื่อเลือกออกรางวัลทันที)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300 line-through text-gray-400 flex items-center justify-center text-[10px]">✕</div>
            <span className="font-medium">สีเทา = ออกแล้ว (คลิกเพื่อดึงกลับเข้าโถสุ่ม)</span>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
            {filteredNumbers.map((num) => {
              const isInPool = poolSet.has(num);
              return (
                <button
                  key={num}
                  onClick={() => onToggleNumber(num, isInPool ? 'IN_POOL' : 'DRAWN')}
                  className={`relative p-2.5 rounded-2xl font-mono text-xs sm:text-sm font-bold transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center shadow-sm ${
                    isInPool
                      ? 'bg-[#E8F8F5] hover:bg-[#D1F2EB] text-[#117A65] border-2 border-[#A3E4D7] hover:border-[#76D7C4]'
                      : 'bg-gray-100 hover:bg-rose-50 text-gray-400 hover:text-rose-600 border border-gray-200 hover:border-rose-300 line-through'
                  }`}
                  title={
                    isInPool
                      ? `หมายเลข #${num}: ยังอยู่ในโถ (คลิกเพื่อเลือกออกรางวัล)`
                      : `หมายเลข #${num}: ออกแล้ว (คลิกเพื่อดึงกลับเข้าโถ)`
                  }
                >
                  <span>{num.toString().padStart(3, '0')}</span>
                </button>
              );
            })}
          </div>

          {filteredNumbers.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              <p className="text-sm font-bold">ไม่พบหมายเลขที่ตรงกับคำค้นหา</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-100 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-2 text-amber-700 font-semibold">
            <AlertTriangle size={15} />
            <span>การปรับเปลี่ยนจะมีผลกับประวัติและการสุ่มในทันทีค่ะ</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-[#2C3E50] hover:bg-[#1A252F] text-white font-bold transition-all shadow-md"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
