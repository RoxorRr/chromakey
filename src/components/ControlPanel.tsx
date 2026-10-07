import React from 'react';
import {
  BackgroundSettings,
  BackgroundPreset,
  PeriodValue,
  ScoreboardSettings,
  TeamState,
} from '../types';
import {
  Maximize2,
  RotateCcw,
  Volume2,
  VolumeX,
  Palette,
  ArrowLeftRight,
  Monitor,
  Eye,
  Settings2,
  Sliders,
  Sparkles,
  HelpCircle,
  Play,
  Pause,
  Video,
} from 'lucide-react';
import { playGoalHorn } from '../utils/audio';

interface ControlPanelProps {
  homeTeam: TeamState;
  visitorTeam: TeamState;
  period: PeriodValue;
  background: BackgroundSettings;
  settings: ScoreboardSettings;
  onUpdateHomeTeam: (updates: Partial<TeamState>) => void;
  onUpdateVisitorTeam: (updates: Partial<TeamState>) => void;
  onPeriodChange: (delta: number) => void;
  onSetPeriod: (p: PeriodValue) => void;
  onUpdateBackground: (updates: Partial<BackgroundSettings>) => void;
  onUpdateSettings: (updates: Partial<ScoreboardSettings>) => void;
  onResetScores: () => void;
  onSwapTeams: () => void;
  onEnterFullscreen: () => void;
  isClockRunning: boolean;
  onToggleClock: () => void;
  onResetClock: () => void;
}

