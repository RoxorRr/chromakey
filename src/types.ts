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
  // Scoreboard background & transparency styling
  scoreboardBgColor: string; // Hex color code for scoreboard body
  scoreboardOpacity: number; // 0 to 100%
  scoreboardBlur: number; // 0 to 20px blur for glassmorphism
  scoreboardBorderOpacity: number; // 0 to 100% border visibility
  scoreboardBorderColor: string; // Border accent color (e.g. #ffffff)
  // Inner box colors & styling
  scoreBoxBgColor: string; // Background color inside score boxes (e.g. #141416)
  scoreBoxOpacity: number; // 0 to 100%
  scoreBoxTextColor: string; // Text color of score digits (e.g. #ffffff)
  scoreBoxMatchTeamColor: boolean; // Tint score box with each team's color
  periodBoxBgColor: string; // Background color inside period section (e.g. #0a0a0c)
  periodBoxOpacity: number; // 0 to 100%
  periodTextColor: string; // Text color for period (e.g. #fbbf24)
  teamBoxStyle: 'neutral' | 'team-tint' | 'team-solid'; // Team name box styling
}
