import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  BackgroundSettings,
  PeriodValue,
  ScoreboardSettings,
  TeamState,
} from './types';
import { Scoreboard } from './components/Scoreboard';
import { ControlPanel } from './components/ControlPanel';
import { ShortcutGuide } from './components/ShortcutGuide';
import { HockeyRinkBackdrop } from './components/HockeyRinkBackdrop';
import { SafeMarginGuides } from './components/SafeMarginGuides';
import { playGoalHorn, playPeriodBuzzer, playScoreClick } from './utils/audio';
import { Maximize2, Minimize2, Eye, EyeOff } from 'lucide-react';

export default function App() {
  // Team states
  const [visitorTeam, setVisitorTeam] = useState<TeamState>({
    name: 'VISITOR',
    abbreviation: 'VIS',
    score: 0,
    shots: 14,
    primaryColor: '#2563eb', // Royal Blue
    secondaryColor: '#ffffff',
  });

  const [homeTeam, setHomeTeam] = useState<TeamState>({
    name: 'HOME',
    abbreviation: 'HOM',
    score: 0,
    shots: 18,
    primaryColor: '#dc2626', // Classic Hockey Red
    secondaryColor: '#ffffff',
  });

  // Period: 1 (1st), 2 (2nd), 3 (3rd), 4 (OT), 5 (SO)
  const [period, setPeriod] = useState<PeriodValue>(1);

  // Background adjustable settings
  const [background, setBackground] = useState<BackgroundSettings>({
    preset: 'pure-black',
    color: '#000000',
    opacity: 100,
    previewBackdrop: 'none',
  });

  // Scoreboard layout & behavior settings
  const [settings, setSettings] = useState<ScoreboardSettings>({
    theme: 'broadcast',
    scale: 0.65, // Compact, television broadcast proportion
    density: 'compact',
    offsetX: 28,
    offsetY: 28,
    showClock: false,
    clockMinutes: 20,
    clockSeconds: 0,
    isClockRunning: false,
    showShots: false,
    soundEnabled: true,
    goalAnimation: true,
    showSafeMargin: false,
  });

  // Full-screen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExitHint, setShowExitHint] = useState(false);
  const exitHintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Goal celebration visual effect
  const [goalEffectTeam, setGoalEffectTeam] = useState<'home' | 'visitor' | null>(null);
  const goalEffectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger Goal celebration
  const triggerGoal = useCallback(
    (team: 'home' | 'visitor') => {
      if (settings.soundEnabled) {
        playGoalHorn();
      }
      if (settings.goalAnimation) {
        setGoalEffectTeam(team);
        if (goalEffectTimeoutRef.current) {
          clearTimeout(goalEffectTimeoutRef.current);
        }
        goalEffectTimeoutRef.current = setTimeout(() => {
          setGoalEffectTeam(null);
        }, 2500);
      }
    },
    [settings.soundEnabled, settings.goalAnimation]
  );

  // Score changers
  const changeHomeScore = useCallback(
    (delta: number) => {
      setHomeTeam((prev) => {
        const nextScore = Math.max(0, prev.score + delta);
        if (delta > 0 && nextScore > prev.score) {
          triggerGoal('home');
        } else if (settings.soundEnabled) {
          playScoreClick(delta > 0);
        }
        return { ...prev, score: nextScore };
      });
    },
    [settings.soundEnabled, triggerGoal]
  );

  const changeVisitorScore = useCallback(
    (delta: number) => {
      setVisitorTeam((prev) => {
        const nextScore = Math.max(0, prev.score + delta);
        if (delta > 0 && nextScore > prev.score) {
          triggerGoal('visitor');
        } else if (settings.soundEnabled) {
          playScoreClick(delta > 0);
        }
        return { ...prev, score: nextScore };
      });
    },
    [settings.soundEnabled, triggerGoal]
  );

  // Period changer
  const changePeriod = useCallback(
    (delta: number) => {
      setPeriod((prev) => {
        const next = Math.max(1, Math.min(5, prev + delta)) as PeriodValue;
        if (next !== prev && settings.soundEnabled) {
          playPeriodBuzzer();
        }
        return next;
      });
    },
    [settings.soundEnabled]
  );

  const setExplicitPeriod = useCallback(
    (p: PeriodValue) => {
      if (p !== period && settings.soundEnabled) {
        playPeriodBuzzer();
      }
      setPeriod(p);
    },
    [period, settings.soundEnabled]
  );

  // Clock countdown ticker
  useEffect(() => {
    if (!settings.isClockRunning || !settings.showClock) return;

    const interval = setInterval(() => {
      setSettings((prev) => {
        if (prev.clockMinutes === 0 && prev.clockSeconds === 0) {
          if (prev.soundEnabled) playPeriodBuzzer();
          return { ...prev, isClockRunning: false };
        }
        let m = prev.clockMinutes;
        let s = prev.clockSeconds - 1;
        if (s < 0) {
          s = 59;
          m = Math.max(0, m - 1);
        }
        return { ...prev, clockMinutes: m, clockSeconds: s };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.isClockRunning, settings.showClock]);

  // Fullscreen toggle handlers
  const enterFullscreen = useCallback(async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // In case browser rejects requestFullscreen (e.g. iframe policy),
      // we still seamlessly activate full overlay mode!
    }
    setIsFullscreen(true);
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      // ignore
    }
    setIsFullscreen(false);
  }, []);

  // Listen to native fullscreen changes (e.g. when user presses Esc natively)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNativeFs = Boolean(document.fullscreenElement);
      if (!isNativeFs && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen]);

  // Global Keyboard Shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return;
      }

      // Exit Fullscreen on Escape
      if (e.key === 'Escape') {
        if (isFullscreen) {
          e.preventDefault();
          exitFullscreen();
        }
        return;
      }

      // Left arrow: home score plus
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        changeHomeScore(1);
        return;
      }

      // Right arrow: home score minus
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        changeHomeScore(-1);
        return;
      }

      // Up arrow: visitor score plus
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        changeVisitorScore(1);
        return;
      }

      // Down arrow: visitor score minus
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        changeVisitorScore(-1);
        return;
      }

      // Period change: plus/minus
      // Keys: '+' or '=' or ']' or 'P'/'p' for Period Plus
      if (e.key === '+' || e.key === '=' || e.key === ']' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        changePeriod(1);
        return;
      }

      // Keys: '-' or '_' or '[' for Period Minus
      if (e.key === '-' || e.key === '_' || e.key === '[') {
        e.preventDefault();
        changePeriod(-1);
        return;
      }

      // < or , : Decrease scoreboard size
      if (e.key === '<' || e.key === ',') {
        e.preventDefault();
        setSettings((prev) => ({
          ...prev,
          scale: Math.max(0.25, Math.round((prev.scale - 0.05) * 100) / 100),
        }));
        return;
      }

      // > or . : Increase scoreboard size
      if (e.key === '>' || e.key === '.') {
        e.preventDefault();
        setSettings((prev) => ({
          ...prev,
          scale: Math.min(1.5, Math.round((prev.scale + 0.05) * 100) / 100),
        }));
        return;
      }

      // F: Toggle fullscreen
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        if (isFullscreen) {
          exitFullscreen();
        } else {
          enterFullscreen();
        }
        return;
      }

      // Space: Toggle clock if clock enabled
      if (e.code === 'Space' && settings.showClock) {
        e.preventDefault();
        setSettings((prev) => ({ ...prev, isClockRunning: !prev.isClockRunning }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isFullscreen,
    exitFullscreen,
    enterFullscreen,
    changeHomeScore,
    changeVisitorScore,
    changePeriod,
    settings.showClock,
  ]);

  // Mouse activity in fullscreen to briefly reveal "ESC to Exit" button
  const handleFullscreenMouseMove = () => {
    if (!isFullscreen) return;
    setShowExitHint(true);
    if (exitHintTimeoutRef.current) clearTimeout(exitHintTimeoutRef.current);
    exitHintTimeoutRef.current = setTimeout(() => {
      setShowExitHint(false);
    }, 2400);
  };

  // Convert hex color + opacity to CSS rgba or hex
  const getComputedBackgroundColor = () => {
    if (background.preset === 'transparent') {
      return 'transparent';
    }
    const hex = background.color.replace('#', '');
    const r = parseInt(hex.substring(0, 2) || '00', 16);
    const g = parseInt(hex.substring(2, 4) || '00', 16);
    const b = parseInt(hex.substring(4, 6) || '00', 16);
    const alpha = background.opacity / 100;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Reset scores helper
  const handleResetScores = () => {
    setHomeTeam((prev) => ({ ...prev, score: 0 }));
    setVisitorTeam((prev) => ({ ...prev, score: 0 }));
  };

  // Swap teams helper
  const handleSwapTeams = () => {
    const temp = { ...homeTeam };
    setHomeTeam({ ...visitorTeam });
    setVisitorTeam({ ...temp });
  };

  return (
    <div
      className={`min-h-screen w-full select-none ${
        isFullscreen
          ? 'fixed inset-0 z-50 overflow-hidden cursor-crosshair'
          : 'bg-neutral-950 text-neutral-100 flex flex-col font-sans'
      }`}
      onMouseMove={handleFullscreenMouseMove}
    >
      {/* ========================================================================= */}
      {/* 1. FULL-SCREEN MODE: ONLY THE SCOREBOARD IN TOP-LEFT CORNER ON BLACK SCREEN */}
      {/* ========================================================================= */}
      {isFullscreen ? (
        <div
          className="relative w-screen h-screen overflow-hidden select-none"
          style={{ backgroundColor: getComputedBackgroundColor() }}
        >
          {/* Optional Test Ice Backdrop (if enabled in background settings) */}
          {background.previewBackdrop === 'rink-photo' && <HockeyRinkBackdrop />}

          {/* Safe Margins (if enabled) */}
          {settings.showSafeMargin && <SafeMarginGuides />}

          {/* Top-Left Corner Scoreboard (The ONLY element required in full-screen) */}
          <div
            className="absolute z-20"
            style={{
              top: `${settings.offsetY}px`,
              left: `${settings.offsetX}px`,
            }}
          >
            <Scoreboard
              homeTeam={homeTeam}
              visitorTeam={visitorTeam}
              period={period}
              settings={settings}
              onPeriodChange={changePeriod}
              onHomeScoreChange={changeHomeScore}
              onVisitorScoreChange={changeVisitorScore}
              onEditTeamName={(team, newName) => {
                if (team === 'home') setHomeTeam((prev) => ({ ...prev, name: newName }));
                if (team === 'visitor') setVisitorTeam((prev) => ({ ...prev, name: newName }));
              }}
              goalEffectTeam={goalEffectTeam}
              isInteractive={true}
            />
          </div>

          {/* Quiet exit affordance & quick size widget on mouse hover/movement */}
          <div
            className={`fixed bottom-5 right-5 z-50 transition-opacity duration-300 pointer-events-auto flex items-center gap-2 ${
              showExitHint ? 'opacity-95' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Quick in-fullscreen size adjuster */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-900 text-white text-xs font-semibold border border-white/20 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Size:</span>
              <button
                type="button"
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    scale: Math.max(0.25, Math.round((prev.scale - 0.05) * 100) / 100),
                  }))
                }
                title="Decrease size (<)"
                className="w-5 h-5 flex items-center justify-center rounded bg-white/10 hover:bg-white/25 active:scale-95 text-white"
              >
                -
              </button>
              <span className="font-digital text-cyan-300 font-bold px-1 min-w-[34px] text-center">
                {Math.round(settings.scale * 100)}%
              </span>
              <button
                type="button"
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    scale: Math.min(1.5, Math.round((prev.scale + 0.05) * 100) / 100),
                  }))
                }
                title="Increase size (>)"
                className="w-5 h-5 flex items-center justify-center rounded bg-white/10 hover:bg-white/25 active:scale-95 text-white"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={exitFullscreen}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-white text-xs font-semibold border border-white/20 shadow-2xl backdrop-blur-md cursor-pointer active:scale-95 transition-all"
            >
              <Minimize2 className="w-4 h-4 text-rose-400" />
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-black/60 font-digital text-amber-300">ESC</kbd> to Exit</span>
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. REGULAR STUDIO EDITOR MODE                                            */
        /* ========================================================================= */
        <div className="flex-1 flex flex-col">
          {/* Navigation Bar */}
          <header className="flex items-center justify-between px-6 py-3 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center font-sports text-xl font-black text-white shadow-md">
                P
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                  PuckOverlay
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                    Hockey Video Bug
                  </span>
                </h1>
              </div>
            </div>

            {/* Quick Size Controller in Header */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1.5 bg-neutral-950/80 px-2.5 py-1 rounded-xl border border-neutral-800 text-xs">
                <span className="text-[10px] uppercase font-bold text-neutral-400 mr-0.5">Size:</span>
                <button
                  type="button"
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      scale: Math.max(0.25, Math.round((prev.scale - 0.05) * 100) / 100),
                    }))
                  }
                  title="Shrink Scoreboard (<)"
                  className="w-6 h-6 flex items-center justify-center rounded bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs"
                >
                  -
                </button>
                <span className="font-digital font-bold text-cyan-400 px-1.5 min-w-[36px] text-center">
                  {Math.round(settings.scale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      scale: Math.min(1.5, Math.round((prev.scale + 0.05) * 100) / 100),
                    }))
                  }
                  title="Enlarge Scoreboard (>)"
                  className="w-6 h-6 flex items-center justify-center rounded bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs"
                >
                  +
                </button>

                <div className="h-3.5 w-px bg-neutral-700 mx-1" />

                {[
                  { label: '35%', val: 0.35 },
                  { label: '50%', val: 0.5 },
                  { label: '65%', val: 0.65 },
                  { label: '80%', val: 0.8 },
                  { label: '100%', val: 1.0 },
                ].map((sz) => (
                  <button
                    key={sz.val}
                    type="button"
                    onClick={() => setSettings((prev) => ({ ...prev, scale: sz.val }))}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-digital font-bold transition-all ${
                      Math.round(settings.scale * 100) === Math.round(sz.val * 100)
                        ? 'bg-cyan-500 text-white shadow-xs'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>

              {/* Top Bar Quick Action: Fullscreen */}
              <button
                type="button"
                onClick={enterFullscreen}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs tracking-wide shadow-md shadow-cyan-900/40 transition-all active:scale-95 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>FULLSCREEN (ESC exits)</span>
              </button>
            </div>
          </header>

          {/* Main Work Area */}
          <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full space-y-6">
            
            {/* Live Video Canvas Preview Frame */}
            <div className="flex flex-col rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
              <div className="px-4 py-2.5 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-neutral-300">Live Overlay Canvas Preview</span>
                  <span className="text-neutral-500 font-digital text-[11px]">
                    (Top-Left Scoreboard on {background.color} Screen)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Quick Scale pills on canvas bar */}
                  <div className="flex items-center gap-1 bg-neutral-900 px-2 py-0.5 rounded-lg border border-neutral-800 text-[11px]">
                    <span className="text-neutral-400 font-bold uppercase text-[9px]">Size:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          scale: Math.max(0.25, Math.round((prev.scale - 0.05) * 100) / 100),
                        }))
                      }
                      title="Decrease scale (<)"
                      className="w-4 h-4 flex items-center justify-center rounded bg-neutral-800 hover:bg-neutral-700 text-white font-bold"
                    >
                      -
                    </button>
                    <span className="font-digital text-cyan-400 font-bold px-1 min-w-[28px] text-center">
                      {Math.round(settings.scale * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          scale: Math.min(1.5, Math.round((prev.scale + 0.05) * 100) / 100),
                        }))
                      }
                      title="Increase scale (>)"
                      className="w-4 h-4 flex items-center justify-center rounded bg-neutral-800 hover:bg-neutral-700 text-white font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setBackground((prev) => ({
                        ...prev,
                        previewBackdrop: prev.previewBackdrop === 'none' ? 'rink-photo' : 'none',
                      }))
                    }
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] transition-colors"
                  >
                    {background.previewBackdrop === 'rink-photo' ? (
                      <>
                        <EyeOff className="w-3 h-3 text-cyan-400" />
                        <span>Hide Ice Simulation</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3 text-neutral-400" />
                        <span>Test on Ice Simulation</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={enterFullscreen}
                    className="text-cyan-400 hover:text-cyan-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Expand</span>
                  </button>
                </div>
              </div>

              {/* Canvas viewport container */}
              <div
                className="relative w-full h-[420px] lg:h-[480px] overflow-hidden flex flex-col justify-start items-start select-none"
                style={{ backgroundColor: getComputedBackgroundColor() }}
              >
                {/* Optional Ice Rink backdrop test */}
                {background.previewBackdrop === 'rink-photo' && <HockeyRinkBackdrop />}

                {/* Broadcast Safe Area Overlay Guides */}
                {settings.showSafeMargin && <SafeMarginGuides />}

                {/* Scoreboard positioned in Top-Left Corner */}
                <div
                  className="absolute z-20"
                  style={{
                    top: `${settings.offsetY}px`,
                    left: `${settings.offsetX}px`,
                  }}
                >
                  <Scoreboard
                    homeTeam={homeTeam}
                    visitorTeam={visitorTeam}
                    period={period}
                    settings={settings}
                    onPeriodChange={changePeriod}
                    onHomeScoreChange={changeHomeScore}
                    onVisitorScoreChange={changeVisitorScore}
                    onEditTeamName={(team, newName) => {
                      if (team === 'home') setHomeTeam((prev) => ({ ...prev, name: newName }));
                      if (team === 'visitor') setVisitorTeam((prev) => ({ ...prev, name: newName }));
                    }}
                    goalEffectTeam={goalEffectTeam}
                    isInteractive={true}
                  />
                </div>

                {/* Overlay Hint Badge */}
                <div className="absolute bottom-3 left-4 z-10 pointer-events-none">
                  <div className="px-2.5 py-1 rounded bg-black/75 border border-white/10 text-[11px] font-digital text-neutral-400 backdrop-blur-xs">
                    Scoreboard placed in Top-Left (X: {settings.offsetX}px, Y: {settings.offsetY}px)
                  </div>
                </div>
              </div>
            </div>

            {/* Keyboard Shortcuts Bar */}
            <ShortcutGuide />

            {/* Controls Tabs (Teams, Background, Position, Guide) */}
            <ControlPanel
              homeTeam={homeTeam}
              visitorTeam={visitorTeam}
              period={period}
              background={background}
              settings={settings}
              onUpdateHomeTeam={(updates) => setHomeTeam((prev) => ({ ...prev, ...updates }))}
              onUpdateVisitorTeam={(updates) => setVisitorTeam((prev) => ({ ...prev, ...updates }))}
              onPeriodChange={changePeriod}
              onSetPeriod={setExplicitPeriod}
              onUpdateBackground={(updates) => setBackground((prev) => ({ ...prev, ...updates }))}
              onUpdateSettings={(updates) => setSettings((prev) => ({ ...prev, ...updates }))}
              onResetScores={handleResetScores}
              onSwapTeams={handleSwapTeams}
              onEnterFullscreen={enterFullscreen}
              isClockRunning={settings.isClockRunning}
              onToggleClock={() => setSettings((prev) => ({ ...prev, isClockRunning: !prev.isClockRunning }))}
              onResetClock={() => setSettings((prev) => ({ ...prev, clockMinutes: 20, clockSeconds: 0, isClockRunning: false }))}
            />

          </main>

          {/* Simple Clean Footer */}
          <footer className="mt-auto border-t border-neutral-900 py-4 px-6 text-center text-xs text-neutral-500 font-digital">
            PuckOverlay • Hockey Video Scoreboard Overlay • Esc to Exit Fullscreen
          </footer>
        </div>
      )}
    </div>
  );
}
