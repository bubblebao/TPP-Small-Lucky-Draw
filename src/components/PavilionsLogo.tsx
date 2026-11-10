import React from 'react';

interface PavilionsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PavilionsLogo: React.FC<PavilionsLogoProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  return (
    <div className="flex items-center space-x-3.5 group cursor-pointer select-none">
      {/* Pristine Emblem with Glowing Gold Rim */}
      <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#698A9A] to-[#44595B] blur-sm opacity-50 group-hover:opacity-80 transition-opacity" />

        {/* Outer Circular Ring */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#1c2638] to-[#0c101a] border border-[#F5CE62]/60 p-1 flex items-center justify-center shadow-lg">
          {/* High-Res Vector SVG of The Pavilions Phuket TP Emblem */}
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer thin ring */}
            <circle cx="50" cy="50" r="46" stroke="#F5CE62" strokeWidth="1.2" opacity="0.9" />
            <circle cx="50" cy="50" r="42" stroke="#D4AF37" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />

            {/* Stylized Monogram TP */}
            {/* T Bar */}
            <path
              d="M32 38 H68 M50 38 V70"
              stroke="#FFF9E6"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* P Loop connected with T */}
            <path
              d="M50 38 H63 C70 38 74 43 74 49 C74 55 69 60 62 60 H50"
              stroke="#F5CE62"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Inner T accent line */}
            <line x1="45" y1="44" x2="45" y2="68" stroke="#D4AF37" strokeWidth="1.2" opacity="0.7" />

            {/* Micro stars */}
            <circle cx="26" cy="50" r="1.5" fill="#F5CE62" />
            <circle cx="74" cy="50" r="1.5" fill="#F5CE62" />
          </svg>
        </div>
      </div>

      {/* Luxury Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline space-x-1.5">
          <span className="font-serif tracking-[0.22em] text-sm sm:text-base font-extrabold text-white drop-shadow">
            THE PAVILIONS
          </span>
          <span className="font-serif italic text-base sm:text-lg font-normal text-[#F5CE62] drop-shadow-sm -ml-0.5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Phuket
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#8ba6b4] font-medium">
            Hotels & Resorts
          </span>
          <span className="w-1 h-1 rounded-full bg-[#D4AF37]/60" />
          <span className="text-[9px] uppercase tracking-[0.15em] text-[#D4AF37] font-semibold">
            Board Room
          </span>
        </div>
      </div>
    </div>
  );
};

