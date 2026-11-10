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
    <div className="w-full max-w-5xl mx-auto mt-6 px-4 sm:px-6">
      <div className="pastel-card rounded-3xl p-6 sm:p-8 border-2 border-white/80 shadow-lg">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b-2 border-gray-100">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-[#FFF9E6] text-[#D97706] border-2 border-[#FFEAA7] shadow-sm">
              <Trophy size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#2C3E50] flex items-center gap-2.5">
                ประวัติการออกรางวัล
                <span className="text-xs bg-[#E2EDF0] text-[#44595B] border border-[#698A9A]/30 px-3 py-1 rounded-full font-mono font-bold">
                  {history.length} รายการ
                </span>
              </h2>
              <p className="text-xs text-gray-500 font-medium">บันทึกผลตามลำดับเวลา สามารถตรวจสอบหรือกดย้อนคืนเลขได้ตลอดเวลา</p>
            </div>
          </div>

          {/* Action Buttons & Search */}
          <div className="flex items-center flex-wrap gap-2.5 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-52">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาเลข / ลำดับ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-2xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#698A9A] focus:bg-white transition-all shadow-inner"
              />
            </div>

            {/* Export CSV */}
            <button
              onClick={() => exportHistoryToCSV(history)}
              disabled={history.length === 0}
              title="ส่งออกผลการจับรางวัลเป็นไฟล์ Excel (CSV)"
              className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-[#E8F8F5] hover:bg-[#D1F2EB] text-[#117A65] text-xs font-bold border-2 border-[#A3E4D7] transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={15} />
              <span>Export Excel</span>
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              disabled={history.length === 0}
              title="พิมพ์เอกสารสรุปผลการจับรางวัลสำหรับให้ HR และพยานลงนาม"
              className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-[#FFF0F3] hover:bg-[#FFE5EC] text-[#E05780] text-xs font-bold border-2 border-[#FFCAD4] transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer size={15} />
              <span>พิมพ์สรุป</span>
            </button>
          </div>
        </div>

        {/* List Content */}
        {history.length === 0 ? (
          <div className="py-14 text-center text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-50 border-2 border-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
              <Trophy size={28} />
            </div>
            <p className="text-sm font-bold text-gray-600">ยังไม่มีประวัติการจับรางวัลในรอบนี้ค่ะ</p>
            <p className="text-xs text-gray-400 mt-1">กดปุ่มสีส้ม "สุ่มรางวัล (SPIN)" ด้านบนเพื่อเริ่มจับรางวัลหมายเลขแรก</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            <p className="text-sm font-bold">ไม่พบหมายเลขที่ตรงกับคำค้นหา "{searchTerm}"</p>
          </div>
        ) : (
          <div className="mt-5 max-h-80 overflow-y-auto pr-1.5 space-y-2.5">
            {filteredHistory.map((item, index) => {
              const isLatest = index === 0 && !searchTerm;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all ${
                    isLatest
                      ? 'bg-gradient-to-r from-[#FFF9E6] via-[#FFF5EB] to-white border-[#FFEAA7] shadow-sm'
                      : 'bg-white hover:bg-gray-50/80 border-gray-100 shadow-sm'
                  }`}
                >
                  {/* Left: Sequence and Number */}
                  <div className="flex items-center space-x-4">
                    <span className="text-xs font-mono font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-xl">
                      #{item.sequence.toString().padStart(3, '0')}
                    </span>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl sm:text-3xl font-black font-mono text-[#1E293B] tracking-wider">
                        {item.number.toString().padStart(3, '0')}
                      </span>
                      {isLatest && (
                        <span className="flex items-center gap-1 text-[11px] bg-[#FFE5EC] text-[#D9381E] border border-[#FFCAD4] px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                          <Sparkles size={12} className="text-[#FF8E53]" />
                          ล่าสุด
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Time and Restore Action */}
                  <div className="flex items-center space-x-4">
                    <div className="hidden sm:flex items-center space-x-1.5 text-xs text-gray-400 font-mono font-medium">
                      <Clock size={13} className="text-gray-400" />
                      <span>{item.timestamp}</span>
                    </div>

                    <button
                      onClick={() => onRestoreNumber(item)}
                      title={`ดึงหมายเลข #${item.number} กลับเข้าสู่โถสุ่ม`}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 transition-all text-xs font-bold shadow-sm active:scale-95"
                    >
                      <RotateCcw size={13} />
                      <span>ดึงคืนโถ</span>
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
