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
  const [lastEntropyHex, setLastEntropyHex] = useState<string | null>(() => {
    const savedHistory = loadSavedHistory();
    return savedHistory.length > 0 ? savedHistory[0].entropyHex : null;
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

  // Main Spin Handler with Strict Sequential Roll & Approaching Deceleration
  const handleSpin = useCallback(() => {
    if (pool.length === 0 || drawState === 'SPINNING') return;

    // 1. Sort pool ascending to ensure strict sequential order
    const sortedPool = [...pool].sort((a, b) => a - b);

    // 2. Determine winner securely using CSPRNG
    const { picked: winnerNumber, entropyHex } = drawFromPool(sortedPool);
    const targetIndex = sortedPool.indexOf(winnerNumber);

    // 3. Determine start index
    let startIndex = 0;
    if (displayNumber !== null && sortedPool.includes(displayNumber)) {
      startIndex = sortedPool.indexOf(displayNumber);
    } else {
      startIndex = Math.floor(Math.random() * sortedPool.length);
    }

    // 4. Calculate total sequential steps to land exactly on winnerNumber
    const duration = settings.spinDurationMs;
    const poolLen = sortedPool.length;
    const distance = (targetIndex - startIndex + poolLen) % poolLen;

    // Ensure enough full laps so it feels like a real rolling wheel
    const minSteps = Math.max(30, Math.floor(duration / 55));
    const laps = Math.max(1, Math.ceil((minSteps - distance) / poolLen));
    const totalSteps = laps * poolLen + distance;

    setDrawState('SPINNING');

    let currentStep = 0;

    const executeNextStep = () => {
      const stepIndex = (startIndex + currentStep) % poolLen;
      const currentNumber = sortedPool[stepIndex];
      setDisplayNumber(currentNumber);

      const remainingSteps = totalSteps - currentStep;

      // Play tick sound (pitch rises slightly as it slows down to build suspense)
      if (remainingSteps <= 10) {
        soundFx.playTick(1.0 + (10 - remainingSteps) * 0.1);
      } else {
        soundFx.playTick(1.0);
      }

      if (currentStep >= totalSteps) {
        // Reached the winner exactly in sequential order!
        setDisplayNumber(winnerNumber);
        setLastEntropyHex(entropyHex);
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

      // Calculate delay with realistic deceleration curve in the final stretch
      let delay = 35; // baseline high speed

      if (remainingSteps <= 12) {
        // Exponential deceleration right before reaching the winner
        // 12 -> 50ms, 8 -> 95ms, 4 -> 210ms, 2 -> 390ms, 1 -> 580ms
        const factor = (13 - remainingSteps) / 12; // 0.08 to 1.0
        delay = Math.round(45 + Math.pow(factor, 2.8) * 550);
      } else if (remainingSteps <= 25) {
        delay = 45;
      }

      currentStep++;
      spinTimerRef.current = setTimeout(executeNextStep, delay);
    };

    executeNextStep();
  }, [pool, drawState, settings.spinDurationMs, settings.autoConfetti, history, displayNumber]);

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
    setLastEntropyHex(remainingHistory.length > 0 ? remainingHistory[0].entropyHex : null);
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
      setLastEntropyHex('MANUAL');
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
    setLastEntropyHex(null);
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

        {/* Main Stage */}
        <main className="max-w-7xl mx-auto w-full pt-4 pb-12">
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
            lastEntropyHex={lastEntropyHex}
          />

          {/* History Drawer */}
          <HistoryLog history={history} onRestoreNumber={handleRestoreSpecific} />
        </main>
      </div>

      {/* Footer Branding */}
      <footer className="w-full py-6 px-4 border-t-2 border-[#E2EDF0] bg-white/80 backdrop-blur-md text-center text-xs text-gray-500 relative z-10">
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
