import React, { useState } from 'react';
import { X, Settings, RotateCcw, AlertOctagon, Check } from 'lucide-react';
import type { LuckyDrawSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LuckyDrawSettings;
  onSaveSettings: (settings: LuckyDrawSettings) => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetAllData,
}) => {
  const [localSettings, setLocalSettings] = useState<LuckyDrawSettings>(settings);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  const handleTriggerReset = () => {
    if (resetConfirmText.trim().toUpperCase() === 'RESET') {
      onResetAllData();
      setShowResetConfirm(false);
      setResetConfirmText('');
      onClose();
    } else {
      alert('กรุณาพิมพ์คำว่า RESET ให้ถูกต้องเพื่อยืนยันค่ะ');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f172a] border border-[#F5CE62]/40 rounded-3xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#1e293b] via-[#111827] to-[#1e293b]">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-600/30 text-[#F5CE62] border border-[#F5CE62]/30">
              <Settings size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">ตั้งค่าระบบ (Settings)</h2>
              <p className="text-xs text-gray-400">ปรับแต่งการทำงานและข้อมูลของโปรแกรม</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto bg-[#080d18]">
          {/* Total Numbers */}
          <div>
            <label className="block text-xs font-bold text-gray-200 mb-1.5">
              จำนวนเลขรางวัลทั้งหมด (Total Lucky Numbers)
            </label>
            <input
              type="number"
              min="1"
              max="999"
              value={localSettings.totalNumbers}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, totalNumbers: Math.max(1, parseInt(e.target.value) || 1) })
              }
              className="w-full px-3.5 py-2.5 bg-[#162033] border border-white/15 rounded-xl text-sm font-mono font-bold text-white focus:outline-none focus:border-[#F5CE62]"
            />
            <p className="text-[11px] text-gray-400 mt-1">ค่ามาตรฐานงานปัจจุบันคือ 205 หมายเลข (1–205)</p>
          </div>

          {/* Sound & Confetti Toggles */}
          <div className="space-y-3 pt-1">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#121929] border border-white/10 cursor-pointer hover:border-white/20 transition-all">
              <span className="text-xs font-medium text-gray-200">เปิดเอฟเฟกต์เสียงตื่นเต้น (Sound FX)</span>
              <input
                type="checkbox"
                checked={localSettings.soundEnabled}
                onChange={(e) => setLocalSettings({ ...localSettings, soundEnabled: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#121929] border border-white/10 cursor-pointer hover:border-white/20 transition-all">
              <span className="text-xs font-medium text-gray-200">เปิดพลุกระดาษฉลองเมื่อออกรางวัล (Confetti)</span>
              <input
                type="checkbox"
                checked={localSettings.autoConfetti}
                onChange={(e) => setLocalSettings({ ...localSettings, autoConfetti: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </label>
          </div>

          {/* Danger Zone: Reset All */}
          <div className="pt-4 border-t border-white/10">
            <h3 className="text-xs font-black text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertOctagon size={15} />
              รีเซ็ตข้อมูลทั้งหมด (Reset to Initial)
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              ล้างประวัติการจับรางวัลทั้งหมด และดึงเลข 1–{localSettings.totalNumbers} กลับเข้าสู่โถสุ่มใหม่ทั้งหมด
            </p>

            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2.5 bg-rose-950/50 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <RotateCcw size={14} />
                <span>รีเซ็ตระบบเริ่มต้นใหม่ทั้งหมด</span>
              </button>
            ) : (
              <div className="p-3.5 bg-rose-950/70 border border-rose-500 rounded-2xl space-y-2.5 shadow-lg">
                <p className="text-xs text-rose-200 font-medium">พิมพ์คำว่า <strong>RESET</strong> เพื่อยืนยันการล้างข้อมูล:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={resetConfirmText}
                    onChange={(e) => setResetConfirmText(e.target.value)}
                    placeholder="พิมพ์ RESET..."
                    className="flex-1 px-3 py-2 bg-black/70 border border-rose-700 rounded-xl text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleTriggerReset}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-md"
                  >
                    ยืนยัน
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3.5 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium rounded-xl transition-all"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0d1424] border-t border-white/10 flex justify-end space-x-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition-all"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-black font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5"
          >
            <Check size={14} />
            <span>บันทึกการตั้งค่า</span>
          </button>
        </div>
      </div>
    </div>
  );
};
