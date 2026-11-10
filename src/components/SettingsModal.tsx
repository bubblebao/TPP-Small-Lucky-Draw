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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border-2 border-gray-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b-2 border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#FFF5EB] via-white to-[#F0F7F9]">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-2xl bg-[#F0F7F9] text-[#44595B] border-2 border-[#CBE3E7] shadow-sm">
              <Settings size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#2C3E50]">ตั้งค่าระบบ (Settings)</h2>
              <p className="text-xs text-gray-500 font-medium">ปรับแต่งการทำงานและข้อมูลของโปรแกรม</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto bg-white">
          {/* Total Numbers */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
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
              className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-2xl text-sm font-mono font-bold text-gray-900 focus:outline-none focus:border-[#698A9A] focus:bg-white"
            />
            <p className="text-[11px] text-gray-400 mt-1">ค่ามาตรฐานงานปัจจุบันคือ 205 หมายเลข (1–205)</p>
          </div>

          {/* Sound & Confetti Toggles */}
          <div className="space-y-3 pt-1">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border-2 border-gray-200 cursor-pointer hover:bg-gray-100/70 transition-all">
              <span className="text-xs font-bold text-gray-700">เปิดเอฟเฟกต์เสียงตื่นเต้น (Sound FX)</span>
              <input
                type="checkbox"
                checked={localSettings.soundEnabled}
                onChange={(e) => setLocalSettings({ ...localSettings, soundEnabled: e.target.checked })}
                className="w-4 h-4 accent-[#FF8E53] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border-2 border-gray-200 cursor-pointer hover:bg-gray-100/70 transition-all">
              <span className="text-xs font-bold text-gray-700">เปิดพลุกระดาษฉลองเมื่อออกรางวัล (Confetti)</span>
              <input
                type="checkbox"
                checked={localSettings.autoConfetti}
                onChange={(e) => setLocalSettings({ ...localSettings, autoConfetti: e.target.checked })}
                className="w-4 h-4 accent-[#FF8E53] rounded"
              />
            </label>
          </div>

          {/* Danger Zone: Reset All */}
          <div className="pt-4 border-t-2 border-gray-100">
            <h3 className="text-xs font-black text-rose-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertOctagon size={15} />
              รีเซ็ตข้อมูลทั้งหมด (Reset to Initial)
            </h3>
            <p className="text-xs text-gray-500 mb-3 font-medium">
              ล้างประวัติการจับรางวัลทั้งหมด และดึงเลข 1–{localSettings.totalNumbers} กลับเข้าสู่โถสุ่มใหม่ทั้งหมด
            </p>

            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-rose-200 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <RotateCcw size={14} />
                <span>รีเซ็ตระบบเริ่มต้นใหม่ทั้งหมด</span>
              </button>
            ) : (
              <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl space-y-2.5 shadow-sm">
                <p className="text-xs text-rose-800 font-bold">พิมพ์คำว่า <strong>RESET</strong> เพื่อยืนยันการล้างข้อมูล:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={resetConfirmText}
                    onChange={(e) => setResetConfirmText(e.target.value)}
                    placeholder="พิมพ์ RESET..."
                    className="flex-1 px-3.5 py-2 bg-white border-2 border-rose-300 rounded-xl text-xs text-gray-800 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleTriggerReset}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl transition-all shadow-sm"
                  >
                    ยืนยัน
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3.5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl transition-all"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-100 flex justify-end space-x-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-2xl text-xs font-bold text-gray-500 hover:text-gray-800 transition-all"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-2xl bg-[#2C3E50] hover:bg-[#1A252F] text-white font-black text-xs transition-all shadow-md flex items-center gap-1.5"
          >
            <Check size={14} />
            <span>บันทึกการตั้งค่า</span>
          </button>
        </div>
      </div>
    </div>
  );
};
