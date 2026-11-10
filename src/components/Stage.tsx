import React, { useEffect } from 'react';
import { Play, RotateCcw, ShieldCheck, Sparkles, SlidersHorizontal, Gift, PartyPopper } from 'lucide-react';
import type { DrawState } from '../types';

interface StageProps {
  drawState: DrawState;
  displayNumber: number | null;
  onSpin: () => void;
  onUndo: () => void;
  canUndo: boolean;
  remainingCount: number;
  totalCount: number;
  onOpenMatrix: () => void;
  spinDurationMs: number;
  onChangeDuration: (duration: number) => void;
  lastEntropyHex: string | null;
}

export const Stage: React.FC<StageProps> = ({
  drawState,
  displayNumber,
  onSpin,
  onUndo,
  canUndo,
  remainingCount,
  totalCount,
  onOpenMatrix,
  spinDurationMs,
  onChangeDuration,
  lastEntropyHex,
}) => {
  const isSpinning = drawState === 'SPINNING';
  const isWinner = drawState === 'WINNER';
  const isCompleted = remainingCount === 0;

  // Keyboard shortcut: Spacebar to spin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSpinning && !isCompleted) {
        if (['INPUT', 'TEXTAREA', 'BUTTON'].includes((e.target as HTMLElement).tagName)) {
          return;
        }
        e.preventDefault();
        onSpin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpinning, isCompleted, onSpin]);

  // Break number into 3 individual digits for slot drums
  const getDigits = (num: number | null): [string, string, string] => {
    if (num === null) return ['-', '-', '-'];
    const str = num.toString().padStart(3, '0');
    return [str[0], str[1], str[2]];
  };

  const digits = getDigits(displayNumber);
  const progressPercentage = Math.round(((totalCount - remainingCount) / totalCount) * 100);

  return (
    <div className="w-full flex flex-col items-center justify-center pt-4 pb-8 px-4 sm:px-6 relative">
      {/* Top Floating Trust Badge */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        <div className="flex items-center space-x-2 bg-white/90 border-2 border-emerald-200 px-4 py-1.5 rounded-full text-xs text-gray-700 shadow-sm">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span className="font-bold">ระบบสุ่มโปร่งใส 100% (CSPRNG Verified)</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-black">FAIR PLAY</span>
        </div>

        {lastEntropyHex && (
          <div className="hidden sm:flex items-center space-x-1.5 bg-white/90 border-2 border-amber-200 px-3.5 py-1.5 rounded-full text-xs font-mono text-gray-600 shadow-sm">
            <span className="text-gray-400">Audit Hash:</span>
            <span className="text-[#E07A5F] font-bold">#{lastEntropyHex}</span>
          </div>
        )}
      </div>

      {/* Main Bright Showcase Frame */}
      <div className="relative w-full max-w-2xl">
        {/* Colorful Glow Aura behind card */}
        <div
          className={`absolute -inset-2 rounded-[38px] blur-2xl transition-all duration-700 pointer-events-none ${
            isWinner
              ? 'bg-gradient-to-r from-pink-300 via-amber-300 to-yellow-300 opacity-70'
              : isSpinning
              ? 'bg-gradient-to-r from-cyan-200 via-teal-200 to-pink-200 opacity-60 animate-pulse'
              : 'bg-gradient-to-r from-blue-100 via-pink-100 to-yellow-100 opacity-50'
          }`}
        />

        {/* 3D Showcase Card */}
        <div
          className={`relative rounded-[32px] p-8 sm:p-12 flex flex-col items-center justify-center transition-all duration-300 ${
            isWinner ? 'pastel-card-winner' : 'pastel-card'
          }`}
        >
          {/* Top Party Ribbon */}
          <div className="flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#FFE5EC] via-[#FFF0F5] to-[#E2EDF0] border-2 border-[#FFCAD4] shadow-sm mb-4">
            <PartyPopper size={16} className="text-[#FF6B8B]" />
            <span className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#44595B] font-extrabold">
              THE PAVILIONS PHUKET • SMALL LUCKY DRAW
            </span>
            <Gift size={16} className="text-[#FF8E53]" />
          </div>

          {/* Winner Celebration Message */}
          <div className="h-9 flex items-center justify-center mb-3">
            {isWinner ? (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-500/10 via-amber-400/20 to-pink-500/10 border-2 border-[#FFD166] px-5 py-1.5 rounded-full animate-bounce shadow-sm">
                <Sparkles size={18} className="text-[#FF8E53]" />
                <span className="text-sm sm:text-base font-black text-[#D9381E] tracking-wide">
                  🎉 ยินดีด้วยนะคะ! หมายเลขผู้โชคดี 🎉
                </span>
                <Sparkles size={18} className="text-[#FF8E53]" />
              </div>
            ) : isSpinning ? (
              <span className="text-sm text-[#3D5A80] font-bold animate-pulse flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B8B] animate-ping"></span>
                กำลังสุ่มหมายเลขจาก {remainingCount} สิทธิ์ที่เหลือ...
              </span>
            ) : (
              <span className="text-xs sm:text-sm text-gray-500 font-semibold tracking-wide">
                กดปุ่มสีส้ม "สุ่มรางวัล" หรือเคาะ Spacebar บนคีย์บอร์ดเพื่อลุ้นเลข
              </span>
            )}
          </div>

          {/* 3D Individual Slot Drum Reels */}
          <div className="relative my-4 flex items-center justify-center gap-3 sm:gap-6">
            {digits.map((digit, index) => (
              <div
                key={index}
                className={`pastel-digit-drum w-24 h-36 sm:w-32 sm:h-48 rounded-2xl sm:rounded-3xl flex items-center justify-center transition-all ${
                  isWinner
                    ? 'border-[#FFD166] shadow-[0_15px_30px_rgba(255,209,102,0.4)]'
                    : isSpinning
                    ? 'border-cyan-300 shadow-[0_10px_25px_rgba(168,218,220,0.4)]'
                    : 'border-gray-200'
                }`}
              >
                {/* Horizontal Center Reel Alignment Guide Line */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 sm:h-20 bg-gradient-to-r from-transparent via-[#E2EDF0]/50 to-transparent pointer-events-none" />

                {/* Digit Display */}
                <span
                  className={`font-mono font-black text-6xl sm:text-8xl select-none z-10 transition-all ${
                    isWinner
                      ? 'party-gradient-winner scale-110 drop-shadow-[0_8px_16px_rgba(255,107,139,0.3)]'
                      : isSpinning
                      ? 'text-[#698A9A] animate-slot-blur-light opacity-90'
                      : 'text-[#1E293B] drop-shadow-sm'
                  }`}
                >
                  {digit}
                </span>
              </div>
            ))}
          </div>

          {/* Subtext info */}
          <div className="mt-4 text-center">
            {isCompleted ? (
              <span className="text-sm font-extrabold text-rose-600 bg-rose-50 border-2 border-rose-200 px-4 py-1.5 rounded-full">
                การจับรางวัลเสร็จสิ้นครบทั้ง 205 รายการแล้วค่ะ
              </span>
            ) : isWinner ? (
              <span className="text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 border-2 border-emerald-200 px-4 py-1.5 rounded-full shadow-sm">
                ✓ ตัดออกจากโถสุ่มเรียบร้อย • พร้อมสุ่มรอบถัดไป
              </span>
            ) : null}
          </div>

          {/* Progress Bar Container */}
          <div className="w-full mt-6 pt-5 border-t-2 border-gray-100">
            <div className="flex justify-between items-center text-xs text-gray-600 mb-2 font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF8E53]"></span>
                จับไปแล้ว <strong className="text-[#2C3E50]">{totalCount - remainingCount}</strong> จาก {totalCount} รางวัล
              </span>
              <span className="text-[#E07A5F] font-mono font-black text-sm">{progressPercentage}%</span>
            </div>
            <div className="w-full h-3.5 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#A8DADC] via-[#FFD166] to-[#FF6B8B] transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Action Controls */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl">
        {/* Undo Button */}
        <button
          onClick={onUndo}
          disabled={!canUndo || isSpinning}
          title="กดย้อนกลับกรณีเผลอกดผิด หรือต้องการคืนเลขล่าสุดเข้าโถสุ่ม"
          className={`w-full sm:w-auto px-5 py-4 rounded-2xl flex items-center justify-center space-x-2 font-bold text-sm transition-all border-2 shadow-sm ${
            canUndo && !isSpinning
              ? 'bg-[#FFF0F3] hover:bg-[#FFE5EC] text-[#E05780] border-[#FFCAD4] hover:border-[#FF8FA3] active:scale-95'
              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
          }`}
        >
          <RotateCcw size={18} />
          <span>ย้อนกลับ (Undo)</span>
        </button>

        {/* Giant Party Spin Button */}
        <button
          onClick={onSpin}
          disabled={isSpinning || isCompleted}
          className={`flex-1 w-full sm:w-auto px-10 py-5 rounded-2xl font-black text-xl sm:text-2xl flex items-center justify-center space-x-3 transition-all ${
            isSpinning || isCompleted
              ? 'bg-gray-200 text-gray-400 border-2 border-gray-300 cursor-not-allowed'
              : 'party-btn-spin'
          }`}
        >
          <Play size={24} className={isSpinning ? 'animate-spin' : 'fill-current'} />
          <span>{isSpinning ? 'กำลังสุ่ม...' : isCompleted ? 'ครบทุกรางวัลแล้ว' : 'สุ่มรางวัล (SPIN)'}</span>
          <span className="hidden md:inline-block text-[11px] bg-white/30 text-white font-mono font-black px-2.5 py-0.5 rounded-lg shadow-sm">
            Spacebar
          </span>
        </button>

        {/* Number Matrix / Manual Override Button */}
        <button
          onClick={onOpenMatrix}
          disabled={isSpinning}
          title="เปิดดูเลข 1-205 ทั้งหมด หรือคลิกคืนเลขเข้าโถได้ด้วยตนเอง"
          className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-[#E8F8F5] hover:bg-[#D1F2EB] text-[#117A65] border-2 border-[#A3E4D7] font-bold text-sm flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-sm"
        >
          <SlidersHorizontal size={18} />
          <span>ผังเลข 1-205</span>
        </button>
      </div>

      {/* Speed Controller Pills */}
      <div className="mt-5 flex items-center space-x-2 text-xs text-gray-600 bg-white/80 border-2 border-gray-200 px-4 py-2 rounded-full shadow-sm">
        <span className="font-bold text-gray-700">จังหวะการลุ้น:</span>
        <button
          onClick={() => onChangeDuration(2000)}
          className={`px-3 py-1 rounded-xl transition-all font-bold ${
            spinDurationMs === 2000
              ? 'bg-[#FF8E53] text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:text-black border border-gray-200'
          }`}
        >
          ⚡ เร็ว (2s)
        </button>
        <button
          onClick={() => onChangeDuration(3500)}
          className={`px-3 py-1 rounded-xl transition-all font-bold ${
            spinDurationMs === 3500
              ? 'bg-[#FF8E53] text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:text-black border border-gray-200'
          }`}
        >
          ⏱️ มาตรฐาน (3.5s)
        </button>
        <button
          onClick={() => onChangeDuration(5000)}
          className={`px-3 py-1 rounded-xl transition-all font-bold ${
            spinDurationMs === 5000
              ? 'bg-[#FF8E53] text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:text-black border border-gray-200'
          }`}
        >
          🔥 ลุ้นระทึก (5s)
        </button>
      </div>
    </div>
  );
};