const COLOR_PRESETS = [
  '#dc2626', // Red
  '#2563eb', // Blue
  '#16a34a', // Green
  '#ca8a04', // Gold / Yellow
  '#ea580c', // Orange
  '#9333ea', // Purple
  '#0891b2', // Teal / Cyan
  '#475569', // Slate
  '#000000', // Black
  '#ffffff', // White
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  homeTeam,
  visitorTeam,
  period,
  background,
  settings,
  onUpdateHomeTeam,
  onUpdateVisitorTeam,
  onPeriodChange,
  onSetPeriod,
  onUpdateBackground,
  onUpdateSettings,
  onResetScores,
  onSwapTeams,
  onEnterFullscreen,
  isClockRunning,
  onToggleClock,
  onResetClock,
}) => {
  const [activeTab, setActiveTab] = React.useState<'teams' | 'screen' | 'overlay' | 'guide'>('teams');

  const handlePresetSelect = (preset: BackgroundPreset) => {
    switch (preset) {
      case 'pure-black':
        onUpdateBackground({ preset, color: '#000000', opacity: 100 });
        break;
      case 'dark-grey':
        onUpdateBackground({ preset, color: '#0e1014', opacity: 100 });
        break;
      case 'chroma-green':
        onUpdateBackground({ preset, color: '#00FF00', opacity: 100 });
        break;
      case 'chroma-blue':
        onUpdateBackground({ preset, color: '#0022FF', opacity: 100 });
        break;
      case 'transparent':
        onUpdateBackground({ preset, opacity: 0 });
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Primary Action Header: Enter Fullscreen */}
      <div className="p-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            Hockey Overlay Studio
          </h2>
          <p className="text-xs text-neutral-400">
            Configure overlay graphics and enter full-screen for video recording or keying.
          </p>
        </div>

        <button
          type="button"
          onClick={onEnterFullscreen}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-cyan-900/30 transition-all active:scale-95 cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
          <span>START FULL-SCREEN (ESC to Exit)</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-800 bg-neutral-950/60 p-1.5 gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('teams')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'teams'
              ? 'bg-neutral-800 text-white shadow-xs'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>Teams & Scores</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('screen')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'screen'
              ? 'bg-neutral-800 text-white shadow-xs'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Monitor className="w-3.5 h-3.5 text-emerald-400" />
          <span>Adjust Black Screen</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('overlay')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'overlay'
              ? 'bg-neutral-800 text-white shadow-xs'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          <span>Scoreboard Style & Size</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'guide'
              ? 'bg-neutral-800 text-white shadow-xs'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Video className="w-3.5 h-3.5 text-purple-400" />
          <span>Video Editor Guide</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-5 flex-1 overflow-y-auto">
        {/* ================= TAB 1: TEAMS & SCORES ================= */}
        {activeTab === 'teams' && (
          <div className="space-y-6">
            {/* Quick Actions Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Teams Configuration
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onSwapTeams}
                  title="Swap Home and Visitor"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Swap Sides</span>
                </button>
                <button
                  type="button"
                  onClick={onResetScores}
                  title="Reset Scores to 0"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Scores</span>
                </button>
              </div>
            </div>

            {/* Team Editors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* VISITOR TEAM */}
              <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: visitorTeam.primaryColor }}
                    />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Visitor Team
                    </h3>
                  </div>
                  <div className="text-[11px] font-digital text-neutral-400">
                    Arrows: Up (+), Down (-)
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">
                    Team Name (Displayed on Scoreboard)
                  </label>
                  <input
                    type="text"
                    value={visitorTeam.name}
                    onChange={(e) => onUpdateVisitorTeam({ name: e.target.value })}
                    placeholder="e.g. VISITOR, RANGERS, BOSTON"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white font-sports text-lg tracking-wide uppercase focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Score Controls */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-neutral-300 font-medium">Current Score</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateVisitorTeam({ score: Math.max(0, visitorTeam.score - 1) })}
                      className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white font-digital font-bold text-lg flex items-center justify-center border border-neutral-700"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={visitorTeam.score}
                      onChange={(e) => onUpdateVisitorTeam({ score: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-14 text-center font-digital text-xl font-bold py-1 bg-neutral-900 rounded-lg text-white border border-neutral-700 focus:border-cyan-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => onUpdateVisitorTeam({ score: visitorTeam.score + 1 })}
                      className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white font-digital font-bold text-lg flex items-center justify-center border border-neutral-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Color Selector */}
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                    Team Jersey Color Accent
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {COLOR_PRESETS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => onUpdateVisitorTeam({ primaryColor: c })}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-md border transition-transform ${
                          visitorTeam.primaryColor === c ? 'scale-115 border-white ring-2 ring-cyan-400' : 'border-neutral-700 hover:scale-105'
                        }`}
                      />
                    ))}
                    <input
                      type="color"
                      value={visitorTeam.primaryColor}
                      onChange={(e) => onUpdateVisitorTeam({ primaryColor: e.target.value })}
                      className="w-6 h-6 rounded-md cursor-pointer bg-transparent border-0 p-0"
                      title="Custom color"
                    />
                  </div>
                </div>
              </div>

              {/* HOME TEAM */}
              <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: homeTeam.primaryColor }}
                    />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Home Team
                    </h3>
                  </div>
                  <div className="text-[11px] font-digital text-neutral-400">
                    Arrows: Left (+), Right (-)
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">
                    Team Name (Displayed on Scoreboard)
                  </label>
                  <input
                    type="text"
                    value={homeTeam.name}
                    onChange={(e) => onUpdateHomeTeam({ name: e.target.value })}
                    placeholder="e.g. HOME, CANADA, HAWKS"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white font-sports text-lg tracking-wide uppercase focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Score Controls */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-neutral-300 font-medium">Current Score</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateHomeTeam({ score: Math.max(0, homeTeam.score - 1) })}
                      className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white font-digital font-bold text-lg flex items-center justify-center border border-neutral-700"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={homeTeam.score}
                      onChange={(e) => onUpdateHomeTeam({ score: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-14 text-center font-digital text-xl font-bold py-1 bg-neutral-900 rounded-lg text-white border border-neutral-700 focus:border-cyan-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => onUpdateHomeTeam({ score: homeTeam.score + 1 })}
                      className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white font-digital font-bold text-lg flex items-center justify-center border border-neutral-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Color Selector */}
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                    Team Jersey Color Accent
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {COLOR_PRESETS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => onUpdateHomeTeam({ primaryColor: c })}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-md border transition-transform ${
                          homeTeam.primaryColor === c ? 'scale-115 border-white ring-2 ring-cyan-400' : 'border-neutral-700 hover:scale-105'
                        }`}
                      />
                    ))}
                    <input
                      type="color"
                      value={homeTeam.primaryColor}
                      onChange={(e) => onUpdateHomeTeam({ primaryColor: e.target.value })}
                      className="w-6 h-6 rounded-md cursor-pointer bg-transparent border-0 p-0"
                      title="Custom color"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PERIOD CONTROLS SECTION */}
            <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Period Controls
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Switch between 1st, 2nd, 3rd, Overtime (OT), and Shootout (SO).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onPeriodChange(-1)}
                    disabled={period <= 1}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold border border-neutral-700 transition-all"
                  >
                    - Period Minus
                  </button>
                  <button
                    type="button"
                    onClick={() => onPeriodChange(1)}
                    disabled={period >= 5}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold border border-neutral-700 transition-all"
                  >
                    + Period Plus
                  </button>
                </div>
              </div>

              {/* Direct Period Buttons */}
              <div className="grid grid-cols-5 gap-2 pt-2">
                {[
                  { id: 1, label: '1st Period' },
                  { id: 2, label: '2nd Period' },
                  { id: 3, label: '3rd Period' },
                  { id: 4, label: 'Overtime (OT)' },
                  { id: 5, label: 'Shootout (SO)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSetPeriod(item.id as PeriodValue)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold text-center transition-all ${
                      period === item.id
                        ? 'bg-amber-500 text-neutral-950 shadow-md font-black ring-2 ring-amber-300'
                        : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ADJUST BLACK SCREEN ================= */}
        {activeTab === 'screen' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Adjust Black Screen & Background
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Adjust screen color and opacity for easy video keying, compositing, or OBS capture.
              </p>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => handlePresetSelect('pure-black')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  background.color === '#000000' && background.opacity === 100
                    ? 'border-cyan-400 bg-neutral-800/80 ring-1 ring-cyan-400'
                    : 'border-neutral-800 bg-neutral-950/60 hover:bg-neutral-900'
                }`}
              >
                <div className="w-full h-8 rounded-md bg-black border border-neutral-700 mb-2" />
                <span className="text-xs font-bold text-white block">Pure Black (#000000)</span>
                <span className="text-[10px] text-neutral-400">Best for Screen blend mode</span>
              </button>

              <button
                type="button"
                onClick={() => handlePresetSelect('dark-grey')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  background.color === '#0e1014' && background.opacity === 100
                    ? 'border-cyan-400 bg-neutral-800/80 ring-1 ring-cyan-400'
                    : 'border-neutral-800 bg-neutral-950/60 hover:bg-neutral-900'
                }`}
              >
                <div className="w-full h-8 rounded-md bg-[#0e1014] border border-neutral-700 mb-2" />
                <span className="text-xs font-bold text-white block">Dark Charcoal (#0E1014)</span>
                <span className="text-[10px] text-neutral-400">Subtle studio matte</span>
              </button>

              <button
                type="button"
                onClick={() => handlePresetSelect('chroma-green')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  background.color === '#00FF00'
                    ? 'border-emerald-400 bg-neutral-800/80 ring-1 ring-emerald-400'
                    : 'border-neutral-800 bg-neutral-950/60 hover:bg-neutral-900'
                }`}
              >
                <div className="w-full h-8 rounded-md bg-[#00FF00] border border-neutral-700 mb-2" />
                <span className="text-xs font-bold text-white block">Chroma Green (#00FF00)</span>
                <span className="text-[10px] text-neutral-400">For Ultra Key / Green Screen</span>
              </button>

              <button
                type="button"
                onClick={() => handlePresetSelect('chroma-blue')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  background.color === '#0022FF'
                    ? 'border-blue-400 bg-neutral-800/80 ring-1 ring-blue-400'
                    : 'border-neutral-800 bg-neutral-950/60 hover:bg-neutral-900'
                }`}
              >
                <div className="w-full h-8 rounded-md bg-[#0022FF] border border-neutral-700 mb-2" />
                <span className="text-xs font-bold text-white block">Chroma Blue (#0022FF)</span>
                <span className="text-[10px] text-neutral-400">For Blue Screen keying</span>
              </button>
            </div>

            {/* Sliders and Custom Pickers */}
            <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-4">
              {/* Custom Color Picker */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-300 block">Custom Screen Color</span>
                  <span className="text-[11px] text-neutral-400 font-digital">{background.color}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={background.color}
                    onChange={(e) => onUpdateBackground({ color: e.target.value, preset: 'custom' })}
                    className="w-10 h-8 rounded cursor-pointer bg-neutral-900 border border-neutral-700 p-0.5"
                  />
                  <input
                    type="text"
                    value={background.color}
                    onChange={(e) => onUpdateBackground({ color: e.target.value, preset: 'custom' })}
                    className="w-24 px-2 py-1 text-xs font-digital bg-neutral-900 border border-neutral-700 rounded text-white"
                  />
                </div>
              </div>

              {/* Background Opacity Slider */}
              <div className="space-y-1.5 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-300">Screen Background Opacity</span>
                  <span className="font-digital text-cyan-400">{background.opacity}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={background.opacity}
                  onChange={(e) => onUpdateBackground({ opacity: parseInt(e.target.value) })}
                  className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-digital">
                  <span>0% (Transparent / Alpha)</span>
                  <span>50% (Semi)</span>
                  <span>100% (Solid Black)</span>
                </div>
              </div>

              {/* Test Backdrop Toggle */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-neutral-300 block">
                      Preview with Test Hockey Footage
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Simulate actual ice hockey video backdrop behind your scoreboard
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
                    <button
                      type="button"
                      onClick={() => onUpdateBackground({ previewBackdrop: 'none' })}
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        background.previewBackdrop === 'none'
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Solid Screen
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateBackground({ previewBackdrop: 'rink-photo' })}
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        background.previewBackdrop === 'rink-photo'
                          ? 'bg-cyan-600 text-white'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Ice Rink Test
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: POSITION & SIZE ================= */}
        {activeTab === 'overlay' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Scoreboard Style, Background & Geometry
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Control the scoreboard's own background color, glass transparency, scale, and margins.
              </p>
            </div>

            {/* SCOREBOARD BACKGROUND & TRANSPARENCY CARD */}
            <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-amber-400" />
                    Scoreboard Background Color & Transparency
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Customize the background color, opacity, and glassmorphism of the scoreboard bug.
                  </p>
                </div>
                <div className="font-digital text-xs font-bold text-amber-400 px-2 py-0.5 bg-neutral-900 rounded border border-neutral-800">
                  {settings.scoreboardOpacity ?? 88}% Opacity
                </div>
              </div>

              {/* Scoreboard Opacity Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-300">Scoreboard Opacity / Transparency</span>
                  <span className="font-digital text-neutral-400">{settings.scoreboardOpacity ?? 88}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={settings.scoreboardOpacity ?? 88}
                  onChange={(e) => onUpdateSettings({ scoreboardOpacity: parseInt(e.target.value) })}
                  className="w-full accent-amber-400 h-2 bg-neutral-800 rounded-lg cursor-pointer"
                />
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {[
                    { label: 'Solid (100%)', val: 100 },
                    { label: 'Glass (85%)', val: 85 },
                    { label: 'Translucent (60%)', val: 60 },
                    { label: 'Ghost (35%)', val: 35 },
                    { label: 'Clear / Float (0%)', val: 0 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => onUpdateSettings({ scoreboardOpacity: preset.val })}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                        (settings.scoreboardOpacity ?? 88) === preset.val
                          ? 'bg-amber-500 text-neutral-950 font-black shadow-xs'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scoreboard Body Color */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-300">Scoreboard Background Color</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.scoreboardBgColor || '#0a0a0c'}
                      onChange={(e) => onUpdateSettings({ scoreboardBgColor: e.target.value })}
                      className="w-7 h-6 rounded cursor-pointer bg-neutral-900 border border-neutral-700 p-0.5"
                    />
                    <input
                      type="text"
                      value={settings.scoreboardBgColor || '#0a0a0c'}
                      onChange={(e) => onUpdateSettings({ scoreboardBgColor: e.target.value })}
                      className="w-20 px-2 py-0.5 text-xs font-digital bg-neutral-900 border border-neutral-700 rounded text-white"
                    />
                  </div>
                </div>

                {/* Color swatches */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { label: 'Pitch Black', hex: '#000000' },
                    { label: 'Dark Charcoal', hex: '#121214' },
                    { label: 'Midnight Navy', hex: '#0a0f1d' },
                    { label: 'Arena Slate', hex: '#1e293b' },
                    { label: 'Hockey Crimson', hex: '#2b0b0e' },
                    { label: 'Ice White', hex: '#ffffff' },
                  ].map((swatch) => (
                    <button
                      key={swatch.hex}
                      type="button"
                      onClick={() => onUpdateSettings({ scoreboardBgColor: swatch.hex })}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium border transition-all ${
                        (settings.scoreboardBgColor || '#0a0a0c').toLowerCase() === swatch.hex.toLowerCase()
                          ? 'border-amber-400 bg-neutral-850 text-white ring-1 ring-amber-400'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-neutral-700"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span>{swatch.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Glassmorphism Blur & Border Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-800">
                {/* Backdrop Blur */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-300">Glass Backdrop Blur</span>
                    <span className="font-digital text-neutral-400">{settings.scoreboardBlur ?? 12}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={settings.scoreboardBlur ?? 12}
                    onChange={(e) => onUpdateSettings({ scoreboardBlur: parseInt(e.target.value) })}
                    className="w-full accent-amber-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 font-digital">
                    <span>0px (Sharp)</span>
                    <span>10px (Glass)</span>
                    <span>20px (Max Blur)</span>
                  </div>
                </div>

                {/* Border Outline Opacity */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-300">Border Outline Opacity</span>
                    <span className="font-digital text-neutral-400">{settings.scoreboardBorderOpacity ?? 25}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={settings.scoreboardBorderOpacity ?? 25}
                    onChange={(e) => onUpdateSettings({ scoreboardBorderOpacity: parseInt(e.target.value) })}
                    className="w-full accent-amber-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 font-digital">
                    <span>0% (Borderless)</span>
                    <span>25% (Subtle)</span>
                    <span>100% (Solid)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLORS INSIDE SCOREBOARD BOXES CARD */}
            <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-5">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  Colors Inside Scoreboard Boxes
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Customize the individual boxes inside: Score digits, Period section, and Team name panels.
                </p>
              </div>

              {/* 1. SCORE BOXES (NUMBERS) */}
              <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-200">
                    Score Number Boxes (Visitor & Home Scores)
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-[11px] text-neutral-400">Match Each Team Color</span>
                    <input
                      type="checkbox"
                      checked={settings.scoreBoxMatchTeamColor ?? false}
                      onChange={(e) => onUpdateSettings({ scoreBoxMatchTeamColor: e.target.checked })}
                      className="rounded accent-cyan-400 cursor-pointer"
                    />
                  </label>
                </div>

                {!settings.scoreBoxMatchTeamColor ? (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-neutral-400">Score Box Background Color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.scoreBoxBgColor || '#18181b'}
                        onChange={(e) => onUpdateSettings({ scoreBoxBgColor: e.target.value })}
                        className="w-7 h-6 rounded cursor-pointer bg-neutral-900 border border-neutral-700 p-0.5"
                      />
                      <input
                        type="text"
                        value={settings.scoreBoxBgColor || '#18181b'}
                        onChange={(e) => onUpdateSettings({ scoreBoxBgColor: e.target.value })}
                        className="w-20 px-2 py-0.5 text-xs font-digital bg-neutral-900 border border-neutral-700 rounded text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-cyan-400 bg-cyan-950/40 p-2 rounded border border-cyan-800/40">
                    Visitor score box uses Visitor color ({visitorTeam.primaryColor}), Home score box uses Home color ({homeTeam.primaryColor}).
                  </p>
                )}

                {/* Score Box Opacity & Number Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400">Score Box Opacity</span>
                      <span className="font-digital text-neutral-300">{settings.scoreBoxOpacity ?? 90}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={settings.scoreBoxOpacity ?? 90}
                      onChange={(e) => onUpdateSettings({ scoreBoxOpacity: parseInt(e.target.value) })}
                      className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Score Digits Text Color</span>
                    <div className="flex items-center gap-1.5">
                      {['#ffffff', '#fbbf24', '#22d3ee', '#ef4444', '#10b981'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => onUpdateSettings({ scoreBoxTextColor: c })}
                          style={{ backgroundColor: c }}
                          className={`w-5 h-5 rounded-md border ${
                            (settings.scoreBoxTextColor || '#ffffff') === c
                              ? 'border-white ring-2 ring-cyan-400'
                              : 'border-neutral-700'
                          }`}
                          title={c}
                        />
                      ))}
                      <input
                        type="color"
                        value={settings.scoreBoxTextColor || '#ffffff'}
                        onChange={(e) => onUpdateSettings({ scoreBoxTextColor: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 p-0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. PERIOD & CLOCK BOX */}
              <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800/80 space-y-3">
                <span className="text-xs font-bold text-neutral-200 block">
                  Period & Clock Section Box
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Period Box Background</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.periodBoxBgColor || '#09090b'}
                        onChange={(e) => onUpdateSettings({ periodBoxBgColor: e.target.value })}
                        className="w-7 h-6 rounded cursor-pointer bg-neutral-900 border border-neutral-700 p-0.5"
                      />
                      <input
                        type="text"
                        value={settings.periodBoxBgColor || '#09090b'}
                        onChange={(e) => onUpdateSettings({ periodBoxBgColor: e.target.value })}
                        className="w-20 px-2 py-0.5 text-xs font-digital bg-neutral-900 border border-neutral-700 rounded text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Period Text Color</span>
                    <div className="flex items-center gap-1.5">
                      {['#fbbf24', '#ffffff', '#38bdf8', '#f97316', '#a855f7'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => onUpdateSettings({ periodTextColor: c })}
                          style={{ backgroundColor: c }}
                          className={`w-5 h-5 rounded-md border ${
                            (settings.periodTextColor || '#fbbf24') === c
                              ? 'border-white ring-2 ring-amber-400'
                              : 'border-neutral-700'
                          }`}
                          title={c}
                        />
                      ))}
                      <input
                        type="color"
                        value={settings.periodTextColor || '#fbbf24'}
                        onChange={(e) => onUpdateSettings({ periodTextColor: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 p-0"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Period Box Opacity</span>
                    <span className="font-digital text-neutral-300">{settings.periodBoxOpacity ?? 90}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={settings.periodBoxOpacity ?? 90}
                    onChange={(e) => onUpdateSettings({ periodBoxOpacity: parseInt(e.target.value) })}
                    className="w-full accent-amber-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* 3. TEAM NAME PANELS STYLE */}
              <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-200">
                    Team Name Panels Background Style
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Background behind VISITOR & HOME team names
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { id: 'neutral', label: 'Neutral Glass', desc: 'Sleek dark glass' },
                    { id: 'team-tint', label: 'Team Tint (25%)', desc: 'Subtle team glow' },
                    { id: 'team-solid', label: 'Solid Team Banner', desc: 'Bold TV banner' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => onUpdateSettings({ teamBoxStyle: style.id as any })}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        (settings.teamBoxStyle || 'neutral') === style.id
                          ? 'border-cyan-400 bg-neutral-800 text-white ring-1 ring-cyan-400'
                          : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white hover:bg-neutral-850'
                      }`}
                    >
                      <span className="text-xs font-bold block">{style.label}</span>
                      <span className="text-[10px] text-neutral-500 block mt-0.5">{style.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-5">
              {/* Scale Slider and Quick Presets */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-300">Scoreboard Size / Scale</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ scale: Math.max(0.25, Math.round((settings.scale - 0.05) * 100) / 100) })}
                      className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center border border-neutral-700 text-xs"
                      title="Decrease size"
                    >
                      -
                    </button>
                    <span className="font-digital font-bold text-cyan-400 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                      {Math.round(settings.scale * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ scale: Math.min(1.5, Math.round((settings.scale + 0.05) * 100) / 100) })}
                      className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center border border-neutral-700 text-xs"
                      title="Increase size"
                    >
                      +
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min={25}
                  max={150}
                  step={1}
                  value={Math.round(settings.scale * 100)}
                  onChange={(e) => onUpdateSettings({ scale: parseInt(e.target.value) / 100 })}
                  className="w-full accent-cyan-400 h-2 bg-neutral-800 rounded-lg cursor-pointer"
                />

                {/* Quick Size Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {[
                    { label: 'Tiny (35%)', val: 0.35 },
                    { label: 'Small (50%)', val: 0.5 },
                    { label: 'Compact (65%)', val: 0.65 },
                    { label: 'Medium (80%)', val: 0.8 },
                    { label: 'Standard (100%)', val: 1.0 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => onUpdateSettings({ scale: preset.val })}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                        Math.round(settings.scale * 100) === Math.round(preset.val * 100)
                          ? 'bg-cyan-500 text-white font-bold shadow-xs'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Density Switch */}
                <div className="pt-2 flex items-center justify-between border-t border-neutral-850">
                  <div>
                    <span className="text-xs font-semibold text-neutral-300 block">Density Profile</span>
                    <span className="text-[11px] text-neutral-500">Compact reduces padding & text footprint</span>
                  </div>
                  <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ density: 'compact' })}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                        settings.density !== 'standard'
                          ? 'bg-neutral-800 text-cyan-400 font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Compact Bug (TV)
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ density: 'standard' })}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                        settings.density === 'standard'
                          ? 'bg-neutral-800 text-cyan-400 font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Standard
                    </button>
                  </div>
                </div>
              </div>

              {/* Offset X Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-300">Left Margin Offset</span>
                  <span className="font-digital text-neutral-400">{settings.offsetX}px</span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={120}
                  value={settings.offsetX}
                  onChange={(e) => onUpdateSettings({ offsetX: parseInt(e.target.value) })}
                  className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Offset Y Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-300">Top Margin Offset</span>
                  <span className="font-digital text-neutral-400">{settings.offsetY}px</span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={120}
                  value={settings.offsetY}
                  onChange={(e) => onUpdateSettings({ offsetY: parseInt(e.target.value) })}
                  className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Broadcast Feature Toggles */}
            <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-3">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                Broadcast Elements & Feedback
              </span>

              {/* Goal Horn Sound */}
              <div className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-neutral-500" />
                  )}
                  <div>
                    <span className="text-xs font-medium text-neutral-200 block">
                      Arena Goal Horn & Buzzer Sound
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Synthesized sound on goal and period changes
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => playGoalHorn()}
                    className="px-2.5 py-1 text-[11px] font-bold rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
                  >
                    Test Horn
                  </button>
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                    className="w-4 h-4 accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Show Clock */}
              <div className="flex items-center justify-between py-1.5 border-t border-neutral-800">
                <div>
                  <span className="text-xs font-medium text-neutral-200 block">
                    Game Period Clock
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    20:00 period timer countdown (Spacebar to start/stop)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {settings.showClock && (
                    <button
                      type="button"
                      onClick={onToggleClock}
                      className="px-2.5 py-1 text-[11px] font-bold rounded bg-neutral-800 hover:bg-neutral-700 text-cyan-400 border border-neutral-700 flex items-center gap-1"
                    >
                      {isClockRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span>{isClockRunning ? 'Pause' : 'Start'}</span>
                    </button>
                  )}
                  <input
                    type="checkbox"
                    checked={settings.showClock}
                    onChange={(e) => onUpdateSettings({ showClock: e.target.checked })}
                    className="w-4 h-4 accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Shots on Goal */}
              <div className="flex items-center justify-between py-1.5 border-t border-neutral-800">
                <div>
                  <span className="text-xs font-medium text-neutral-200 block">
                    Shots on Goal (SOG)
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Show shot counters under each team name
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showShots}
                  onChange={(e) => onUpdateSettings({ showShots: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Safe Margins */}
              <div className="flex items-center justify-between py-1.5 border-t border-neutral-800">
                <div>
                  <span className="text-xs font-medium text-neutral-200 block">
                    Broadcast Title Safe Margins
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Show guide overlays (90% Action Safe / 80% Title Safe)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showSafeMargin}
                  onChange={(e) => onUpdateSettings({ showSafeMargin: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: VIDEO EDITOR GUIDE ================= */}
        {activeTab === 'guide' && (
          <div className="space-y-4 text-xs text-neutral-300">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                How to use in Video Editors & Streaming
              </h3>
              <p className="text-neutral-400 mt-0.5">
                Simple steps to overlay this scoreboard onto your hockey match footage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1.5">
                <span className="font-bold text-cyan-400 text-xs block">
                  Method 1: Adobe Premiere Pro
                </span>
                <ol className="list-decimal list-inside space-y-1 text-neutral-400 text-[11px]">
                  <li>Set screen to <strong>Pure Black (#000000)</strong>.</li>
                  <li>Record or capture fullscreen scoreboard.</li>
                  <li>Place above your hockey clip on the Premiere timeline.</li>
                  <li>In <em>Effect Controls &gt; Opacity &gt; Blend Mode</em>, select <strong>Screen</strong> or <strong>Add</strong>.</li>
                  <li>The black completely vanishes, leaving only the crisp scoreboard!</li>
                </ol>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1.5">
                <span className="font-bold text-emerald-400 text-xs block">
                  Method 2: DaVinci Resolve
                </span>
                <ol className="list-decimal list-inside space-y-1 text-neutral-400 text-[11px]">
                  <li>Place the overlay on Video Track 2 above your match.</li>
                  <li>Open Inspector &gt; <em>Composite Mode</em>.</li>
                  <li>Set to <strong>Screen</strong> (or use Chroma Green with <em>3D Keyer</em> on the Color page).</li>
                  <li>Adjust transform / zoom if needed.</li>
                </ol>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1.5">
                <span className="font-bold text-amber-400 text-xs block">
                  Method 3: Final Cut Pro
                </span>
                <ol className="list-decimal list-inside space-y-1 text-neutral-400 text-[11px]">
                  <li>Add overlay clip as a connected clip above storyline.</li>
                  <li>Go to <em>Video Inspector &gt; Compositing</em>.</li>
                  <li>Change Blend Mode from Normal to <strong>Screen</strong>.</li>
                  <li>Or use Chroma Green background with the built-in <strong>Keyer</strong> effect.</li>
                </ol>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1.5">
                <span className="font-bold text-purple-400 text-xs block">
                  Method 4: OBS Studio / Streamlabs
                </span>
                <ol className="list-decimal list-inside space-y-1 text-neutral-400 text-[11px]">
                  <li>Set background to <strong>Chroma Green</strong> or <strong>Transparent</strong>.</li>
                  <li>Add <em>Window Capture</em> or <em>Browser Source</em> in OBS.</li>
                  <li>If Chroma Green: Add filter &gt; <strong>Color Key / Chroma Key</strong>.</li>
                  <li>Full transparency is achieved instantly!</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
