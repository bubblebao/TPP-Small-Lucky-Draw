import React, { useState } from 'react';
import { Download, Printer, Search, RotateCcw, Clock, Trophy, Sparkles } from 'lucide-react';
import type { DrawRecord } from '../types';
import { exportHistoryToCSV } from '../utils/storage';

interface HistoryLogProps {
  history: DrawRecord[];
  onRestoreNumber: (record: DrawRecord) => void;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ history, onRestoreNumber }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.trim().toLowerCase();
    return (
      item.number.toString().includes(term) ||
      item.sequence.toString().includes(term) ||
      item.timestamp.toLowerCase().includes(term)
    );
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full">
      <div className="pastel-card rounded-3xl p-5 sm:p-6 border-2 border-white/90 shadow-md flex flex-col h-full">
        {/* Header Bar */}
        <div className="pb-4 border-b-2 border-gray-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 rounded-2xl bg-[#FFF9E6] text-[#D97706] border-2 border-[#FFEAA7] shadow-sm">
                <Trophy size={20} />
              </div>
              <div>
                <h2 className="text-base font-black text-[#2C3E50] flex items-center gap-2">
                  ประวัติรางวัล
                  <span className="text-[11px] bg-[#E2EDF0] text-[#44595B] border border-[#698A9A]/30 px-2 py-0.5 rounded-full font-mono font-bold">
                    {history.length}
                  </span>
                </h2>
                <p className="text-[11px] text-gray-500 font-medium">บันทึกผลเรียงตามเวลาจริง</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => exportHistoryToCSV(history)}
                disabled={history.length === 0}
                title="ส่งออก Excel"
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-[#E8F8F5] hover:bg-[#D1F2EB] text-[#117A65] text-xs font-bold border-2 border-[#A3E4D7] transition-all shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <Download size={13} />
                <span>Excel</span>
              </button>
              <button
                onClick={handlePrint}
                disabled={history.length === 0}
                title="พิมพ์สรุป"
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-[#FFF0F3] hover:bg-[#FFE5EC] text-[#E05780] text-xs font-bold border-2 border-[#FFCAD4] transition-all shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <Printer size={13} />
                <span>พิมพ์</span>
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาหมายเลขรางวัล..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#698A9A] focus:bg-white transition-all shadow-inner"
            />
          </div>
        </div>

        {/* List Content */}
        {history.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="w-12 h-12 rounded-full bg-gray-50 border-2 border-gray-100 flex items-center justify-center mx-auto mb-2 text-gray-400">
              <Trophy size={20} />
            </div>
            <p className="text-xs font-bold text-gray-600">ยังไม่มีประวัติการจับรางวัล</p>
            <p className="text-[11px] text-gray-400 mt-0.5">กดสุ่มรางวัลเพื่อเริ่มบันทึก</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            <p className="text-xs font-bold">ไม่พบหมายเลข "{searchTerm}"</p>
          </div>
        ) : (
          <div className="mt-3 overflow-y-auto max-h-[520px] pr-1 space-y-2">
            {filteredHistory.map((item, index) => {
              const isLatest = index === 0 && !searchTerm;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border-2 transition-all ${
                    isLatest
                      ? 'bg-gradient-to-r from-[#FFF9E6] via-[#FFF5EB] to-white border-[#FFEAA7] shadow-sm'
                      : 'bg-white hover:bg-gray-50 border-gray-100 shadow-sm'
                  }`}
                >
                  {/* Left: Sequence and Number */}
                  <div className="flex items-center space-x-2.5">
                    <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg">
                      #{item.sequence.toString().padStart(3, '0')}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xl sm:text-2xl font-black font-mono text-[#1E293B]">
                        {item.number.toString().padStart(3, '0')}
                      </span>
                      {isLatest && (
                        <span className="flex items-center gap-0.5 text-[9px] bg-[#FFE5EC] text-[#D9381E] border border-[#FFCAD4] px-1.5 py-0.2 rounded-full font-bold">
                          <Sparkles size={10} className="text-[#FF8E53]" />
                          ล่าสุด
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Time and Restore Action */}
                  <div className="flex items-center space-x-2">
                    <div className="hidden sm:flex items-center space-x-1 text-[11px] text-gray-400 font-mono">
                      <Clock size={11} className="text-gray-400" />
                      <span>{item.timestamp}</span>
                    </div>

                    <button
                      onClick={() => onRestoreNumber(item)}
                      title={`ดึงหมายเลข #${item.number} กลับเข้าสู่โถสุ่ม`}
                      className="px-2 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all text-[11px] font-bold shadow-sm active:scale-95 flex items-center space-x-0.5"
                    >
                      <RotateCcw size={11} />
                      <span>คืน</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
