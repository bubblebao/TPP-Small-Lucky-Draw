import React, { useEffect } from 'react';
import { Play, RotateCcw, ShieldCheck, Sparkles, SlidersHorizontal, Gift, Award } from 'lucide-react';
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
    <div className="w-full flex flex-col items-center justify-center pt-2 pb-6 px-4 sm:px-6 relative">
      {/* Top Floating Trust Badge */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        <div className="flex items-center space-x-2 bg-[#121929]/80 border border-emerald-500/40 px-4 py-1.5 rounded-full text-xs text-gray-300 shadow-md">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span className="font-medium">ระบบสุ่มโปร่งใส 100% (CSPRNG Verified)</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold">FAIR PLAY</span>
        </div>

        {lastEntropyHex && (
          <div className="hidden sm:flex items-center space-x-1.5 bg-[#121929]/80 border border-[#F5CE62]/30 px-3.5 py-1.5 rounded-full text-xs font-mono text-gray-300 shadow-md">
            <span className="text-gray-400">Audit Hash:</span>
            <span className="text-[#F5CE62] font-bold">#{lastEntropyHex}</span>
          </div>
        )}
      </div>

      {/* Main Grand Stage Frame */}
      <div className="relative w-full max-w-2xl">
        {/* Radiant Ambient Spotlight Behind Box */}
        <div
          className={`absolute -inset-2 rounded-[36px] blur-2xl transition-all duration-700 pointer-events-none ${
            isWinner
              ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 opacity-80'
              : isSpinning
              ? 'bg-gradient-to-r from-cyan-400 via-yellow-200 to-amber-400 opacity-60 animate-pulse'
              : 'bg-[#D4AF37]/20 opacity-40'
          }`}
        />

        {/* 3D Showcase Box */}
        <div
          className={`relative rounded-[32px] p-8 sm:p-12 flex flex-col items-center justify-center transition-all duration-300 ${
            isWinner ? 'gold-stage-frame-active' : 'gold-stage-frame'
          }`}
        >
          {/* Top Stage Header Ribbon */}
          <div className="flex items-center space-x-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-[#1e2738] via-[#2c374d] to-[#1e2738] border border-[#F5CE62]/40 shadow-inner mb-4">
            <Gift size={14} className="text-[#F5CE62]" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#FFF4D0] font-bold">
              THE PAVILIONS PHUKET • SMALL LUCKY DRAW
            </span>
            <Award size={14} className="text-[#F5CE62]" />
          </div>

          {/* Winner Celebration Banner */}
          <div className="h-8 flex items-center justify-center mb-3">
            {isWinner ? (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border border-[#F5CE62] px-4 py-1 rounded-full animate-bounce">
                <Sparkles size={16} className="text-[#F5CE62]" />
                <span className="text-xs sm:text-sm font-extrabold text-[#FFF9E6] tracking-wide">
                  🎉 ยินดีด้วยค่ะ! หมายเลขผู้โชคดี 🎉
                </span>
                <Sparkles size={16} className="text-[#F5CE62]" />
              </div>
            ) : isSpinning ? (
              <span className="text-xs sm:text-sm text-[#8ba6b4] font-medium animate-pulse flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping"></span>
                กำลังสุ่มตัวเลขจาก {remainingCount} สิทธิ์ที่เหลือ...
              </span>
            ) : (
              <span className="text-xs text-gray-400 font-medium tracking-wide">
                กดปุ่ม "สุ่มรางวัล" หรือเคาะ Spacebar บนคีย์บอร์ดเพื่อลุ้นเลข
              </span>
            )}
          </div>

          {/* 3D Individual Slot Drum Reels */}
          <div className="relative my-4 flex items-center justify-center gap-3 sm:gap-5">
            {digits.map((digit, index) => (
              <div
                key={index}
                className={`digit-drum w-24 h-36 sm:w-32 sm:h-48 rounded-2xl sm:rounded-3xl flex items-center justify-center transition-all ${
                  isWinner
                    ? 'border-[#F5CE62] shadow-[0_0_25px_rgba(245,206,98,0.5)]'
                    : isSpinning
                    ? 'border-cyan-400/50 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                    : 'border-white/10'
                }`}
              >
                {/* Horizontal Center Reel Alignment Guide Line */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 sm:h-20 bg-white/[0.03] border-y border-white/[0.08] pointer-events-none" />

                {/* Digit Display */}
                <span
                  className={`font-mono font-black text-6xl sm:text-8xl select-none z-10 transition-all ${
                    isWinner
                      ? 'gold-text-glow scale-110 drop-shadow-[0_8px_16px_rgba(212,175,55,0.7)]'
                      : isSpinning
                      ? 'text-white animate-slot-blur opacity-90'
                      : 'text-gray-200 drop-shadow-md'
                  }`}
                >
                  {digit}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Subtext info */}
          <div className="mt-4 text-center">
            {isCompleted ? (
              <span className="text-sm font-bold text-rose-400">
                การจับรางวัลเสร็จสิ้นครบทั้ง 205 รายการแล้วค่ะ
              </span>
            ) : isWinner ? (
              <span className="text-xs sm:text-sm font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-3.5 py-1 rounded-full">
                ✓ ตัดออกจากโถสุ่มเรียบร้อย • พร้อมสุ่มรอบถัดไป
              </span>
            ) : null}
          </div>

          {/* Progress Bar Container */}
          <div className="w-full mt-6 pt-5 border-t border-white/10">
            <div className="flex justify-between items-center text-xs text-gray-300 mb-2 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F5CE62]"></span>
                จับไปแล้ว <strong className="text-white font-bold">{totalCount - remainingCount}</strong> จาก {totalCount} รางวัล
              </span>
              <span className="text-[#F5CE62] font-mono font-extrabold text-sm">{progressPercentage}%</span>
            </div>
            <div className="w-full h-3 bg-[#0a0f18] rounded-full overflow-hidden p-0.5 border border-white/15 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-[#F5CE62] to-amber-500 transition-all duration-500 shadow-md"
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
          className={`w-full sm:w-auto px-5 py-4 rounded-2xl flex items-center justify-center space-x-2 font-bold text-sm transition-all border ${
            canUndo && !isSpinning
              ? 'bg-[#1b263b] hover:bg-rose-950/60 text-gray-200 hover:text-rose-200 border-white/15 hover:border-rose-500/60 shadow-lg active:scale-95'
              : 'bg-gray-900/50 text-gray-600 border-gray-800 cursor-not-allowed opacity-50'
          }`}
        >
          <RotateCcw size={18} />
          <span>ย้อนกลับ (Undo)</span>
        </button>

        {/* 3D Giant Spin Button */}
        <button
          onClick={onSpin}
          disabled={isSpinning || isCompleted}
          className={`flex-1 w-full sm:w-auto px-10 py-5 rounded-2xl font-black text-xl sm:text-2xl flex items-center justify-center space-x-3 transition-all ${
            isSpinning || isCompleted
              ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
              : 'spin-btn-3d'
          }`}
        >
          <Play size={24} className={isSpinning ? 'animate-spin' : 'fill-current'} />
          <span>{isSpinning ? 'กำลังสุ่ม...' : isCompleted ? 'ครบทุกรางวัลแล้ว' : 'สุ่มรางวัล (SPIN)'}</span>
          <span className="hidden md:inline-block text-[11px] bg-black/25 text-black font-mono font-bold px-2 py-0.5 rounded-md shadow-sm">
            Spacebar
          </span>
        </button>

        {/* Number Matrix / Manual Override Button */}
        <button
          onClick={onOpenMatrix}
          disabled={isSpinning}
          title="เปิดดูเลข 1-205 ทั้งหมด หรือคลิกคืนเลขเข้าโถได้ด้วยตนเอง"
          className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-[#1b263b] hover:bg-[#253552] text-gray-200 hover:text-[#F5CE62] border border-white/15 hover:border-[#F5CE62]/50 font-bold text-sm flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-lg"
        >
          <SlidersHorizontal size={18} />
          <span>ผังเลข 1-205</span>
        </button>
      </div>

      {/* Speed Controller Pills */}
      <div className="mt-5 flex items-center space-x-2 text-xs text-gray-400 bg-[#121929]/70 border border-white/10 px-4 py-1.5 rounded-full shadow-inner">
        <span className="font-medium text-gray-300">จังหวะการลุ้น:</span>
        <button
          onClick={() => onChangeDuration(2000)}
          className={`px-3 py-1 rounded-lg transition-all font-semibold ${
            spinDurationMs === 2000
              ? 'bg-[#F5CE62] text-black shadow-md'
              : 'bg-[#1b263b] text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          ⚡ เร็ว (2s)
        </button>
        <button
          onClick={() => onChangeDuration(3500)}
          className={`px-3 py-1 rounded-lg transition-all font-semibold ${
            spinDurationMs === 3500
              ? 'bg-[#F5CE62] text-black shadow-md'
              : 'bg-[#1b263b] text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          ⏱️ มาตรฐาน (3.5s)
        </button>
        <button
          onClick={() => onChangeDuration(5000)}
          className={`px-3 py-1 rounded-lg transition-all font-semibold ${
            spinDurationMs === 5000
              ? 'bg-[#F5CE62] text-black shadow-md'
              : 'bg-[#1b263b] text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          🔥 ลุ้นระทึก (5s)
        </button>
      </div>
    </div>
  );
};
