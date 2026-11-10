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
    <header className="w-full bg-[#0d1424]/85 border-b border-[#44595B]/60 backdrop-blur-xl sticky top-0 z-40 transition-all shadow-xl">
      {/* Subtle brand theme gradient accent stripe at top edge */}
      <div className="h-1 w-full bg-gradient-to-r from-[#44595B] via-[#698A9A] to-[#D4AF37]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-6">
          <PavilionsLogo size="md" />

          {/* Event Title Divider (Desktop) */}
          <div className="hidden lg:flex items-center space-x-3 pl-6 border-l border-white/10">
            <span className="text-xs uppercase tracking-widest text-[#698A9A] font-bold">Event</span>
            <h1 className="text-lg font-extrabold gold-gradient-title tracking-wider">
              SMALL LUCKY DRAW 2026
            </h1>
          </div>
        </div>

        {/* Center Live Indicator */}
        <div className="hidden md:flex items-center space-x-3 bg-[#162033]/90 border border-[#698A9A]/40 px-5 py-2 rounded-full shadow-inner">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs text-gray-300 font-medium">คงเหลือ:</span>
          <span className="text-base font-extrabold text-[#F5CE62] font-mono">{remainingCount}</span>
          <span className="text-xs text-gray-400">/ {totalCount} รางวัล</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'ปิดเสียง (Mute)' : 'เปิดเสียง (Unmute)'}
            className={`p-2.5 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-[#1b263b] border-[#F5CE62]/40 text-[#F5CE62] hover:bg-[#22304a] shadow-sm'
                : 'bg-[#0f172a] border-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Matrix / Inspect Pool */}
          <button
            onClick={onOpenMatrix}
            title="เปิดดูและจัดการเลข 1-205 (Pool Matrix)"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#1b263b] hover:bg-[#253552] border border-[#698A9A]/50 text-gray-200 hover:text-[#F5CE62] hover:border-[#F5CE62]/60 transition-all text-xs font-semibold shadow-sm"
          >
            <Grid size={16} />
            <span className="hidden sm:inline">โถสุ่มเลข</span>
          </button>

          {/* Rules / Conditions */}
          <button
            onClick={onOpenRules}
            title="เงื่อนไขและกติกาการจับรางวัล"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#1b263b] hover:bg-[#253552] border border-[#698A9A]/50 text-gray-200 hover:text-white transition-all text-xs font-semibold shadow-sm"
          >
            <FileText size={16} />
            <span className="hidden sm:inline">เงื่อนไข</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            title="ตั้งค่าระบบ"
            className="p-2.5 rounded-xl bg-[#1b263b] hover:bg-[#253552] border border-gray-700 text-gray-300 hover:text-white transition-all"
          >
            <Settings size={18} />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'ออกจากโหมดเต็มจอ' : 'แสดงเต็มจอ (Fullscreen Presentation)'}
            className="p-2.5 rounded-xl bg-[#1b263b] hover:bg-[#253552] border border-gray-700 text-gray-300 hover:text-[#F5CE62] transition-all"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};
