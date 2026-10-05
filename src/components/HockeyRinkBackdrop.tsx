import React from 'react';

export const HockeyRinkBackdrop: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-neutral-900 flex items-center justify-center">
      {/* Ice surface simulation */}
      <div className="relative w-full h-full bg-gradient-to-b from-[#e5eef7] via-[#f0f6fc] to-[#dbe7f2] flex items-center justify-center opacity-90">
        
        {/* Ice skate scratch marks texture overlay */}
        <div
          className="absolute inset-0 opacity-25 mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.8), transparent 70%),
              repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(200,220,240,0.15) 10px, rgba(200,220,240,0.15) 20px)`,
          }}
        />

        {/* Stadium lighting glow */}
        <div className="absolute inset-0 bg-radial from-white/40 via-transparent to-neutral-900/30 pointer-events-none" />

        {/* Rink Markings SVG */}
        <svg
          className="w-full h-full max-w-7xl max-h-[85vh] p-8"
          viewBox="0 0 1000 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dasher Boards outline */}
          <rect
            x="20"
            y="20"
            width="960"
            height="460"
            rx="80"
            stroke="#f59e0b"
            strokeWidth="10"
            fill="none"
          />
          <rect
            x="25"
            y="25"
            width="950"
            height="450"
            rx="75"
            stroke="#0ea5e9"
            strokeWidth="2"
            fill="none"
            opacity="0.4"
          />

          {/* Center Red Line */}
          <line
            x1="500"
            y1="25"
            x2="500"
            y2="475"
            stroke="#dc2626"
            strokeWidth="6"
            strokeDasharray="14 10"
          />

          {/* Center Ice Circle & Faceoff Dot */}
          <circle cx="500" cy="250" r="70" stroke="#0284c7" strokeWidth="4" />
          <circle cx="500" cy="250" r="6" fill="#0284c7" />

          {/* Blue Lines (Neutral Zone) */}
          <line x1="360" y1="25" x2="360" y2="475" stroke="#0284c7" strokeWidth="8" />
          <line x1="640" y1="25" x2="640" y2="475" stroke="#0284c7" strokeWidth="8" />

          {/* Goal Lines (Red) */}
          <line x1="100" y1="55" x2="100" y2="445" stroke="#dc2626" strokeWidth="4" />
          <line x1="900" y1="55" x2="900" y2="445" stroke="#dc2626" strokeWidth="4" />

          {/* Goal Creases */}
          <path
            d="M 100 220 A 30 30 0 0 1 100 280 Z"
            fill="#38bdf8"
            fillOpacity="0.4"
            stroke="#dc2626"
            strokeWidth="3"
          />
          <path
            d="M 900 220 A 30 30 0 0 0 900 280 Z"
            fill="#38bdf8"
            fillOpacity="0.4"
            stroke="#dc2626"
            strokeWidth="3"
          />

          {/* End Zone Faceoff Circles & Dots (Left) */}
          <circle cx="210" cy="130" r="50" stroke="#dc2626" strokeWidth="3" />
          <circle cx="210" cy="130" r="5" fill="#dc2626" />
          <circle cx="210" cy="370" r="50" stroke="#dc2626" strokeWidth="3" />
          <circle cx="210" cy="370" r="5" fill="#dc2626" />

          {/* End Zone Faceoff Circles & Dots (Right) */}
          <circle cx="790" cy="130" r="50" stroke="#dc2626" strokeWidth="3" />
          <circle cx="790" cy="130" r="5" fill="#dc2626" />
          <circle cx="790" cy="370" r="50" stroke="#dc2626" strokeWidth="3" />
          <circle cx="790" cy="370" r="5" fill="#dc2626" />

          {/* Neutral Zone Faceoff Dots */}
          <circle cx="390" cy="130" r="5" fill="#dc2626" />
          <circle cx="390" cy="370" r="5" fill="#dc2626" />
          <circle cx="610" cy="130" r="5" fill="#dc2626" />
          <circle cx="610" cy="370" r="5" fill="#dc2626" />
        </svg>

        {/* Player Silhouettes Simulation */}
        <div className="absolute bottom-16 right-1/4 opacity-40 select-none">
          <div className="text-[11px] font-sports font-bold tracking-widest text-neutral-500 uppercase">
            [Sample Hockey Broadcast Camera View - Live Ice Test]
          </div>
        </div>
      </div>
    </div>
  );
};
