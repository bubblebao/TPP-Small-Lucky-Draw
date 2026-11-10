import React from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, FileText, Grid, Settings } from 'lucide-react';
import { PavilionsLogo } from './PavilionsLogo';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenRules: () => void;
  onOpenMatrix: () => void;
  onOpenSettings: () => void;
  remainingCount: number;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  isFullscreen,
  onToggleFullscreen,
  onOpenRules,
  onOpenMatrix,
  onOpenSettings,
  remainingCount,
  totalCount,
}) => {
  return (
    <header className="w-full bg-white/95 border-b-2 border-[#E2EDF0] backdrop-blur-md sticky top-0 z-40 transition-all shadow-sm">
      {/* Festive Pastel Party Top Accent Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#698A9A] via-[#FFB4A2] via-[#FFD166] to-[#A8DADC]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Brand & Logo */}
        <div className="flex items-center space-x-5 shrink-0">
          <PavilionsLogo />

          {/* Event Title Divider (Desktop) */}
          <div className="hidden xl:flex items-center space-x-2.5 pl-5 border-l-2 border-gray-200 whitespace-nowrap">
            <span className="text-base font-black party-gradient-title">
              🎉 SMALL LUCKY DRAW 2026
            </span>
          </div>
        </div>

        {/* Center: Live Remaining Pill */}
        <div className="flex items-center space-x-2.5 bg-[#F0F7F9] border-2 border-[#CBE3E7] px-4 py-2 rounded-full shadow-sm shrink-0 whitespace-nowrap">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs text-gray-600 font-bold">คงเหลือ:</span>
          <span className="text-base font-black text-[#2C3E50] font-mono">{remainingCount}</span>
          <span className="text-xs text-gray-500 font-semibold">/ {totalCount} รางวัล</span>
        </div>

        {/* Right: Action Controls with guaranteed whitespace-nowrap */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'ปิดเสียง (Mute)' : 'เปิดเสียง (Unmute)'}
            className={`p-2.5 rounded-2xl border-2 transition-all shadow-sm shrink-0 ${
              soundEnabled
                ? 'bg-[#FFF9E6] border-[#FFEAA7] text-[#D97706] hover:bg-[#FFF3B0]'
                : 'bg-gray-100 border-gray-200 text-gray-400 hover:text-gray-700'
            }`}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Matrix / Inspect Pool */}
          <button
            onClick={onOpenMatrix}
            title="เปิดดูและจัดการเลข 1-205 (Pool Matrix)"
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-[#E8F8F5] hover:bg-[#D1F2EB] border-2 border-[#A3E4D7] text-[#117A65] transition-all text-xs font-bold shadow-sm whitespace-nowrap shrink-0 active:scale-95"
          >
            <Grid size={16} />
            <span className="hidden sm:inline">โถสุ่มเลข</span>
          </button>

          {/* Rules / Conditions */}
          <button
            onClick={onOpenRules}
            title="เงื่อนไขและกติกาการจับรางวัล"
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-[#FFF0F3] hover:bg-[#FFE5EC] border-2 border-[#FFCAD4] text-[#E05780] transition-all text-xs font-bold shadow-sm whitespace-nowrap shrink-0 active:scale-95"
          >
            <FileText size={16} />
            <span className="hidden sm:inline">เงื่อนไข</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            title="ตั้งค่าระบบ"
            className="p-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 text-gray-600 hover:text-gray-900 transition-all shadow-sm shrink-0"
          >
            <Settings size={18} />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'ออกจากโหมดเต็มจอ' : 'แสดงเต็มจอ (Fullscreen Presentation)'}
            className="p-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 text-gray-600 hover:text-[#698A9A] transition-all shadow-sm shrink-0"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};
