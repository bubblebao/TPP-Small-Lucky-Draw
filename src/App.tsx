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

  // Main Spin Handler
  const handleSpin = useCallback(() => {
    if (pool.length === 0 || drawState === 'SPINNING') return;

    // 1. Determine winner securely using CSPRNG
    const { picked: winnerNumber, entropyHex } = drawFromPool(pool);

    setDrawState('SPINNING');

    const duration = settings.spinDurationMs;
    const startTime = Date.now();

    // 2. Rolling animation sequence
    let currentSpeed = 45; // starts fast (ms per tick)

    const runRollingTick = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (elapsed >= duration) {
        // Grand Reveal
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

        // Sound & Confetti
        soundFx.playWinnerFanfare();
        if (settings.autoConfetti) {
          fireCelebrationConfetti();
        }
        return;
      }

      // Sample a random number from current pool to flash on screen
      const sampleIndex = Math.floor(Math.random() * pool.length);
      setDisplayNumber(pool[sampleIndex]);
      soundFx.playTick(1.0 + progress * 0.4);

      // Decelerate smoothly as it approaches the end (ease-out)
      if (progress > 0.75) {
        currentSpeed = Math.floor(60 + Math.pow(progress, 3.5) * 380);
      } else if (progress > 0.45) {
        currentSpeed = 80;
      }

      spinTimerRef.current = setTimeout(runRollingTick, currentSpeed);
    };

    runRollingTick();
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
    <div className="gala-bg text-white min-h-screen flex flex-col justify-between relative selection:bg-amber-400 selection:text-black">
      {/* Ambient Floating Celebration Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-10 w-2 h-2 rounded-full bg-[#F5CE62] animate-float-1" />
        <div className="absolute top-1/3 right-16 w-3 h-3 rounded-full bg-cyan-400/60 animate-float-2" />
        <div className="absolute top-2/3 left-1/4 w-2 h-2 rounded-full bg-amber-400/70 animate-float-3" />
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 rounded-full bg-white/50 animate-float-1" />
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
        <main className="max-w-7xl mx-auto w-full pt-4 pb-10">
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
      <footer className="w-full py-6 px-4 border-t border-white/10 bg-[#070b14]/90 text-center text-xs text-gray-400 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold tracking-wider text-[#F5CE62]">THE PAVILIONS PHUKET</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400">Luxury Hotels & Resorts</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-gray-500">
            <span>Offline LocalStorage Ready</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">100% Client-Side Safe</span>
            <span>•</span>
            <span className="text-[#F5CE62] font-semibold">Deployable on Netlify</span>
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
