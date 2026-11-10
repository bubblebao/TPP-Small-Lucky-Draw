import type { DrawRecord, LuckyDrawSettings } from '../types';

const STORAGE_KEY_POOL = 'pavilions_lucky_draw_pool_v1';
const STORAGE_KEY_HISTORY = 'pavilions_lucky_draw_history_v1';
const STORAGE_KEY_SETTINGS = 'pavilions_lucky_draw_settings_v1';

export const DEFAULT_TOTAL_NUMBERS = 205;

export const DEFAULT_SETTINGS: LuckyDrawSettings = {
  totalNumbers: DEFAULT_TOTAL_NUMBERS,
  spinDurationMs: 3500,
  soundEnabled: true,
  autoConfetti: true,
};

export function createInitialPool(total: number = DEFAULT_TOTAL_NUMBERS): number[] {
  return Array.from({ length: total }, (_, i) => i + 1);
}

export function loadSavedPool(defaultTotal: number = DEFAULT_TOTAL_NUMBERS): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POOL);
    if (!raw) return createInitialPool(defaultTotal);
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (err) {
    console.error('Failed to load pool from localStorage', err);
  }
  return createInitialPool(defaultTotal);
}

export function savePool(pool: number[]) {
  try {
    localStorage.setItem(STORAGE_KEY_POOL, JSON.stringify(pool));
  } catch (err) {
    console.error('Failed to save pool', err);
  }
}

export function loadSavedHistory(): DrawRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (err) {
    console.error('Failed to load history', err);
  }
  return [];
}

export function saveHistory(history: DrawRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  } catch (err) {
    console.error('Failed to save history', err);
  }
}

export function loadSettings(): LuckyDrawSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: LuckyDrawSettings) {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
}

export function clearAllStorage(total: number = DEFAULT_TOTAL_NUMBERS) {
  localStorage.removeItem(STORAGE_KEY_POOL);
  localStorage.removeItem(STORAGE_KEY_HISTORY);
  return {
    pool: createInitialPool(total),
    history: [],
  };
}

/**
 * Exports history to a cleanly formatted CSV file compatible with Excel
 */
export function exportHistoryToCSV(history: DrawRecord[]) {
  if (history.length === 0) {
    alert('ยังไม่มีประวัติการจับรางวัลเพื่อ Export ค่ะ');
    return;
  }

  const headers = ['ลำดับการจับ (Order)', 'หมายเลขรางวัล (Lucky Number)', 'วันเวลาที่ออก (Timestamp)', 'Crypto Audit Ref (CSPRNG Hex)'];
  const rows = history.map((item) => [
    item.sequence,
    `"${item.number.toString().padStart(3, '0')}"`,
    `"${item.timestamp}"`,
    `"${item.entropyHex}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const nowStr = new Date().toISOString().slice(0, 10);
  a.download = `ThePavilionsPhuket_LuckyDraw_Results_${nowStr}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
