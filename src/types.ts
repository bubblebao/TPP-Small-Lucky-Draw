export interface DrawRecord {
  id: string;
  sequence: number;
  number: number;
  timestamp: string;
  entropyHex: string;
}

export interface LuckyDrawSettings {
  totalNumbers: number;
  spinDurationMs: number; // 2000, 3500, 5000
  soundEnabled: boolean;
  autoConfetti: boolean;
}

export type DrawState = 'IDLE' | 'SPINNING' | 'WINNER' | 'COMPLETED';

