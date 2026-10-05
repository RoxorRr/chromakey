import React from 'react';

export const SafeMarginGuides: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* 90% Action Safe Area */}
      <div className="absolute inset-[5%] border border-dashed border-emerald-500/40">
        <span className="absolute top-1 left-2 text-[10px] font-digital font-semibold text-emerald-400 bg-neutral-900/80 px-1 rounded">
          90% Action Safe
        </span>
      </div>

      {/* 80% Title Safe Area */}
      <div className="absolute inset-[10%] border border-dashed border-amber-500/40">
        <span className="absolute top-1 left-2 text-[10px] font-digital font-semibold text-amber-400 bg-neutral-900/80 px-1 rounded">
          80% Title Safe
        </span>
      </div>

      {/* Center crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-40">
        <div className="absolute top-1/2 inset-x-0 h-px bg-white" />
        <div className="absolute left-1/2 inset-y-0 w-px bg-white" />
      </div>
    </div>
  );
};
