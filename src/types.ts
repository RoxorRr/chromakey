export type PeriodValue = 1 | 2 | 3 | 4 | 5;

export interface TeamState {
  name: string;
  abbreviation: string;
  score: number;
  shots: number;
  primaryColor: string;
  secondaryColor: string;
  isPowerPlay?: boolean;
}

export type BackgroundPreset = 'pure-black' | 'chroma-green' | 'chroma-blue' | 'transparent' | 'dark-grey' | 'custom';

export interface BackgroundSettings {
  preset: BackgroundPreset;
  color: string; // Hex color code
  opacity: number; // 0 to 100%
  previewBackdrop: 'none' | 'rink-photo' | 'rink-animated';
}

export type ScoreboardTheme = 'broadcast' | 'nhl-pro' | 'minimal' | 'arena-led';

export interface ScoreboardSettings {
  theme: ScoreboardTheme;
  scale: number; // 0.25 to 1.5
  density?: 'compact' | 'standard';
  offsetX: number; // px from left
  offsetY: number; // px from top
  showClock: boolean;
  clockMinutes: number;
  clockSeconds: number;
  isClockRunning: boolean;
  showShots: boolean;
  soundEnabled: boolean;
  goalAnimation: boolean;
  showSafeMargin: boolean;
}
