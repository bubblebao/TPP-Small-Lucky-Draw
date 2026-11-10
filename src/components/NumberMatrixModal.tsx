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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f172a] border border-[#F5CE62]/40 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#1e293b] via-[#111827] to-[#1e293b]">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-600/30 text-[#F5CE62] border border-[#F5CE62]/30">
              <Layers size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                ผังตรวจสอบและจัดการเลขรางวัล (1–{totalNumbers})
              </h2>
              <p className="text-xs text-gray-400">
                คลิกที่หมายเลขเพื่อ "ดึงกลับเข้าโถสุ่ม" หรือ "บังคับกำหนดว่าออกแล้ว" ได้ทันที
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="p-6 pb-3 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0a0f1d]">
          {/* Tabs */}
          <div className="flex items-center space-x-2 bg-[#162033] p-1.5 rounded-2xl border border-white/10 w-full sm:w-auto">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === 'ALL'
                  ? 'bg-gradient-to-r from-[#44595B] to-[#698A9A] text-white shadow'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              ทั้งหมด ({totalNumbers})
            </button>
            <button
              onClick={() => setFilter('REMAINING')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filter === 'REMAINING'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <CheckCircle2 size={13} />
              อยู่ในโถ ({remainingPool.length})
            </button>
            <button
              onClick={() => setFilter('DRAWN')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filter === 'DRAWN'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <RotateCcw size={13} />
              ออกแล้ว ({drawnNumbers.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาเลข..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-[#162033] border border-white/15 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#F5CE62]"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 py-2.5 bg-[#0d1424] flex flex-wrap items-center gap-6 text-xs text-gray-400 border-b border-white/5">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center text-[10px] font-bold">✓</div>
            <span>สีเขียว = ยังไม่ออก (คลิกเพื่อเลือกออกรางวัลทันที)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gray-800 border border-gray-600 line-through text-gray-400 flex items-center justify-center text-[10px]">✕</div>
            <span>สีเทา = ออกแล้ว (คลิกเพื่อดึงกลับเข้าโถสุ่ม)</span>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#080d18]">
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
            {filteredNumbers.map((num) => {
              const isInPool = poolSet.has(num);
              return (
                <button
                  key={num}
                  onClick={() => onToggleNumber(num, isInPool ? 'IN_POOL' : 'DRAWN')}
                  className={`relative p-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center shadow-sm ${
                    isInPool
                      ? 'bg-emerald-950/50 hover:bg-emerald-800 text-emerald-300 border border-emerald-500/50 hover:border-emerald-300'
                      : 'bg-gray-900/60 hover:bg-rose-950/80 text-gray-600 hover:text-rose-200 border border-white/5 hover:border-rose-500 line-through'
                  }`}
                  title={
                    isInPool
                      ? `หมายเลข #${num}: ยังอยู่ในโถ (คลิกเพื่อบังคับเลือก)`
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
              <p className="text-sm font-medium">ไม่พบหมายเลขที่ตรงกับคำค้นหา</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0d1424] border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-2 text-amber-300">
            <AlertTriangle size={15} />
            <span>การปรับเปลี่ยนจะมีผลกับประวัติและการสุ่มในทันทีค่ะ</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#44595B] to-[#698A9A] hover:brightness-110 text-white font-bold transition-all shadow-md"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
