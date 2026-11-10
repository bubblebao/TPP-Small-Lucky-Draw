import { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { Stage } from './components/Stage';
import { HistoryLog } from './components/HistoryLog';
import { NumberMatrixModal } from './components/NumberMatrixModal';
import { RulesModal } from './components/RulesModal';
import { SettingsModal } from './components/SettingsModal';
import type { DrawRecord, DrawState, LuckyDrawSettings } from './types';
import {
  loadSavedPool,
  savePool,
  loadSavedHistory,
  saveHistory,
  loadSettings,
  saveSettings,
  clearAllStorage,
} from './utils/storage';
import { drawFromPool } from './utils/fairRandom';
import { soundFx } from './utils/soundEffects';
import { fireCelebrationConfetti } from './utils/confetti';

export function App() {
  const [settings, setSettings] = useState<LuckyDrawSettings>(() => loadSettings());
  const [pool, setPool] = useState<number[]>(() => loadSavedPool(settings.totalNumbers));
  const [history, setHistory] = useState<DrawRecord[]>(() => loadSavedHistory());

  const [drawState, setDrawState] = useState<DrawState>('IDLE');
  const [displayNumber, setDisplayNumber] = useState<number | null>(() => {
    const savedHistory = loadSavedHistory();
    return savedHistory.length > 0 ? savedHistory[0].number : null;
  });

  // Modal states
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync sound settings with SoundManager
  useEffect(() => {
    soundFx.setMuted(!settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Fullscreen toggle handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Main Spin Handler: Randomized Starting Point + Full 205-Cycle Guarantee + Approaching Deceleration (3s / 5s / 7s)
  const handleSpin = useCallback(() => {
    if (pool.length === 0 || drawState === 'SPINNING') return;

    // 1. Sort pool ascending to ensure strict sequential order
    const sortedPool = [...pool].sort((a, b) => a - b);
    const poolLen = sortedPool.length;

    // 2. Determine winner securely using CSPRNG
    const { picked: winnerNumber, entropyHex } = drawFromPool(sortedPool);
    const targetIndex = sortedPool.indexOf(winnerNumber);

    // 3. Randomize starting point organically on every spin!
    const startIndex = Math.floor(Math.random() * poolLen);

    // 4. Full Cycle Guarantee: Must cycle through ALL numbers in the pool at least once!
    const duration = settings.spinDurationMs; // 3000, 5000, 7000
    let minLaps = 1;

    if (duration >= 6500) {
      // 🔥 7s: 2 full cycles (or 3 for smaller pools)
      minLaps = poolLen >= 150 ? 2 : 3;
    } else if (duration >= 4500) {
      // ⏱️ 5s: 1-2 full cycles
      minLaps = poolLen >= 150 ? 1 : 2;
    } else {
      // ⚡ 3s: 1 full cycle
      minLaps = 1;
    }

    const distance = (targetIndex - startIndex + poolLen) % poolLen;
    const totalSteps = minLaps * poolLen + distance;

    // Deceleration steps count calibrated for 3s / 5s / 7s
    let decelStepsCount = 14;
    let decelDurationTarget = 1800;

    if (duration <= 3500) {
      // 3s: snappy 11-step deceleration (~1100ms)
      decelStepsCount = Math.min(11, Math.max(6, Math.floor(totalSteps * 0.12)));
      decelDurationTarget = 1100;
    } else if (duration >= 6500) {
      // 7s: long suspenseful 18-step deceleration (~2400ms)
      decelStepsCount = Math.min(18, Math.max(10, Math.floor(totalSteps * 0.16)));
      decelDurationTarget = 2400;
    } else {
      // 5s: standard 14-step deceleration (~1800ms)
      decelStepsCount = Math.min(14, Math.max(8, Math.floor(totalSteps * 0.14)));
      decelDurationTarget = 1800;
    }

    const fastStepsCount = Math.max(1, totalSteps - decelStepsCount);
    const fastDelay = Math.max(7, Math.floor((duration - decelDurationTarget) / fastStepsCount));

    setDrawState('SPINNING');

    let currentStep = 0;

    const executeNextStep = () => {
      const stepIndex = (startIndex + currentStep) % poolLen;
      const currentNumber = sortedPool[stepIndex];
      setDisplayNumber(currentNumber);

      const remainingSteps = totalSteps - currentStep;

      // Sound FX: Smooth wheel clicker during fast full cycle, individual ticks during deceleration
      if (remainingSteps <= decelStepsCount) {
        soundFx.playTick(1.0 + (decelStepsCount - remainingSteps) * 0.08);
      } else if (currentStep % 4 === 0) {
        soundFx.playTick(0.9);
      }

      if (currentStep >= totalSteps) {
        // Reached the winner in full sequential cycle on target time!
        setDisplayNumber(winnerNumber);
        setDrawState('WINNER');

        // Update pool and history
        const newPool = pool.filter((n) => n !== winnerNumber);
        setPool(newPool);
        savePool(newPool);

        const newRecord: DrawRecord = {
          id: `${Date.now()}-${winnerNumber}`,
          sequence: history.length + 1,
          number: winnerNumber,
          timestamp: new Date().toLocaleTimeString('th-TH', { hour12: false }),
          entropyHex,
        };

        const newHistory = [newRecord, ...history];
        setHistory(newHistory);
        saveHistory(newHistory);

        // Winner celebration
        soundFx.playWinnerFanfare();
        if (settings.autoConfetti) {
          fireCelebrationConfetti();
        }
        return;
      }

      // Deceleration curve for the final stretch into the winner
      let delay = fastDelay;

      if (remainingSteps <= decelStepsCount) {
        const factor = (decelStepsCount + 1 - remainingSteps) / decelStepsCount; // 0.1 to 1.0
        const maxDecelDelay = duration >= 6500 ? 550 : duration <= 3500 ? 380 : 460;
        delay = Math.round(fastDelay + Math.pow(factor, 2.4) * (maxDecelDelay - fastDelay));
      }

      currentStep++;
      spinTimerRef.current = setTimeout(executeNextStep, delay);
    };

    executeNextStep();
  }, [pool, drawState, settings.spinDurationMs, settings.autoConfetti, history]);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
    };
  }, []);

  // Undo Latest Draw
  const handleUndoLatest = () => {
    if (history.length === 0 || drawState === 'SPINNING') return;

    const [latestRecord, ...remainingHistory] = history;
    const numberToRestore = latestRecord.number;

    const newPool = [...pool, numberToRestore].sort((a, b) => a - b);
    setPool(newPool);
    savePool(newPool);

    setHistory(remainingHistory);
    saveHistory(remainingHistory);

    setDisplayNumber(remainingHistory.length > 0 ? remainingHistory[0].number : null);
    setDrawState('IDLE');

    soundFx.playUndo();
  };

  // Restore specific number (from History)
  const handleRestoreSpecific = (record: DrawRecord) => {
    const confirmRestore = window.confirm(
      `ต้องการดึงหมายเลข #${record.number} (ลำดับที่ ${record.sequence}) กลับเข้าสู่โถสุ่มหรือไม่คะ?`
    );
    if (!confirmRestore) return;

    const newHistory = history.filter((h) => h.id !== record.id);
    const newPool = [...pool, record.number].sort((a, b) => a - b);

    setPool(newPool);
    savePool(newPool);
    setHistory(newHistory);
    saveHistory(newHistory);

    if (displayNumber === record.number) {
      setDisplayNumber(newHistory.length > 0 ? newHistory[0].number : null);
      setDrawState('IDLE');
    }

    soundFx.playUndo();
  };

  // Toggle number status directly from Matrix
  const handleToggleNumberFromMatrix = (num: number, currentStatus: 'IN_POOL' | 'DRAWN') => {
    if (currentStatus === 'DRAWN') {
      const confirmReturn = window.confirm(`ต้องการนำหมายเลข #${num} คืนกลับเข้าสู่โถสุ่มหรือไม่คะ?`);
      if (!confirmReturn) return;

      const newHistory = history.filter((h) => h.number !== num);
      const newPool = [...pool, num].sort((a, b) => a - b);

      setPool(newPool);
      savePool(newPool);
      setHistory(newHistory);
      saveHistory(newHistory);

      if (displayNumber === num) {
        setDisplayNumber(newHistory.length > 0 ? newHistory[0].number : null);
        setDrawState('IDLE');
      }
      soundFx.playUndo();
    } else {
      const confirmDraw = window.confirm(
        `ต้องการกำหนดให้หมายเลข #${num} เป็นผู้ได้รับรางวัลในรอบนี้ทันทีหรือไม่คะ?`
      );
      if (!confirmDraw) return;

      const newPool = pool.filter((n) => n !== num);
      const newRecord: DrawRecord = {
        id: `${Date.now()}-${num}`,
        sequence: history.length + 1,
        number: num,
        timestamp: new Date().toLocaleTimeString('th-TH', { hour12: false }),
        entropyHex: 'MANUAL',
      };

      const newHistory = [newRecord, ...history];

      setPool(newPool);
      savePool(newPool);
      setHistory(newHistory);
      saveHistory(newHistory);

      setDisplayNumber(num);
      setDrawState('WINNER');

      soundFx.playWinnerFanfare();
      if (settings.autoConfetti) {
        fireCelebrationConfetti();
      }
    }
  };

  // Reset all data
  const handleResetAllData = () => {
    const { pool: freshPool, history: freshHistory } = clearAllStorage(settings.totalNumbers);
    setPool(freshPool);
    setHistory(freshHistory);
    setDisplayNumber(null);
    setDrawState('IDLE');
    soundFx.playUndo();
  };

  // Save settings update
  const handleSaveSettings = (newSettings: LuckyDrawSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);

    if (history.length === 0 && newSettings.totalNumbers !== settings.totalNumbers) {
      const newPool = Array.from({ length: newSettings.totalNumbers }, (_, i) => i + 1);
      setPool(newPool);
      savePool(newPool);
    }
  };

  const drawnNumberList = history.map((h) => h.number);

  return (
    <div className="pastel-party-bg text-[#2D3748] min-h-screen flex flex-col justify-between relative selection:bg-[#FFD166] selection:text-[#2D3748]">
      {/* Ambient Floating Pastel Party Confetti Shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-10 w-4 h-4 rounded-full bg-[#FFCAD4] animate-confetti-1" />
        <div className="absolute top-1/3 right-16 w-5 h-5 rounded-lg rotate-45 bg-[#A8DADC] animate-confetti-2" />
        <div className="absolute top-2/3 left-1/4 w-4 h-4 rounded-full bg-[#FFEAA7] animate-confetti-3" />
        <div className="absolute top-1/2 right-1/3 w-3 h-3 rounded-full bg-[#FFB4A2] animate-confetti-4" />
        <div className="absolute top-12 left-1/2 w-4 h-4 rounded-lg rotate-12 bg-[#D8B4E2] animate-confetti-1" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <Header
          soundEnabled={settings.soundEnabled}
          onToggleSound={() => {
            const nextSound = !settings.soundEnabled;
            const updated = { ...settings, soundEnabled: nextSound };
            setSettings(updated);
            saveSettings(updated);
          }}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenMatrix={() => setIsMatrixOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          remainingCount={pool.length}
          totalCount={settings.totalNumbers}
        />

        {/* Main Hero Stage & Compact History Sidebar Layout (Laptop 15.6" & Projector Optimized) */}
        <main className="max-w-[1580px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col lg:flex-row gap-5 xl:gap-7 items-stretch">
            {/* Dominant Hero Stage (72% - 75% on Laptop / Desktop) */}
            <div className="flex-1 min-w-0 flex flex-col">
              <Stage
                drawState={drawState}
                displayNumber={displayNumber}
                onSpin={handleSpin}
                onUndo={handleUndoLatest}
                canUndo={history.length > 0}
                remainingCount={pool.length}
                totalCount={settings.totalNumbers}
                onOpenMatrix={() => setIsMatrixOpen(true)}
                spinDurationMs={settings.spinDurationMs}
                onChangeDuration={(duration) => {
                  const updated = { ...settings, spinDurationMs: duration };
                  setSettings(updated);
                  saveSettings(updated);
                }}
              />
            </div>

            {/* Compact History Sidebar (25% - 28% on Laptop / Desktop, snug & neat) */}
            <div className="w-full lg:w-[350px] xl:w-[390px] shrink-0 flex flex-col">
              <HistoryLog history={history} onRestoreNumber={handleRestoreSpecific} />
            </div>
          </div>
        </main>
      </div>

      {/* Footer Branding */}
      <footer className="w-full py-5 px-4 border-t-2 border-[#E2EDF0] bg-white/80 backdrop-blur-md text-center text-xs text-gray-500 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 font-bold text-gray-700">
            <span className="tracking-wider text-[#44595B]">THE PAVILIONS PHUKET</span>
            <span className="text-gray-300">•</span>
            <span className="text-[#698A9A]">Hotels & Resorts</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-gray-500 font-medium">
            <span>Offline LocalStorage Ready</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">100% Client-Side Safe</span>
            <span>•</span>
            <span className="text-[#E07A5F] font-bold">Ready for Netlify</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <NumberMatrixModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
        totalNumbers={settings.totalNumbers}
        remainingPool={pool}
        drawnNumbers={drawnNumberList}
        onToggleNumber={handleToggleNumberFromMatrix}
      />

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onResetAllData={handleResetAllData}
      />
    </div>
  );
}

export default App;
