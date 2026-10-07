import React from 'react';
import { PeriodValue, ScoreboardSettings, TeamState } from '../types';
import { Plus, Minus, Flame } from 'lucide-react';

interface ScoreboardProps {
  homeTeam: TeamState;
  visitorTeam: TeamState;
  period: PeriodValue;
  settings: ScoreboardSettings;
  onPeriodChange: (delta: number) => void;
  onHomeScoreChange: (delta: number) => void;
  onVisitorScoreChange: (delta: number) => void;
  onEditTeamName?: (team: 'home' | 'visitor', newName: string) => void;
  isInteractive?: boolean;
  goalEffectTeam?: 'home' | 'visitor' | null;
}

export const getPeriodText = (p: PeriodValue): string => {
  switch (p) {
    case 1:
      return '1ST';
    case 2:
      return '2ND';
    case 3:
      return '3RD';
    case 4:
      return 'OT';
    case 5:
      return 'SO';
    default:
      return `${p}TH`;
  }
};

export const Scoreboard: React.FC<ScoreboardProps> = ({
  homeTeam,
  visitorTeam,
  period,
  settings,
  onPeriodChange,
  onHomeScoreChange,
  onVisitorScoreChange,
  onEditTeamName,
  isInteractive = true,
  goalEffectTeam = null,
}) => {
  const [editingHome, setEditingHome] = React.useState(false);
  const [editingVisitor, setEditingVisitor] = React.useState(false);
  const [homeInput, setHomeInput] = React.useState(homeTeam.name);
  const [visitorInput, setVisitorInput] = React.useState(visitorTeam.name);

  // Sync inputs if props change
  React.useEffect(() => {
    setHomeInput(homeTeam.name);
  }, [homeTeam.name]);

  React.useEffect(() => {
    setVisitorInput(visitorTeam.name);
  }, [visitorTeam.name]);

  const handleHomeSubmit = () => {
    setEditingHome(false);
    if (onEditTeamName && homeInput.trim()) {
      onEditTeamName('home', homeInput.trim());
    }
  };

  const handleVisitorSubmit = () => {
    setEditingVisitor(false);
    if (onEditTeamName && visitorInput.trim()) {
      onEditTeamName('visitor', visitorInput.trim());
    }
  };

  const formatClock = (mins: number, secs: number) => {
    const m = String(mins).padStart(2, '0');
    const s = String(secs).padStart(2, '0');
    return `${m}:${s}`;
  };

  const isCompact = settings.density !== 'standard';

  const hexToRgba = (hex: string, alphaPercent: number) => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2) || '00', 16);
    const g = parseInt(cleanHex.substring(2, 4) || '00', 16);
    const b = parseInt(cleanHex.substring(4, 6) || '00', 16);
    const alpha = Math.max(0, Math.min(1, alphaPercent / 100));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const sbBgColor = settings.scoreboardBgColor || '#0a0a0c';
  const sbOpacity = settings.scoreboardOpacity ?? 88;
  const sbBlur = settings.scoreboardBlur ?? 12;
  const sbBorderOpacity = settings.scoreboardBorderOpacity ?? 25;
  const sbBorderColor = settings.scoreboardBorderColor || '#ffffff';

  const shellBg = hexToRgba(sbBgColor, sbOpacity);
  const shellBorder = hexToRgba(sbBorderColor, sbBorderOpacity);
  const dividerBorder = hexToRgba(sbBorderColor, sbBorderOpacity * 0.75);

  // Inner box computations:
  const teamBoxStyle = settings.teamBoxStyle || 'neutral';
  
  const getTeamBoxBg = (teamColor: string) => {
    if (teamBoxStyle === 'team-tint') {
      return hexToRgba(teamColor, 25);
    }
    if (teamBoxStyle === 'team-solid') {
      return hexToRgba(teamColor, 75);
    }
    return 'transparent';
  };

  const getScoreBoxBg = (teamColor: string) => {
    if (settings.scoreBoxMatchTeamColor) {
      return hexToRgba(teamColor, settings.scoreBoxOpacity ?? 90);
    }
    const color = settings.scoreBoxBgColor || '#18181b';
    const opacity = settings.scoreBoxOpacity ?? 90;
    return hexToRgba(color, opacity);
  };

  const periodBoxBg = hexToRgba(
    settings.periodBoxBgColor || '#09090b',
    settings.periodBoxOpacity ?? 90
  );
  const periodTextColor = settings.periodTextColor || '#fbbf24';
  const scoreTextColor = settings.scoreBoxTextColor || '#ffffff';

  return (
    <div
      className="inline-flex select-none flex-col transition-transform duration-150 origin-top-left"
      style={{
        transform: `scale(${settings.scale})`,
        filter: sbOpacity > 15 ? 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.75))' : 'none',
      }}
    >
      {/* Outer Shell - Custom Background Color & Transparency */}
      <div
        className="relative flex items-stretch rounded-lg overflow-hidden text-white transition-colors duration-150 shadow-2xl"
        style={{
          backgroundColor: shellBg,
          borderColor: shellBorder,
          borderWidth: sbBorderOpacity > 0 ? '1px' : '0px',
          borderStyle: 'solid',
          backdropFilter: sbBlur > 0 ? `blur(${sbBlur}px)` : 'none',
          WebkitBackdropFilter: sbBlur > 0 ? `blur(${sbBlur}px)` : 'none',
        }}
      >
        
        {/* Subtle Top Metallic Highlight Strip (fades with opacity) */}
        {sbBorderOpacity > 10 && (
          <div
            className="absolute inset-x-0 top-0 h-[1.5px] pointer-events-none"
            style={{
              background: `linear-gradient(to right, transparent, ${hexToRgba(sbBorderColor, sbBorderOpacity * 1.5)}, transparent)`,
            }}
          />
        )}

        {/* ================= VISITOR TEAM (TOP / LEFT) ================= */}
        <div
          className="relative flex items-stretch group"
          style={{
            borderRightWidth: '1px',
            borderRightStyle: 'solid',
            borderRightColor: dividerBorder,
          }}
        >
          {/* Visitor Team Color Accent Bar */}
          <div
            className={`${isCompact ? 'w-2' : 'w-2.5'} transition-colors duration-200`}
            style={{ backgroundColor: visitorTeam.primaryColor }}
          />

          {/* Visitor Team Details */}
          <div
            className={`flex flex-col justify-center transition-colors duration-200 ${isCompact ? 'px-3 py-1.5 min-w-[95px] max-w-[135px]' : 'px-4 py-2 min-w-[130px] max-w-[170px]'}`}
            style={{
              backgroundColor: getTeamBoxBg(visitorTeam.primaryColor),
            }}
          >
            <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 leading-none mb-0.5">
              VISITOR
            </span>
            {editingVisitor && isInteractive ? (
              <input
                type="text"
                autoFocus
                value={visitorInput}
                onChange={(e) => setVisitorInput(e.target.value)}
                onBlur={handleVisitorSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleVisitorSubmit();
                  if (e.key === 'Escape') setEditingVisitor(false);
                }}
                className={`bg-neutral-800 text-white font-sports uppercase font-black px-1 rounded outline-none border border-cyan-400 w-full ${isCompact ? 'text-lg py-0' : 'text-xl py-0.5'}`}
              />
            ) : (
              <button
                type="button"
                onClick={() => isInteractive && setEditingVisitor(true)}
                title="Click to edit team name"
                className={`text-left font-sports font-black uppercase tracking-tight text-neutral-100 hover:text-cyan-300 transition-colors truncate block leading-tight ${isCompact ? 'text-xl' : 'text-2xl'}`}
              >
                {visitorTeam.name}
              </button>
            )}

            {settings.showShots && (
              <div className="text-[10px] font-digital font-medium text-neutral-400 flex items-center gap-1 mt-0.5">
                <span>SOG:</span>
                <span className="text-white font-bold">{visitorTeam.shots}</span>
              </div>
            )}
          </div>

          {/* Visitor Score Box */}
          <div
            className={`relative flex items-center justify-center font-digital font-extrabold tracking-tighter transition-colors duration-150 ${
              isCompact ? 'px-3.5 py-1 min-w-[48px] text-2xl' : 'px-5 py-1 min-w-[64px] text-4xl'
            } ${
              goalEffectTeam === 'visitor'
                ? 'text-yellow-300 bg-yellow-950/80 ring-2 ring-yellow-400 animate-pulse'
                : ''
            }`}
            style={{
              backgroundColor: goalEffectTeam === 'visitor' ? undefined : getScoreBoxBg(visitorTeam.primaryColor),
              color: goalEffectTeam === 'visitor' ? undefined : scoreTextColor,
              borderLeftWidth: '1px',
              borderLeftStyle: 'solid',
              borderLeftColor: dividerBorder,
            }}
          >
            <span>{visitorTeam.score}</span>

            {/* Quick +/- hover controls if interactive */}
            {isInteractive && (
              <div className="absolute inset-y-0 right-0 flex flex-col justify-between p-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-xs">
                <button
                  type="button"
                  onClick={() => onVisitorScoreChange(1)}
                  title="Visitor Score +1 (Up Arrow)"
                  className="w-4 h-4 flex items-center justify-center rounded text-neutral-300 hover:text-white hover:bg-neutral-700"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onVisitorScoreChange(-1)}
                  title="Visitor Score -1 (Down Arrow)"
                  className="w-4 h-4 flex items-center justify-center rounded text-neutral-300 hover:text-white hover:bg-neutral-700"
                >
                  <Minus className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= HOME TEAM (BOTTOM / RIGHT) ================= */}
        <div
          className="relative flex items-stretch group"
          style={{
            borderRightWidth: '1px',
            borderRightStyle: 'solid',
            borderRightColor: dividerBorder,
          }}
        >
          {/* Home Team Color Accent Bar */}
          <div
            className={`${isCompact ? 'w-2' : 'w-2.5'} transition-colors duration-200`}
            style={{ backgroundColor: homeTeam.primaryColor }}
          />

          {/* Home Team Details */}
          <div
            className={`flex flex-col justify-center transition-colors duration-200 ${isCompact ? 'px-3 py-1.5 min-w-[95px] max-w-[135px]' : 'px-4 py-2 min-w-[130px] max-w-[170px]'}`}
            style={{
              backgroundColor: getTeamBoxBg(homeTeam.primaryColor),
            }}
          >
            <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 leading-none mb-0.5">
              HOME
            </span>
            {editingHome && isInteractive ? (
              <input
                type="text"
                autoFocus
                value={homeInput}
                onChange={(e) => setHomeInput(e.target.value)}
                onBlur={handleHomeSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleHomeSubmit();
                  if (e.key === 'Escape') setEditingHome(false);
                }}
                className={`bg-neutral-800 text-white font-sports uppercase font-black px-1 rounded outline-none border border-cyan-400 w-full ${isCompact ? 'text-lg py-0' : 'text-xl py-0.5'}`}
              />
            ) : (
              <button
                type="button"
                onClick={() => isInteractive && setEditingHome(true)}
                title="Click to edit team name"
                className={`text-left font-sports font-black uppercase tracking-tight text-neutral-100 hover:text-cyan-300 transition-colors truncate block leading-tight ${isCompact ? 'text-xl' : 'text-2xl'}`}
              >
                {homeTeam.name}
              </button>
            )}

            {settings.showShots && (
              <div className="text-[10px] font-digital font-medium text-neutral-400 flex items-center gap-1 mt-0.5">
                <span>SOG:</span>
                <span className="text-white font-bold">{homeTeam.shots}</span>
              </div>
            )}
          </div>

          {/* Home Score Box */}
          <div
            className={`relative flex items-center justify-center font-digital font-extrabold tracking-tighter transition-colors duration-150 ${
              isCompact ? 'px-3.5 py-1 min-w-[48px] text-2xl' : 'px-5 py-1 min-w-[64px] text-4xl'
            } ${
              goalEffectTeam === 'home'
                ? 'text-yellow-300 bg-yellow-950/80 ring-2 ring-yellow-400 animate-pulse'
                : ''
            }`}
            style={{
              backgroundColor: goalEffectTeam === 'home' ? undefined : getScoreBoxBg(homeTeam.primaryColor),
              color: goalEffectTeam === 'home' ? undefined : scoreTextColor,
              borderLeftWidth: '1px',
              borderLeftStyle: 'solid',
              borderLeftColor: dividerBorder,
            }}
          >
            <span>{homeTeam.score}</span>

            {/* Quick +/- hover controls if interactive */}
            {isInteractive && (
              <div className="absolute inset-y-0 right-0 flex flex-col justify-between p-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-xs">
                <button
                  type="button"
                  onClick={() => onHomeScoreChange(1)}
                  title="Home Score +1 (Left Arrow)"
                  className="w-4 h-4 flex items-center justify-center rounded text-neutral-300 hover:text-white hover:bg-neutral-700"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onHomeScoreChange(-1)}
                  title="Home Score -1 (Right Arrow)"
                  className="w-4 h-4 flex items-center justify-center rounded text-neutral-300 hover:text-white hover:bg-neutral-700"
                >
                  <Minus className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= PERIOD & CLOCK SECTION ================= */}
        <div
          className={`relative flex flex-col justify-center text-center transition-colors duration-150 group/period ${isCompact ? 'px-3 py-1.5 min-w-[76px]' : 'px-4 py-2 min-w-[100px]'}`}
          style={{
            backgroundColor: periodBoxBg,
          }}
        >
          <div className="flex items-center justify-center gap-1">
            {/* Period Minus Button */}
            {isInteractive && (
              <button
                type="button"
                onClick={() => onPeriodChange(-1)}
                title="Previous Period (-)"
                disabled={period <= 1}
                className="w-4 h-4 flex items-center justify-center rounded bg-white/5 hover:bg-white/20 active:scale-95 disabled:opacity-20 disabled:pointer-events-none text-neutral-300 transition-all"
              >
                <Minus className="w-2.5 h-2.5" />
              </button>
            )}

            {/* Period Indicator */}
            <div className="flex flex-col items-center">
              <span className="text-[8px] uppercase tracking-wider font-semibold text-neutral-400 leading-none">
                PERIOD
              </span>
              <span
                className={`font-sports font-black tracking-wider transition-colors ${isCompact ? 'text-xl' : 'text-2xl'}`}
                style={{
                  color: periodTextColor,
                  textShadow: `0 0 10px ${hexToRgba(periodTextColor, 40)}`,
                }}
              >
                {getPeriodText(period)}
              </span>
            </div>

            {/* Period Plus Button */}
            {isInteractive && (
              <button
                type="button"
                onClick={() => onPeriodChange(1)}
                title="Next Period (+)"
                disabled={period >= 5}
                className="w-4 h-4 flex items-center justify-center rounded bg-white/5 hover:bg-white/20 active:scale-95 disabled:opacity-20 disabled:pointer-events-none text-neutral-300 transition-all"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            )}
          </div>

          {/* Optional Clock */}
          {settings.showClock && (
            <div className="mt-0.5 font-digital text-[10px] font-bold tracking-wider text-neutral-300">
              {formatClock(settings.clockMinutes, settings.clockSeconds)}
            </div>
          )}
        </div>

      </div>

      {/* Goal Celebration Flash Banner */}
      {goalEffectTeam && (
        <div className="mt-1 flex items-center justify-center gap-1.5 py-1 px-4 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white font-sports font-black text-sm tracking-widest uppercase rounded shadow-lg animate-bounce">
          <Flame className="w-4 h-4 text-yellow-200 fill-yellow-200" />
          <span>GOAL! {goalEffectTeam === 'home' ? homeTeam.name : visitorTeam.name}</span>
          <Flame className="w-4 h-4 text-yellow-200 fill-yellow-200" />
        </div>
      )}
    </div>
  );
};
