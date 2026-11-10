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
    <div className="w-full flex flex-col items-center justify-start h-full">
      {/* Top Cheerful Party Blessing Badge (Replaced defensive badge) */}
      <div className="mb-4 flex items-center justify-center">
        <div className="flex items-center space-x-2 bg-gradient-to-r from-[#FFF5EB] via-white to-[#FFE5EC] border-2 border-[#FFCAD4] px-5 py-1.5 rounded-full shadow-sm">
          <Sparkles size={16} className="text-[#FF8E53] animate-spin-slow" />
          <span className="text-xs sm:text-sm font-black text-[#D9381E] tracking-wide">
            ✨ ขอให้ทุกคนโชคดีในการจับรางวัลนะคะ ✨
          </span>
          <Sparkles size={16} className="text-[#FF8E53] animate-spin-slow" />
        </div>
      </div>

      {/* Main Integrated Showcase Card */}
      <div className="relative w-full flex-1 flex flex-col">
        {/* Glow Aura behind card */}
        <div
          className={`absolute -inset-1.5 rounded-[36px] blur-xl transition-all duration-700 pointer-events-none ${
            isWinner
              ? 'bg-gradient-to-r from-pink-300 via-amber-300 to-yellow-300 opacity-60'
              : isSpinning
              ? 'bg-gradient-to-r from-cyan-200 via-teal-200 to-pink-200 opacity-50 animate-pulse'
              : 'bg-gradient-to-r from-blue-100 via-pink-100 to-yellow-100 opacity-40'
          }`}
        />

        {/* Unified Card Container */}
        <div
          className={`relative rounded-[32px] p-6 sm:p-7 flex flex-col justify-between flex-1 transition-all duration-300 ${
            isWinner ? 'pastel-card-winner' : 'pastel-card'
          }`}
        >
          {/* Card Top: Ribbon & Status */}
          <div className="flex flex-col items-center">
            {/* Party Ribbon */}
            <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FFE5EC] via-[#FFF0F5] to-[#E2EDF0] border-2 border-[#FFCAD4] shadow-sm mb-3">
              <PartyPopper size={15} className="text-[#FF6B8B]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#44595B] font-extrabold">
                THE PAVILIONS PHUKET • SMALL LUCKY DRAW
              </span>
              <Gift size={15} className="text-[#FF8E53]" />
            </div>

            {/* Status Message */}
            <div className="h-8 flex items-center justify-center">
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
                  กำลังหมุนเรียงลำดับ... กำลังชะลอแตะเบรกเข้าสู่เลขรางวัล!
                </span>
              ) : (
                <span className="text-xs text-gray-500 font-semibold tracking-wide">
                  กดปุ่มสีส้ม "สุ่มรางวัล" หรือเคาะ Spacebar บนคีย์บอร์ด
                </span>
              )}
            </div>

            {/* 3D Hero Slot Drums (Large & Dominant Focal Point) */}
            <div className="relative my-4 sm:my-6 flex items-center justify-center gap-4 sm:gap-6 md:gap-8 w-full">
              {digits.map((digit, index) => (
                <div
                  key={index}
                  className={`pastel-digit-drum w-28 h-44 sm:w-36 sm:h-56 md:w-44 md:h-64 lg:w-48 lg:h-72 xl:w-56 xl:h-80 rounded-3xl sm:rounded-[36px] flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
                    isWinner
                      ? 'border-4 border-[#FFD166] shadow-[0_20px_45px_rgba(255,209,102,0.55)] scale-105'
                      : isSpinning
                      ? 'border-4 border-cyan-300 shadow-[0_12px_30px_rgba(168,218,220,0.5)] scale-[1.02]'
                      : 'border-3 border-gray-200/90 shadow-md hover:border-gray-300'
                  }`}
                >
                  {/* Subtle 3D Cylindrical drum light reflection */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 sm:h-24 bg-gradient-to-r from-transparent via-[#E2EDF0]/60 to-transparent pointer-events-none" />
                  <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />

                  <span
                    className={`font-mono font-black text-7xl sm:text-8xl md:text-9xl xl:text-[10rem] select-none z-10 transition-all ${
                      isWinner
                        ? 'party-gradient-winner scale-110 drop-shadow-[0_8px_16px_rgba(255,107,139,0.35)]'
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

            {/* Winner Badge or Empty Info */}
            <div className="h-6 flex items-center justify-center">
              {isCompleted ? (
                <span className="text-xs font-black text-rose-600 bg-rose-50 border-2 border-rose-200 px-3 py-0.5 rounded-full">
                  จับรางวัลเสร็จสิ้นครบทั้ง 205 รายการแล้วค่ะ
                </span>
              ) : isWinner ? (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full">
                  ✓ ตัดออกจากโถสุ่มเรียบร้อย • พร้อมสุ่มรอบถัดไป
                </span>
              ) : null}
            </div>

            {/* Progress Bar */}
            <div className="w-full mt-3 pt-3 border-t-2 border-gray-100">
              <div className="flex justify-between items-center text-xs text-gray-600 mb-1.5 font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF8E53]"></span>
                  จับไปแล้ว <strong className="text-[#2C3E50]">{totalCount - remainingCount}</strong> จาก {totalCount} รางวัล
                </span>
                <span className="text-[#E07A5F] font-mono font-black">{progressPercentage}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#A8DADC] via-[#FFD166] to-[#FF6B8B] transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Integrated Action Controls at Bottom of Card */}
          <div className="mt-5 pt-4 border-t-2 border-gray-100 flex flex-col gap-3">
            {/* Buttons Row */}
            <div className="flex items-center justify-center gap-3 w-full">
              {/* Undo Button */}
              <button
                onClick={onUndo}
                disabled={!canUndo || isSpinning}
                title="กดย้อนกลับกรณีเผลอกดผิด หรือต้องการคืนเลขล่าสุดเข้าโถสุ่ม"
                className={`px-4 sm:px-5 py-4 rounded-2xl sm:rounded-3xl flex items-center justify-center space-x-1.5 font-bold text-xs sm:text-base transition-all border-2 shadow-sm shrink-0 ${
                  canUndo && !isSpinning
                    ? 'bg-[#FFF0F3] hover:bg-[#FFE5EC] text-[#E05780] border-[#FFCAD4] hover:border-[#FF8FA3] active:scale-95'
                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                }`}
              >
                <RotateCcw size={18} />
                <span>ย้อนกลับ</span>
              </button>

              {/* Giant Party Spin Button (The Hero Action) */}
              <button
                onClick={onSpin}
                disabled={isSpinning || isCompleted}
                className={`flex-1 py-4 sm:py-5 px-6 sm:px-8 rounded-2xl sm:rounded-3xl font-black text-xl sm:text-2xl flex items-center justify-center space-x-3 transition-all shadow-md hover:shadow-xl active:scale-[0.98] ${
                  isSpinning || isCompleted
                    ? 'bg-gray-200 text-gray-400 border-2 border-gray-300 cursor-not-allowed'
                    : 'party-btn-spin'
                }`}
              >
                <Play size={26} className={isSpinning ? 'animate-spin' : 'fill-current'} />
                <span>{isSpinning ? 'กำลังสุ่ม...' : isCompleted ? 'ครบทุกรางวัลแล้ว' : 'สุ่มรางวัล (SPIN)'}</span>
                <span className="hidden sm:inline-block text-[11px] bg-white/30 text-white font-mono font-black px-2.5 py-0.5 rounded-md shadow-sm">
                  Spacebar
                </span>
              </button>

              {/* Number Matrix Button */}
              <button
                onClick={onOpenMatrix}
                disabled={isSpinning}
                title="เปิดดูเลข 1-205 ทั้งหมด หรือคลิกคืนเลขเข้าโถได้ด้วยตนเอง"
                className="px-4 sm:px-5 py-4 rounded-2xl sm:rounded-3xl bg-[#E8F8F5] hover:bg-[#D1F2EB] text-[#117A65] border-2 border-[#A3E4D7] font-bold text-xs sm:text-base flex items-center justify-center space-x-1.5 transition-all active:scale-95 shadow-sm shrink-0"
              >
                <SlidersHorizontal size={18} />
                <span>ผังเลข</span>
              </button>
            </div>

            {/* Speed Controller Pills inside the card */}
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-600 bg-gray-50 border border-gray-200 py-1.5 px-3 rounded-full shadow-inner">
              <span className="font-bold text-gray-600 text-[11px]">จังหวะ:</span>
              <button
                onClick={() => onChangeDuration(3000)}
                className={`px-3 py-1 rounded-xl transition-all font-bold text-[11px] ${
                  spinDurationMs <= 3500
                    ? 'bg-[#FF8E53] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:text-black border border-gray-200'
                }`}
              >
                ⚡ เร็ว (3s)
              </button>
              <button
                onClick={() => onChangeDuration(5000)}
                className={`px-3 py-1 rounded-xl transition-all font-bold text-[11px] ${
                  spinDurationMs > 3500 && spinDurationMs <= 5500
                    ? 'bg-[#FF8E53] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:text-black border border-gray-200'
                }`}
              >
                ⏱️ มาตรฐาน (5s)
              </button>
              <button
                onClick={() => onChangeDuration(7000)}
                className={`px-3 py-1 rounded-xl transition-all font-bold text-[11px] ${
                  spinDurationMs > 5500
                    ? 'bg-[#FF8E53] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:text-black border border-gray-200'
                }`}
              >
                🔥 ลุ้นระทึก (7s)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
