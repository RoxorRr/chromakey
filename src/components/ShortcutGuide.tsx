import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Plus, Minus, Maximize2, ShieldAlert } from 'lucide-react';

interface ShortcutGuideProps {
  onDismiss?: () => void;
}

export const ShortcutGuide: React.FC<ShortcutGuideProps> = () => {
  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200">
            Keyboard Controls & Shortcuts
          </h3>
        </div>
        <span className="text-[11px] font-digital text-cyan-400">ACTIVE IN FULLSCREEN</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        {/* Home Score */}
        <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-neutral-950/70 border border-neutral-800/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Home Team Score
          </span>
          <div className="flex items-center justify-between">
            <span className="text-neutral-300">Home Score +1</span>
            <kbd className="inline-flex items-center gap-1 px-2 py-1 rounded bg-neutral-800 border border-neutral-700 font-digital font-bold text-white shadow-xs">
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" /> Left Arrow
            </kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-300">Home Score -1</span>
            <kbd className="inline-flex items-center gap-1 px-2 py-1 rounded bg-neutral-800 border border-neutral-700 font-digital font-bold text-white shadow-xs">
              <ArrowRight className="w-3.5 h-3.5 text-neutral-300" /> Right Arrow
            </kbd>
          </div>
        </div>

        {/* Visitor Score */}
        <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-neutral-950/70 border border-neutral-800/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Visitor Team Score
          </span>
          <div className="flex items-center justify-between">
            <span className="text-neutral-300">Visitor Score +1</span>
            <kbd className="inline-flex items-center gap-1 px-2 py-1 rounded bg-neutral-800 border border-neutral-700 font-digital font-bold text-white shadow-xs">
              <ArrowUp className="w-3.5 h-3.5 text-emerald-400" /> Up Arrow
            </kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-300">Visitor Score -1</span>
            <kbd className="inline-flex items-center gap-1 px-2 py-1 rounded bg-neutral-800 border border-neutral-700 font-digital font-bold text-white shadow-xs">
              <ArrowDown className="w-3.5 h-3.5 text-neutral-300" /> Down Arrow
            </kbd>
          </div>
        </div>

        {/* Period & Navigation */}
        <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-neutral-950/70 border border-neutral-800/80 sm:col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Period, Size & Screen
          </span>
          <div className="flex items-center justify-between">
            <span className="text-neutral-300">Period Change (+ / -)</span>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-digital font-bold text-amber-300">
                +
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-digital font-bold text-neutral-300">
                -
              </kbd>
              <span className="text-neutral-500 text-[10px]">or [ / ]</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-300">Resize Scoreboard</span>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-digital font-bold text-cyan-300">
                &lt;
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-digital font-bold text-cyan-300">
                &gt;
              </kbd>
              <span className="text-neutral-500 text-[10px]">shrink / grow</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-300">Exit Fullscreen</span>
            <kbd className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-digital font-bold text-rose-400">
              ESC
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
