import React, { useEffect } from 'react';
import { Play, RotateCcw, Sparkles, SlidersHorizontal, Gift, PartyPopper } from 'lucide-react';
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
    <div className="w-full flex flex-col items-center justify-center p-0 relative">
      {/* Top Event Greeting Badge */}
      <div className="flex items-center justify-center mb-2.5">
        <div className="flex items-center space-x-2 bg-white/95 border-2 border-[#FFCAD4] px-4 py-1 rounded-full text-xs text-[#44595B] shadow-sm font-bold">
          <Sparkles size={14} className="text-[#FF8E53]" />
          <span>ขอให้ทุกคนโชคดี ได้รับของขวัญถูกใจในงาน Small Lucky Draw นะคะ</span>
          <Gift size={14} className="text-[#FF8E53]" />
        </div>
      </div>

      {/* Main Bright Showcase Frame */}
      <div className="relative w-full max-w-xl">
        {/* Colorful Glow Aura behind card */}
        <div
          className={`absolute -inset-1.5 rounded-[32px] blur-xl transition-all duration-700 pointer-events-none ${
            isWinner
              ? 'bg-gradient-to-r from-pink-300 via-amber-300 to-yellow-300 opacity-70'
              : isSpinning
              ? 'bg-gradient-to-r from-cyan-200 via-teal-200 to-pink-200 opacity-60 animate-pulse'
              : 'bg-gradient-to-r from-blue-100 via-pink-100 to-yellow-100 opacity-50'
          }`}
        />

        {/* 3D Showcase Card */}
        <div
          className={`relative rounded-[28px] p-4 sm:p-6 flex flex-col items-center justify-center transition-all duration-300 ${
            isWinner ? 'pastel-card-winner' : 'pastel-card'
          }`}
        >
          {/* Top Party Ribbon */}
          <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FFE5EC] via-[#FFF0F5] to-[#E2EDF0] border-2 border-[#FFCAD4] shadow-sm mb-2.5">
            <PartyPopper size={14} className="text-[#FF6B8B]" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[#44595B] font-extrabold">
              THE PAVILIONS PHUKET • SMALL LUCKY DRAW
            </span>
            <Gift size={14} className="text-[#FF8E53]" />
          </div>

          {/* Winner Celebration Message */}
          <div className="h-7 flex items-center justify-center mb-2">
            {isWinner ? (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-500/10 via-amber-400/20 to-pink-500/10 border-2 border-[#FFD166] px-4 py-1 rounded-full animate-bounce shadow-sm">
                <Sparkles size={16} className="text-[#FF8E53]" />
                <span className="text-xs sm:text-sm font-black text-[#D9381E] tracking-wide">
                  🎉 ยินดีด้วยนะคะ! หมายเลขผู้โชคดี 🎉
                </span>
                <Sparkles size={16} className="text-[#FF8E53]" />
              </div>
            ) : isSpinning ? (
              <span className="text-xs sm:text-sm text-[#E07A5F] font-black animate-pulse flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF6B8B] animate-ping"></span>
                กำลังวิ่งหมุนเรียงลำดับ 1–{totalCount}... กำลังชะลอเข้าสู่เลขผู้โชคดี!
              </span>
            ) : (
              <span className="text-xs text-gray-500 font-semibold tracking-wide">
                กดปุ่มสีส้ม "สุ่มรางวัล" หรือเคาะ Spacebar บนคีย์บอร์ดเพื่อลุ้นเลข
              </span>
            )}
          </div>

          {/* 3D Individual Slot Drum Reels */}
          <div className="relative my-2 flex items-center justify-center gap-2.5 sm:gap-4">
            {digits.map((digit, index) => (
              <div
                key={index}
                className={`pastel-digit-drum w-20 h-28 sm:w-24 sm:h-34 lg:w-28 lg:h-38 rounded-2xl flex items-center justify-center transition-all ${
                  isWinner
                    ? 'border-[#FFD166] shadow-[0_10px_25px_rgba(255,209,102,0.4)]'
                    : isSpinning
                    ? 'border-cyan-300 shadow-[0_8px_20px_rgba(168,218,220,0.4)]'
                    : 'border-gray-200'
                }`}
              >
                {/* Horizontal Center Reel Alignment Guide Line */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 sm:h-16 bg-gradient-to-r from-transparent via-[#E2EDF0]/50 to-transparent pointer-events-none" />

                {/* Digit Display */}
                <span
                  className={`font-mono font-black text-5xl sm:text-6xl lg:text-7xl select-none z-10 transition-all ${
                    isWinner
                      ? 'party-gradient-winner scale-105 drop-shadow-[0_6px_12px_rgba(255,107,139,0.3)]'
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
          <div className="mt-2 text-center h-6 flex items-center justify-center">
            {isCompleted ? (
              <span className="text-xs sm:text-sm font-extrabold text-rose-600 bg-rose-50 border-2 border-rose-200 px-3 py-1 rounded-full">
                การจับรางวัลเสร็จสิ้นครบทั้ง 205 รายการแล้วค่ะ
              </span>
            ) : isWinner ? (
              <span className="text-[11px] sm:text-xs font-bold text-emerald-800 bg-emerald-50 border-2 border-emerald-200 px-3 py-0.5 rounded-full shadow-sm">
                ✓ ตัดออกจากโถสุ่มเรียบร้อย • พร้อมสุ่มรอบถัดไป
              </span>
            ) : null}
          </div>

          {/* Progress Bar Container */}
          <div className="w-full mt-3 pt-2.5 border-t-2 border-gray-100">
            <div className="flex justify-between items-center text-[11px] text-gray-600 mb-1.5 font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF8E53]"></span>
                จับไปแล้ว <strong className="text-[#2C3E50]">{totalCount - remainingCount}</strong> จาก {totalCount} รางวัล
              </span>
              <span className="text-[#E07A5F] font-mono font-black">{progressPercentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#A8DADC] via-[#FFD166] to-[#FF6B8B] transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Action Controls */}
      <div className="mt-3.5 sm:mt-4 flex flex-row items-center justify-center gap-3 w-full max-w-xl">
        {/* Undo Button */}
        <button
          onClick={onUndo}
          disabled={!canUndo || isSpinning}
          title="กดย้อนกลับกรณีเผลอกดผิด หรือต้องการคืนเลขล่าสุดเข้าโถสุ่ม"
          className={`px-4 py-3 rounded-2xl flex items-center justify-center space-x-1.5 font-bold text-xs sm:text-sm transition-all border-2 shadow-sm ${
            canUndo && !isSpinning
              ? 'bg-[#FFF0F3] hover:bg-[#FFE5EC] text-[#E05780] border-[#FFCAD4] hover:border-[#FF8FA3] active:scale-95'
              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
          }`}
        >
          <RotateCcw size={16} />
          <span>ย้อนกลับ</span>
        </button>

        {/* Giant Party Spin Button */}
        <button
          onClick={onSpin}
          disabled={isSpinning || isCompleted}
          className={`flex-1 px-7 py-3.5 sm:py-4 rounded-2xl font-black text-lg sm:text-xl flex items-center justify-center space-x-2.5 transition-all ${
            isSpinning || isCompleted
              ? 'bg-gray-200 text-gray-400 border-2 border-gray-300 cursor-not-allowed'
              : 'party-btn-spin'
          }`}
        >
          <Play size={20} className={isSpinning ? 'animate-spin' : 'fill-current'} />
          <span>{isSpinning ? 'กำลังสุ่ม...' : isCompleted ? 'ครบทุกรางวัลแล้ว' : 'สุ่มรางวัล (SPIN)'}</span>
          <span className="hidden md:inline-block text-[10px] bg-white/30 text-white font-mono font-black px-2 py-0.5 rounded-lg shadow-sm">
            Spacebar
          </span>
        </button>

        {/* Number Matrix / Manual Override Button */}
        <button
          onClick={onOpenMatrix}
          disabled={isSpinning}
          title="เปิดดูเลข 1-205 ทั้งหมด หรือคลิกคืนเลขเข้าโถได้ด้วยตนเอง"
          className="px-4 py-3 rounded-2xl bg-[#E8F8F5] hover:bg-[#D1F2EB] text-[#117A65] border-2 border-[#A3E4D7] font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all active:scale-95 shadow-sm"
        >
          <SlidersHorizontal size={16} />
          <span>ผังเลข 1-205</span>
        </button>
      </div>

      {/* Speed Controller Pills */}
      <div className="mt-2.5 sm:mt-3 flex items-center space-x-2 text-xs text-gray-600 bg-white/80 border-2 border-gray-200 px-3.5 py-1.5 rounded-full shadow-sm">
        <span className="font-bold text-gray-700 text-[11px]">จังหวะการลุ้น:</span>
        <button
          onClick={() => onChangeDuration(3000)}
          className={`px-3 py-0.5 rounded-xl transition-all font-bold text-[11px] ${
            spinDurationMs <= 3500
              ? 'bg-[#FF8E53] text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:text-black border border-gray-200'
          }`}
        >
          ⚡ เร็ว (3s)
        </button>
        <button
          onClick={() => onChangeDuration(5000)}
          className={`px-3 py-0.5 rounded-xl transition-all font-bold text-[11px] ${
            spinDurationMs > 3500 && spinDurationMs <= 5500
              ? 'bg-[#FF8E53] text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:text-black border border-gray-200'
          }`}
        >
          ⏱️ มาตรฐาน (5s)
        </button>
        <button
          onClick={() => onChangeDuration(7000)}
          className={`px-3 py-0.5 rounded-xl transition-all font-bold text-[11px] ${
            spinDurationMs > 5500
              ? 'bg-[#FF8E53] text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:text-black border border-gray-200'
          }`}
        >
          🔥 ลุ้นระทึก (7s)
        </button>
      </div>
    </div>
  );
};
