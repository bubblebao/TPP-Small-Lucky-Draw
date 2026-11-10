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
      <div className="glass-panel-v2 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-600/30 text-[#F5CE62] border border-[#F5CE62]/40 shadow-inner">
              <Trophy size={22} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
                ประวัติการออกรางวัล
                <span className="text-xs bg-[#1e293b] text-[#F5CE62] border border-[#F5CE62]/30 px-3 py-0.5 rounded-full font-mono font-bold">
                  {history.length} รายการ
                </span>
              </h2>
              <p className="text-xs text-gray-400">บันทึกผลตามลำดับเวลา สามารถตรวจสอบหรือกดย้อนคืนเลขได้ตลอดเวลา</p>
            </div>
          </div>

          {/* Action Buttons & Search */}
          <div className="flex items-center flex-wrap gap-2.5 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-52">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาเลข / ลำดับ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#0d1424] border border-white/15 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#F5CE62] transition-colors"
              />
            </div>

            {/* Export CSV */}
            <button
              onClick={() => exportHistoryToCSV(history)}
              disabled={history.length === 0}
              title="ส่งออกผลการจับรางวัลเป็นไฟล์ Excel (CSV)"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold border border-emerald-400/30 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={15} />
              <span>Export Excel</span>
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              disabled={history.length === 0}
              title="พิมพ์เอกสารสรุปผลการจับรางวัลสำหรับให้ HR และพยานลงนาม"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1e293b] hover:bg-[#2e3e57] text-gray-200 text-xs font-bold border border-white/15 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer size={15} />
              <span>พิมพ์สรุป</span>
            </button>
          </div>
        </div>

        {/* List Content */}
        {history.length === 0 ? (
          <div className="py-14 text-center text-gray-400">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-gray-500">
              <Trophy size={28} />
            </div>
            <p className="text-sm font-semibold text-gray-300">ยังไม่มีประวัติการจับรางวัลในรอบนี้ค่ะ</p>
            <p className="text-xs text-gray-500 mt-1">กดปุ่ม "สุ่มรางวัล (SPIN)" ด้านบนเพื่อเริ่มจับรางวัลหมายเลขแรก</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-10 text-center text-gray-400">
            <p className="text-sm font-medium">ไม่พบหมายเลขที่ตรงกับคำค้นหา "{searchTerm}"</p>
          </div>
        ) : (
          <div className="mt-5 max-h-80 overflow-y-auto pr-1.5 space-y-2.5">
            {filteredHistory.map((item, index) => {
              const isLatest = index === 0 && !searchTerm;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all ${
                    isLatest
                      ? 'bg-gradient-to-r from-amber-500/15 via-[#1b263b] to-[#0d1424] border-[#F5CE62]/60 shadow-[0_0_20px_rgba(245,206,98,0.15)]'
                      : 'bg-[#0d1424]/70 hover:bg-[#162033]/80 border-white/10'
                  }`}
                >
                  {/* Left: Sequence and Number */}
                  <div className="flex items-center space-x-4">
                    <span className="text-xs font-mono font-bold text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg">
                      #{item.sequence.toString().padStart(3, '0')}
                    </span>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl sm:text-3xl font-black font-mono gold-text-glow tracking-wider">
                        {item.number.toString().padStart(3, '0')}
                      </span>
                      {isLatest && (
                        <span className="flex items-center gap-1 text-[11px] bg-amber-400/20 text-[#FFF4D0] border border-amber-400/40 px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                          <Sparkles size={12} className="text-[#F5CE62]" />
                          ล่าสุด
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Time and Restore Action */}
                  <div className="flex items-center space-x-4">
                    <div className="hidden sm:flex items-center space-x-1.5 text-xs text-gray-400 font-mono">
                      <Clock size={13} className="text-gray-500" />
                      <span>{item.timestamp}</span>
                    </div>

                    <button
                      onClick={() => onRestoreNumber(item)}
                      title={`ดึงหมายเลข #${item.number} กลับเข้าสู่โถสุ่ม`}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/80 text-rose-300 hover:text-white border border-rose-800/40 hover:border-rose-500/60 transition-all text-xs font-semibold shadow-sm active:scale-95"
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
